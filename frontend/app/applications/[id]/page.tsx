"use client";

import { api } from "@/lib/api";
import { Application } from "@/lib/types";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import ContactsSection from "./ContactsSection";
import InteractionSection from "./InteractionSection";
import { StatusBadge } from "../StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ExternalLinkIcon,
  BanknoteIcon,
  CompassIcon,
  AlertCircleIcon,
} from "lucide-react";

function formatSalary(min: number | null, max: number | null) {
  if (min == null && max == null) return null;
  const fmt = (n: number) => `$${n.toLocaleString()}`;
  if (min != null && max != null) return `${fmt(min)} – ${fmt(max)}`;
  return fmt((min ?? max) as number);
}

export default function ApplicationPage() {
  const isAuthenticated = useRequireAuth();
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["application", id],
    queryFn: () => api.get<Application>(`/applications/${id}`),
  });

  if (!isAuthenticated) return null;

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex w-full max-w-3xl items-center px-6 py-3.5">
          <Button asChild variant="ghost" size="sm">
            <Link href="/applications">
              <ArrowLeftIcon />
              Applications
            </Link>
          </Button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl px-6 py-10">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-9 w-1/2 animate-pulse rounded-lg bg-muted" />
            <div className="h-40 animate-pulse rounded-xl bg-muted" />
          </div>
        ) : isError ? (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
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
                <p className="mt-1 text-muted-foreground">{data?.role}</p>
              </div>
              {data && <StatusBadge status={data.status} />}
            </div>

            <Card className="mb-8 p-6">
              <dl className="grid gap-5 sm:grid-cols-2">
                <Detail
                  icon={<CalendarIcon className="size-4" />}
                  label="Applied"
                  value={
                    data?.applied_at
                      ? new Date(data.applied_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "—"
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
                  value={formatSalary(data?.salary_min ?? null, data?.salary_max ?? null) || "—"}
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
                        className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline"
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
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
        <dd className="mt-0.5 truncate text-sm font-medium">{value}</dd>
      </div>
    </div>
  );
}
