import { Field } from "@/common/components/ui/field";
import { Input, type FieldState } from "@/common/components/ui/input";

interface KeyFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  hint?: React.ReactNode;
  aside?: React.ReactNode;
  placeholder?: string;
  maxLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  valid?: boolean;
}

/** Monospace input for encryption keys. */
export function KeyField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  aside,
  placeholder,
  maxLength,
  inputMode,
  valid = false,
}: KeyFieldProps) {
  const state: FieldState = error ? "error" : valid ? "success" : "default";

  return (
    <Field label={label} htmlFor={id} error={error} hint={hint} aside={aside}>
      <Input
        id={id}
        mono
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        inputMode={inputMode}
        state={state}
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="characters"
        aria-describedby={`${id}-message`}
      />
    </Field>
  );
}
