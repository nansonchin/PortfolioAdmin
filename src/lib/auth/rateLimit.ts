import "server-only";
import { getSupabase } from "../db/supabase";
const WINDOW_MINUTES = 15;
const MAX_FAILURES_PER_IP = 5;
const MAX_FAILURES_GLOBAL = 20;

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function isLoginBlocked(ip: string): Promise<boolean> {
  const since = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();
  const supabase = getSupabase();

  const [perIp, global] = await Promise.all([
    supabase
      .from("login_attempts")
      .select("id", { count: "exact", head: true })
      .eq("ip", ip)
      .eq("succeed", false)
      .gte("created_at", since),

    supabase
      .from("login_attempts")
      .select("id", { count: "exact", head: true })
      .eq("succeeded", false)
      .gte("created_at", since),
  ]);

  if(perIp.error|| global.error){
    throw new Error(`Failed to read Login Attept Record: ${perIp.error?.message ?? global.error?.message}`)
  }

  return (perIp.count ?? 0) >=MAX_FAILURES_PER_IP || (global.count?? 0)>=MAX_FAILURES_GLOBAL
}

export async function recordLoginAttempt(ip:string, succeeded:boolean):Promise<void>{
    const supabase = getSupabase()
    const {error} = await supabase.from("login_attempts").insert({ ip, succeeded });

    if(error){
        throw new Error(`Failed to write the login attempts record: ${error.message}`)
    }

   if (!succeeded) {
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60_000).toISOString();
    await supabase.from("login_attempts").delete().lt("created_at", cutoff);
  }
}