import type { ApplicationDraft } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SparklesIcon, AlertCircleIcon } from "lucide-react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  onAutofill: (data: ApplicationDraft) => void;
};

export default function AutoFIllModal({
  open,
  onClose,
  onAutofill,
}: ModalProps) {
  const [jd, setjd] = useState("");

  const autofillMutation = useMutation({
    mutationFn: () =>
      api.post<ApplicationDraft>(`/applications/extract`, {
        job_description: jd,
      }),
    onSuccess: (data) => {
      onAutofill(data);
      onClose();
    },
  });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SparklesIcon className="size-4" />
            Autofill from job post
          </DialogTitle>
          <DialogDescription>
            Paste the job description and we&apos;ll extract the company, role,
            and requirements for you.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex min-h-0 flex-1 flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            autofillMutation.mutate();
          }}
        >
          <Label htmlFor="jd">Job description</Label>
          <Textarea
            id="jd"
            value={jd}
            onChange={(e) => setjd(e.target.value)}
            placeholder="Paste the full job description here…"
            className="min-h-40 flex-1 resize-none overflow-y-auto"
            autoFocus
          />

          {autofillMutation.isError && (
            <p className="text-destructive flex items-center gap-1.5 text-sm">
              <AlertCircleIcon className="size-4" />
              {autofillMutation.error.message}
            </p>
          )}

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={autofillMutation.isPending || !jd.trim()}
            >
              {autofillMutation.isPending ? "Extracting…" : "Autofill"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
