import { Contact } from "@/lib/types";
import { Dialog, DialogTrigger, DialogOverlay, DialogContent, DialogTitle, DialogDescription  } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";




type Contactprops = {
    open: boolean;
    contact: null | Contact;
    applicationId: string;
    onClose: () => void;
}

export default function ContactModal({open, contact, applicationId, onClose}: Contactprops) {
    const [name, setName] = useState(contact?.name || "");
    const [email, setEmail] = useState(contact?.email || "");
    const [linkedin_url, setLinkedinUrl] = useState(contact?.linkedin_url || "");
    const [title, setTitle] = useState(contact?.title || "");

    const queryClient = useQueryClient();

    const addMutation = useMutation({
        mutationFn: () => api.post(`/applications/${applicationId}/contacts`,
            {
                name: name,
                email: email,
                linkedin_url: linkedin_url,
                title: title
            }
        ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts", applicationId] });
            onClose();
        }
    });

    const editMutation = useMutation({
        mutationFn: () => api.put(`/applications/${applicationId}/contacts/${contact?.id}`,
            {
                name: name,
                email: email,
                linkedin_url: linkedin_url,
                title: title
            }
        ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts", applicationId] });
            onClose();
        }
    });

    return (
        <Dialog open={open} onOpenChange={(open) => {if (!open) onClose()}}>
            <DialogTrigger />
            <DialogOverlay className="fixed inset-0 bg-black/50" />
            <DialogContent className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded bg-white p-6">
            <DialogDescription className="text-sm text-gray-500">Use the form below to {contact ? "edit" : "add"} a contact for this application.</DialogDescription>
                <DialogTitle>{contact ? "Edit Contact" : "Add Contact"}</DialogTitle>
                {/* Form fields for contact details would go here */}
                <form className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                        <input type="url" value={linkedin_url} onChange={(e) => setLinkedinUrl(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-sm text-white flex flex-auto items-center justify-center"
                            onClick={(e) => {
                                e.preventDefault();
                                if (contact) {
                                    editMutation.mutate();
                                } else {
                                    addMutation.mutate();
                                }
                            }}>
                            {contact ? "Save" : "Add"}
                        </button>
                    </div>
                </form>
                <button onClick={onClose}>Close</button>
            </DialogContent>
        </Dialog>
    );
}