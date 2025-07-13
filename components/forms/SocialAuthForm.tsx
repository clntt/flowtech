"use client";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import ROUTES from "@/constants/routes";

const SocialAuthForm = () => {
  const buttonClass = "body-medium rounded-2 flex-1 px-4 py-3.5 min-h-12";

  // const handleSignIn = async (provider: "github" | "google") => {
  //   try {
  //     await signIn(provider, {
  //       callbackUrl: ROUTES.HOME,
  //       redirect: false,
  //     });
  //   } catch (error) {
  //     toast.error("Sign-in Failed", {
  //       description:
  //         error instanceof Error
  //           ? error.message
  //           : "An error occurred during sign-in",
  //     });
  //   }
  // };

  const handleSignIn = async (provider: "github" | "google") => {
    try {
      const response = await signIn(provider, {
        callbackUrl: ROUTES.HOME,
        redirect: false, // required for manual redirect
      });

      if (response?.error) {
        toast.error("Sign-in Failed", {
          description: response.error,
        });
      } else if (response?.url) {
        window.location.href = response.url; // manually redirect
      }
    } catch (error) {
      toast.error("Sign-in Failed", {
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during sign-in",
      });
    }
  };

  return (
    <div className="mt-10 flex flex-wrap gap-2.5">
      <Button className={buttonClass} onClick={() => handleSignIn("github")}>
        <Image
          src="/icons/github.svg"
          alt="github logo"
          width={20}
          height={20}
          className="mr-2.5 object-contain"
        />
        <span>Log in with GitHub</span>
      </Button>

      <Button className={buttonClass} onClick={() => handleSignIn("google")}>
        <Image
          src="/icons/google.svg"
          alt="Google logo"
          width={20}
          height={20}
          className="mr-2.5 object-contain"
        />
        <span>Log in with Google</span>
      </Button>
    </div>
  );
};

export default SocialAuthForm;
