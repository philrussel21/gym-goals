import { AuthError, Session } from "@supabase/supabase-js";

type LinkType = {
  label: string;
  url: string;
}

export type {
  LinkType,
}