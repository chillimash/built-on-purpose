import { getCurrentProfile } from "@/lib/data/content";
import { DashboardNav } from "@/components/dashboard/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  return (
    <div className="min-h-screen flex flex-col paper-grain">
      <DashboardNav profile={profile} />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10">
        {children}
      </main>
    </div>
  );
}
