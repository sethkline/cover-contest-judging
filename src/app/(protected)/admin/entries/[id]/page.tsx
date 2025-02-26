import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import EntryDetailView from "./EntryDetailView";

export default async function EntryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerComponentClient({ cookies });

  const { data: entry, error } = await supabase
    .from("entries")
    .select(
      `
      *,
      contests (
        name,
        type
      )
    `,
    )
    .eq("id", params.id)
    .single();

  if (error || !entry) {
    notFound();
  }

  // Get public URLs for images
  const { data: frontImageUrl } = supabase.storage
    .from("contest-images")
    .getPublicUrl(entry.front_image_path);

  const backImageUrl = entry.back_image_path
    ? supabase.storage
        .from("contest-images")
        .getPublicUrl(entry.back_image_path).data.publicUrl
    : null;

  return (
    <EntryDetailView 
      entry={entry} 
      frontImageUrl={frontImageUrl.publicUrl} 
      backImageUrl={backImageUrl} 
    />
  );
}