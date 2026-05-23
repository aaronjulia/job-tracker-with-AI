"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Application, ApplicationStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const STATUSES: ApplicationStatus[] = [
  "wishlist", "applied", "interviewing", "offer", "accepted", "rejected", "withdrawn",
];

export default function AddApplicationForm() {
  const queryClient = useQueryClient();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<ApplicationStatus>("wishlist");

  const createMutation = useMutation({
    mutationFn: () => api.post<Application>("/applications", { company, role, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      setCompany(""); setRole(""); setStatus("wishlist");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createMutation.mutate();
  }

  return (
    <form onSubmit={handleSubmit}
      className="mb-6 flex flex-wrap items-end gap-3 rounded-xl border bg-card p-4">
      <div className="min-w-[140px] flex-1 space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Company</label>
        <Input value={company} onChange={(e) => setCompany(e.target.value)}
          placeholder="Stripe" required />
      </div>

      <div className="min-w-[140px] flex-1 space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Role</label>
        <Input value={role} onChange={(e) => setRole(e.target.value)}
          placeholder="Software Engineer" required />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Status</label>
        <Select value={status} onValueChange={(v) => setStatus(v as ApplicationStatus)}>
          <SelectTrigger className="w-[150px] capitalize">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending ? "Adding…" : "Add"}
      </Button>

      {createMutation.isError && (
        <p className="w-full text-sm text-destructive">{createMutation.error.message}</p>
      )}
    </form>
  );
}