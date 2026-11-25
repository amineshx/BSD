import { FlaskConical } from "lucide-react";

import { KeyField } from "@/common/components/cipher/key-field";
import { MessageField } from "@/common/components/cipher/message-field";
import { Button } from "@/common/components/ui/button";

interface SolverFormProps {
  message: string;
  onMessageChange: (value: string) => void;
  messageError: string | null;
  substitutionKey: string;
  onSubstitutionKeyChange: (value: string) => void;
  substitutionKeyError: string | null;
  substitutionKeyValid: boolean;
  transpositionKey: string;
  onTranspositionKeyChange: (value: string) => void;
  transpositionKeyError: string | null;
  caesarKey: string;
  onCaesarKeyChange: (value: string) => void;
  caesarKeyError: string | null;
  onLoadExample: () => void;
  isPending: boolean;
  onSubmit: () => void;
}

export function SolverForm({
  message,
  onMessageChange,
  messageError,
  substitutionKey,
  onSubstitutionKeyChange,
  substitutionKeyError,
  substitutionKeyValid,
  transpositionKey,
  onTranspositionKeyChange,
  transpositionKeyError,
  caesarKey,
  onCaesarKeyChange,
  caesarKeyError,
  onLoadExample,
  isPending,
  onSubmit,
}: SolverFormProps) {
  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <MessageField
        id="solver-message"
        label="Layered ciphertext"
        value={message}
        onChange={onMessageChange}
        error={messageError}
        placeholder="GOACJIPIUE"
      />

      <KeyField
        id="solver-substitution-key"
        label="Substitution key"
        value={substitutionKey}
        onChange={onSubstitutionKeyChange}
        error={substitutionKeyError}
        valid={substitutionKeyValid}
        hint="26 letters, each exactly once."
        placeholder="JVYBLAMGESONHUTKZPRDXCQWFI"
        maxLength={26}
        aside={
          <span
            className={
              substitutionKeyValid ? "font-mono text-xs text-success" : "font-mono text-xs text-foreground-muted"
            }
          >
            {substitutionKey.length}/26
          </span>
        }
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <KeyField
          id="solver-transposition-key"
          label="Transposition key"
          value={transpositionKey}
          onChange={onTranspositionKeyChange}
          error={transpositionKeyError}
          hint="Keyword, letters A–Z."
          placeholder="TABLE"
        />
        <KeyField
          id="solver-caesar-key"
          label="Caesar key (optional)"
          value={caesarKey}
          onChange={onCaesarKeyChange}
          error={caesarKeyError}
          hint="Leave empty to try keys 1–25."
          placeholder="1–25"
          inputMode="numeric"
          maxLength={6}
        />
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" loading={isPending} className="w-full sm:w-auto">
          Solve message
        </Button>
        <Button variant="outline" size="lg" onClick={onLoadExample} className="w-full sm:w-auto">
          <FlaskConical aria-hidden />
          Load example
        </Button>
      </div>
    </form>
  );
}
