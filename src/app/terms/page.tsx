"use client";

import { Box, Container, Typography, Paper, Stack, Divider, Link, Button } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";

const TermsOfServicePage = () => {
  const router = useRouter();

  return (
    <PageContainer title="Terms of Service" description="QubeAI Terms of Service">
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
              Terms of Service
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
                    'Acceptance of Terms',
                    'Eligibility',
                    'Description of Services',
                    'Account Registration and Responsibilities',
                    'User Conduct and Acceptable Use',
                    'AI Chatbot Behavior and Limitations',
                    'Data Ownership and Usage',
                    'Customer Responsibilities (Data Controller Obligations)',
                    'Pricing, Billing, and Refunds',
                    'Service Availability and Uptime',
                    'Integrations and Third-Party Services',
                    'Intellectual Property Rights',
                    'Prohibited Activities',
                    'Confidentiality',
                    'Data Protection and Privacy',
                    'Termination and Suspension',
                    'Disclaimers and Limitation of Liability',
                    'Indemnification',
                    'Governing Law and Jurisdiction',
                    'Changes to These Terms',
                    'Contact Information',
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
                  These Terms of Service (&quot;Terms,&quot; &quot;Agreement&quot;) govern your access to and use of QubeAI (&quot;Service,&quot; &quot;Platform&quot;), operated by Algoqube Solutions Pvt Ltd (&quot;Company,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;).
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  By using QubeAI, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, do not use the Service.
                </Typography>
              </Box>

              <Divider />

              {/* Section 2: Acceptance of Terms */}
              <Box id="section-2">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  2. Acceptance of Terms
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  By accessing, registering for, or using QubeAI, you acknowledge that:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      You have read, understood, and agree to these Terms.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      You have the legal authority to enter into this Agreement.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      You consent to receive service-related communications from us.
                    </Typography>
                  </li>
                </Box>
              </Box>

              <Divider />

              {/* Section 3: Eligibility */}
              <Box id="section-3">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  3. Eligibility
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  To use QubeAI:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      You must be at least 18 years old.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      You must have the legal capacity to enter into contracts.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      You must be using the Service for lawful business or personal purposes.
                    </Typography>
                  </li>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  We may restrict or terminate access if eligibility standards are not met.
                </Typography>
              </Box>

              <Divider />

              {/* Section 4: Description of Services */}
              <Box id="section-4">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  4. Description of Services
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  QubeAI is an AI-powered business chatbot platform that enables users to:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Train AI models using website or custom data
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Deploy chatbots for sales, support, and lead generation
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Integrate chatbots with websites, CRMs, and business applications
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Capture leads, automate responses, and enhance customer engagement
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Access analytics and customization dashboards
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Connect with third-party services, including social media platforms
                    </Typography>
                  </li>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  The features, functionality, and availability of the Service may change over time.
                </Typography>
              </Box>

              <Divider />

              {/* Section 5: Account Registration and Responsibilities */}
              <Box id="section-5">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  5. Account Registration and Responsibilities
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  When creating an account, you must provide accurate, complete, and updated information.
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  You are responsible for:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Maintaining the confidentiality of your account credentials
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      All activity that occurs under your account
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Updating your information when necessary
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Ensuring your use complies with applicable laws
                    </Typography>
                  </li>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  If you suspect unauthorized access, notify us immediately.
                </Typography>
              </Box>

              <Divider />

              {/* Section 6: User Conduct and Acceptable Use */}
              <Box id="section-6">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  6. User Conduct and Acceptable Use
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  You agree NOT to use QubeAI to:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Upload harmful, illegal, or malicious content
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Misrepresent your identity or impersonate another entity
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Conduct fraud, scams, or deceptive practices
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Interfere with the functioning of the Service
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Reverse engineer, copy, or attempt to derive source code
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Circumvent security or access controls
                    </Typography>
                  </li>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  You are solely responsible for the inputs you provide to the AI and the outputs generated based on your data.
                </Typography>
              </Box>

              <Divider />

              {/* Section 7: AI Chatbot Behavior and Limitations */}
              <Box id="section-7">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  7. AI Chatbot Behavior and Limitations
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  QubeAI uses artificial intelligence and machine learning technologies.
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  You acknowledge that:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      AI-generated responses may occasionally be inaccurate or incomplete
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      AI interpretations depend on training data and user inputs
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      You must review and validate any critical or sensitive outputs
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      AI should not be relied upon for legal, medical, or financial advice
                    </Typography>
                  </li>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  We are not liable for actions taken based on AI-generated content.
                </Typography>
              </Box>

              <Divider />

              {/* Section 8: Data Ownership and Usage */}
              <Box id="section-8">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  8. Data Ownership and Usage
                </Typography>

                <Typography variant="h6" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                  A. Customer Data
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  You retain full ownership of all content you provide, including:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Website URLs
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Documents and training data
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Customer conversations and interactions
                    </Typography>
                  </li>
                </Box>

                <Typography variant="h6" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                  B. Our Usage of Data
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  We may process your data to:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Provide and improve the Service
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Train your private chatbot models
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Offer analytics and insights
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Troubleshoot issues
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Comply with legal obligations
                    </Typography>
                  </li>
                </Box>

                <Typography variant="h6" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                  C. No Cross-Client Training
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  Your data is not used to train AI models for other customers.
                </Typography>

                <Typography variant="h6" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                  D. End-User Conversations
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  Messages exchanged between your users and QubeAI are processed solely on your behalf.
                </Typography>
              </Box>

              <Divider />

              {/* Section 9: Customer Responsibilities */}
              <Box id="section-9">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  9. Customer Responsibilities (Data Controller Obligations)
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  If you deploy QubeAI on your website or applications, YOU act as the Data Controller and must:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Comply with data protection laws relevant to your location
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Provide your users with a privacy notice
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Obtain any legally required consents
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Ensure lawful collection of customer data
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Manage user requests (access, deletion, etc.)
                    </Typography>
                  </li>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  QubeAI acts as a Data Processor, processing data according to your instructions.
                </Typography>
              </Box>

              <Divider />

              {/* Section 10: Pricing, Billing, and Refunds */}
              <Box id="section-10">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  10. Pricing, Billing, and Refunds
                </Typography>

                <Typography variant="h6" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                  A. Pricing
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  Usage-based or subscription plans may apply. Pricing is available on our website.
                </Typography>

                <Typography variant="h6" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                  B. Billing
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  By subscribing, you authorize us to:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Charge your payment method
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Process recurring payments when applicable
                    </Typography>
                  </li>
                </Box>

                <Typography variant="h6" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                  C. Refunds
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  Unless required by law, we do not guarantee refunds once a subscription cycle begins.
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  We may offer refunds on a case-by-case basis at our discretion.
                </Typography>
              </Box>

              <Divider />

              {/* Section 11: Service Availability and Uptime */}
              <Box id="section-11">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  11. Service Availability and Uptime
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  We aim to provide continuous availability; however:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Occasional downtime may occur due to maintenance, upgrades, or unexpected issues
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      We do not guarantee uninterrupted operation
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      We will attempt to notify users of scheduled downtime in advance
                    </Typography>
                  </li>
                </Box>
              </Box>

              <Divider />

              {/* Section 12: Integrations and Third-Party Services */}
              <Box id="section-12">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  12. Integrations and Third-Party Services
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  QubeAI may integrate with services such as:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      CRM platforms
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Social media tools
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Cloud storage providers
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Email and messaging systems
                    </Typography>
                  </li>
                </Box>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  You acknowledge that:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Third-party terms and policies also apply
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      We are not responsible for failures or breaches in third-party platforms
                    </Typography>
                  </li>
                </Box>
              </Box>

              <Divider />

              {/* Section 13: Intellectual Property Rights */}
              <Box id="section-13">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  13. Intellectual Property Rights
                </Typography>

                <Typography variant="h6" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                  A. Our IP
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  All rights to:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      QubeAI platform and technology
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Software
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Designs, trademarks, branding
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      AI models not trained on your data
                    </Typography>
                  </li>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  belong to Algoqube Solutions Pvt Ltd.
                </Typography>

                <Typography variant="h6" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                  B. Your IP
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  Content you upload or train the bot with remains your property.
                </Typography>

                <Typography variant="h6" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                  C. License to Use
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  You receive a limited, revocable, non-transferable license to use QubeAI for business purposes.
                </Typography>
              </Box>

              <Divider />

              {/* Section 14: Prohibited Activities */}
              <Box id="section-14">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  14. Prohibited Activities
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  You agree not to:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Use QubeAI to generate harmful or illegal content
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Upload copyrighted material without proper rights
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Violate privacy or data protection regulations
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Use the Service for competitive analysis or to build a similar product
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Introduce malware, viruses, bots, or harmful scripts
                    </Typography>
                  </li>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  Violations may result in immediate termination.
                </Typography>
              </Box>

              <Divider />

              {/* Section 15: Confidentiality */}
              <Box id="section-15">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  15. Confidentiality
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  Both parties agree to maintain the confidentiality of:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Business information
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Training data
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Technical details
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Sensitive customer content
                    </Typography>
                  </li>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  Confidentiality obligations continue even after termination.
                </Typography>
              </Box>

              <Divider />

              {/* Section 16: Data Protection and Privacy */}
              <Box id="section-16">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  16. Data Protection and Privacy
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  Our data handling practices are detailed in our Privacy Policy, which is part of these Terms.
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  By using QubeAI, you agree to data processing described in the{' '}
                  <Link href="/privacy" sx={{ color: 'primary.main' }}>
                    Privacy Policy
                  </Link>.
                </Typography>
              </Box>

              <Divider />

              {/* Section 17: Termination and Suspension */}
              <Box id="section-17">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  17. Termination and Suspension
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  We may suspend or terminate your access if:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      You violate these Terms
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      You misuse the Service
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Payment fails repeatedly
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      You engage in illegal activities
                    </Typography>
                  </li>
                </Box>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  Upon termination:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Your access to the platform will be revoked
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Certain data may be deleted based on our retention policy
                    </Typography>
                  </li>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  You may terminate your account at any time.
                </Typography>
              </Box>

              <Divider />

              {/* Section 18: Disclaimers and Limitation of Liability */}
              <Box id="section-18">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  18. Disclaimers and Limitation of Liability
                </Typography>

                <Typography variant="h6" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                  A. No Warranty
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  The Service is provided &quot;as is&quot; and &quot;as available.&quot;
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  We make no guarantees regarding:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Accuracy of AI responses
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Uptime
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Compatibility
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Fitness for a particular purpose
                    </Typography>
                  </li>
                </Box>

                <Typography variant="h6" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                  B. Limitation of Liability
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  To the maximum extent permitted by law:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      We are not liable for indirect, incidental, or consequential damages
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Our total liability shall not exceed the amount paid to us in the last 12 months
                    </Typography>
                  </li>
                </Box>
              </Box>

              <Divider />

              {/* Section 19: Indemnification */}
              <Box id="section-19">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  19. Indemnification
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  You agree to defend and indemnify Algoqube Solutions Pvt Ltd against claims resulting from:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Your misuse of the Service
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Violation of these Terms
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Illegal or harmful content generated using your account
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Disputes arising between you and your customers or end-users
                    </Typography>
                  </li>
                </Box>
              </Box>

              <Divider />

              {/* Section 20: Governing Law and Jurisdiction */}
              <Box id="section-20">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  20. Governing Law and Jurisdiction
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  These Terms are governed by the laws of India.
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  Any disputes will be resolved exclusively in:
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', mt: 1, fontWeight: 500 }}>
                  Courts in Pune, Maharashtra, India.
                </Typography>
              </Box>

              <Divider />

              {/* Section 21: Changes to These Terms */}
              <Box id="section-21">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  21. Changes to These Terms
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  We may update these Terms at any time.
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Changes become effective upon posting
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      Continued use of QubeAI indicates acceptance of updated Terms
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                      We recommend reviewing this page regularly
                    </Typography>
                  </li>
                </Box>
              </Box>

              <Divider />

              {/* Section 22: Contact Information */}
              <Box id="section-22">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  22. Contact Information
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  For questions regarding these Terms, please contact:
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

export default TermsOfServicePage;

