package api

import (
	"net"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"
)

const defaultRateLimit = 60

func withSecurityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Security-Policy", "default-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline' https://unpkg.com; script-src 'self' 'unsafe-inline' https://unpkg.com")
		w.Header().Set("Cross-Origin-Opener-Policy", "same-origin")
		w.Header().Set("Referrer-Policy", "no-referrer")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		next.ServeHTTP(w, r)
	})
}

func withCORS(next http.Handler) http.Handler {
	allowedOrigins := strings.Split(os.Getenv("CORS_ORIGINS"), ",")
	allowAll := len(allowedOrigins) == 1 && strings.TrimSpace(allowedOrigins[0]) == "*"
	if strings.TrimSpace(os.Getenv("CORS_ORIGINS")) == "" {
		allowedOrigins = []string{"*"}
		allowAll = true
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		allowed := allowAll
		if !allowAll && origin != "" {
			for _, configured := range allowedOrigins {
				if strings.TrimSpace(configured) == origin {
					allowed = true
					break
				}
			}
		}

		if origin != "" {
			w.Header().Add("Vary", "Origin")
			if allowed {
				w.Header().Set("Access-Control-Allow-Origin", origin)
				w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
				w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
				w.Header().Set("Access-Control-Max-Age", "86400")
			}
		}

		if r.Method == http.MethodOptions {
			if allowed {
				w.WriteHeader(http.StatusNoContent)
			} else {
				writeJSON(w, http.StatusForbidden, errorResponse{Error: "origin is not allowed"})
			}
			return
		}
		next.ServeHTTP(w, r)
	})
}

type rateLimiter struct {
	mu       sync.Mutex
	requests map[string][]time.Time
	window   time.Duration
	limit    int
}

func newRateLimiter(limit int) *rateLimiter {
	if limit < 1 {
		limit = defaultRateLimit
	}
	return &rateLimiter{
		requests: make(map[string][]time.Time),
		window:   time.Minute,
		limit:    limit,
	}
}

func envRateLimit() int {
	value := os.Getenv("RATE_LIMIT_PER_MINUTE")
	if value == "" {
		return defaultRateLimit
	}
	limit, err := strconv.Atoi(value)
	if err != nil || limit < 1 {
		return defaultRateLimit
	}
	return limit
}

func clientIP(r *http.Request) string {
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err == nil {
		return host
	}
	return r.RemoteAddr
}

func (l *rateLimiter) middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := clientIP(r)
		now := time.Now()

		l.mu.Lock()
		cutoff := now.Add(-l.window)
		recent := l.requests[ip][:0]
		for _, timestamp := range l.requests[ip] {
			if timestamp.After(cutoff) {
				recent = append(recent, timestamp)
			}
		}

		if len(recent) >= l.limit {
			l.requests[ip] = recent
			l.mu.Unlock()
			w.Header().Set("Retry-After", "60")
			writeJSON(w, http.StatusTooManyRequests, errorResponse{Error: "rate limit exceeded"})
			return
		}

		recent = append(recent, now)
		l.requests[ip] = recent
		l.mu.Unlock()
		next.ServeHTTP(w, r)
	})
}
