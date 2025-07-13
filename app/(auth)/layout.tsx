import SocialAuthForm from "@/components/forms/SocialAuthForm";
import Image from "next/image";
import React, { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main
      style={{ backgroundImage: 'url("/images/auth-light.png")' }}
      className="flex min-h-screen items-center justify-center bg-auth-light bg-cover bg-center bg-no-repeat py-10 px-4"
    >
      <section className=" bg-white shadow-gray-100 shadow-xs sm:min-w-[520px] sm:px-8 rounded-[10px] min-w-full  px-4 py-10">
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-2.5">
            <h1 className=" h2-bold">Join FlowTech</h1>
            <p className="paragraph-regular">To get your questions answered</p>
          </div>

          <Image
            src="images/site-logo.svg"
            alt="flowtech logo"
            width={50}
            height={50}
            className="object-contain"
          />
        </div>
        {children}

        <SocialAuthForm />
      </section>
    </main>
  );
};

export default AuthLayout;
