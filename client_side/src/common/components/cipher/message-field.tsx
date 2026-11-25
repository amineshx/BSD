import { Field } from "@/common/components/ui/field";
import { Textarea } from "@/common/components/ui/input";

interface MessageFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  placeholder?: string;
}

/** Monospace message textarea with a letter counter. Normalization happens in the feature hook. */
export function MessageField({ id, label, value, onChange, error, placeholder }: MessageFieldProps) {
  return (
    <Field
      label={label}
      htmlFor={id}
      error={error}
      hint="Letters A–Z only. Lowercase is converted; spaces, digits and punctuation are removed."
      aside={<span className="font-mono text-xs text-foreground-muted">{value.length} letters</span>}
    >
      <Textarea
        id={id}
        mono
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        state={error ? "error" : "default"}
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="characters"
        aria-describedby={`${id}-message`}
      />
    </Field>
  );
}
