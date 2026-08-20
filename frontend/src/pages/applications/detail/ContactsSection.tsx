import { api } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Contact } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ContactModal from "./ContactModal";
import {
  UsersIcon,
  PlusIcon,
  MailIcon,
  LinkIcon,
  Trash2Icon,
} from "lucide-react";

export default function ContactsSection({
  applicationId,
}: {
  applicationId: string;
}) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["contacts", applicationId],
    queryFn: () =>
      api.get<Contact[]>(`/applications/${applicationId}/contacts`),
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (contactId: string) => api.delete(`/contacts/${contactId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts", applicationId] });
    },
  });

  function initials(name: string) {
    return name
      .split(" ")
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  return (
    <section>
      <ContactModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        contact={editingContact}
        applicationId={applicationId}
      />

      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-heading flex items-center gap-2 text-lg font-semibold">
          <UsersIcon className="text-muted-foreground size-4.5" />
          Contacts
          {data && data.length > 0 && (
            <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-medium">
              {data.length}
            </span>
          )}
        </h2>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setEditingContact(null);
            setModalOpen(true);
          }}
        >
          <PlusIcon />
          Add
        </Button>
      </div>

      {isLoading ? (
        <div className="bg-muted h-16 animate-pulse rounded-xl" />
      ) : isError ? (
        <p className="text-destructive text-sm">{error.message}</p>
      ) : data && data.length === 0 ? (
        <p className="text-muted-foreground rounded-xl border border-dashed px-4 py-8 text-center text-sm">
          No contacts yet.
        </p>
      ) : (
        <div className="space-y-2.5">
          {data?.map((contact) => (
            <div
              key={contact.id}
              className="bg-card ring-foreground/5 flex items-center gap-3 rounded-xl border p-4 ring-1 transition-shadow hover:shadow-sm"
            >
              <span className="bg-muted text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-medium">
                {initials(contact.name)}
              </span>

              <button
                type="button"
                className="min-w-0 flex-1 text-left"
                onClick={() => {
                  setEditingContact(contact);
                  setModalOpen(true);
                }}
              >
                <p className="truncate font-medium">{contact.name}</p>
                {contact.title && (
                  <p className="text-muted-foreground truncate text-sm">
                    {contact.title}
                  </p>
                )}
                <div className="text-muted-foreground mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs">
                  {contact.email && (
                    <span className="inline-flex items-center gap-1">
                      <MailIcon className="size-3" />
                      {contact.email}
                    </span>
                  )}
                </div>
              </button>

              {contact.linkedin_url && (
                <a
                  href={contact.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:bg-muted hover:text-foreground flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors"
                  title="LinkedIn profile"
                >
                  <LinkIcon className="size-4" />
                </a>
              )}

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2Icon />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this contact?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove {contact.name} from this
                      application. This can&apos;t be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteMutation.mutate(contact.id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
