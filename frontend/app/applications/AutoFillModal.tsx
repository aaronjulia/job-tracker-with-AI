import { ApplicationDraft } from "@/lib/types";
import { Dialog, DialogTrigger, DialogOverlay, DialogContent, DialogTitle, DialogDescription  } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";


type ModalProps = {
    open: boolean;
    onClose: () => void;
    onAutofill: (data: ApplicationDraft) => void;
}

export default function AutoFIllModal({open, onClose, onAutofill} : ModalProps) {
    const [jd, setjd] = useState("");

    const autofillMutation = useMutation({
        mutationFn: () => api.post<ApplicationDraft>(`/applications/extract`,
            {
                job_description: jd,
            }
        ),
        onSuccess: (data) => {
            onAutofill(data);
            onClose();
        },
    });

    return (
        <Dialog open={open} onOpenChange={() => onClose()}>
            <DialogTrigger />
            <DialogOverlay className="fixed inset-0 bg-black/50" />
            <DialogContent className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded bg-white p-6">
                <DialogDescription className="text-sm text-gray-500">autofill</DialogDescription>
                <DialogTitle>autofill</DialogTitle>
                <form className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Job description</label>
                        <input
                            type="text"
                            value={jd}
                            onChange={(e) => setjd(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>

                    {autofillMutation.isError && (
                        <p className="text-sm text-red-600">{autofillMutation.error.message}</p>
                    )}

                    <div className="flex justify-end space-x-2">
                        <Button
                            type="submit"
                            disabled={autofillMutation.isPending}
                            className="rounded bg-blue-600 px-4 py-2 text-sm text-white flex flex-auto items-center justify-center"
                            onClick={(e) => {
                                e.preventDefault();
                                autofillMutation.mutate();
                            }}
                        >
                            {autofillMutation.isPending ? "Extracting…" : "Autofill"}
                        </Button>
                    </div>
                </form>
                <button onClick={() => onClose()}>Close</button>
            </DialogContent>
        </Dialog>
    );
}