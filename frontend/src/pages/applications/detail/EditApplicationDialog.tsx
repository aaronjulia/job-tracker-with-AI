import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Application, ApplicationStatus } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type props = {
  open: boolean;
  application: Application;
  onClose: () => void;
};

export default function EditApplicationDialog({
  open,
  application,
  onClose,
}: props) {
  const [company, setCompany] = useState(application.company);
  const [role, setRole] = useState(application.role);
  const [status] = useState<ApplicationStatus>(application.status);
  const [source, setSource] = useState(application.source || "");
  const [job_url, setJobUrl] = useState(application.job_url || "");
  const [salary_min, setSalaryMin] = useState(
    application.salary_min != null ? String(application.salary_min) : "",
  );
  const [salary_max, setSalaryMax] = useState(
    application.salary_max != null ? String(application.salary_max) : "",
  );
  const [applied_at, setAppliedAt] = useState(
    application.applied_at ? application.applied_at.substring(0, 10) : "",
  ); // Format as YYYY-MM-DD

  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: () =>
      api.put(`/applications/${application.id}`, {
        company,
        role,
        status,
        source,
        job_url,
        salary_min: salary_min ? Number(salary_min) : null,
        salary_max: salary_max ? Number(salary_max) : null,
        applied_at: applied_at || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["application", application.id],
      });
      onClose();
    },
  });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Application</DialogTitle>
          <DialogDescription>
            Update the details of your job application.
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid w-full gap-4 py-4"
          onSubmit={(e) => {
            e.preventDefault();
            updateMutation.mutate();
          }}
        >
          <div className="grid w-full items-center gap-2">
            <label
              htmlFor="company"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Company
            </label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company name"
              required
              autoFocus
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <label
              htmlFor="role"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Role
            </label>
            <Input
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Job title"
              required
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <label
              htmlFor="source"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Source
            </label>
            <Input
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Where did you find this job?"
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <label
              htmlFor="job_url"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Job URL
            </label>
            <Input
              id="job_url"
              type="url"
              value={job_url}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://company.com/job-posting"
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <label
              htmlFor="salary_min"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Minimum Salary
            </label>
            <Input
              id="salary_min"
              type="number"
              value={salary_min}
              onChange={(e) => setSalaryMin(e.target.value)}
              placeholder="Minimum salary"
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <label
              htmlFor="salary_max"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Maximum Salary
            </label>
            <Input
              id="salary_max"
              type="number"
              value={salary_max}
              onChange={(e) => setSalaryMax(e.target.value)}
              placeholder="Maximum salary"
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <label
              htmlFor="applied_at"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Applied At
            </label>
            <Input
              id="applied_at"
              type="date"
              value={applied_at}
              onChange={(e) => setAppliedAt(e.target.value)}
            />
          </div>
          <Button type="submit" className="ml-auto">
            Save changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
