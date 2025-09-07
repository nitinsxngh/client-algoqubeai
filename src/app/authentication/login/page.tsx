"use client";
import Link from "next/link";
import { Grid, Box, Card, Stack, Typography, Container } from "@mui/material";
// components
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import AuthLogin from "../auth/AuthLogin";

// Updated login page without animations - deployment test
const Login2 = () => {
  return (
    <PageContainer title="Login" description="this is Login page">
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
        }}
      >

        <Container maxWidth="lg" sx={{ height: '100vh', position: 'relative', zIndex: 1 }}>
          <Grid
            container
            spacing={0}
            justifyContent="center"
            alignItems="center"
            sx={{ height: "100vh" }}
          >
            <Grid
              size={{
                xs: 12,
                sm: 12,
                lg: 5,
                xl: 4
              }}
            >
                <Card
                  elevation={24}
                  sx={{
                    p: 5,
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #667eea, #764ba2)',
                    },
                  }}
                >
                  <AuthLogin
                    title="Welcome back"
                    subtext={
                      <Typography
                        variant="body1"
                        textAlign="center"
                        color="text.secondary"
                        mb={3}
                        sx={{ fontSize: '1.1rem' }}
                      >
                        Sign in to continue to your AI-powered dashboard
                      </Typography>
                    }
                    subtitle={
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                        mt={4}
                        pt={3}
                        sx={{ borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}
                      >
                        <Typography
                          color="text.secondary"
                          variant="body1"
                          fontWeight="500"
                        >
                          Don&apos;t have an account?
                        </Typography>
                        <Typography
                          component={Link}
                          href="/authentication/register"
                          fontWeight="600"
                          sx={{
                            textDecoration: "none",
                            color: "primary.main",
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          Sign up
                        </Typography>
                      </Stack>
                    }
                  />
                </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </PageContainer>
  );
};

export default Login2;
