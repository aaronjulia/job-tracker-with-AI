"use client";

import { api } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Contact } from "@/lib/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ContactModal from "./ContactModal";



export default function ContactsSection({ applicationId }: { applicationId: string }) {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["contacts", applicationId],
        queryFn: () => api.get<Contact[]>(`/applications/${applicationId}/contacts`),
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

    if (isLoading) {
        return <p className="p-4">Loading contacts…</p>;
    }

    if (isError) {
        return <p className="p-4 text-red-600">{error.message}</p>;
    }


    return (
        <div>
            <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} contact={editingContact} applicationId={applicationId} />
            <div className="mb-4 flex items-center gap-4">
                <h2 className="text-xl font-semibold">Contacts</h2>
                <Button onClick={() => {setEditingContact(null); setModalOpen(true);}} className="hover:bg-primary/80">Add Contact</Button>
            </div>
            {data?.map(contact => (
                <div key={contact.id} className="mb-2 rounded border p-3">
                    <div onClick={() => {setEditingContact(contact); setModalOpen(true);}}>
                        <p><strong>Name:</strong> {contact.name}</p>
                        {contact.email && <p><strong>Email:</strong> {contact.email}</p>}
                        {contact.linkedin_url && <p><strong>LinkedIn:</strong> <a href={contact.linkedin_url} target="_blank" rel="noopener noreferrer">View Profile</a></p>}
                        {contact.title && <p><strong>Title:</strong> {contact.title}</p>}
                    </div>
                     <AlertDialog>
                    <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogDescription> this is wraps brotha</AlertDialogDescription>
                    <AlertDialogTitle>Are you sure you want to delete this contact?</AlertDialogTitle>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate(contact.id)}>
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