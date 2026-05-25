"use client";

import { api } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Interaction } from "@/lib/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ContactModal from "./ContactModal";
import InteractionModal from "./InteractionModal";

export default function InteractionSection({ applicationId }: { applicationId: string }) {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["interactions", applicationId],
        queryFn: () => api.get<Interaction[]>(`/applications/${applicationId}/interactions`),
    });
    const [modalOpen, setModalOpen] = useState(false);
    const [editingInteraction, setEditingInteraction] = useState<Interaction | null>(null);


    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: (interactionId: string) => api.delete(`/applications/${applicationId}/interactions/${interactionId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["interactions", applicationId] });
        },
    });

    if (isLoading) {
        return <p className="p-4">Loading interactions…</p>;
    }

    if (isError) {
        return <p className="p-4 text-red-600">{error.message}</p>;
    }


    return (
        <div>
            <InteractionModal open={modalOpen} onClose={() => setModalOpen(false)} interaction={editingInteraction} applicationId={applicationId} />
            <div className="mb-4 flex items-center gap-4">
                <h2 className="text-xl font-semibold">Interactions</h2>
                <Button onClick={() => {setEditingInteraction(null); setModalOpen(true);}} className="hover:bg-primary/80">Add Interaction</Button>
            </div>
            {data?.map(interaction => (
                <div key={interaction.id} className="mb-2 rounded border p-3">
                    <div onClick={() => {setEditingInteraction(interaction); setModalOpen(true);}}>
                        <p><strong>Type:</strong> {interaction.type}</p>
                        {interaction.notes && <p><strong>Notes:</strong> {interaction.notes}</p>}
                        {interaction.occurred_at && <p><strong>Occurred At:</strong> {new Date(interaction.occurred_at).toLocaleString()}</p>}
                    </div>
                     <AlertDialog>
                    <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogDescription> this is wraps brotha</AlertDialogDescription>
                    <AlertDialogTitle>Are you sure you want to delete this interaction?</AlertDialogTitle>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate(interaction.id)}>
                        Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                    </AlertDialog>
                </div>
            ))}
        </div>
    );
}