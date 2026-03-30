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

  const isEmployee = session.user.role === "EMPLOYEE";

  return <DashboardShell isEmployee={isEmployee}>{children}</DashboardShell>;
}
