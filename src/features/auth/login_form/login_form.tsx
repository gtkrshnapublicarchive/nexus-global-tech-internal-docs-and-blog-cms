"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Shield, ArrowRight, Lock, Mail } from "lucide-react";
import { FeedbackAlert } from "@/shared/ui/feedback_alert";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid corporate credentials. Please check email and password.");
      } else {
        router.push("/feed");
        router.refresh();
      }
    } catch {
      setError("An unexpected authentication error occurred. Please retry.");
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (userEmail: string) => {
    setEmail(userEmail);
    setPassword("password123");
    setError(null);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="rounded-2xl border border-black/8 bg-white p-8 shadow-sm">
        <div className="mb-6 space-y-2 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#252724] text-white">
            <Shield className="h-5 w-5" />
          </div>
          <h1 className="font-['Fraunces'] text-2xl font-medium tracking-tight text-[#20211f]">
            Nexus Knowledge Portal
          </h1>
          <p className="text-xs text-[#737870]">
            Corporate Single Sign-On for internal technical staff
          </p>
        </div>

        {error && (
          <FeedbackAlert
            type="error"
            title="Authentication Error"
            message={error}
            onDismiss={() => setError(null)}
            className="mb-5"
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-wider text-[#686d66]"
            >
              Corporate Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#81857e]" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@nexusglobal.tech"
                className="w-full rounded-xl border border-black/10 bg-white py-2.5 pl-10 pr-3 text-sm text-[#20211f] placeholder:text-[#a0a59e] focus:border-[#668c63] focus:outline-none focus:ring-2 focus:ring-[#668c63]/20"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-wider text-[#686d66]"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#81857e]" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-xl border border-black/10 bg-white py-2.5 pl-10 pr-3 text-sm text-[#20211f] placeholder:text-[#a0a59e] focus:border-[#668c63] focus:outline-none focus:ring-2 focus:ring-[#668c63]/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#252724] py-2.5 text-sm font-semibold text-white transition hover:bg-[#3b3e39] active:scale-[0.99] disabled:opacity-60"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Nexus Portal</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 border-t border-black/7 pt-5">
          <p className="mb-3 text-center text-xs font-medium text-[#737870]">
            Quick-Fill Pre-Seeded Personas
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => fillCredentials("nadia@nexusglobal.tech")}
              className="flex flex-col items-start rounded-xl border border-black/8 bg-[#fbfbfa] p-2.5 text-left transition hover:border-[#668c63] hover:bg-[#eef2ec]"
            >
              <span className="text-xs font-semibold text-[#20211f]">
                Nadia Chen
              </span>
              <span className="text-[11px] text-[#5a8357]">
                Staff Reader
              </span>
            </button>

            <button
              type="button"
              onClick={() => fillCredentials("marcus@nexusglobal.tech")}
              className="flex flex-col items-start rounded-xl border border-black/8 bg-[#fbfbfa] p-2.5 text-left transition hover:border-[#668c63] hover:bg-[#eef2ec]"
            >
              <span className="text-xs font-semibold text-[#20211f]">
                Marcus Aurelius
              </span>
              <span className="text-[11px] text-[#5a8357]">
                Author / Editor
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-[11px] text-[#81857e]">
        Nexus Global Tech - Internal Network Deployment Only
      </div>
    </div>
  );
}
