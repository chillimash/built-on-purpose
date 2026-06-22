import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Note: route-level access control (admin-only) is already enforced in
  // proxy.ts, which checks the user's role before allowing /admin/* through.
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <AdminNav />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10">
        {children}
      </main>
    </div>
  );
}
