import { LoginForm } from "@/components/LoginForm";

export const metadata = {
  title: "Sign in — GoldenGate",
  description: "Sign in to your investor account.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <LoginForm />
    </div>
  );
}
