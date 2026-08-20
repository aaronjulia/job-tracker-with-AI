import type { Contact } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircleIcon } from "lucide-react";

type Contactprops = {
  open: boolean;
  contact: null | Contact;
  applicationId: string;
  onClose: () => void;
};

export default function ContactModal({
  open,
  contact,
  applicationId,
  onClose,
}: Contactprops) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [linkedin_url, setLinkedinUrl] = useState("");
  const [title, setTitle] = useState("");

  // Sync fields whenever the modal opens for a (possibly different) contact.
  useEffect(() => {
    if (open) {
      /* eslint-disable react-hooks/set-state-in-effect -- one-shot form reset when the dialog (re)opens */
      setName(contact?.name || "");
      setEmail(contact?.email || "");
      setLinkedinUrl(contact?.linkedin_url || "");
      setTitle(contact?.title || "");
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [open, contact]);

  const queryClient = useQueryClient();

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["contacts", applicationId] });
    onClose();
  };

  const addMutation = useMutation({
    mutationFn: () =>
      api.post(`/applications/${applicationId}/contacts`, {
        name,
        email,
        linkedin_url,
        title,
      }),
    onSuccess,
  });

  const editMutation = useMutation({
    mutationFn: () =>
      api.put(`/applications/${applicationId}/contacts/${contact?.id}`, {
        name,
        email,
        linkedin_url,
        title,
      }),
    onSuccess,
  });

  const mutation = contact ? editMutation : addMutation;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{contact ? "Edit contact" : "Add contact"}</DialogTitle>
          <DialogDescription>
            {contact
              ? "Update the details for this contact."
              : "Add a recruiter, referral, or anyone tied to this role."}
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
            <Label htmlFor="c-name">Name</Label>
            <Input
              id="c-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              required
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-email">Email</Label>
            <Input
              id="c-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@company.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-linkedin">LinkedIn URL</Label>
            <Input
              id="c-linkedin"
              type="url"
              value={linkedin_url}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/…"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-title">Title</Label>
            <Input
              id="c-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Engineering Manager"
            />
          </div>

          {mutation.isError && (
            <p className="text-destructive flex items-center gap-1.5 text-sm">
              <AlertCircleIcon className="size-4" />
              {mutation.error.message}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending
                ? "Saving…"
                : contact
                  ? "Save changes"
                  : "Add contact"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
