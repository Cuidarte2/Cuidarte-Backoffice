"use client";
import { useCallback, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Image from "next/image";
import Link from "next/link";
import { getTokenFromStorage } from "@/app/utils/auth";
import useUsersStore from "../hooks/useUsersStore";
import { useRouter } from "next/navigation";

export default function Header() {
  const { logout } = useUsersStore();
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  const router = useRouter();
  useEffect(() => {
    const checkToken = () => setIsLoggedIn(!!getTokenFromStorage());
    checkToken();

    window.addEventListener("auth-change", checkToken);
    return () => window.removeEventListener("auth-change", checkToken);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    router.replace("/login");
  }, [logout, router]);



  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Image src="/cuidarte-logo.png" alt="Logo" width={48} height={48} />
        </Box>

        {/* Links */}
        <Box sx={{ display: "flex", gap: 2 }}>
          {!isLoggedIn && (
            <>
              <Button component={Link} href="/login" color="inherit">
                Login
              </Button>
            </>
          )}
          {isLoggedIn && (
            <>
              <Button
                color="inherit"
                onClick={() => {
                  handleLogout();
                }}
              >
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
