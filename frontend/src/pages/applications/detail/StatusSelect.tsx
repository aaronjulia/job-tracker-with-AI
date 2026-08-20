import { api } from "@/lib/api";
import type { Application, ApplicationStatus } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2Icon } from "lucide-react";

const STATUSES: ApplicationStatus[] = [
  "wishlist",
  "applied",
  "interviewing",
  "offer",
  "accepted",
  "rejected",
  "withdrawn",
];

const STYLES: Record<ApplicationStatus, string> = {
  wishlist: "bg-slate-100 text-slate-700 border-slate-200",
  applied: "bg-blue-100 text-blue-700 border-blue-200",
  interviewing: "bg-amber-100 text-amber-700 border-amber-200",
  offer: "bg-emerald-100 text-emerald-700 border-emerald-200",
  accepted: "bg-green-100 text-green-800 border-green-300",
  rejected: "bg-red-100 text-red-700 border-red-200",
  withdrawn: "bg-gray-100 text-gray-500 border-gray-200",
};

const DOT: Record<ApplicationStatus, string> = {
  wishlist: "bg-slate-400",
  applied: "bg-blue-500",
  interviewing: "bg-amber-500",
  offer: "bg-emerald-500",
  accepted: "bg-green-600",
  rejected: "bg-red-500",
  withdrawn: "bg-gray-400",
};

export function StatusSelect({
  applicationId,
  status,
}: {
  applicationId: string;
  status: ApplicationStatus;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (next: ApplicationStatus) =>
      api.put<Application>(`/applications/${applicationId}`, { status: next }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["application", applicationId], updated);
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });

  return (
    <Select
      value={status}
      onValueChange={(next) => mutation.mutate(next as ApplicationStatus)}
      disabled={mutation.isPending}
    >
      <SelectTrigger
        size="sm"
        className={`${STYLES[status]} gap-2 font-medium capitalize`}
      >
        {mutation.isPending && (
          <Loader2Icon className="size-3.5 animate-spin" />
        )}
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {STATUSES.map((s) => (
          <SelectItem key={s} value={s} className="capitalize">
            <span className={`size-2 rounded-full ${DOT[s]}`} />
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
