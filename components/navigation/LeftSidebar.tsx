import React from "react";
import NavLinks from "./navbar/NavLinks";
import { Button } from "../ui/button";
import Link from "next/link";

import { LogOut } from "lucide-react";
import ROUTES from "@/constants/routes";
import Image from "next/image";
import { auth, signOut } from "@/auth";
const LeftSidebar = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  console.log("LeftSidebar userId: ", userId);

  return (
    <section className="bg-gray-800 text-white sticky left-0 top-0 h-screen flex flex-col justify-between overflow-y-auto border-r p-6 pt-36 max-sm:hidden lg:w-[266px]">
      <div className="flex flex-1 flex-col gap-6 ">
        <NavLinks isMobileNav={false} userId={userId} />
      </div>

      <div className="flex flex-col gap-3">
        {userId ? (
          <form
            action={async () => {
              "use server";

              await signOut();
            }}
          >
            <Button
              type="submit"
              className="base-medium w-fit !bg-transparent px-4 py-3"
            >
              <LogOut className="size-5 text-white" />
              <span className="max-lg:hidden">Logout</span>
            </Button>
          </form>
        ) : (
          <>
            <Button
              className="min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none m-auto bg-gray-600"
              asChild
            >
              <Link href={ROUTES.SIGN_IN}>
                <Image
                  src="/icons/account.svg"
                  alt="Account"
                  width={20}
                  height={20}
                  className="lg:hidden"
                />
                <span className="text-amber-500 max-lg:hidden">Log In</span>
              </Link>
            </Button>

            <Button
              className="min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none m-auto bg-transparent border"
              asChild
            >
              <Link href={ROUTES.SIGN_UP}>
                <Image
                  src="/icons/sign-up.svg"
                  alt="Account"
                  width={20}
                  height={20}
                  className="lg:hidden"
                />

                <span className="max-lg:hidden">Sign Up</span>
              </Link>
            </Button>
          </>
        )}
      </div>
    </section>
  );
};

export default LeftSidebar;
