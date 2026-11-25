import { Lock, LockOpen, RotateCcw, Shuffle } from "lucide-react";

import { KeyField } from "@/common/components/cipher/key-field";
import { MessageField } from "@/common/components/cipher/message-field";
import { Button } from "@/common/components/ui/button";
import { SegmentedControl, type SegmentedOption } from "@/common/components/ui/segmented-control";
import type { CipherDirection } from "@/common/types/api";

import { KeyMapping } from "./key-mapping";

const modeOptions: SegmentedOption<CipherDirection>[] = [
  { value: "encrypt", label: "Encrypt", icon: <Lock aria-hidden /> },
  { value: "decrypt", label: "Decrypt", icon: <LockOpen aria-hidden /> },
];

interface SubstitutionFormProps {
  mode: CipherDirection;
  onModeChange: (mode: CipherDirection) => void;
  message: string;
  onMessageChange: (value: string) => void;
  messageError: string | null;
  cipherKey: string;
  onKeyChange: (value: string) => void;
  keyError: string | null;
  keyValid: boolean;
  duplicateLetters: string[];
  onRandomizeKey: () => void;
  onResetKey: () => void;
  isPending: boolean;
  onSubmit: () => void;
}

export function SubstitutionForm({
  mode,
  onModeChange,
  message,
  onMessageChange,
  messageError,
  cipherKey,
  onKeyChange,
  keyError,
  keyValid,
  duplicateLetters,
  onRandomizeKey,
  onResetKey,
  isPending,
  onSubmit,
}: SubstitutionFormProps) {
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
        id="substitution-message"
        label={mode === "encrypt" ? "Plaintext" : "Ciphertext"}
        value={message}
        onChange={onMessageChange}
        error={messageError}
        placeholder={mode === "encrypt" ? "ATTAQUE" : "QZZQJXT"}
      />

      <div className="flex flex-col gap-3">
        <KeyField
          id="substitution-key"
          label="Substitution alphabet"
          value={cipherKey}
          onChange={onKeyChange}
          error={keyError}
          valid={keyValid}
          hint="A permutation of A–Z: each letter exactly once. A maps to the 1st letter, B to the 2nd…"
          placeholder="QWERTYUIOPASDFGHJKLZXCVBNM"
          maxLength={26}
          aside={
            <span className={keyValid ? "font-mono text-xs text-success" : "font-mono text-xs text-foreground-muted"}>
              {cipherKey.length}/26
            </span>
          }
        />
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onRandomizeKey}>
            <Shuffle aria-hidden />
            Random key
          </Button>
          <Button variant="ghost" size="sm" onClick={onResetKey}>
            <RotateCcw aria-hidden />
            Example key
          </Button>
        </div>
        <KeyMapping cipherKey={cipherKey} duplicates={duplicateLetters} />
      </div>

      <Button type="submit" size="lg" loading={isPending} className="w-full sm:w-auto sm:self-start">
        {mode === "encrypt" ? "Encrypt message" : "Decrypt message"}
      </Button>
    </form>
  );
}
