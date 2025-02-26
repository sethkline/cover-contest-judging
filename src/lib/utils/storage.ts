/**
 * Generates a public URL for a file in Supabase storage
 * @param {string} bucket - The storage bucket name
 * @param {string} path - The file path within the bucket
 * @returns {string} The complete public URL
 */
export function getSupabasePublicUrl(bucket: string, path: string): string | null {
  if (!path) return null;

  // Check if the path is already a full URL
  if (path.startsWith('http')) {
    return path;
  }

  // Use environment variable for Supabase URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}
