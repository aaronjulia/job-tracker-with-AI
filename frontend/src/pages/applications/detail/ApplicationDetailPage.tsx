import { api } from "@/lib/api";
import type { Application } from "@/lib/types";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import ContactsSection from "./ContactsSection";
import InteractionSection from "./InteractionSection";
import { StatusSelect } from "./StatusSelect";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EditApplicationDialog from "./EditApplicationDialog";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ExternalLinkIcon,
  BanknoteIcon,
  CompassIcon,
  AlertCircleIcon,
  FileTextIcon,
  GraduationCapIcon,
  BriefcaseIcon,
  PencilIcon,
} from "lucide-react";

function formatSalary(min: number | null, max: number | null) {
  if (min == null && max == null) return null;
  const fmt = (n: number) => `$${n.toLocaleString()}`;
  if (min != null && max != null) return `${fmt(min)} – ${fmt(max)}`;
  return fmt((min ?? max) as number);
}

function formatAppliedDate(value: string) {
  // Parse the calendar date in local time to avoid the UTC-midnight off-by-one.
  const [year, month, day] = value.substring(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ApplicationDetailPage() {
  const isAuthenticated = useRequireAuth();
  // The route is /applications/:id, so `id` is always present here.
  const { id = "" } = useParams<{ id: string }>();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["application", id],
    queryFn: () => api.get<Application>(`/applications/${id}`),
  });

  if (!isAuthenticated) return null;

  return (
    <div className="flex flex-1 flex-col">
      <header className="bg-background/80 supports-backdrop-filter:bg-background/60 sticky top-0 z-10 border-b backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center px-6 py-3.5">
          <Button asChild variant="ghost" size="sm">
            <Link to="/applications">
              <ArrowLeftIcon />
              Applications
            </Link>
          </Button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl px-6 py-10">
        {isLoading ? (
          <div className="space-y-4">
            <div className="bg-muted h-9 w-1/2 animate-pulse rounded-lg" />
            <div className="bg-muted h-40 animate-pulse rounded-xl" />
          </div>
        ) : isError ? (
          <div className="border-destructive/30 bg-destructive/5 text-destructive flex items-center gap-2 rounded-xl border px-4 py-3 text-sm">
            <AlertCircleIcon className="size-4 shrink-0" />
            {error.message}
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="font-heading text-3xl font-semibold tracking-tight">
                  {data?.company}
                </h1>
                <p className="text-muted-foreground mt-1">{data?.role}</p>
              </div>
              {data && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditOpen(true)}
                  >
                    <PencilIcon />
                    Edit
                  </Button>
                  <StatusSelect applicationId={id} status={data.status} />
                </div>
              )}
            </div>

            {data && (
              <EditApplicationDialog
                open={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                application={data}
              />
            )}

            <Card className="mb-8 p-6">
              <dl className="grid gap-5 sm:grid-cols-2">
                <Detail
                  icon={<CalendarIcon className="size-4" />}
                  label="Applied"
                  value={
                    data?.applied_at ? formatAppliedDate(data.applied_at) : "—"
                  }
                />
                <Detail
                  icon={<CompassIcon className="size-4" />}
                  label="Source"
                  value={data?.source || "—"}
                />
                <Detail
                  icon={<BanknoteIcon className="size-4" />}
                  label="Salary range"
                  value={
                    formatSalary(
                      data?.salary_min ?? null,
                      data?.salary_max ?? null,
                    ) || "—"
                  }
                />
                <Detail
                  icon={<ExternalLinkIcon className="size-4" />}
                  label="Job posting"
                  value={
                    data?.job_url ? (
                      <a
                        href={data.job_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground inline-flex items-center gap-1 font-medium underline-offset-4 hover:underline"
                      >
                        View posting
                        <ExternalLinkIcon className="size-3.5" />
                      </a>
                    ) : (
                      "—"
                    )
                  }
                />
              </dl>
            </Card>

            {data?.extracted_requirements && (
              <section className="mb-8">
                <h2 className="font-heading mb-3 flex items-center gap-2 text-lg font-semibold">
                  <FileTextIcon className="text-muted-foreground size-4.5" />
                  Job Details
                </h2>
                <Card className="space-y-6 p-6">
                  <dl className="grid gap-5 sm:grid-cols-2">
                    <Detail
                      icon={<GraduationCapIcon className="size-4" />}
                      label="Education"
                      value={data.extracted_requirements.education || "—"}
                    />
                    <Detail
                      icon={<BriefcaseIcon className="size-4" />}
                      label="Experience"
                      value={
                        data.extracted_requirements.years_experience || "—"
                      }
                    />
                  </dl>

                  <SkillGroup
                    label="Required skills"
                    items={data.extracted_requirements.required_skills}
                    variant="secondary"
                  />
                  <SkillGroup
                    label="Preferred skills"
                    items={data.extracted_requirements.preferred_skills}
                    variant="outline"
                  />

                  {data.extracted_requirements.responsibilities.length > 0 && (
                    <div>
                      <h3 className="text-muted-foreground mb-2 text-xs font-medium">
                        Responsibilities
                      </h3>
                      <ul className="space-y-1.5">
                        {data.extracted_requirements.responsibilities.map(
                          (item, i) => (
                            <li key={i} className="flex gap-2.5 text-sm">
                              <span className="bg-muted-foreground/40 mt-2 size-1.5 shrink-0 rounded-full" />
                              <span>{item}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                </Card>
              </section>
            )}

            <div className="space-y-8">
              <ContactsSection applicationId={id} />
              <InteractionSection applicationId={id} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="bg-muted text-muted-foreground mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-muted-foreground text-xs font-medium">{label}</dt>
        <dd className="mt-0.5 truncate text-sm font-medium">{value}</dd>
      </div>
    </div>
  );
}

function SkillGroup({
  label,
  items,
  variant,
}: {
  label: string;
  items: string[];
  variant: "secondary" | "outline";
}) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h3 className="text-muted-foreground mb-2 text-xs font-medium">
        {label}
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <Badge key={i} variant={variant} className="h-6 px-2.5">
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}
