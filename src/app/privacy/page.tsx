"use client";

import { Box, Container, Typography, Paper, Stack, Divider, Link, Button } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";

const PrivacyPolicyPage = () => {
  const router = useRouter();

  return (
    <PageContainer title="Privacy Policy" description="QubeAI Privacy Policy">
      <Box
        sx={{
          minHeight: '100vh',
          background: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
          py: 4,
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.03) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.03) 0%, transparent 50%),
              linear-gradient(135deg, rgba(102, 126, 234, 0.01) 0%, rgba(118, 75, 162, 0.01) 100%)
            `,
            zIndex: 0,
          }}
        />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
          {/* Back Button */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
            sx={{
              mb: 3,
              textTransform: 'none',
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'rgba(102, 126, 234, 0.08)',
              },
            }}
          >
            Back
          </Button>

          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Privacy Policy
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
              QubeAI
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Effective Date: November 20, 2025 | Last Updated: November 20, 2025
            </Typography>
          </Box>

          {/* Content */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Stack spacing={4}>
              {/* Table of Contents */}
              <Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Table of Contents
                </Typography>
                <Stack spacing={1} sx={{ mt: 2 }}>
                  {[
                    'Introduction',
                    'Data Protection Inquiries',
                    'Information We Collect',
                    'How We Use Your Information',
                    'Cookies and Tracking Technologies',
                    'AI Model Training and Data Usage',
                    'Data Sharing and Third Parties',
                    'Data Processing on Your Behalf',
                    'International Data Transfers',
                    'Your Privacy Rights',
                    'Data Security',
                    'Data Retention',
                    "Children's Privacy",
                    'Facebook/Meta Integration',
                    'Legal Basis for Processing (For GDPR Regions)',
                    'Your Responsibilities as a Data Controller',
                    'Data Breach Notification',
                    'Changes to This Policy',
                    'Contact Us',
                  ].map((item, index) => (
                    <Link
                      key={index}
                      href={`#section-${index + 1}`}
                      sx={{
                        color: 'primary.main',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>
                        {index + 1}. {item}
                      </Typography>
                    </Link>
                  ))}
                </Stack>
              </Box>

              <Divider />

              {/* Section 1: Introduction */}
              <Box id="section-1">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  1. Introduction
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  QubeAI (&quot;QubeAI,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is an advanced AI-powered chatbot platform developed and operated by Algoqube Solutions Pvt Ltd. This Privacy Policy outlines how we collect, process, use, store, share, and protect information when you:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Visit our website ai.algoqube.com
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Sign up for or use the QubeAI platform
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Integrate QubeAI with your website, CRM, or business applications
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Interact with QubeAI through any deployment channel (website, CRM, chat widget, API, social media integration, etc.)
                    </Typography>
                  </li>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  Our priority is ensuring transparency about our data practices and maintaining trust with our customers and end-users. We are committed to safeguarding personal information and complying with all applicable data protection laws, including India&apos;s Digital Personal Data Protection Act (DPDPA), GDPR (where applicable), and other relevant international standards.
                </Typography>
              </Box>

              <Divider />

              {/* Section 2: Data Protection Inquiries */}
              <Box id="section-2">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  2. Data Protection Inquiries
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  If you have questions about this Privacy Policy, want clarity on how your data is processed, wish to exercise your privacy rights, or want to report concerns, you may contact us directly.
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  We aim to respond to all privacy-related messages within 7–14 business days depending on jurisdictional requirements.
                </Typography>
              </Box>

              <Divider />

              {/* Section 3: Information We Collect */}
              <Box id="section-3">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  3. Information We Collect
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  We collect several categories of information depending on how you interact with QubeAI.
                </Typography>

                <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 2 }}>
                  A. Information You Provide to Us Directly
                </Typography>

                <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                  1. Account Information
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Full name
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Business name
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Email address
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Phone number
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Password (securely stored using encryption)
                    </Typography>
                  </li>
                </Box>

                <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                  2. Website or Training Data
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Website URLs submitted for training
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Documents such as PDFs, text files, FAQs, manuals, product catalogs
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      CRM or API data that you voluntarily connect to QubeAI
                    </Typography>
                  </li>
                </Box>

                <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                  3. Communication with Us
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Email messages
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Customer support tickets
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Chat interactions
                    </Typography>
                  </li>
                </Box>

                <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                  4. Billing and Payment Information
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Plan details
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Billing address
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Payment gateway tokens (we do not store credit card numbers; payments are processed through secure third-party providers)
                    </Typography>
                  </li>
                </Box>

                <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 2 }}>
                  B. Automatically Collected Information
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  When you use QubeAI or visit our website, we automatically collect:
                </Typography>

                <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                  1. Device and Technical Data
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      IP address
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Browser type, operating system
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Device identifiers and configuration
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Time zone, language settings
                    </Typography>
                  </li>
                </Box>

                <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                  2. Usage Logs
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Login timestamps
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Page views
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Platform interactions
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Chatbot training events
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Error logs and diagnostic data
                    </Typography>
                  </li>
                </Box>

                <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                  3. Cookies and Similar Technologies
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Session cookies
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Analytics cookies
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Preference cookies
                    </Typography>
                  </li>
                </Box>

                <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 2 }}>
                  C. End-User Chat & Lead Information
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  When your website visitors or customers interact with your QubeAI chatbot:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Chat messages
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Customer names
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Emails and phone numbers (if collected)
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Interaction timestamps
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Lead capture details
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      User behavior insights (with anonymization when possible)
                    </Typography>
                  </li>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  This information is processed on your behalf as part of the services we provide.
                </Typography>
              </Box>

              <Divider />

              {/* Section 4: How We Use Your Information */}
              <Box id="section-4">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  4. How We Use Your Information
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  We use your data to provide, improve, protect, and personalize our services. This includes:
                </Typography>

                <Typography variant="h6" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                  A. Delivering Our Services
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Training your chatbot on your website or custom data
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Managing user accounts and authentication
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Ensuring accurate and human-like chatbot responses
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Powering lead capture, support automation, and CRM workflows
                    </Typography>
                  </li>
                </Box>

                <Typography variant="h6" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                  B. Improving Platform Performance
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Monitoring system logs
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Debugging issues
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Conducting quality checks on chatbot outputs
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Enhancing model accuracy
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Research and development for new features
                    </Typography>
                  </li>
                </Box>

                <Typography variant="h6" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                  C. Communication
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Sending onboarding guidance
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Providing product updates and notifications
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Responding to support queries
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Sending invoices, billing alerts, and subscription-related communication
                    </Typography>
                  </li>
                </Box>

                <Typography variant="h6" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                  D. Legal and Compliance Purposes
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Preventing fraud and unauthorized access
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Complying with applicable laws and regulatory requirements
                    </Typography>
                  </li>
                </Box>

                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', mt: 2, fontStyle: 'italic' }}>
                  We do not use your business data or conversation content to train global public AI models.
                </Typography>
              </Box>

              <Divider />

              {/* Section 5: Cookies and Tracking Technologies */}
              <Box id="section-5">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  5. Cookies and Tracking Technologies
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  QubeAI uses cookies and tracking mechanisms to enhance functionality and improve your experience.
                </Typography>

                <Typography variant="h6" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                  Types of Cookies We Use
                </Typography>
                <Box component="ol" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      <strong>Essential Cookies</strong> – required for authentication and core platform functionality.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      <strong>Analytics Cookies</strong> – help us understand usage patterns (e.g., Google Analytics).
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      <strong>Preference Cookies</strong> – save your settings and configurations.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      <strong>Advertising/Remarketing Cookies</strong> – only used on our marketing website (not inside the QubeAI dashboard).
                    </Typography>
                  </li>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  Users may manage cookie preferences through browser settings.
                </Typography>
              </Box>

              <Divider />

              {/* Section 6: AI Model Training and Data Usage */}
              <Box id="section-6">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  6. AI Model Training and Data Usage
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  We follow strict data-handling protocols to ensure responsible AI usage.
                </Typography>

                <Typography variant="h6" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                  A. Your Data Trains Only Your Chatbot
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  Your website content, documents, and training materials are used exclusively to train your version of QubeAI.
                </Typography>

                <Typography variant="h6" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                  B. No Cross-Client Mixing
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  Your data is never used to train another business&apos;s chatbot.
                </Typography>

                <Typography variant="h6" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                  C. Human Review
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  Only authorized team members may review conversation logs for:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Troubleshooting
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Quality improvement
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Abuse prevention
                    </Typography>
                  </li>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  All reviews follow strict confidentiality and minimal-access principles.
                </Typography>

                <Typography variant="h6" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                  D. End-User Conversations
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  These are processed solely to:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Generate responses
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Improve accuracy
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Provide analytics and insights for your business
                    </Typography>
                  </li>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  We do not use end-user chat logs to develop general AI capabilities.
                </Typography>
              </Box>

              <Divider />

              {/* Section 7: Data Sharing and Third Parties */}
              <Box id="section-7">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  7. Data Sharing and Third Parties
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  We do not sell, trade, or rent your personal information.
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  However, we may share data with:
                </Typography>

                <Typography variant="h6" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                  A. Trusted Service Providers
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  Such as:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Cloud hosting (AWS, GCP, Azure, or equivalent)
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Email service providers
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Analytics tools
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Payment processors
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      CRM or third-party apps you choose to integrate
                    </Typography>
                  </li>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  All providers follow strict confidentiality agreements and data protection standards.
                </Typography>

                <Typography variant="h6" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                  B. Legal and Regulatory Bodies
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  Data may be disclosed if required to:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Comply with lawful requests
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Respond to legal processes
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Protect safety or prevent fraud
                    </Typography>
                  </li>
                </Box>
              </Box>

              <Divider />

              {/* Section 8: Data Processing on Your Behalf */}
              <Box id="section-8">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  8. Data Processing on Your Behalf
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  When you deploy QubeAI on your website or applications, you act as the Data Controller, and QubeAI acts as the Data Processor.
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  This means:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      You determine what data is collected
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      QubeAI processes it under your instructions
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      You retain full ownership of your data
                    </Typography>
                  </li>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  We provide tools to help you meet obligations under relevant laws.
                </Typography>
              </Box>

              <Divider />

              {/* Section 9: International Data Transfers */}
              <Box id="section-9">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  9. International Data Transfers
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  Depending on service configuration, data may be processed in secure servers located outside India.
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  We ensure:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Adequate data protection safeguards
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Compliance with GDPR, SCCs, and other regulatory frameworks where applicable
                    </Typography>
                  </li>
                </Box>
              </Box>

              <Divider />

              {/* Section 10: Your Privacy Rights */}
              <Box id="section-10">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  10. Your Privacy Rights
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  You may exercise the following rights:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Right to access your data
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Right to correct inaccurate information
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Right to request deletion (&quot;right to be forgotten&quot;)
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Right to restrict processing
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Right to data portability
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Right to withdraw consent
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Right to lodge a complaint with authorities
                    </Typography>
                  </li>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  Requests can be made using the contact information provided below.
                </Typography>
              </Box>

              <Divider />

              {/* Section 11: Data Security */}
              <Box id="section-11">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  11. Data Security
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  We implement strict security measures including:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Encryption at rest and in transit
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Firewall and intrusion detection systems
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Role-based access control
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Secure password policies
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Regular vulnerability assessments
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Enforced least-privilege access principles
                    </Typography>
                  </li>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  However, no system is 100% immune to breaches. We take every reasonable step to prevent them.
                </Typography>
              </Box>

              <Divider />

              {/* Section 12: Data Retention */}
              <Box id="section-12">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  12. Data Retention
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  We retain data as long as necessary to fulfill the purposes described in this policy, unless a longer retention period is legally required.
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  For example:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Chat logs may be retained for analytics or customer support
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Account information is retained while your subscription is active
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Data can be deleted upon request
                    </Typography>
                  </li>
                </Box>
              </Box>

              <Divider />

              {/* Section 13: Children's Privacy */}
              <Box id="section-13">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  13. Children&apos;s Privacy
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  QubeAI is not designed for use by children under the age of 13 (or the minimum legal age in applicable jurisdictions).
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  We do not knowingly collect personal information from minors.
                </Typography>
              </Box>

              <Divider />

              {/* Section 14: Facebook/Meta Integration */}
              <Box id="section-14">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  14. Facebook/Meta Integration
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  If you connect QubeAI with Facebook/Meta platforms:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      We access only the data needed to manage your page conversations
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      We do not post, modify, or publish content without your consent
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      All data is processed in compliance with Meta Platform Policies
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Synchronization can be disabled anytime from your settings
                    </Typography>
                  </li>
                </Box>
              </Box>

              <Divider />

              {/* Section 15: Legal Basis for Processing */}
              <Box id="section-15">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  15. Legal Basis for Processing (For GDPR Regions)
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  For users in the European Economic Area (EEA), we process data based on:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Consent
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Contractual necessity
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Legitimate interests
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Legal obligations
                    </Typography>
                  </li>
                </Box>
              </Box>

              <Divider />

              {/* Section 16: Your Responsibilities as a Data Controller */}
              <Box id="section-16">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  16. Your Responsibilities as a Data Controller
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  If you deploy QubeAI for your business, you are responsible for:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Informing your website visitors about AI usage
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Complying with relevant data protection laws
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Ensuring lawful collection of customer data
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Providing your own privacy disclosures
                    </Typography>
                  </li>
                </Box>
              </Box>

              <Divider />

              {/* Section 17: Data Breach Notification */}
              <Box id="section-17">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  17. Data Breach Notification
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  If a data breach occurs:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      We will notify affected customers without undue delay
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      We will take immediate corrective action
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      We will comply with all reporting obligations under applicable laws
                    </Typography>
                  </li>
                </Box>
              </Box>

              <Divider />

              {/* Section 18: Changes to This Policy */}
              <Box id="section-18">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  18. Changes to This Policy
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  We may update this Privacy Policy periodically.
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  When changes occur:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      The &quot;Last Updated&quot; date will be revised
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Significant changes will be prominently communicated
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Continued use of QubeAI constitutes acceptance of updates
                    </Typography>
                  </li>
                </Box>
              </Box>

              <Divider />

              {/* Section 19: Contact Us */}
              <Box id="section-19">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  19. Contact Us
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  <strong>Algoqube Solutions Pvt Ltd</strong>
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  C 803, Palladio, Ashok Nagar<br />
                  Tathawade, Pune – 411033<br />
                  India
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  <strong>Phone:</strong> +91 959-501-2234
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  <strong>Email:</strong>{' '}
                  <Link href="mailto:connect@algoqube.com" sx={{ color: 'primary.main' }}>
                    connect@algoqube.com
                  </Link>
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Footer Actions */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={() => router.push('/authentication/login')}
              sx={{
                textTransform: 'none',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              Return to Login
            </Button>
          </Box>
        </Container>
      </Box>
    </PageContainer>
  );
};

export default PrivacyPolicyPage;

