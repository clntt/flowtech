import { ThemeProviderProps } from "next-themes";
import { ThemeProvider as NextThemsProvider } from "next-themes";
import React from "react";

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return <NextThemsProvider {...props}>{children}</NextThemsProvider>;
};

export default ThemeProvider;
