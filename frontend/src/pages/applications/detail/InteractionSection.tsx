import { api } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Interaction } from "@/lib/types";
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
import InteractionModal from "./InteractionModal";
import {
  MessageSquareIcon,
  PlusIcon,
  Trash2Icon,
  StickyNoteIcon,
  MailIcon,
  PhoneIcon,
  UsersIcon,
  CornerUpRightIcon,
} from "lucide-react";

const TYPE_META: Record<string, { label: string; icon: typeof MailIcon }> = {
  note: { label: "Note", icon: StickyNoteIcon },
  email: { label: "Email", icon: MailIcon },
  call: { label: "Call", icon: PhoneIcon },
  interview: { label: "Interview", icon: UsersIcon },
  follow_up: { label: "Follow up", icon: CornerUpRightIcon },
};

export default function InteractionSection({
  applicationId,
}: {
  applicationId: string;
}) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["interactions", applicationId],
    queryFn: () =>
      api.get<Interaction[]>(`/applications/${applicationId}/interactions`),
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingInteraction, setEditingInteraction] =
    useState<Interaction | null>(null);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (interactionId: string) =>
      api.delete(
        `/applications/${applicationId}/interactions/${interactionId}`,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["interactions", applicationId],
      });
    },
  });

  return (
    <section>
      <InteractionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        interaction={editingInteraction}
        applicationId={applicationId}
      />

      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-heading flex items-center gap-2 text-lg font-semibold">
          <MessageSquareIcon className="text-muted-foreground size-4.5" />
          Interactions
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
            setEditingInteraction(null);
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
          No interactions logged yet.
        </p>
      ) : (
        <div className="relative space-y-2.5">
          {data?.map((interaction) => {
            const meta = TYPE_META[interaction.type] ?? {
              label: interaction.type,
              icon: MessageSquareIcon,
            };
            const Icon = meta.icon;
            return (
              <div
                key={interaction.id}
                className="bg-card ring-foreground/5 flex items-start gap-3 rounded-xl border p-4 ring-1 transition-shadow hover:shadow-sm"
              >
                <span className="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-lg">
                  <Icon className="size-4" />
                </span>

                <button
                  type="button"
                  className="min-w-0 flex-1 text-left"
                  onClick={() => {
                    setEditingInteraction(interaction);
                    setModalOpen(true);
                  }}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-medium">{meta.label}</p>
                    {interaction.occurred_at && (
                      <p className="text-muted-foreground shrink-0 text-xs">
                        {new Date(interaction.occurred_at).toLocaleString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    )}
                  </div>
                  {interaction.notes && (
                    <p className="text-muted-foreground mt-0.5 text-sm">
                      {interaction.notes}
                    </p>
                  )}
                </button>

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
                      <AlertDialogTitle>
                        Delete this interaction?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently remove this{" "}
                        {meta.label.toLowerCase()} from the timeline. This
                        can&apos;t be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMutation.mutate(interaction.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
