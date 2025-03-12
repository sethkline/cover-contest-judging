// lib/judgeService.ts
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export async function updateJudgeStatus(status: 'pending' | 'active' | 'inactive'): Promise<void> {
  const supabase = createClientComponentClient();
  
  try {
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Not authenticated");
    }
    
    // Update judge status
    const { error } = await supabase
      .from('judges')
      .update({ status })
      .eq('id', session.user.id);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error updating judge status:", error);
    throw error;
  }
}