package api

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"strings"

	"github.com/amineshx/BSD/cipher"
)

type messageRequest struct {
	Message string `json:"message"`
}

type keyedRequest struct {
	Message        string `json:"message"`
	Key            string `json:"key"`
	OriginalLength *int   `json:"originalLength,omitempty"`
}

type caesarRequest struct {
	Message string `json:"message"`
	Key     int    `json:"key"`
}

type solveRequest struct {
	Message          string `json:"message"`
	SubstitutionKey  string `json:"substitutionKey"`
	TranspositionKey string `json:"transpositionKey"`
	CaesarKey        *int   `json:"caesarKey,omitempty"`
}

type solveCandidate struct {
	CaesarKey int    `json:"caesarKey"`
	Plaintext string `json:"plaintext"`
}

type solveResponse struct {
	Candidates []solveCandidate `json:"candidates"`
}

type resultResponse struct {
	Result string `json:"result"`
}

type errorResponse struct {
	Error string `json:"error"`
}

func serveHealth(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, errorResponse{Error: "use GET"})
		return
	}
	writeJSON(w, http.StatusOK, struct {
		Status string `json:"status"`
	}{Status: "ok"})
}

func docsPath(name string) string {
	candidate := filepath.Join("docs", name)
	if _, err := os.Stat(candidate); err == nil {
		return candidate
	}

	current, err := os.Getwd()
	if err != nil {
		return candidate
	}
	for {
		candidate = filepath.Join(current, "docs", name)
		if _, err := os.Stat(candidate); err == nil {
			return candidate
		}
		parent := filepath.Dir(current)
		if parent == current {
			break
		}
		current = parent
	}
	return filepath.Join("docs", name)
}

func serveSwaggerUI(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, errorResponse{Error: "use GET"})
		return
	}
	page, err := os.ReadFile(docsPath("swagger.html"))
	if err != nil {
		http.Error(w, "Swagger UI page is unavailable", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	_, _ = w.Write(page)
}

func serveOpenAPISpec(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, errorResponse{Error: "use GET"})
		return
	}
	spec, err := os.ReadFile(docsPath("openapi.yaml"))
	if err != nil {
		http.Error(w, "OpenAPI specification is unavailable", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/yaml; charset=utf-8")
	_, _ = w.Write(spec)
}

func handleAPI(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, errorResponse{Error: "use POST with a JSON request body"})
		return
	}
	if strings.Trim(r.URL.Path, "/") == "api/solve" {
		handleSolve(w, r)
		return
	}
	parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(parts) != 3 || parts[0] != "api" {
		writeJSON(w, http.StatusNotFound, errorResponse{Error: "unknown API endpoint"})
		return
	}
	algorithm, operation := parts[1], parts[2]
	switch algorithm + "/" + operation {
	case "caesar/encrypt", "caesar/decrypt":
		var request caesarRequest
		if !decodeRequest(w, r, &request) {
			return
		}
		var result string
		var err error
		if operation == "encrypt" {
			result, err = cipher.EncryptCaesar(request.Message, request.Key)
		} else {
			result, err = cipher.DecryptCaesar(request.Message, request.Key)
		}
		writeResultOrError(w, result, err)
	case "caesar/bruteforce":
		var request messageRequest
		if !decodeRequest(w, r, &request) {
			return
		}
		candidates, err := cipher.BruteForceCaesar(request.Message)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, errorResponse{Error: err.Error()})
			return
		}
		writeJSON(w, http.StatusOK, candidates)
	case "substitution/encrypt", "substitution/decrypt", "transposition/encrypt", "transposition/decrypt":
		var request keyedRequest
		if !decodeRequest(w, r, &request) {
			return
		}
		var result string
		var err error
		switch algorithm + "/" + operation {
		case "substitution/encrypt":
			result, err = cipher.EncryptSubstitution(request.Message, request.Key)
		case "substitution/decrypt":
			result, err = cipher.DecryptSubstitution(request.Message, request.Key)
		case "transposition/encrypt":
			result, err = cipher.EncryptTransposition(request.Message, request.Key)
		case "transposition/decrypt":
			if request.OriginalLength == nil {
				result, err = cipher.DecryptTransposition(request.Message, request.Key)
			} else {
				result, err = cipher.DecryptTranspositionWithLength(request.Message, request.Key, *request.OriginalLength)
			}
		}
		writeResultOrError(w, result, err)
	default:
		writeJSON(w, http.StatusNotFound, errorResponse{Error: "unknown API endpoint"})
	}
}

func handleSolve(w http.ResponseWriter, r *http.Request) {
	var request solveRequest
	if !decodeRequest(w, r, &request) {
		return
	}
	keys := make([]int, 0, 25)
	if request.CaesarKey != nil {
		keys = append(keys, *request.CaesarKey)
	} else {
		for key := 1; key <= 25; key++ {
			keys = append(keys, key)
		}
	}

	candidates := make([]solveCandidate, 0, len(keys))
	for _, key := range keys {
		withoutCaesar, err := cipher.DecryptCaesar(request.Message, key)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, errorResponse{Error: err.Error()})
			return
		}
		withoutTransposition, err := cipher.DecryptTransposition(withoutCaesar, request.TranspositionKey)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, errorResponse{Error: err.Error()})
			return
		}
		plaintext, err := cipher.DecryptSubstitution(withoutTransposition, request.SubstitutionKey)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, errorResponse{Error: err.Error()})
			return
		}
		candidates = append(candidates, solveCandidate{CaesarKey: key, Plaintext: plaintext})
	}
	writeJSON(w, http.StatusOK, solveResponse{Candidates: candidates})
}

func decodeRequest(w http.ResponseWriter, r *http.Request, destination any) bool {
	r.Body = http.MaxBytesReader(w, r.Body, 1<<20)
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(destination); err != nil {
		writeJSON(w, http.StatusBadRequest, errorResponse{Error: "invalid JSON request: " + err.Error()})
		return false
	}
	var extra any
	if err := decoder.Decode(&extra); !errors.Is(err, io.EOF) {
		writeJSON(w, http.StatusBadRequest, errorResponse{Error: "request body must contain one JSON object"})
		return false
	}
	return true
}

func writeResultOrError(w http.ResponseWriter, result string, err error) {
	if err != nil {
		writeJSON(w, http.StatusBadRequest, errorResponse{Error: err.Error()})
		return
	}
	writeJSON(w, http.StatusOK, resultResponse{Result: result})
}

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}

var (
	// Version is the version of the application, set during build time.
	Version = "dev"
	// BuildTime is the time when the application was built, set during build time.
	BuildTime = "unknown"
	// CommitHash is the git commit hash when the application was built, set during build time.
	CommitHash = "unknown"
)

// PrintVersionInfo prints the version information of the application.
func PrintVersionInfo() {
	_, _ = io.WriteString(os.Stdout, "Version: "+Version+"\n")
	_, _ = io.WriteString(os.Stdout, "Build Time: "+BuildTime+"\n")
	_, _ = io.WriteString(os.Stdout, "Commit Hash: "+CommitHash+"\n")
	_, _ = io.WriteString(os.Stdout, "Go Version: "+runtime.Version()+"\n")
	_, _ = io.WriteString(os.Stdout, "OS/Arch: "+runtime.GOOS+"/"+runtime.GOARCH+"\n")
}

// init initializes the package, printing the version information.
func init() {
	PrintVersionInfo()
}
