import { Lock, LockOpen, Zap } from "lucide-react";

import { KeyField } from "@/common/components/cipher/key-field";
import { MessageField } from "@/common/components/cipher/message-field";
import { Button } from "@/common/components/ui/button";
import { SegmentedControl, type SegmentedOption } from "@/common/components/ui/segmented-control";

import type { CaesarMode } from "../types/caesar";

const modeOptions: SegmentedOption<CaesarMode>[] = [
  { value: "encrypt", label: "Encrypt", icon: <Lock aria-hidden /> },
  { value: "decrypt", label: "Decrypt", icon: <LockOpen aria-hidden /> },
  { value: "bruteforce", label: "Brute force", icon: <Zap aria-hidden /> },
];

const submitLabels: Record<CaesarMode, string> = {
  encrypt: "Encrypt message",
  decrypt: "Decrypt message",
  bruteforce: "Try all 25 keys",
};

interface CaesarFormProps {
  mode: CaesarMode;
  onModeChange: (mode: CaesarMode) => void;
  message: string;
  onMessageChange: (value: string) => void;
  messageError: string | null;
  keyInput: string;
  onKeyChange: (value: string) => void;
  keyError: string | null;
  isPending: boolean;
  onSubmit: () => void;
}

export function CaesarForm({
  mode,
  onModeChange,
  message,
  onMessageChange,
  messageError,
  keyInput,
  onKeyChange,
  keyError,
  isPending,
  onSubmit,
}: CaesarFormProps) {
  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <SegmentedControl label="Operation" options={modeOptions} value={mode} onChange={onModeChange} />

      <MessageField
        id="caesar-message"
        label={mode === "encrypt" ? "Plaintext" : "Ciphertext"}
        value={message}
        onChange={onMessageChange}
        error={messageError}
        placeholder={mode === "encrypt" ? "BONJOUR" : "ERQMRXU"}
      />

      {mode === "bruteforce" ? (
        <p className="rounded-md border border-border bg-background-secondary px-4 py-3 text-sm text-foreground-muted">
          No key needed — every shift from <span className="font-mono text-foreground-secondary">1</span> to{" "}
          <span className="font-mono text-foreground-secondary">25</span> is tried. Pick the line that reads as plain
          language.
        </p>
      ) : (
        <KeyField
          id="caesar-key"
          label="Shift key"
          value={keyInput}
          onChange={onKeyChange}
          error={keyError}
          hint="Whole number, positive or negative (e.g. 3 or -5). Shifts wrap around the alphabet."
          placeholder="3"
          inputMode="numeric"
          maxLength={6}
        />
      )}

      <Button type="submit" size="lg" loading={isPending} className="w-full sm:w-auto sm:self-start">
        {submitLabels[mode]}
      </Button>
    </form>
  );
}
