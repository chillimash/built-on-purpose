import { notFound } from "next/navigation";
import { getMasterclassById } from "@/lib/data/admin";
import { MasterclassForm } from "@/components/admin/MasterclassForm";

export default async function EditMasterclassPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const masterclass = await getMasterclassById(id);
  if (!masterclass) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink mb-8">Edit masterclass</h1>
      <MasterclassForm existing={masterclass} />
    </div>
  );
}
