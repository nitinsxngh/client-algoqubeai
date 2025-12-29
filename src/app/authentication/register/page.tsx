"use client";
import { Grid, Box, Card, Typography, Stack, Container, Divider, Chip } from "@mui/material";
import Link from "next/link";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import AuthRegisterSteps from "../auth/AuthRegisterSteps";
import GoogleOAuthButton from "@/components/auth/GoogleOAuthButton";

const Register2 = () => (
  <PageContainer title="Register" description="this is Register page">
        <Box
          sx={{
            minHeight: '100vh',
            background: '#ffffff',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
          }}
        >
      {/* AI Pattern Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(102, 126, 234, 0.03) 0%, transparent 50%),
            linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%)
          `,
          zIndex: 0,
        }}
      />
      
      {/* AI Grid Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(102, 126, 234, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(102, 126, 234, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          opacity: 0.3,
          zIndex: 0,
        }}
      />

      <Container 
        maxWidth="lg" 
        sx={{ 
          minHeight: '100vh', 
          py: 4, 
          position: 'relative', 
          zIndex: 1,
          '@keyframes rotateCube': {
            '0%': {
              transform: 'rotateX(0deg) rotateY(0deg)',
            },
            '25%': {
              transform: 'rotateX(0deg) rotateY(90deg)',
            },
            '50%': {
              transform: 'rotateX(90deg) rotateY(90deg)',
            },
            '75%': {
              transform: 'rotateX(90deg) rotateY(180deg)',
            },
            '100%': {
              transform: 'rotateX(0deg) rotateY(360deg)',
            },
          },
        }}
      >
        <Grid
          container
          spacing={0}
          sx={{ minHeight: "100vh" }}
        >
          {/* Left Side - Form */}
          <Grid
            size={{
              xs: 12,
              lg: 6
            }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: { xs: 1, sm: 2, md: 4 }
              }}
          >
            <Box sx={{ width: '100%', maxWidth: 480 }}>
              {/* Logo */}
              <Box sx={{ mb: { xs: 2, sm: 3 }, textAlign: 'center' }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                  }}
                >
                  Qube AI
                </Typography>
              </Box>

                <Box
                sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                    boxShadow: 'none',
                  position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                {/* Google Sign Up Button */}
                <GoogleOAuthButton variant="signup" />

                {/* Divider */}
                <Box sx={{ position: 'relative', mb: { xs: 2, sm: 3 } }}>
                  <Divider />
                  <Typography
                    variant="body2"
                    sx={{
                    position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      px: 2,
                      color: 'text.secondary',
                      fontSize: '0.875rem',
                    }}
                  >
                    or
                  </Typography>
                </Box>

                <AuthRegisterSteps
                  subtext={
                    <Typography
                      variant="body2"
                      textAlign="center"
                      color="text.secondary"
                      mb={3}
                      sx={{ fontSize: '0.875rem' }}
                    >
                      Create your account
                    </Typography>
                  }
                  subtitle={
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="center"
                      mt={3}
                      pt={2}
                      sx={{ 
                        borderTop: '1px solid rgba(0, 0, 0, 0.08)',
                        flexWrap: 'wrap',
                        gap: 1
                      }}
                    >
                      <Typography
                        color="text.secondary"
                        variant="body2"
                        fontWeight="400"
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
              </Box>

              {/* Terms */}
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  textAlign: 'center',
                  mt: { xs: 2, sm: 3 },
                  color: '#000000',
                  fontSize: '0.75rem',
                }}
              >
                By continuing, you agree to our{' '}
                <Link href="/terms" style={{ color: 'rgba(102, 126, 234, 0.9)', textDecoration: 'none' }}>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" style={{ color: 'rgba(102, 126, 234, 0.9)', textDecoration: 'none' }}>
                  Privacy Policy
                </Link>
              </Typography>
            </Box>
          </Grid>

          {/* Right Side - AI Visual Content */}
          <Grid
            size={{
              xs: 0,
              lg: 6
            }}
            sx={{
              display: { xs: 'none', lg: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%)',
            }}
          >
            <Box sx={{ textAlign: 'center', p: 4, position: 'relative' }}>
              {/* 3D AI Cube */}
              <Box
                sx={{
                  width: { xs: 200, sm: 240, md: 280 },
                  height: { xs: 200, sm: 240, md: 280 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: { xs: 2, sm: 3, md: 4 },
                  position: 'relative',
                  perspective: '1000px',
                }}
              >
                  <Box
                    sx={{
                      width: { xs: 140, sm: 170, md: 200 },
                      height: { xs: 140, sm: 170, md: 200 },
                      position: 'relative',
                      transformStyle: 'preserve-3d',
                      animation: 'rotateCube 8s linear infinite',
                    }}
                  >
                    {/* Front Face */}
                    <Box
                      sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.4) 0%, rgba(118, 75, 162, 0.4) 100%)',
                        border: '2px solid rgba(102, 126, 234, 0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: { xs: 'translateZ(70px)', sm: 'translateZ(85px)', md: 'translateZ(100px)' },
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Typography
                        variant="h1"
                        sx={{
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
                          letterSpacing: '-0.02em',
                          textAlign: 'center',
                          lineHeight: 1.2,
                        }}
                      >
                        Orchestration
                      </Typography>
                    </Box>
                  
                    {/* Back Face */}
                    <Box
                      sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(118, 75, 162, 0.3) 0%, rgba(102, 126, 234, 0.3) 100%)',
                        border: '2px solid rgba(118, 75, 162, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: { xs: 'rotateY(180deg) translateZ(70px)', sm: 'rotateY(180deg) translateZ(85px)', md: 'rotateY(180deg) translateZ(100px)' },
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Typography
                        variant="h1"
                        sx={{
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
                          letterSpacing: '-0.02em',
                          textAlign: 'center',
                          lineHeight: 1.2,
                        }}
                      >
                        Compliance
                      </Typography>
                    </Box>
                  
                    {/* Right Face */}
                    <Box
                      sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)',
                        border: '2px solid rgba(102, 126, 234, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: { xs: 'rotateY(90deg) translateZ(70px)', sm: 'rotateY(90deg) translateZ(85px)', md: 'rotateY(90deg) translateZ(100px)' },
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Typography
                        variant="h1"
                        sx={{
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
                          letterSpacing: '-0.02em',
                          textAlign: 'center',
                          lineHeight: 1.2,
                        }}
                      >
                        Automation
                      </Typography>
                    </Box>
                  
                    {/* Left Face */}
                    <Box
                      sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(118, 75, 162, 0.3) 0%, rgba(102, 126, 234, 0.3) 100%)',
                        border: '2px solid rgba(118, 75, 162, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: { xs: 'rotateY(-90deg) translateZ(70px)', sm: 'rotateY(-90deg) translateZ(85px)', md: 'rotateY(-90deg) translateZ(100px)' },
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Typography
                        variant="h1"
                        sx={{
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
                          letterSpacing: '-0.02em',
                          textAlign: 'center',
                          lineHeight: 1.2,
                        }}
                      >
                        Scalability
                      </Typography>
                    </Box>
                  
                    {/* Top Face */}
                    <Box
                      sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                        border: '2px solid rgba(102, 126, 234, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: { xs: 'rotateX(90deg) translateZ(70px)', sm: 'rotateX(90deg) translateZ(85px)', md: 'rotateX(90deg) translateZ(100px)' },
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Typography
                        variant="h1"
                        sx={{
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
                          letterSpacing: '-0.02em',
                          textAlign: 'center',
                          lineHeight: 1.2,
                        }}
                      >
                        Security
                      </Typography>
                    </Box>
                  
                    {/* Bottom Face */}
                    <Box
                      sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(118, 75, 162, 0.2) 0%, rgba(102, 126, 234, 0.2) 100%)',
                        border: '2px solid rgba(118, 75, 162, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: { xs: 'rotateX(-90deg) translateZ(70px)', sm: 'rotateX(-90deg) translateZ(85px)', md: 'rotateX(-90deg) translateZ(100px)' },
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Typography
                        variant="h1"
                        sx={{
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
                          letterSpacing: '-0.02em',
                          textAlign: 'center',
                          lineHeight: 1.2,
                        }}
                      >
                        Efficiency
                      </Typography>
                    </Box>
                </Box>
              </Box>
              
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: '#1a1a1a',
                  mb: 2,
                  fontSize: '2rem',
                }}
              >
                Start Building Today
              </Typography>
              
              <Typography
                variant="h6"
                sx={{
                  color: '#666666',
                  fontWeight: 400,
                  maxWidth: 400,
                  mx: 'auto',
                  lineHeight: 1.6,
                  fontSize: '1.1rem',
                }}
              >
                Join thousands of developers and businesses creating intelligent AI solutions that scale with your growth.
              </Typography>

                  {/* AI Feature Chips */}
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="center"
                    mt={4}
                    flexWrap="wrap"
                    gap={1}
                  >
                    {['Chatbots', 'AI Automation', 'Smart Analytics'].map((feature) => (
                  <Chip
                    key={feature}
                    label={feature}
                    sx={{
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      color: '#667eea',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: 'rgba(102, 126, 234, 0.15)',
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  </PageContainer>
);

export default Register2;
