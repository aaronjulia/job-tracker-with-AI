"use client";

import { api } from "@/lib/api";
import { Application } from "@/lib/types";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import ContactsSection from "./ContactsSection";
import InteractionSection from "./InteractionSection";



export default function ApplicationPage() {
    const isAuthenticated = useRequireAuth();
    const { id } = useParams<{ id: string }>(); // Get the application ID from the URL query parameters

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["application", id],
        queryFn: () => api.get<Application>(`/applications/${id}`),
    });

    if(!isAuthenticated) {
        return null; // or a loading spinner
    }

    console.log(data);

    if (isLoading) {
        return <p className="p-8">Loading…</p>;
    }

    if (isError) {
        return <p className="p-8 text-red-600">{error.message}</p>;
    }



    {/*
      id: string;
      company: string;
      role: string;
      status: ApplicationStatus;
      source: string | null;
      job_url: string | null;
      salary_min: number | null;
      salary_max: number | null;
      applied_at: string | null;
      created_at: string;
      updated_at: string; */}

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Application Details</h1>
        <p><strong>Company:</strong> {data?.company}</p>
        <p><strong>Role:</strong> {data?.role}</p>
        <p><strong>Status:</strong> {data?.status}</p>
        <p><strong>Applied At:</strong> {new Date(data?.applied_at || "").toLocaleDateString()}</p>
        <p><strong>Job URL:</strong> {data?.job_url ? <a href={data.job_url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{data.job_url}</a> : "N/A"}</p>
        <p><strong>Salary Range:</strong> {data?.salary_min && data?.salary_max ? `$${data.salary_min} - $${data.salary_max}` : "N/A"}</p>
        <div className="mt-4">
            <ContactsSection applicationId={id} />
        </div>
        
        <div className="mt-4">
            <InteractionSection applicationId={id} />
        </div>
    </div>
  );
}