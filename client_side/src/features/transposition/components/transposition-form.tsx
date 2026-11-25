import { Lock, LockOpen } from "lucide-react";

import { KeyField } from "@/common/components/cipher/key-field";
import { MessageField } from "@/common/components/cipher/message-field";
import { Button } from "@/common/components/ui/button";
import { Field } from "@/common/components/ui/field";
import { Input } from "@/common/components/ui/input";
import { SegmentedControl, type SegmentedOption } from "@/common/components/ui/segmented-control";
import type { CipherDirection } from "@/common/types/api";

const modeOptions: SegmentedOption<CipherDirection>[] = [
  { value: "encrypt", label: "Encrypt", icon: <Lock aria-hidden /> },
  { value: "decrypt", label: "Decrypt", icon: <LockOpen aria-hidden /> },
];

interface TranspositionFormProps {
  mode: CipherDirection;
  onModeChange: (mode: CipherDirection) => void;
  message: string;
  onMessageChange: (value: string) => void;
  messageError: string | null;
  cipherKey: string;
  onKeyChange: (value: string) => void;
  keyError: string | null;
  originalLength: string;
  onOriginalLengthChange: (value: string) => void;
  originalLengthError: string | null;
  isPending: boolean;
  onSubmit: () => void;
  /** Extra content under the key (grid preview). */
  children?: React.ReactNode;
}

export function TranspositionForm({
  mode,
  onModeChange,
  message,
  onMessageChange,
  messageError,
  cipherKey,
  onKeyChange,
  keyError,
  originalLength,
  onOriginalLengthChange,
  originalLengthError,
  isPending,
  onSubmit,
  children,
}: TranspositionFormProps) {
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
        id="transposition-message"
        label={mode === "encrypt" ? "Plaintext" : "Ciphertext"}
        value={message}
        onChange={onMessageChange}
        error={messageError}
        placeholder={mode === "encrypt" ? "RENDEZVOUSAMIDI" : "ESIEVMRZANOIDUD"}
      />

      <KeyField
        id="transposition-key"
        label="Keyword"
        value={cipherKey}
        onChange={onKeyChange}
        error={keyError}
        hint="One or more letters A–Z. Its length sets the number of columns."
        placeholder="PORTE"
        aside={<span className="font-mono text-xs text-foreground-muted">{cipherKey.length} columns</span>}
      />

      {mode === "decrypt" && (
        <Field
          label="Original length (optional)"
          htmlFor="transposition-original-length"
          error={originalLengthError}
          hint="Without it, up to key length − 1 trailing X letters are removed as padding. Set it to keep real trailing X letters."
        >
          <Input
            id="transposition-original-length"
            mono
            inputMode="numeric"
            value={originalLength}
            onChange={(event) => onOriginalLengthChange(event.target.value)}
            placeholder="15"
            state={originalLengthError ? "error" : "default"}
            className="sm:max-w-40"
            aria-describedby="transposition-original-length-message"
          />
        </Field>
      )}

      {children}

      <Button type="submit" size="lg" loading={isPending} className="w-full sm:w-auto sm:self-start">
        {mode === "encrypt" ? "Encrypt message" : "Decrypt message"}
      </Button>
    </form>
  );
}
