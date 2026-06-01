"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Application, ApplicationStatus, ExtractedRequirements } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import AutoFIllModal from "./AutoFillModal";
import { SparklesIcon, AlertCircleIcon } from "lucide-react";

const STATUSES: ApplicationStatus[] = [
  "wishlist", "applied", "interviewing", "offer", "accepted", "rejected", "withdrawn",
];

export default function AddApplicationForm({ onCreated }: { onCreated?: () => void }) {
  const queryClient = useQueryClient();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<ApplicationStatus>("wishlist");
  const [source, setSource] = useState("");
  const [job_url, setJobUrl] = useState("");
  const [salary_min, setSalaryMin] = useState("");
  const [salary_max, setSalaryMax] = useState("");
  const [applied_at, setAppliedAt] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [requirements, setRequirements] = useState<ExtractedRequirements | null>();

  const createMutation = useMutation({
    mutationFn: () => api.post<Application>("/applications",
      {
        company,
        role,
        status,
        source: source || null,
        job_url: job_url || null,
        salary_min: salary_min ? parseInt(salary_min) : null,
        salary_max: salary_max ? parseInt(salary_max) : null,
        applied_at: applied_at || null,
        extracted_requirements: requirements ?? null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      setCompany(""); setRole(""); setStatus("wishlist"); setSource(""); setJobUrl(""); setSalaryMin(""); setSalaryMax(""); setAppliedAt(""); setRequirements(null);
      onCreated?.();
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createMutation.mutate();
  }

  return (
    <>
      {/* Rendered outside the <form> on purpose: React portals bubble events
          through the React tree, so a modal nested in the form would submit it. */}
      <AutoFIllModal
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        onAutofill={(data) => {
          setCompany(data.company ?? "");
          setRole(data.role ?? "");
          if (data.status) setStatus(data.status);
          if (data.source) setSource(data.source);
          if (data.job_url) setJobUrl(data.job_url);
          setSalaryMin(data.salary_min != null ? String(data.salary_min) : "");
          setSalaryMax(data.salary_max != null ? String(data.salary_max) : "");
          setRequirements(data.extracted_requirements);
        }}
      />

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border bg-card p-5 ring-1 ring-foreground/5"
      >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-heading text-base font-medium">New application</h2>
        <Button type="button" variant="outline" size="sm" onClick={() => setModalVisible(true)}>
          <SparklesIcon />
          Autofill from job post
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="af-company">Company</Label>
          <Input id="af-company" value={company} onChange={(e) => setCompany(e.target.value)}
            placeholder="Stripe" required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="af-role">Role</Label>
          <Input id="af-role" value={role} onChange={(e) => setRole(e.target.value)}
            placeholder="Software Engineer" required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="af-status">Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as ApplicationStatus)}>
            <SelectTrigger id="af-status" className="w-full capitalize">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="af-source">Source</Label>
          <Input id="af-source" value={source} onChange={(e) => setSource(e.target.value)}
            placeholder="LinkedIn" />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="af-url">Job URL</Label>
          <Input id="af-url" value={job_url} onChange={(e) => setJobUrl(e.target.value)}
            placeholder="https://example.com/job" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="af-min">Salary min</Label>
          <Input id="af-min" inputMode="numeric" value={salary_min} onChange={(e) => setSalaryMin(e.target.value)}
            placeholder="50000" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="af-max">Salary max</Label>
          <Input id="af-max" inputMode="numeric" value={salary_max} onChange={(e) => setSalaryMax(e.target.value)}
            placeholder="100000" />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="af-applied">Applied at</Label>
          <Input id="af-applied" type="date" value={applied_at} onChange={(e) => setAppliedAt(e.target.value)} />
        </div>
      </div>

      {createMutation.isError && (
        <p className="mt-4 flex items-center gap-1.5 text-sm text-destructive">
          <AlertCircleIcon className="size-4" />
          {createMutation.error.message}
        </p>
      )}

      <div className="mt-5 flex justify-end gap-2 border-t pt-4">
        <Button type="submit" size="lg" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Adding…" : "Add application"}
        </Button>
      </div>
      </form>
    </>
  );
}
