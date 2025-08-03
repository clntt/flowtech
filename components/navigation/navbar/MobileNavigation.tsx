import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import { Button } from "@/components/ui/button";
import NavLinks from "./NavLinks";
const MobileNavigation = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          src="/icons/hamburger.svg"
          width={36}
          height={36}
          alt="menu"
          className="sm:hidden"
        />
      </SheetTrigger>

      <SheetContent side="left" className="border-none">
        <SheetTitle className="hidden">Navigation</SheetTitle>
        <Link href="/" className="flex items-center gap-1 m-5">
          <Image
            src="/images/site-logo.svg"
            alt="logo"
            width={23}
            height={23}
          />

          <p className="h2-bold font-space-grotesk ">
            Flow<span className="text-amber-600">Tech</span>
          </p>
        </Link>

        <div className="no-scrollbar flex h-[calc(100vh-80px)] flex-col justify-between overflow-y-auto">
          <SheetClose asChild>
            <section className="flex h-full flex-col gap-6 pt-16 ">
              <NavLinks isMobileNav />
            </section>
          </SheetClose>

          <div className="flex flex-col gap-3 m-5">
            <SheetClose asChild>
              <Link href={ROUTES.SIGN_IN}>
                <Button className="min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none m-auto">
                  <span className="text-amber-500">Log In</span>
                </Button>
              </Link>
            </SheetClose>

            <SheetClose asChild>
              <Link href={ROUTES.SIGN_UP}>
                <Button className="min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none m-auto">
                  Sign Up
                </Button>
              </Link>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
