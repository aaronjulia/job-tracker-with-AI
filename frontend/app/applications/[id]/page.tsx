"use client";

import { api } from "@/lib/api";
import { Application } from "@/lib/types";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import ContactsSection from "./ContactsSection";
import InteractionSection from "./InteractionSection";



export default function ApplicationPage() {
    const isAuthenticated = useRequireAuth();
    const { id } = useParams<{ id: string }>();
    const [jd, setJd] = useState("");
    const [background, setBackground] = useState("");


    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["application", id],
        queryFn: () => api.get<Application>(`/applications/${id}`),
    });

    useEffect(() => {
        if (data?.job_description) {
            setJd(data.job_description);
        }
    }, [data?.job_description]);

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

        {/* <label className="block text-sm font-medium text-gray-700 mt-4">Job Description</label>
        <textarea value={jd} onChange={(e) => setJd(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" rows={6} />
        <button onClick={() => console.log(jd)} className="mt-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">parse Job Description</button> */}

        {/* <label className="block text-sm font-medium text-gray-700 mt-4">Background</label>
        <textarea value={background} onChange={(e) => setBackground(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" rows={6} />
        <button onClick={() => console.log(background)} className="mt-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Generate Cover Letter</button> */}


    </div>
  );
}