"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Application } from "@/lib/types";
import AddApplicationForm from "./AddApplicationForm";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { logout } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { useRouter } from "next/navigation";

export default function ApplicationsPage() {
  const isAuthenticated = useRequireAuth();
  const router = useRouter();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["applications"],
    queryFn: () => api.get<Application[]>("/applications"),
  });

  if (!isAuthenticated) return null; // or a loading state while redirecting


  if (isLoading) return <p className="p-8">Loading…</p>;
  if (isError) return <p className="p-8 text-red-600">{error.message}</p>;

 return (
  <div className="mx-auto max-w-3xl px-6 py-12">
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Applications</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track every role in one place.
        </p>
      </div>
      <Button variant="ghost" size="sm" onClick={logout}>
        Log out
      </Button>
    </div>

    <AddApplicationForm />

    {data && data.length === 0 ? (
      <div className="rounded-xl border border-dashed py-16 text-center text-muted-foreground">
        No applications yet — add your first one above.
      </div>
    ) : (
      <div className="space-y-3">
        {data?.map((app) => (
          <Card
            key={app.id}
            className="flex items-center justify-between p-5 transition-shadow hover:shadow-md"
            onClick={() => router.push(`/applications/${app.id}`)}
          >
            <div>
              <p className="font-medium">{app.company}</p>
              <p className="text-sm text-muted-foreground">{app.role}</p>
            </div>
            <StatusBadge status={app.status} />
          </Card>
        ))}
      </div>
    )}
  </div>
);
}
