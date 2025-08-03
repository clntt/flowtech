import Image from "next/image";
import Link from "next/link";
import React from "react";
import Theme from "./Theme";
import MobileNavigation from "./MobileNavigation";

const Navbar = () => {
  return (
    <nav className="flex-between bg-blue-950 fixed z-50 w-full p-6 dark:shadow-none sm:px-12 shadow-amber-100 gap-5 text-white">
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
        <MobileNavigation />
      </div>
    </nav>
  );
};

export default Navbar;
