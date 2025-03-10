import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: Request) {
  try {
    const { id, email } = await request.json();

    // STEP 1: Delete all scores associated with this judge
    const { error: scoresError } = await supabase
      .from("scores")
      .delete()
      .eq("judge_id", id);

    if (scoresError) {
      console.error("Error deleting scores:", scoresError);
      throw new Error(
        `Failed to delete judge's scores: ${scoresError.message}`,
      );
    }

    // STEP 2: Delete all detailed_scores associated with this judge
    const { error: detailedScoresError } = await supabase
      .from("detailed_scores")
      .delete()
      .eq("judge_id", id);

    if (detailedScoresError) {
      console.error("Error deleting detailed scores:", detailedScoresError);
      throw new Error(
        `Failed to delete judge's detailed scores: ${detailedScoresError.message}`,
      );
    }

    // STEP 3: Delete the judge record from the judges table
    const { error: judgeError } = await supabase
      .from("judges")
      .delete()
      .eq("id", id);

    if (judgeError) {
      console.error("Error deleting judge record:", judgeError);
      throw new Error(`Failed to delete judge record: ${judgeError.message}`);
    }

    // STEP 4: Finally, delete the auth user
    const { error: deleteError } = await supabase.auth.admin.deleteUser(id);

    if (deleteError) {
      console.error("Error deleting auth user:", deleteError);
      throw new Error(`Failed to delete auth user: ${deleteError.message}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in delete-judge:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 400 },
    );
  }
}
