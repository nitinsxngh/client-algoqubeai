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

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT;

  useEffect(() => {
    const isPublic = PUBLIC_ROUTES.includes(pathname);

    if (isPublic) {
      setAuthChecked(true);
      return;
    }

    // Get token from localStorage
    const token = localStorage.getItem('token');
    console.log('Layout: Token found:', token ? token.substring(0, 20) + '...' : 'No token');
    
    // If no token, redirect to login immediately
    if (!token) {
      console.log('Layout: No token, redirecting to login');
      router.replace("/authentication/login");
      return;
    }
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    
    console.log('Layout: Making auth check request to:', `${backendUrl}/api/users/me`);
    
    fetch(`${backendUrl}/api/users/me`, {
      method: "GET",
      headers,
      credentials: "include",
    })
      .then((res) => {
        console.log('Layout: Auth check response status:', res.status);
        if (!res.ok) {
          console.log('Layout: Auth check failed, clearing tokens');
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.replace("/authentication/login");
        } else {
          console.log('Layout: Auth check successful');
          setAuthChecked(true);
        }
      })
      .catch((error) => {
        console.error('Layout: Auth check error:', error);
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.replace("/authentication/login");
      });
  }, [pathname, router, backendUrl]);

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
