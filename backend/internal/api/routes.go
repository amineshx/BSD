package api

import "net/http"

// NewRouter builds the HTTP handler used by the CryptoBox server.
func NewRouter() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/health", serveHealth)
	mux.HandleFunc("/docs", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/docs/", http.StatusPermanentRedirect)
	})
	mux.HandleFunc("/docs/", serveSwaggerUI)
	mux.HandleFunc("/openapi.yaml", serveOpenAPISpec)
	mux.HandleFunc("/api/", handleAPI)

	var handler http.Handler = mux
	handler = newRateLimiter(envRateLimit()).middleware(handler)
	handler = withCORS(handler)
	handler = withSecurityHeaders(handler)
	return handler
}
