package cipher

import "fmt"

// EncryptSubstitution maps A-Z to the corresponding letters in key.
func EncryptSubstitution(message, key string) (string, error) {
	if err := validateMessage(message); err != nil {
		return "", err
	}
	if err := validateSubstitutionKey(key); err != nil {
		return "", err
	}
	result := make([]byte, len(message))
	for i := range message {
		result[i] = key[message[i]-'A']
	}
	return string(result), nil
}

// DecryptSubstitution maps letters in key back to A-Z.
func DecryptSubstitution(message, key string) (string, error) {
	if err := validateMessage(message); err != nil {
		return "", err
	}
	if err := validateSubstitutionKey(key); err != nil {
		return "", err
	}
	var inverse [26]byte
	for i := range key {
		inverse[key[i]-'A'] = byte('A' + i)
	}
	result := make([]byte, len(message))
	for i := range message {
		result[i] = inverse[message[i]-'A']
	}
	return string(result), nil
}

func validateSubstitutionKey(key string) error {
	if len(key) != 26 {
		return fmt.Errorf("substitution key must be exactly 26 letters")
	}
	if err := validateKeyword(key); err != nil {
		return fmt.Errorf("invalid substitution key: %w", err)
	}
	var seen [26]bool
	for i := range key {
		index := key[i] - 'A'
		if seen[index] {
			return fmt.Errorf("substitution key must contain each letter A-Z exactly once")
		}
		seen[index] = true
	}
	return nil
}
