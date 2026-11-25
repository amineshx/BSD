import { useState } from "react";

import { getApiErrorMessage } from "@/common/lib/axios";
import type { CipherDirection } from "@/common/types/api";
import { parseInteger, toCipherLetters } from "@/common/utils/letters";

import { useTranspositionDecrypt, useTranspositionEncrypt } from "../api/transposition-api";
import { buildGrid, columnRanks } from "../utils/grid";

function getOriginalLengthError(input: string, value: number | null, messageLength: number): string | null {
  if (input.trim() === "") return null;
  if (value === null || value < 0) return "Must be a whole number of 0 or more.";
  if (value > messageLength) return `Cannot be longer than the ciphertext (${messageLength}).`;
  return null;
}

export function useTransposition() {
  const [mode, setMode] = useState<CipherDirection>("encrypt");
  const [message, setMessage] = useState("");
  const [key, setKey] = useState("PORTE");
  const [originalLengthInput, setOriginalLengthInput] = useState("");
  const [attempted, setAttempted] = useState(false);

  const encrypt = useTranspositionEncrypt();
  const decrypt = useTranspositionDecrypt();
  const active = mode === "encrypt" ? encrypt : decrypt;

  const originalLength = parseInteger(originalLengthInput);
  const originalLengthError =
    mode === "decrypt" ? getOriginalLengthError(originalLengthInput, originalLength, message.length) : null;

  const keyError = attempted && key.length === 0 ? "Enter a keyword." : null;
  const lengthMismatch =
    mode === "decrypt" && key.length > 0 && message.length > 0 && message.length % key.length !== 0;
  const messageError =
    attempted && message.length === 0
      ? "Enter a message."
      : lengthMismatch
        ? `Ciphertext length (${message.length}) must be a multiple of the key length (${key.length}).`
        : null;

  function submit() {
    setAttempted(true);
    if (message.length === 0 || key.length === 0 || lengthMismatch || originalLengthError) return;

    if (mode === "encrypt") {
      encrypt.mutate({ message, key });
    } else {
      decrypt.mutate({
        message,
        key,
        ...(originalLength !== null ? { originalLength } : {}),
      });
    }
  }

  function reuseResult() {
    const result = active.data?.result;
    if (result === undefined) return;

    // After encrypting, carry the exact plaintext length over so trailing X letters survive decryption.
    setOriginalLengthInput(mode === "encrypt" ? String(encrypt.variables?.message.length ?? "") : "");
    setMessage(result);
    setMode(mode === "encrypt" ? "decrypt" : "encrypt");
  }

  return {
    mode,
    setMode,
    message,
    setMessage: (value: string) => setMessage(toCipherLetters(value)),
    key,
    setKey: (value: string) => setKey(toCipherLetters(value)),
    keyError,
    originalLengthInput,
    setOriginalLengthInput: (value: string) => setOriginalLengthInput(value.replace(/\D/g, "")),
    originalLengthError,
    messageError,
    // The grid preview only makes sense for the plaintext being written row by row.
    grid: mode === "encrypt" ? buildGrid(message, key) : [],
    ranks: columnRanks(key),
    submit,
    isPending: active.isPending,
    error: active.isError ? getApiErrorMessage(active.error) : null,
    result: active.data?.result,
    reuseResult,
  };
}
