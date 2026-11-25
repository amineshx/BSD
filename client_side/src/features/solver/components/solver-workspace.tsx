"use client";

import { CandidateList } from "@/common/components/cipher/candidate-list";
import { Alert } from "@/common/components/ui/alert";
import { Badge } from "@/common/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/common/components/ui/card";

import { useSolver } from "../hooks/use-solver";
import { SolverForm } from "./solver-form";

export function SolverWorkspace() {
  const solver = useSolver();

  return (
    <div className="grid items-start gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Input</CardTitle>
        </CardHeader>
        <CardContent>
          <SolverForm
            message={solver.message}
            onMessageChange={solver.setMessage}
            messageError={solver.messageError}
            substitutionKey={solver.substitutionKey}
            onSubstitutionKeyChange={solver.setSubstitutionKey}
            substitutionKeyError={solver.substitutionKeyError}
            substitutionKeyValid={solver.substitutionKeyValid}
            transpositionKey={solver.transpositionKey}
            onTranspositionKeyChange={solver.setTranspositionKey}
            transpositionKeyError={solver.transpositionKeyError}
            caesarKey={solver.caesarKeyInput}
            onCaesarKeyChange={solver.setCaesarKeyInput}
            caesarKeyError={solver.caesarKeyError}
            onLoadExample={solver.loadExample}
            isPending={solver.isPending}
            onSubmit={solver.submit}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-1">
            <CardTitle>Plaintext candidates</CardTitle>
            <CardDescription>
              {solver.candidates && solver.candidates.length > 1
                ? "Select the line that reads as plain language."
                : "One line per Caesar key tried."}
            </CardDescription>
          </div>
          {solver.candidates && <Badge>{solver.candidates.length} results</Badge>}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {solver.error && (
            <Alert variant="error" title="Request failed">
              {solver.error}
            </Alert>
          )}
          <CandidateList
            candidates={solver.candidates}
            isPending={solver.isPending}
            keyLabel="Caesar key"
            selectedKey={solver.selectedKey}
            onSelect={solver.setSelectedKey}
            emptyTitle="Nothing solved yet"
            emptyDescription="Enter the ciphertext and both keys, or load the example, then solve."
          />
        </CardContent>
      </Card>
    </div>
  );
}
