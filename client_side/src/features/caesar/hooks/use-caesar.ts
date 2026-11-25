import { useState } from "react";

import { getApiErrorMessage } from "@/common/lib/axios";
import { parseInteger, toCipherLetters } from "@/common/utils/letters";

import { useCaesarBruteforce, useCaesarDecrypt, useCaesarEncrypt } from "../api/caesar-api";
import type { CaesarMode } from "../types/caesar";

function getKeyError(keyInput: string, key: number | null, attempted: boolean): string | null {
  if (keyInput.trim() === "") return attempted ? "Enter a key." : null;
  return key === null ? "The key must be a whole number." : null;
}

export function useCaesar() {
  const [mode, setMode] = useState<CaesarMode>("encrypt");
  const [message, setMessage] = useState("");
  const [keyInput, setKeyInput] = useState("3");
  const [attempted, setAttempted] = useState(false);
  const [selectedKey, setSelectedKey] = useState<number | null>(null);

  const encrypt = useCaesarEncrypt();
  const decrypt = useCaesarDecrypt();
  const bruteforce = useCaesarBruteforce();
  const active = mode === "encrypt" ? encrypt : mode === "decrypt" ? decrypt : bruteforce;

  const key = parseInteger(keyInput);
  const needsKey = mode !== "bruteforce";
  const messageError = attempted && message.length === 0 ? "Enter a message." : null;
  const keyError = needsKey ? getKeyError(keyInput, key, attempted) : null;
  const result = mode === "encrypt" ? encrypt.data?.result : mode === "decrypt" ? decrypt.data?.result : undefined;

  function submit() {
    setAttempted(true);
    if (message.length === 0) return;

    if (mode === "bruteforce") {
      setSelectedKey(null);
      bruteforce.mutate({ message });
      return;
    }

    if (key === null) return;
    (mode === "encrypt" ? encrypt : decrypt).mutate({ message, key });
  }

  /** Feed the last result back in and flip the direction (encrypt ⇄ decrypt). */
  function reuseResult() {
    if (result === undefined || mode === "bruteforce") return;
    setMessage(result);
    setMode(mode === "encrypt" ? "decrypt" : "encrypt");
  }

  return {
    mode,
    setMode,
    message,
    setMessage: (value: string) => setMessage(toCipherLetters(value)),
    keyInput,
    setKeyInput: (value: string) => setKeyInput(value.replace(/[^\d-]/g, "")),
    messageError,
    keyError,
    submit,
    isPending: active.isPending,
    error: active.isError ? getApiErrorMessage(active.error) : null,
    result,
    candidates: bruteforce.data?.map((candidate) => ({ key: candidate.key, text: candidate.message })),
    selectedKey,
    setSelectedKey,
    reuseResult,
  };
}
