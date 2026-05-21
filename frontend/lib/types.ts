export type ApplicationStatus =
  | "wishlist"
  | "applied"
  | "interviewing"
  | "offer"
  | "accepted"
  | "rejected"
  | "withdrawn";

export type Application = {
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
  updated_at: string;
};