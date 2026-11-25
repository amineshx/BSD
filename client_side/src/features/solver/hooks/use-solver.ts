import { useState } from "react";

import { getApiErrorMessage } from "@/common/lib/axios";
import {
  checkSubstitutionKey,
  describeSubstitutionKeyError,
  parseInteger,
  toCipherLetters,
} from "@/common/utils/letters";

import { useSolveMutation } from "../api/solver-api";

const EXAMPLE = {
  message: "GOACJIPIUE",
  substitutionKey: "JVYBLAMGESONHUTKZPRDXCQWFI",
  transpositionKey: "TABLE",
};

export function useSolver() {
  const [message, setMessage] = useState("");
  const [substitutionKey, setSubstitutionKey] = useState("");
  const [transpositionKey, setTranspositionKey] = useState("");
  const [caesarKeyInput, setCaesarKeyInput] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [selectedKey, setSelectedKey] = useState<number | null>(null);

  const solve = useSolveMutation();

  const substitutionCheck = checkSubstitutionKey(substitutionKey);
  const caesarKey = parseInteger(caesarKeyInput);
  const caesarKeyProvided = caesarKeyInput.trim() !== "";

  const lengthMismatch =
    transpositionKey.length > 0 && message.length > 0 && message.length % transpositionKey.length !== 0;
  const messageError =
    attempted && message.length === 0
      ? "Enter the ciphertext."
      : lengthMismatch
        ? `Length (${message.length}) must be a multiple of the transposition key length (${transpositionKey.length}).`
        : null;
  const substitutionKeyError =
    substitutionCheck.duplicates.length > 0 || attempted || substitutionKey.length === 26
      ? describeSubstitutionKeyError(substitutionKey)
      : null;
  const transpositionKeyError = attempted && transpositionKey.length === 0 ? "Enter a keyword." : null;
  const caesarKeyError = caesarKeyProvided && caesarKey === null ? "Must be a whole number." : null;

  function submit() {
    setAttempted(true);
    const invalid =
      message.length === 0 ||
      lengthMismatch ||
      !substitutionCheck.valid ||
      transpositionKey.length === 0 ||
      caesarKeyError !== null;
    if (invalid) return;

    setSelectedKey(null);
    solve.mutate(
      {
        message,
        substitutionKey,
        transpositionKey,
        ...(caesarKey !== null ? { caesarKey } : {}),
      },
      {
        // A single candidate is the answer — highlight it straight away.
        onSuccess: (data) => {
          if (data.candidates.length === 1) setSelectedKey(data.candidates[0].caesarKey);
        },
      },
    );
  }

  function loadExample() {
    setMessage(EXAMPLE.message);
    setSubstitutionKey(EXAMPLE.substitutionKey);
    setTranspositionKey(EXAMPLE.transpositionKey);
    setCaesarKeyInput("");
  }

  return {
    message,
    setMessage: (value: string) => setMessage(toCipherLetters(value)),
    substitutionKey,
    setSubstitutionKey: (value: string) => setSubstitutionKey(toCipherLetters(value).slice(0, 26)),
    substitutionKeyValid: substitutionCheck.valid,
    transpositionKey,
    setTranspositionKey: (value: string) => setTranspositionKey(toCipherLetters(value)),
    caesarKeyInput,
    setCaesarKeyInput: (value: string) => setCaesarKeyInput(value.replace(/[^\d-]/g, "")),
    messageError,
    substitutionKeyError,
    transpositionKeyError,
    caesarKeyError,
    loadExample,
    submit,
    isPending: solve.isPending,
    error: solve.isError ? getApiErrorMessage(solve.error) : null,
    candidates: solve.data?.candidates.map((candidate) => ({ key: candidate.caesarKey, text: candidate.plaintext })),
    selectedKey,
    setSelectedKey,
  };
}
