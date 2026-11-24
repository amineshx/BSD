package cipher

import "strings"

func shift(char byte, rev bool, k int) byte {
	k %= 26
	if rev {
		k = -k
	}
	base := byte('A')
	if char >= 'a' && char <= 'z' {
		base = 'a'
	}
	pos := (int(char-base) + k) % 26
	if pos < 0 {
		pos += 26
	}
	return base + byte(pos)
}

func proceeding(rev bool, k int, m string) string {
	var sb strings.Builder

	for _, ch := range m {
		if ch >= 'A' && ch <= 'Z' {
			sb.WriteByte(shift(byte(ch), rev, k))
		} else {
			sb.WriteRune(ch) // spaces, punctuation, etc. stay unchanged
		}
	}

	return sb.String()
}

// EncryptCaesar shifts every uppercase letter by k positions.
func EncryptCaesar(message string, k int) (string, error) {
	if err := validateMessage(message); err != nil {
		return "", err
	}
	return proceeding(false, k, message), nil
}

// DecryptCaesar reverses a Caesar shift of k positions.
func DecryptCaesar(message string, k int) (string, error) {
	if err := validateMessage(message); err != nil {
		return "", err
	}
	return proceeding(true, k, message), nil
}

type CaesarCandidate struct {
	Key     int    `json:"key"`
	Message string `json:"message"`
}

// BruteForceCaesar returns the 25 non-identity Caesar decryptions.
func BruteForceCaesar(message string) ([]CaesarCandidate, error) {
	if err := validateMessage(message); err != nil {
		return nil, err
	}
	candidates := make([]CaesarCandidate, 0, 25)
	for key := 1; key <= 25; key++ {
		plaintext, _ := DecryptCaesar(message, key)
		candidates = append(candidates, CaesarCandidate{Key: key, Message: plaintext})
	}
	return candidates, nil
}
