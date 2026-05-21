"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (token) => {
      localStorage.setItem("token", token);
      router.push("/applications");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    loginMutation.mutate();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg border bg-white p-8 shadow-sm"
      >
        <h1 className="text-2xl font-semibold">Log in</h1>

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        {loginMutation.isError && (
          <p className="text-sm text-red-600">{loginMutation.error.message}</p>
        )}

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loginMutation.isPending ? "Logging in..." : "Log in"}
        </button>
      </form>
    </div>
  );
}