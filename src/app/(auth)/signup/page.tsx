"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Suspense, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Logo from "../../../../public/logo.svg";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MailCheck } from "lucide-react";
import { FormSchema } from "@/lib/types";
import { signup as actionSignUpUser } from "@/lib/serverActions/auth-actions";
import Loader from "@/components/global/loader";
import { toast } from "sonner";

const SignUpFormSchema = z
  .object({
    email: z.string().describe("Email").email({ message: "Invalid Email" }),
    password: z
      .string()
      .describe("Password")
      .min(6, "Password must be minimum 6 characters"),
    confirmPassword: z
      .string()
      .describe("Confirm Password")
      .min(6, "Password must be minimum 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

const Signup = () => {
  const router = useRouter();
  // const searchParams = useSearchParams();
  const [submitError, setSubmitError] = useState("");
  const [confirmation, setConfirmation] = useState(false);

  // const codeExchangeError = useMemo(() => {
  //   console.log('codeExchangeError ',searchParams)
  //   if (!searchParams) return "";
  //   console.log('codeExchangeError DEsc',searchParams?.get("error_description"))
  //   return searchParams.get("error_description");
  // }, [searchParams]);

  // const confirmationAndErrorStyles = useMemo(
  //   () =>
  //     clsx("bg-primary", {
  //       "bg-red-500/10": codeExchangeError,
  //       "border-red-500/50": codeExchangeError,
  //       "text-red-700": codeExchangeError,
  //     }),
  //   [codeExchangeError]
  // );

  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async ({ email, password }: z.infer<typeof FormSchema>) => {
    const { error, errorMsg } = await actionSignUpUser({ email, password });
    if (error) {
      toast.error(errorMsg);
      setSubmitError(errorMsg || "");
    } else {
      toast.success("Check your email.", {
        description: "An email confirmation has been sent.",
      });
      setConfirmation(true);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Form {...form}>
        <form
          onChange={() => {
            if (submitError) setSubmitError("");
          }}
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col
        space-y-6 sm:w-[400px]
        sm:justify-center
        "
        >
          <Link
            href="/"
            className="
          flex
          w-full
          items-center
          justify-start"
          >
            <Image src={Logo} alt="motion Logo" width={50} height={50} />
            <span
              className="text-4xl
          font-semibold first-letter:ml-2 dark:text-white"
            >
              motion.
            </span>
          </Link>
          <FormDescription
            className="
        text-foreground/60"
          >
            An all-In-One Collaboration and Productivity Platform
          </FormDescription>
          {/* {!confirmation && !codeExchangeError && (
            <>
              <FormField
                disabled={isLoading}
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full p-6" disabled={isLoading}>
                {!isLoading ? "Create Account" : <Loader />}
              </Button>
            </>
          )} */}

          {submitError && <FormMessage>{submitError}</FormMessage>}
          <span className="self-center">
            Already have an account?{" "}
            <Link href="/login" className="text-primary">
              Login
            </Link>
          </span>
          {/* {(confirmation || codeExchangeError) && (
            <>
              <Alert className={confirmationAndErrorStyles}>
                {!codeExchangeError && <MailCheck className="size-4" />}
                <AlertTitle>
                  {codeExchangeError ? "Invalid Link" : "Check your email."}
                </AlertTitle>
                <AlertDescription>
                  {codeExchangeError || "An email confirmation has been sent."}
                </AlertDescription>
              </Alert>
            </>
          )} */}
        </form>
      </Form>
    </Suspense>
  );
};

export default Signup;
