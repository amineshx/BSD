package cipher

import "fmt"

func validateMessage(message string) error {
	for i := 0; i < len(message); i++ {
		if message[i] < 'A' || message[i] > 'Z' {
			return fmt.Errorf("message must contain uppercase letters A-Z only (invalid byte at position %d)", i)
		}
	}
	return nil
}

func validateKeyword(keyword string) error {
	if len(keyword) == 0 {
		return fmt.Errorf("key must not be empty")
	}
	for i := 0; i < len(keyword); i++ {
		if keyword[i] < 'A' || keyword[i] > 'Z' {
			return fmt.Errorf("key must contain uppercase letters A-Z only (invalid byte at position %d)", i)
		}
	}
	return nil
}
