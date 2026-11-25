package cipher

import "fmt"

// EncryptTransposition writes message in rows under key, pads the final row
// with X, and reads columns in alphabetical key order.
func EncryptTransposition(message, key string) (string, error) {
	if err := validateMessage(message); err != nil {
		return "", err
	}
	if err := validateKeyword(key); err != nil {
		return "", err
	}
	if len(message) == 0 {
		return "", nil
	}
	columns := columnOrder(key)
	rows := (len(message) + len(key) - 1) / len(key)
	padded := make([]byte, rows*len(key))
	copy(padded, message)
	for i := len(message); i < len(padded); i++ {
		padded[i] = 'X'
	}
	result := make([]byte, 0, len(padded))
	for _, column := range columns {
		for row := 0; row < rows; row++ {
			result = append(result, padded[row*len(key)+column])
		}
	}
	return string(result), nil
}

// DecryptTransposition reverses columnar transposition and removes up to
// len(key)-1 trailing X padding characters. Use DecryptTranspositionWithLength
// when the original message may itself end in X.
func DecryptTransposition(message, key string) (string, error) {
	plaintext, err := decryptTransposition(message, key)
	if err != nil || len(message) == 0 {
		return plaintext, err
	}
	paddingLimit := len(key) - 1
	padding := 0
	for padding < paddingLimit && padding < len(plaintext) && plaintext[len(plaintext)-1-padding] == 'X' {
		padding++
	}
	return plaintext[:len(plaintext)-padding], nil
}

// DecryptTranspositionWithLength decrypts while preserving literal trailing X
// characters by using the known original plaintext length.
func DecryptTranspositionWithLength(message, key string, originalLength int) (string, error) {
	plaintext, err := decryptTransposition(message, key)
	if err != nil {
		return "", err
	}
	if originalLength < 0 || originalLength > len(plaintext) {
		return "", fmt.Errorf("original length must be between 0 and %d", len(plaintext))
	}
	if originalLength > 0 && (originalLength+len(key)-1)/len(key)*len(key) != len(message) {
		return "", fmt.Errorf("original length is inconsistent with ciphertext length")
	}
	if originalLength == 0 && len(message) != 0 {
		return "", fmt.Errorf("original length is inconsistent with ciphertext length")
	}
	return plaintext[:originalLength], nil
}

func decryptTransposition(message, key string) (string, error) {
	if err := validateMessage(message); err != nil {
		return "", err
	}
	if err := validateKeyword(key); err != nil {
		return "", err
	}
	if len(message) == 0 {
		return "", nil
	}
	if len(message)%len(key) != 0 {
		return "", fmt.Errorf("transposition ciphertext length must be a multiple of key length")
	}
	rows := len(message) / len(key)
	columns := columnOrder(key)
	grid := make([]byte, len(message))
	position := 0
	for _, column := range columns {
		for row := 0; row < rows; row++ {
			grid[row*len(key)+column] = message[position]
			position++
		}
	}
	return string(grid), nil
}

func columnOrder(key string) []int {
	order := make([]int, len(key))
	for i := range order {
		order[i] = i
	}
	// Stable insertion sort makes equal keyword letters retain their original order.
	for i := 1; i < len(order); i++ {
		for j := i; j > 0 && key[order[j]] < key[order[j-1]]; j-- {
			order[j], order[j-1] = order[j-1], order[j]
		}
	}
	return order
}
