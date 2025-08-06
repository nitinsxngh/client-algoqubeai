"use client";
import { Grid, Box, Card, Typography, Stack, Container } from "@mui/material";
import Link from "next/link";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import AuthRegister from "../auth/AuthRegister";

const Register2 = () => (
  <PageContainer title="Register" description="this is Register page">
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
      }}
    >

      <Container maxWidth="lg" sx={{ minHeight: '100vh', py: 4, position: 'relative', zIndex: 1 }}>
        <Grid
          container
          spacing={0}
          justifyContent="center"
          alignItems="center"
          sx={{ minHeight: "100vh" }}
        >
          <Grid
            size={{
              xs: 12,
              sm: 10,
              md: 8,
              lg: 6,
              xl: 5
            }}
            >
              <Card
                elevation={24}
                sx={{
                  p: { xs: 4, sm: 5, md: 6 },
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12), 0 8px 25px rgba(0, 0, 0, 0.08)',
                  position: 'relative',
                  overflow: 'visible',
                  width: '100%',
                  maxWidth: '500px',
                  mx: 'auto',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #667eea, #764ba2)',
                    borderRadius: '12px 12px 0 0',
                  },
                }}
              >
                <AuthRegister
                  title="Join Algoqube"
                  subtext={
                    <Typography
                      variant="body1"
                      textAlign="center"
                      color="text.secondary"
                      mb={4}
                      sx={{ 
                        fontSize: '1.1rem',
                        lineHeight: 1.6,
                        opacity: 0.8,
                        maxWidth: '400px',
                        mx: 'auto'
                      }}
                    >
                      Create your account and start building AI-powered chatbots
                    </Typography>
                  }
                  subtitle={
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="center"
                      mt={5}
                      pt={4}
                      sx={{ 
                        borderTop: '1px solid rgba(0, 0, 0, 0.08)',
                        flexWrap: 'wrap',
                        gap: 1
                      }}
                    >
                      <Typography
                        color="text.secondary"
                        variant="body1"
                        fontWeight="500"
                      >
                        Already have an account?
                      </Typography>
                      <Typography
                        component={Link}
                        href="/authentication/login"
                        fontWeight="600"
                        sx={{
                          textDecoration: "none",
                          color: "primary.main",
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        Sign in
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

export default Register2;
