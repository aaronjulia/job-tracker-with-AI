import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { api, login } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { BriefcaseIcon, AlertCircleIcon } from "lucide-react";

export default function CreateAccount() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  {
    /*
    class UserCreate(BaseModel):
        email: EmailStr
        name: str
        password: str


    class UserOut(BaseModel):
        id: uuid.UUID
        email: EmailStr
        name: str
        created_at: datetime

        model_config = ConfigDict(from_attributes=True)
    */
  }
  const createAccountMutation = useMutation({
    mutationFn: () => api.post("/users", { email, name, password }),
    onSuccess: () => {
      //login to get the token, save it, then navigate
      login(email, password).then(() => {
        navigate("/applications");
      });
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createAccountMutation.mutate();
  }

  return (
    <div className="relative flex min-h-screen flex-1 items-center justify-center px-4">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="bg-primary/5 absolute -top-32 left-1/2 size-[32rem] -translate-x-1/2 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm">
        <Link
          to="/"
          className="font-heading mb-8 flex items-center justify-center gap-2 text-lg font-semibold tracking-tight"
        >
          <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
            <BriefcaseIcon className="size-4" />
          </span>
          Job Tracker
        </Link>

        <Card className="p-8">
          <div className="mb-6 space-y-1 text-center">
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              Welcome
            </h1>
            <p className="text-muted-foreground text-sm">
              Create account to track your job applications and land your next
              role.
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
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
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

            {createAccountMutation.isError && (
              <p className="text-destructive flex items-center gap-1.5 text-sm">
                <AlertCircleIcon className="size-4" />
                {createAccountMutation.error.message}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              className="h-10 w-full"
              disabled={createAccountMutation.isPending}
            >
              {createAccountMutation.isPending
                ? "Creating account…"
                : "Create account"}
            </Button>
          </form>
        </Card>

        <p className="text-muted-foreground mt-6 text-center text-xs">
          Track every role in one calm, organized place.
        </p>
      </div>
    </div>
  );
}
