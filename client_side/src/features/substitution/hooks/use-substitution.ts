import { useState } from "react";

import { getApiErrorMessage } from "@/common/lib/axios";
import type { CipherDirection } from "@/common/types/api";
import { checkSubstitutionKey, describeSubstitutionKeyError, toCipherLetters } from "@/common/utils/letters";

import { useSubstitutionDecrypt, useSubstitutionEncrypt } from "../api/substitution-api";
import { generateSubstitutionKey } from "../utils/random-key";

export const EXAMPLE_SUBSTITUTION_KEY = "QWERTYUIOPASDFGHJKLZXCVBNM";

export function useSubstitution() {
  const [mode, setMode] = useState<CipherDirection>("encrypt");
  const [message, setMessage] = useState("");
  const [key, setKey] = useState(EXAMPLE_SUBSTITUTION_KEY);
  const [attempted, setAttempted] = useState(false);

  const encrypt = useSubstitutionEncrypt();
  const decrypt = useSubstitutionDecrypt();
  const active = mode === "encrypt" ? encrypt : decrypt;

  const keyCheck = checkSubstitutionKey(key);
  // Duplicates are always worth flagging; an incomplete key only after a submit attempt.
  const keyError =
    keyCheck.duplicates.length > 0 || attempted || key.length === 26 ? describeSubstitutionKeyError(key) : null;
  const messageError = attempted && message.length === 0 ? "Enter a message." : null;

  function submit() {
    setAttempted(true);
    if (message.length === 0 || !keyCheck.valid) return;
    active.mutate({ message, key });
  }

  function reuseResult() {
    const result = active.data?.result;
    if (result === undefined) return;
    setMessage(result);
    setMode(mode === "encrypt" ? "decrypt" : "encrypt");
  }

  return {
    mode,
    setMode,
    message,
    setMessage: (value: string) => setMessage(toCipherLetters(value)),
    key,
    setKey: (value: string) => setKey(toCipherLetters(value).slice(0, 26)),
    keyValid: keyCheck.valid,
    duplicateLetters: keyCheck.duplicates,
    keyError,
    randomizeKey: () => setKey(generateSubstitutionKey()),
    resetToExampleKey: () => setKey(EXAMPLE_SUBSTITUTION_KEY),
    messageError,
    submit,
    isPending: active.isPending,
    error: active.isError ? getApiErrorMessage(active.error) : null,
    result: active.data?.result,
    reuseResult,
  };
}
