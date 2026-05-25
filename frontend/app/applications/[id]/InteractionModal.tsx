import { Contact, Interaction } from "@/lib/types";
import { Dialog, DialogTrigger, DialogOverlay, DialogContent, DialogTitle, DialogDescription  } from "@/components/ui/dialog";
import {useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api";

type Interactionprops = {
    open: boolean;
    interaction: null | Interaction;
    applicationId: string;
    onClose: () => void;
}

{/*
  class InteractionOut(BaseModel):
    id: uuid.UUID
    type: str
    date: datetime
    notes: str | None = None
    occurred_at: datetime | None = None
    model_config = ConfigDict(from_attributes=True)

    class InteractionType(str, PyEnum):
    note = "note"
    email = "email"
    call = "call"
    interview = "interview"
    follow_up = "follow_up"
    */
}

export default function InteractionModal({ open, interaction, applicationId, onClose }: Interactionprops) {
    const [type, setType] = useState(interaction?.type || "");
    const [notes, setNotes] = useState(interaction?.notes || "");
    const [occurred_at, setOccurredAt] = useState(interaction?.occurred_at || "");

    const queryClient = useQueryClient();

    const addMutation = useMutation({
        mutationFn: () => api.post(`/applications/${applicationId}/interactions`,
            {
                type: type,
                notes: notes,
                occurred_at: occurred_at
            }
        ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["interactions", applicationId] });
            onClose();
        }
    });

    const editMutation = useMutation({
        mutationFn: () => api.put(`/applications/${applicationId}/interactions/${interaction?.id}`,
            {
                type: type,
                notes: notes,
                occurred_at: occurred_at
            }
        ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["interactions", applicationId] });
            onClose();
        }
    });

    return (
        <Dialog open={open} onOpenChange={(open) => {if (!open) onClose()}}>
            <DialogTrigger />
            <DialogOverlay className="fixed inset-0 bg-black/50" />
            <DialogContent className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded bg-white p-6">
            <DialogDescription className="text-sm text-gray-500">Use the form below to {interaction ? "edit" : "add"} an interaction for this application.</DialogDescription>
                <DialogTitle>{interaction ? "Edit Interaction" : "Add Interaction"}</DialogTitle>
                {/* Form fields for interaction details would go here */}
                <form className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                            <option value="note">Note</option>
                            <option value="email">Email</option>
                            <option value="call">Call</option>
                            <option value="interview">Interview</option>
                            <option value="follow_up">Follow Up</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Notes</label>
                        <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Occurred At</label>
                        <input type="datetime-local" value={occurred_at} onChange={(e) => setOccurredAt(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-sm text-white flex flex-auto items-center justify-center"
                            onClick={(e) => {
                                e.preventDefault();
                                if (interaction) {
                                    editMutation.mutate();
                                } else {
                                    addMutation.mutate();
                                }
                            }}>
                            {interaction ? "Save" : "Add"}
                        </button>
                    </div>
                </form>
                <button onClick={onClose}>Close</button>
            </DialogContent>
        </Dialog>
    );
}