"use client";

import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import NavLinks from "./nav-links";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      <NavLinks />
      {children}
    </ThemeProvider>
  );
}
