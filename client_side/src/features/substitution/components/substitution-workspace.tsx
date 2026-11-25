"use client";

import { ArrowLeftRight } from "lucide-react";

import { CipherOutput } from "@/common/components/cipher/cipher-output";
import { Alert } from "@/common/components/ui/alert";
import { Button } from "@/common/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui/card";

import { useSubstitution } from "../hooks/use-substitution";
import { SubstitutionForm } from "./substitution-form";

export function SubstitutionWorkspace() {
  const substitution = useSubstitution();
  const encrypting = substitution.mode === "encrypt";

  return (
    <div className="grid items-start gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Input</CardTitle>
        </CardHeader>
        <CardContent>
          <SubstitutionForm
            mode={substitution.mode}
            onModeChange={substitution.setMode}
            message={substitution.message}
            onMessageChange={substitution.setMessage}
            messageError={substitution.messageError}
            cipherKey={substitution.key}
            onKeyChange={substitution.setKey}
            keyError={substitution.keyError}
            keyValid={substitution.keyValid}
            duplicateLetters={substitution.duplicateLetters}
            onRandomizeKey={substitution.randomizeKey}
            onResetKey={substitution.resetToExampleKey}
            isPending={substitution.isPending}
            onSubmit={substitution.submit}
          />
        </CardContent>
      </Card>

      <Card className="lg:sticky lg:top-8">
        <CardHeader>
          <CardTitle>Output</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {substitution.error && (
            <Alert variant="error" title="Request failed">
              {substitution.error}
            </Alert>
          )}
          <CipherOutput
            label={encrypting ? "ciphertext" : "plaintext"}
            value={substitution.result}
            isPending={substitution.isPending}
            emptyDescription={`Run ${encrypting ? "encryption" : "decryption"} to see the result here.`}
            actions={
              <Button variant="ghost" size="sm" onClick={substitution.reuseResult}>
                <ArrowLeftRight aria-hidden />
                {encrypting ? "Decrypt this" : "Encrypt this"}
              </Button>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
