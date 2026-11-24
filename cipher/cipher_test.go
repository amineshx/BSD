package cipher

import "testing"

func TestProceeding(t *testing.T) {
	tests := []struct {
		name string
		rev  bool
		k    int
		in   string
		want string
	}{
		{"basic encrypt", false, 3, "HELLO WORLD", "KHOOR ZRUOG"},
		{"basic decrypt", true, 3, "KHOOR ZRUOG", "HELLO WORLD"},
		{"wrap forward", false, 3, "XYZ", "ABC"},
		{"wrap backward", true, 3, "ABC", "XYZ"},
		{"k = 26 is identity", false, 26, "HELLO", "HELLO"},
		{"k larger than 26", false, 29, "HELLO", "KHOOR"},
		{"negative k", false, -3, "KHOOR", "HELLO"},
		{"k = 0", false, 0, "HELLO", "HELLO"},
		{"non letters untouched", false, 1, "A, B!", "B, C!"},
		{"empty string", false, 5, "", ""},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := proceeding(tt.rev, tt.k, tt.in)
			if got != tt.want {
				t.Errorf("proceeding(%v, %d, %q) = %q, want %q",
					tt.rev, tt.k, tt.in, got, tt.want)
			}
		})
	}
}

func TestRoundTrip(t *testing.T) {
	msg := "THE QUICK BROWN FOX"
	for k := -30; k <= 30; k++ {
		enc := proceeding(false, k, msg)
		dec := proceeding(true, k, enc)
		if dec != msg {
			t.Errorf("k=%d: round trip gave %q, want %q", k, dec, msg)
		}
	}
}

func TestShift(t *testing.T) {
	if got := shift('A', false, 1); got != 'B' {
		t.Errorf("shift('A', false, 1) = %c, want B", got)
	}
	if got := shift('A', true, 1); got != 'Z' {
		t.Errorf("shift('A', true, 1) = %c, want Z", got)
	}
}

func TestSubstitutionExamplesAndRoundTrip(t *testing.T) {
	const key = "QWERTYUIOPASDFGHJKLZXCVBNM"
	got, err := EncryptSubstitution("ATTAQUE", key)
	if err != nil {
		t.Fatal(err)
	}
	if got != "QZZQJXT" {
		t.Fatalf("EncryptSubstitution() = %q, want QZZQJXT", got)
	}
	got, err = DecryptSubstitution(got, key)
	if err != nil {
		t.Fatal(err)
	}
	if got != "ATTAQUE" {
		t.Fatalf("DecryptSubstitution() = %q, want ATTAQUE", got)
	}
}

func TestSubstitutionRejectsInvalidKey(t *testing.T) {
	if _, err := EncryptSubstitution("ABC", "AAAAAAAAAAAAAAAAAAAAAAAAAA"); err == nil {
		t.Fatal("expected duplicate substitution key to be rejected")
	}
}

func TestTranspositionExamplesAndRoundTrip(t *testing.T) {
	got, err := EncryptTransposition("RENDEZVOUSAMIDI", "PORTE")
	if err != nil {
		t.Fatal(err)
	}
	if got != "ESIEVMRZANOIDUD" {
		t.Fatalf("EncryptTransposition() = %q, want ESIEVMRZANOIDUD", got)
	}
	decoded, err := DecryptTransposition(got, "PORTE")
	if err != nil {
		t.Fatal(err)
	}
	if decoded != "RENDEZVOUSAMIDI" {
		t.Fatalf("DecryptTransposition() = %q, want RENDEZVOUSAMIDI", decoded)
	}
}

func TestTranspositionPaddingAndLiteralTrailingX(t *testing.T) {
	ciphertext, err := EncryptTransposition("HELLOA", "TABLE")
	if err != nil {
		t.Fatal(err)
	}
	decoded, err := DecryptTranspositionWithLength(ciphertext, "TABLE", 6)
	if err != nil {
		t.Fatal(err)
	}
	if decoded != "HELLOA" {
		t.Fatalf("DecryptTranspositionWithLength() = %q, want HELLOA", decoded)
	}
	decoded, err = DecryptTransposition(ciphertext, "TABLE")
	if err != nil {
		t.Fatal(err)
	}
	if decoded != "HELLOA" {
		t.Fatalf("DecryptTransposition() = %q, want HELLOA after removing padding", decoded)
	}
	literalCiphertext, err := EncryptTransposition("HELLOX", "TABLE")
	if err != nil {
		t.Fatal(err)
	}
	decoded, err = DecryptTranspositionWithLength(literalCiphertext, "TABLE", 6)
	if err != nil {
		t.Fatal(err)
	}
	if decoded != "HELLOX" {
		t.Fatalf("DecryptTranspositionWithLength() = %q, want HELLOX", decoded)
	}
}

func TestCaesarPublicOperations(t *testing.T) {
	got, err := EncryptCaesar("BONJOUR", 3)
	if err != nil {
		t.Fatal(err)
	}
	if got != "ERQMRXU" {
		t.Fatalf("EncryptCaesar() = %q, want ERQMRXU", got)
	}
	candidates, err := BruteForceCaesar(got)
	if err != nil {
		t.Fatal(err)
	}
	if len(candidates) != 25 || candidates[2].Message != "BONJOUR" {
		t.Fatalf("BruteForceCaesar() did not include expected key 3 result: %#v", candidates)
	}
}
