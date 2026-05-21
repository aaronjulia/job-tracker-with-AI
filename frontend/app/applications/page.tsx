"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Application } from "@/lib/types";
import AddApplicationForm from "./AddApplicationForm";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { logout } from "@/lib/api";

export default function ApplicationsPage() {
    const isAuthenticated = useRequireAuth();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["applications"],
    queryFn: () => api.get<Application[]>("/applications"),
  });

  if (!isAuthenticated) return null; // or a loading state while redirecting


  if (isLoading) return <p className="p-8">Loading…</p>;
  if (isError) return <p className="p-8 text-red-600">{error.message}</p>;

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="mb-6 text-2xl font-semibold">My Applications</h1>
      <div className="flex justify-between">
        <AddApplicationForm />

      <button onClick={logout} className="text-sm text-gray-500 underline border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-100">
        Log out
        </button>

        </div>

      {data && data.length === 0 ? (
        <p className="text-gray-500">No applications yet.</p>
      ) : (
        <ul className="space-y-3">
          {data?.map((app) => (
            <li key={app.id} className="rounded-lg border p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{app.company}</p>
                  <p className="text-sm text-gray-600">{app.role}</p>
                </div>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs capitalize">
                  {app.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
