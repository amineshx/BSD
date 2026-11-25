"use client";

import { ArrowLeftRight } from "lucide-react";

import { CipherOutput } from "@/common/components/cipher/cipher-output";
import { Alert } from "@/common/components/ui/alert";
import { Button } from "@/common/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui/card";

import { useTransposition } from "../hooks/use-transposition";
import { TranspositionForm } from "./transposition-form";
import { TranspositionGrid } from "./transposition-grid";

export function TranspositionWorkspace() {
  const transposition = useTransposition();
  const encrypting = transposition.mode === "encrypt";

  return (
    <div className="grid items-start gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Input</CardTitle>
        </CardHeader>
        <CardContent>
          <TranspositionForm
            mode={transposition.mode}
            onModeChange={transposition.setMode}
            message={transposition.message}
            onMessageChange={transposition.setMessage}
            messageError={transposition.messageError}
            cipherKey={transposition.key}
            onKeyChange={transposition.setKey}
            keyError={transposition.keyError}
            originalLength={transposition.originalLengthInput}
            onOriginalLengthChange={transposition.setOriginalLengthInput}
            originalLengthError={transposition.originalLengthError}
            isPending={transposition.isPending}
            onSubmit={transposition.submit}
          >
            <TranspositionGrid cipherKey={transposition.key} ranks={transposition.ranks} grid={transposition.grid} />
          </TranspositionForm>
        </CardContent>
      </Card>

      <Card className="lg:sticky lg:top-8">
        <CardHeader>
          <CardTitle>Output</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {transposition.error && (
            <Alert variant="error" title="Request failed">
              {transposition.error}
            </Alert>
          )}
          <CipherOutput
            label={encrypting ? "ciphertext" : "plaintext"}
            value={transposition.result}
            isPending={transposition.isPending}
            emptyDescription={`Run ${encrypting ? "encryption" : "decryption"} to see the result here.`}
            actions={
              <Button variant="ghost" size="sm" onClick={transposition.reuseResult}>
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
