package api

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestAPIEndpoints(t *testing.T) {
	tests := []struct {
		path string
		body string
		want string
	}{
		{"/api/caesar/encrypt", `{"message":"BONJOUR","key":3}`, `{"result":"ERQMRXU"}`},
		{"/api/substitution/encrypt", `{"message":"ATTAQUE","key":"QWERTYUIOPASDFGHJKLZXCVBNM"}`, `{"result":"QZZQJXT"}`},
		{"/api/transposition/encrypt", `{"message":"RENDEZVOUSAMIDI","key":"PORTE"}`, `{"result":"ESIEVMRZANOIDUD"}`},
	}
	for _, tt := range tests {
		t.Run(tt.path, func(t *testing.T) {
			request := httptest.NewRequest(http.MethodPost, tt.path, strings.NewReader(tt.body))
			response := httptest.NewRecorder()
			NewRouter().ServeHTTP(response, request)
			if response.Code != http.StatusOK || !strings.Contains(response.Body.String(), tt.want) {
				t.Fatalf("response = %d %s, want 200 containing %s", response.Code, response.Body.String(), tt.want)
			}
		})
	}
}

func TestSolveEndpointBruteForcesCaesarKey(t *testing.T) {
	body := `{"message":"GOACJIPIUE","substitutionKey":"JVYBLAMGESONHUTKZPRDXCQWFI","transpositionKey":"TABLE"}`
	request := httptest.NewRequest(http.MethodPost, "/api/solve", strings.NewReader(body))
	response := httptest.NewRecorder()
	NewRouter().ServeHTTP(response, request)
	if response.Code != http.StatusOK {
		t.Fatalf("status = %d, body = %s", response.Code, response.Body.String())
	}
	if !strings.Contains(response.Body.String(), `"caesarKey":11`) || !strings.Contains(response.Body.String(), `"plaintext":"ABRICOTS"`) {
		t.Fatalf("solve response does not include expected candidate: %s", response.Body.String())
	}
	if strings.Count(response.Body.String(), `"caesarKey":`) != 25 {
		t.Fatalf("solve should return 25 Caesar candidates; response: %s", response.Body.String())
	}
}

func TestSolveEndpointAcceptsKnownCaesarKey(t *testing.T) {
	body := `{"message":"GOACJIPIUE","substitutionKey":"JVYBLAMGESONHUTKZPRDXCQWFI","transpositionKey":"TABLE","caesarKey":11}`
	request := httptest.NewRequest(http.MethodPost, "/api/solve", strings.NewReader(body))
	response := httptest.NewRecorder()
	NewRouter().ServeHTTP(response, request)
	if response.Code != http.StatusOK || !strings.Contains(response.Body.String(), `"plaintext":"ABRICOTS"`) {
		t.Fatalf("solve response = %d %s", response.Code, response.Body.String())
	}
	if strings.Count(response.Body.String(), `"caesarKey":`) != 1 {
		t.Fatalf("expected one candidate when caesarKey is given; response: %s", response.Body.String())
	}
}

func TestAPIRejectsNonPost(t *testing.T) {
	request := httptest.NewRequest(http.MethodGet, "/api/caesar/encrypt", nil)
	response := httptest.NewRecorder()
	NewRouter().ServeHTTP(response, request)
	if response.Code != http.StatusMethodNotAllowed {
		t.Fatalf("status = %d, want %d", response.Code, http.StatusMethodNotAllowed)
	}
}

func TestSwaggerDocumentationRoutes(t *testing.T) {
	tests := []struct {
		path        string
		contentType string
		contains    string
	}{
		{"/docs/", "text/html", "SwaggerUIBundle"},
		{"/openapi.yaml", "application/yaml", "/api/caesar/encrypt"},
	}
	for _, tt := range tests {
		t.Run(tt.path, func(t *testing.T) {
			request := httptest.NewRequest(http.MethodGet, tt.path, nil)
			response := httptest.NewRecorder()
			NewRouter().ServeHTTP(response, request)
			if response.Code != http.StatusOK {
				t.Fatalf("status = %d, want %d", response.Code, http.StatusOK)
			}
			if !strings.HasPrefix(response.Header().Get("Content-Type"), tt.contentType) {
				t.Fatalf("Content-Type = %q, want prefix %q", response.Header().Get("Content-Type"), tt.contentType)
			}
			if !strings.Contains(response.Body.String(), tt.contains) {
				t.Fatalf("documentation response does not contain %q", tt.contains)
			}
		})
	}
}

func TestHealthEndpoint(t *testing.T) {
	request := httptest.NewRequest(http.MethodGet, "/health", nil)
	response := httptest.NewRecorder()
	NewRouter().ServeHTTP(response, request)
	if response.Code != http.StatusOK || !strings.Contains(response.Body.String(), `"status":"ok"`) {
		t.Fatalf("health response = %d %s, want 200 with status ok", response.Code, response.Body.String())
	}
}

func TestCORSSecurityHeadersAndRateLimit(t *testing.T) {
	t.Setenv("CORS_ORIGINS", "https://example.com")
	t.Setenv("RATE_LIMIT_PER_MINUTE", "2")
	router := NewRouter()

	for i := 0; i < 2; i++ {
		request := httptest.NewRequest(http.MethodGet, "/health", nil)
		request.Header.Set("Origin", "https://example.com")
		response := httptest.NewRecorder()
		router.ServeHTTP(response, request)
		if response.Code != http.StatusOK {
			t.Fatalf("request %d status = %d, want %d", i+1, response.Code, http.StatusOK)
		}
		if response.Header().Get("Access-Control-Allow-Origin") != "https://example.com" {
			t.Fatalf("missing CORS allow-origin header: %v", response.Header())
		}
		if response.Header().Get("X-Content-Type-Options") != "nosniff" {
			t.Fatalf("missing security headers: %v", response.Header())
		}
	}

	request := httptest.NewRequest(http.MethodGet, "/health", nil)
	request.Header.Set("Origin", "https://example.com")
	response := httptest.NewRecorder()
	router.ServeHTTP(response, request)
	if response.Code != http.StatusTooManyRequests {
		t.Fatalf("rate-limited status = %d, want %d", response.Code, http.StatusTooManyRequests)
	}
}

func TestCORSPreflight(t *testing.T) {
	t.Setenv("CORS_ORIGINS", "https://example.com")
	request := httptest.NewRequest(http.MethodOptions, "/api/caesar/encrypt", nil)
	request.Header.Set("Origin", "https://example.com")
	response := httptest.NewRecorder()
	NewRouter().ServeHTTP(response, request)
	if response.Code != http.StatusNoContent {
		t.Fatalf("preflight status = %d, want %d", response.Code, http.StatusNoContent)
	}
}

func TestCORSRejectsDisallowedOrigin(t *testing.T) {
	t.Setenv("CORS_ORIGINS", "https://example.com")
	request := httptest.NewRequest(http.MethodGet, "/health", nil)
	request.Header.Set("Origin", "https://attacker.example")
	response := httptest.NewRecorder()
	NewRouter().ServeHTTP(response, request)
	if response.Code != http.StatusOK {
		t.Fatalf("status = %d, want normal response because disallowed origins are filtered by CORS", response.Code)
	}
	if response.Header().Get("Access-Control-Allow-Origin") != "" {
		t.Fatalf("disallowed origin unexpectedly allowed: %q", response.Header().Get("Access-Control-Allow-Origin"))
	}
}
