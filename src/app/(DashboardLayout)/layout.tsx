"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { styled, Container, Box, CircularProgress, Typography } from "@mui/material";
import Header from "@/app/(DashboardLayout)/layout/header/Header";
import Sidebar from "@/app/(DashboardLayout)/layout/sidebar/Sidebar";

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "60px",
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: "transparent",
}));

const PUBLIC_ROUTES = ["/authentication/login", "/authentication/register"];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isPublic = PUBLIC_ROUTES.includes(pathname);

    if (isPublic) {
      setAuthChecked(true);
      return;
    }

    // Verify auth using backend (cookie-based)
    fetch("http://localhost:4000/api/users/me", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          router.replace("/authentication/login");
        } else {
          setAuthChecked(true);
        }
      })
      .catch(() => {
        router.replace("/authentication/login");
      });
  }, [pathname, router]);

  if (!authChecked) {
    return (
      <Box height="100vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
        <Typography ml={2}>Verifying authentication...</Typography>
      </Box>
    );
  }

  return (
    <MainWrapper className="mainwrapper">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
      />

      <PageWrapper className="page-wrapper">
        <Header toggleMobileSidebar={() => setMobileSidebarOpen(true)} />
        <Container
          sx={{
            paddingTop: "20px",
            maxWidth: "1200px",
          }}
        >
          <Box sx={{ minHeight: "calc(100vh - 170px)" }}>{children}</Box>
        </Container>
      </PageWrapper>
    </MainWrapper>
  );
}
