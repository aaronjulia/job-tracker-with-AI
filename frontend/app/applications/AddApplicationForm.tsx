"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Application, ApplicationStatus } from "@/lib/types";

const STATUSES: ApplicationStatus[] = [
  "wishlist",
  "applied",
  "interviewing",
  "offer",
  "accepted",
  "rejected",
  "withdrawn",
];

export default function AddApplicationForm() {
  const queryClient = useQueryClient();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<ApplicationStatus>("wishlist");

  const createMutation = useMutation({
    mutationFn: () =>
      api.post<Application>("/applications", { company, role, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      setCompany("");
      setRole("");
      setStatus("wishlist");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createMutation.mutate();
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-3 rounded-lg border p-4">
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
          className="flex-1 rounded-md border px-3 py-2"
        />
        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          className="flex-1 rounded-md border px-3 py-2"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
          className="rounded-md border px-3 py-2 capitalize"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>
      </div>

      {createMutation.isError && (
        <p className="text-sm text-red-600">{createMutation.error.message}</p>
      )}

      <button
        type="submit"
        disabled={createMutation.isPending}
        className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {createMutation.isPending ? "Adding…" : "Add application"}
      </button>
    </form>
  );
}