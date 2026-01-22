import Image from "next/image";
import Link from "next/link";
import React from "react";
import Theme from "./Theme";
import MobileNavigation from "./MobileNavigation";
import { auth } from "@/auth";
import UserAvatar from "@/components/UserAvatar";

const Navbar = async () => {
  const session = await auth();

  return (
    <nav className="flex-between bg-gray-800 fixed z-50 w-full p-6 dark:shadow-none sm:px-12 shadow-amber-100 gap-5 text-white">
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="/images/site-logo.svg"
          alt="site-logo"
          width={23}
          height={23}
        />

        <p className="h2-bold font-space-grotesk max-sm:hidden">
          Flow<span className="text-amber-600">Tech</span>
        </p>
      </Link>

      <p>Global Search</p>

      <div className="flex-between gap-5">
        <Theme />

        {session?.user?.id && (
          <UserAvatar
            id={session?.user?.id}
            name={session?.user?.name}
            imageUrl={session?.user?.image}
          />
        )}
        <MobileNavigation />
      </div>
    </nav>
  );
};

export default Navbar;
