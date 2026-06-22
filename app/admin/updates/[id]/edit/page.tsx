import { notFound } from "next/navigation";
import { getWeeklyUpdateById } from "@/lib/data/admin";
import { UpdateForm } from "@/components/admin/UpdateForm";

export default async function EditUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const update = await getWeeklyUpdateById(id);
  if (!update) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink mb-8">Edit field note</h1>
      <UpdateForm existing={update} />
    </div>
  );
}
