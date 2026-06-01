"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { BriefcaseIcon, AlertCircleIcon } from "lucide-react";

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
    <div className="relative flex min-h-screen flex-1 items-center justify-center px-4">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 size-[32rem] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2 font-heading text-lg font-semibold tracking-tight"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BriefcaseIcon className="size-4" />
          </span>
          Job Tracker
        </Link>

        <Card className="p-8">
          <div className="mb-6 space-y-1 text-center">
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Log in to your job tracker
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {loginMutation.isError && (
              <p className="flex items-center gap-1.5 text-sm text-destructive">
                <AlertCircleIcon className="size-4" />
                {loginMutation.error.message}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              className="h-10 w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in…" : "Log in"}
            </Button>
          </form>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Track every role in one calm, organized place.
        </p>
      </div>
    </div>
  );
}
