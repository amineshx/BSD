"use client";

import { ArrowLeftRight } from "lucide-react";

import { CandidateList } from "@/common/components/cipher/candidate-list";
import { CipherOutput } from "@/common/components/cipher/cipher-output";
import { Alert } from "@/common/components/ui/alert";
import { Button } from "@/common/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/common/components/ui/card";

import { useCaesar } from "../hooks/use-caesar";
import { CaesarForm } from "./caesar-form";

export function CaesarWorkspace() {
  const caesar = useCaesar();
  const isBruteforce = caesar.mode === "bruteforce";

  return (
    <div className="grid items-start gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Input</CardTitle>
        </CardHeader>
        <CardContent>
          <CaesarForm
            mode={caesar.mode}
            onModeChange={caesar.setMode}
            message={caesar.message}
            onMessageChange={caesar.setMessage}
            messageError={caesar.messageError}
            keyInput={caesar.keyInput}
            onKeyChange={caesar.setKeyInput}
            keyError={caesar.keyError}
            isPending={caesar.isPending}
            onSubmit={caesar.submit}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-1">
            <CardTitle>{isBruteforce ? "Candidates" : "Output"}</CardTitle>
            {isBruteforce && caesar.candidates && (
              <CardDescription>Select the readable line to highlight it.</CardDescription>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {caesar.error && <Alert variant="error" title="Request failed">{caesar.error}</Alert>}

          {isBruteforce ? (
            <CandidateList
              candidates={caesar.candidates}
              isPending={caesar.isPending}
              selectedKey={caesar.selectedKey}
              onSelect={caesar.setSelectedKey}
              emptyTitle="No brute-force run yet"
              emptyDescription="Paste a ciphertext and run the brute force to list all 25 shifts."
            />
          ) : (
            <CipherOutput
              label={caesar.mode === "encrypt" ? "ciphertext" : "plaintext"}
              value={caesar.result}
              isPending={caesar.isPending}
              emptyDescription={`Run ${caesar.mode === "encrypt" ? "encryption" : "decryption"} to see the result here.`}
              actions={
                <Button variant="ghost" size="sm" onClick={caesar.reuseResult}>
                  <ArrowLeftRight aria-hidden />
                  {caesar.mode === "encrypt" ? "Decrypt this" : "Encrypt this"}
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
