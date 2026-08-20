import { Link } from "react-router-dom";
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

export default function Landing() {
  return (
    <div className="relative flex flex-1 flex-col">
      {/* soft background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="bg-primary/5 absolute -top-40 left-1/2 size-[40rem] -translate-x-1/2 rounded-full blur-3xl" />
        <div className="bg-chart-1/20 absolute top-1/3 -right-32 size-[28rem] rounded-full blur-3xl" />
      </div>

      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <div className="font-heading flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
            <BriefcaseIcon className="size-4" />
          </span>
          Job Tracker
        </div>
        <Button asChild variant="outline" size="lg">
          <Link to="/login">Log in</Link>
        </Button>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <span className="bg-card text-muted-foreground mb-6 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium">
          <SparklesIcon className="size-3.5" />
          Your job search, organized
        </span>

        <h1 className="font-heading max-w-2xl text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-6xl">
          Land your next role without losing track.
        </h1>
        <p className="text-muted-foreground mt-6 max-w-xl text-lg leading-relaxed text-balance">
          Job Tracker keeps every application, contact, and interview in one
          calm, organized place — so you can focus on the conversations that
          matter.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-11 px-6 text-sm">
            <Link to="/create">
              Get started
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-11 px-6 text-sm"
          >
            <Link to="/applications">View applications</Link>
          </Button>
        </div>

        <div className="mt-24 grid w-full gap-4 text-left sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="bg-card ring-foreground/5 rounded-xl border p-5 ring-1 transition-shadow hover:shadow-sm"
            >
              <span className="bg-muted text-foreground flex size-9 items-center justify-center rounded-lg">
                <Icon className="size-4.5" />
              </span>
              <h3 className="mt-4 font-medium">{title}</h3>
              <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                {body}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-muted-foreground mx-auto w-full max-w-5xl px-6 py-8 text-center text-sm">
        <CalendarClockIcon className="mr-1.5 inline size-4 align-text-bottom" />
        Built to keep your search moving.
      </footer>
    </div>
  );
}
