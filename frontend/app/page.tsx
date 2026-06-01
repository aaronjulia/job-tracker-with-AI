import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BriefcaseIcon,
  SparklesIcon,
  UsersIcon,
  CalendarClockIcon,
  ArrowRightIcon,
} from "lucide-react";

const FEATURES = [
  {
    icon: BriefcaseIcon,
    title: "Every application, one place",
    body: "Track companies, roles, salary ranges, and status from wishlist to offer.",
  },
  {
    icon: SparklesIcon,
    title: "AI autofill",
    body: "Paste a job description and let AI extract the role, requirements, and keywords.",
  },
  {
    icon: UsersIcon,
    title: "Contacts & interviews",
    body: "Keep recruiters, referrals, and every interaction tied to the right role.",
  },
];

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col">
      {/* soft background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 size-[40rem] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/3 -right-32 size-[28rem] rounded-full bg-chart-1/20 blur-3xl" />
      </div>

      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2 font-heading text-lg font-semibold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BriefcaseIcon className="size-4" />
          </span>
          Job Tracker
        </div>
        <Button asChild variant="outline" size="lg">
          <Link href="/login">Log in</Link>
        </Button>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <SparklesIcon className="size-3.5" />
          Your job search, organized
        </span>

        <h1 className="max-w-2xl font-heading text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-6xl">
          Land your next role without losing track.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-balance">
          Job Tracker keeps every application, contact, and interview in one
          calm, organized place — so you can focus on the conversations that
          matter.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-11 px-6 text-sm">
            <Link href="/login">
              Get started
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-11 px-6 text-sm">
            <Link href="/applications">View applications</Link>
          </Button>
        </div>

        <div className="mt-24 grid w-full gap-4 text-left sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-xl border bg-card p-5 ring-1 ring-foreground/5 transition-shadow hover:shadow-sm"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-foreground">
                <Icon className="size-4.5" />
              </span>
              <h3 className="mt-4 font-medium">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="mx-auto w-full max-w-5xl px-6 py-8 text-center text-sm text-muted-foreground">
        <CalendarClockIcon className="mr-1.5 inline size-4 align-text-bottom" />
        Built to keep your search moving.
      </footer>
    </div>
  );
}
