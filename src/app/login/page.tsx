import { LoginForm } from "@/features/auth/login_form/login_form";

export const metadata = {
  title: "Corporate Sign In - Nexus Knowledge & Technical Blog",
  description: "Internal documentation and blog portal for Nexus Global Tech staff",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#fbfbfa] p-4 sm:p-6">
      <LoginForm />
    </main>
  );
}
