"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Application } from "@/lib/types";
import AddApplicationForm from "./AddApplicationForm";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { logout } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BriefcaseIcon,
  LogOutIcon,
  PlusIcon,
  XIcon,
  ChevronRightIcon,
  AlertCircleIcon,
  Trash2Icon,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ApplicationsPage() {
  const isAuthenticated = useRequireAuth();
  const router = useRouter();
  const [formVisible, setFormVisible] = useState(false);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["applications"],
    queryFn: () => api.get<Application[]>("/applications"),
  });
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (appId: string) => api.delete(`/applications/${appId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      router.refresh(); // Refresh the list after deletion
    },
  });

  if (!isAuthenticated) return null; // or a loading state while redirecting

  return (
    <div className="flex flex-1 flex-col">
      {/* Top bar */}
      <header className="bg-background/80 supports-backdrop-filter:bg-background/60 sticky top-0 z-10 border-b backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-3.5">
          <div className="font-heading flex items-center gap-2 text-base font-semibold tracking-tight">
            <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-lg">
              <BriefcaseIcon className="size-3.5" />
            </span>
            Job Tracker
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOutIcon />
            Log out
          </Button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl px-6 py-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-semibold tracking-tight">
              Applications
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {data && data.length > 0
                ? `Tracking ${data.length} role${data.length === 1 ? "" : "s"}.`
                : "Track every role in one place."}
            </p>
          </div>
          <Button
            onClick={() => setFormVisible(!formVisible)}
            variant={formVisible ? "outline" : "default"}
            size="lg"
          >
            {formVisible ? (
              <>
                <XIcon />
                Hide
              </>
            ) : (
              <>
                <PlusIcon />
                Add application
              </>
            )}
          </Button>
        </div>

        {formVisible && (
          <div className="mb-8">
            <AddApplicationForm onCreated={() => setFormVisible(false)} />
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="bg-muted h-[68px] animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="border-destructive/30 bg-destructive/5 text-destructive flex items-center gap-2 rounded-xl border px-4 py-3 text-sm">
            <AlertCircleIcon className="size-4 shrink-0" />
            {error.message}
          </div>
        ) : data && data.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
            <span className="bg-muted text-muted-foreground flex size-11 items-center justify-center rounded-full">
              <BriefcaseIcon className="size-5" />
            </span>
            <div>
              <p className="font-medium">No applications yet</p>
              <p className="text-muted-foreground mt-0.5 text-sm">
                Add your first role to start tracking.
              </p>
            </div>
            {!formVisible && (
              <Button size="lg" onClick={() => setFormVisible(true)}>
                <PlusIcon />
                Add application
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {data?.map((app) => (
              <Card
                key={app.id}
                className="group hover:ring-foreground/20 flex cursor-pointer flex-row items-center justify-between gap-4 p-5 transition-all hover:shadow-md"
                onClick={() => router.push(`/applications/${app.id}`)}
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{app.company}</p>
                  <p className="text-muted-foreground truncate text-sm">
                    {app.role}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <StatusBadge status={app.status} />

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        onClick={(e) => e.stopPropagation()}
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2Icon />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete this application?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently remove this application. This
                          can&apos;t be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(app.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <ChevronRightIcon className="text-muted-foreground size-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
