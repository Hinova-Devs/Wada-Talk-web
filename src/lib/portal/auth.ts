import type {SupabaseClient} from "@supabase/supabase-js";
export function usesDemoPassword(email: string, development: boolean): boolean {
 return development && email.trim().toLowerCase() === "sahra@demo.wada.test";
}
export function authErrorMessage(error: {code?: string; message: string; status?: number}): string {
 const messages: Record<string, string> = {
  email_address_not_authorized: "The school's email sender is not configured for this address. Ask the project owner to configure email delivery.",
  email_address_invalid: "Enter a real email address. Test addresses cannot receive sign-in links.",
  over_email_send_rate_limit: "The email sending limit has been reached. Please wait before requesting another link.",
  over_request_rate_limit: "Too many sign-in attempts. Please wait a few minutes and try again.",
  user_not_found: "Ask your school admin to invite you using this email address.",
  signup_disabled: "Ask your school admin to invite you using this email address.",
  otp_disabled: "Email-link sign-in is disabled for this school. Ask the project owner to enable it.",
  email_provider_disabled: "Email sign-in is disabled for this school. Ask the project owner to enable it.",
  invalid_credentials: "The email or password is incorrect.",
  email_not_confirmed: "Confirm your email using your invitation before signing in.",
  otp_expired: "This sign-in link has expired. Request a new link.",
  flow_state_expired: "This sign-in link has expired. Request a new link.",
  flow_state_not_found: "Open the sign-in link in the same browser where you requested it, or request a new link.",
  bad_code_verifier: "Open the sign-in link in the same browser where you requested it, or request a new link.",
  unexpected_failure: "The sign-in service could not complete your request. Please try again later.",
 };
 if (error.code && messages[error.code]) return messages[error.code];
 if (error.status === 429) return messages.over_request_rate_limit;
 if (error.status && error.status >= 500) return "The school's sign-in or email service could not complete your request. Ask the project owner to check email delivery.";
 if (/signups? not allowed/i.test(error.message)) return messages.user_not_found;
 if (/failed to fetch|network|fetch failed/i.test(error.message)) return "Could not connect to the sign-in service. Check your connection and try again.";
 return error.message || "Could not sign in. Please try again.";
}
export async function signInStaff(client: SupabaseClient, input: {email: string; password: string; development: boolean; origin: string}) {
 const email = input.email.trim().toLowerCase();
 if (usesDemoPassword(email, input.development)) return client.auth.signInWithPassword({email, password: input.password});
 return client.auth.signInWithOtp({email, options: {emailRedirectTo: input.origin, shouldCreateUser: false}});
}
