"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Application, ApplicationStatus, ExtractedRequirements } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import AutoFIllModal from "./AutoFillModal";

const STATUSES: ApplicationStatus[] = [
  "wishlist", "applied", "interviewing", "offer", "accepted", "rejected", "withdrawn",
];

{/*

  class ApplicationCreate(BaseModel):
    company: str
    role: str
    status: ApplicationStatus = ApplicationStatus.wishlist
    source: str | None = None
    job_url: str | None = None
    salary_min: int | None = None
    salary_max: int | None = None
    applied_at: datetime | None = None
  */

}

export default function AddApplicationForm() {
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

  {/*

    type ExtractedRequirements = {
    required_skills: string[]
    preferred_skills: string[]
    years_experience: string | null
    education: string | null
    responsibilities: string[]
    keywords: string[]
}
    */
   }


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
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createMutation.mutate();
  }

  return (
    <form onSubmit={handleSubmit}
      className="mb-6 flex flex-wrap items-end gap-3 rounded-xl border bg-card p-4">

        <AutoFIllModal open={modalVisible} onClose={() => setModalVisible(false)}
        onAutofill={(data) => {
          setCompany(data.company ?? "");
          setRole(data.role ?? "");
          if (data.status) setStatus(data.status);
          if (data.source) setSource(data.source);
          if (data.job_url) setJobUrl(data.job_url);
          setSalaryMin(data.salary_min != null ? String(data.salary_min) : "");
          setSalaryMax(data.salary_max != null ? String(data.salary_max) : "");
          setRequirements(data.extracted_requirements);
        }}/>

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

            <div className="min-w-[140px] flex-1 space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Source</label>
        <Input value={source} onChange={(e) => setSource(e.target.value)}
          placeholder="LinkedIn" />
      </div>

      <div className="min-w-[140px] flex-1 space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Job URL</label>
        <Input value={job_url} onChange={(e) => setJobUrl(e.target.value)}
          placeholder="https://example.com/job" />
      </div>

      <div className="min-w-[140px] flex-1 space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Salary Min</label>
        <Input value={salary_min} onChange={(e) => setSalaryMin(e.target.value)}
          placeholder="50000" />
      </div>

      <div className="min-w-[140px] flex-1 space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Salary Max</label>
        <Input value={salary_max} onChange={(e) => setSalaryMax(e.target.value)}
          placeholder="100000" />
      </div>

      <div className="min-w-[140px] flex-1 space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Applied At</label>
        <Input value={applied_at} onChange={(e) => setAppliedAt(e.target.value)}
          placeholder="2023-10-01" />
      </div>

      <div>
      <Button type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending ? "Adding…" : "Add"}
      </Button>

      <Button type="button" onClick={() => setModalVisible(true)}>
        autofill
      </Button>
      </div>

      {createMutation.isError && (
        <p className="w-full text-sm text-destructive">{createMutation.error.message}</p>
      )}
    </form>
  );
}