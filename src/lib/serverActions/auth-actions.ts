"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FormSchema } from "../types";
import { z } from "zod";
import console from "console";

export async function login({ email, password }: z.infer<typeof FormSchema>) {
  const supabase = createClient();
  console.log("logg");
  const response = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return {
    error: !!response.error,
    errorMsg: response?.error?.message || "",
    user: response.data,
  };
}

export async function signup({ email, password }: z.infer<typeof FormSchema>) {
  const supabase = createClient();
  console.log("signingup");
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email);

  if (data?.length) return { error: { message: "User already exists", data } };
  const response = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}api/auth/callback`,
    },
  });
  console.log("respon", response);
  return {
    error: !!response.error,
    errorMsg: response?.error?.message || "",
    user: response.data,
  };
}

export async function actionSignUpUser({
  email,
  password,
}: z.infer<typeof FormSchema>) {
  const supabase = createClient();

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email);

  if (data?.length) return { error: { message: "User already exists", data } };
  const response = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}api/auth/callback`,
    },
  });
  return response;
}
