import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role;
  const shellRole =
    role === "EMPLOYEE"
      ? "employee"
      : role === "DEAL_SOURCER"
        ? "deal_sourcer"
        : "investor";

  return <DashboardShell shellRole={shellRole}>{children}</DashboardShell>;
}
