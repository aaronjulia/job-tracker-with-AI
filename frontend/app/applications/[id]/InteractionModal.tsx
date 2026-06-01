import { Interaction } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { AlertCircleIcon } from "lucide-react";

type Interactionprops = {
  open: boolean;
  interaction: null | Interaction;
  applicationId: string;
  onClose: () => void;
};

const TYPES = [
  { value: "note", label: "Note" },
  { value: "email", label: "Email" },
  { value: "call", label: "Call" },
  { value: "interview", label: "Interview" },
  { value: "follow_up", label: "Follow up" },
];

export default function InteractionModal({ open, interaction, applicationId, onClose }: Interactionprops) {
  const [type, setType] = useState("note");
  const [notes, setNotes] = useState("");
  const [occurred_at, setOccurredAt] = useState("");

  // Sync fields whenever the modal opens for a (possibly different) interaction.
  useEffect(() => {
    if (open) {
      setType(interaction?.type || "note");
      setNotes(interaction?.notes || "");
      setOccurredAt(interaction?.occurred_at || "");
    }
  }, [open, interaction]);

  const queryClient = useQueryClient();

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["interactions", applicationId] });
    onClose();
  };

  const addMutation = useMutation({
    mutationFn: () =>
      api.post(`/applications/${applicationId}/interactions`, {
        type,
        notes,
        occurred_at,
      }),
    onSuccess,
  });

  const editMutation = useMutation({
    mutationFn: () =>
      api.put(`/applications/${applicationId}/interactions/${interaction?.id}`, {
        type,
        notes,
        occurred_at,
      }),
    onSuccess,
  });

  const mutation = interaction ? editMutation : addMutation;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{interaction ? "Edit interaction" : "Add interaction"}</DialogTitle>
          <DialogDescription>
            {interaction
              ? "Update this entry in the timeline."
              : "Log a note, email, call, or interview for this role."}
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="i-type">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="i-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="i-occurred">Occurred at</Label>
            <Input
              id="i-occurred"
              type="datetime-local"
              value={occurred_at}
              onChange={(e) => setOccurredAt(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="i-notes">Notes</Label>
            <Textarea
              id="i-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What happened?"
              className="min-h-24"
            />
          </div>

          {mutation.isError && (
            <p className="flex items-center gap-1.5 text-sm text-destructive">
              <AlertCircleIcon className="size-4" />
              {mutation.error.message}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving…" : interaction ? "Save changes" : "Add interaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
