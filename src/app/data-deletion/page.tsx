"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  MenuItem,
  Alert,
  Divider,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon, Email as EmailIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";

const DataDeletionPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    userEmail: "",
    userId: "",
    recipientEmail: "nitin.singh@algoqube.com",
    customEmail: "",
    message: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const recipientOptions = [
    { value: "nitin.singh@algoqube.com", label: "nitin.singh@algoqube.com" },
    { value: "connect@algoqube.com", label: "connect@algoqube.com" },
    { value: "custom", label: "Custom Email" },
  ];

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const recipientEmail =
      formData.recipientEmail === "custom" ? formData.customEmail : formData.recipientEmail;

    if (!recipientEmail) {
      return;
    }

    const subject = encodeURIComponent("Data Deletion Request - QubeAI");
    const body = encodeURIComponent(
      `Dear QubeAI Support Team,

I am requesting the deletion of my personal data from your system.

User Information:
- Email: ${formData.userEmail || "Not provided"}
- User ID: ${formData.userId || "Not provided"}

${formData.message ? `Additional Information:\n${formData.message}\n\n` : ""}Please process this data deletion request in accordance with applicable data protection laws.

Thank you for your prompt attention to this matter.

Best regards`
    );

    const mailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
    setShowSuccess(true);
  };

  return (
    <PageContainer title="Data Deletion Request" description="Request deletion of your personal data">
      <Box
        sx={{
          minHeight: "100vh",
          background: "#ffffff",
          position: "relative",
          overflow: "hidden",
          fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
          py: 4,
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: "absolute",
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

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, maxWidth: "900px" }}>
          {/* Back Button */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
            sx={{
              mb: 3,
              textTransform: "none",
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "rgba(102, 126, 234, 0.08)",
              },
            }}
          >
            Back
          </Button>

          {/* Header */}
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Data Deletion Request
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
              Request deletion of your personal data
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              We respect your privacy rights and will process your request promptly
            </Typography>
          </Box>

          {/* Content */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Stack spacing={4}>
              {/* Information Section */}
              <Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Your Right to Data Deletion
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: "text.secondary", mb: 2 }}>
                  Under applicable data protection laws (including GDPR, DPDPA, and others), you have the
                  right to request deletion of your personal data. We will process your request within 30 days
                  of receipt.
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.8, color: "text.secondary" }}>
                  Please fill out the form below to submit your data deletion request. We will send you a
                  confirmation email and process your request as soon as possible.
                </Typography>
              </Box>

              <Divider />

              {/* Success Message */}
              {showSuccess && (
                <Alert severity="success" onClose={() => setShowSuccess(false)}>
                  Your email client should open with a pre-filled deletion request. If it doesn&apos;t open
                  automatically, please send an email to{" "}
                  {formData.recipientEmail === "custom"
                    ? formData.customEmail
                    : formData.recipientEmail}{" "}
                  with your deletion request.
                </Alert>
              )}

              {/* Form */}
              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    label="Your Email Address"
                    type="email"
                    fullWidth
                    required
                    value={formData.userEmail}
                    onChange={handleChange("userEmail")}
                    placeholder="your.email@example.com"
                    helperText="The email address associated with your account"
                  />

                  <TextField
                    label="User ID (Optional)"
                    fullWidth
                    value={formData.userId}
                    onChange={handleChange("userId")}
                    placeholder="Enter your user ID if you know it"
                    helperText="This helps us locate your account faster"
                  />

                  <TextField
                    select
                    label="Send Request To"
                    fullWidth
                    required
                    value={formData.recipientEmail}
                    onChange={handleChange("recipientEmail")}
                    helperText="Select the email address to send your deletion request"
                  >
                    {recipientOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  {formData.recipientEmail === "custom" && (
                    <TextField
                      label="Custom Email Address"
                      type="email"
                      fullWidth
                      required
                      value={formData.customEmail}
                      onChange={handleChange("customEmail")}
                      placeholder="custom@example.com"
                    />
                  )}

                  <TextField
                    label="Additional Information (Optional)"
                    multiline
                    rows={4}
                    fullWidth
                    value={formData.message}
                    onChange={handleChange("message")}
                    placeholder="Please provide any additional information that might help us process your request..."
                    helperText="Any additional details about your account or data you want deleted"
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<EmailIcon />}
                    fullWidth
                    sx={{
                      textTransform: "none",
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #5568d3 0%, #653a8f 100%)",
                      },
                    }}
                  >
                    Open Email Client to Send Request
                  </Button>
                </Stack>
              </Box>

              <Divider />

              {/* Additional Information */}
              <Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  What Happens Next?
                </Typography>
                <Box component="ol" sx={{ pl: 3, mb: 2 }}>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: "text.secondary", mb: 1 }}>
                      After you submit the form, your email client will open with a pre-filled deletion
                      request.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: "text.secondary", mb: 1 }}>
                      Review and send the email to complete your request.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: "text.secondary", mb: 1 }}>
                      You will receive a confirmation email within 24 hours acknowledging your request.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: "text.secondary" }}>
                      Your data will be deleted within 30 days, unless we need to retain certain
                      information for legal or regulatory purposes.
                    </Typography>
                  </li>
                </Box>
              </Box>

              <Divider />

              {/* Contact Information */}
              <Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Need Help?
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: "text.secondary", mb: 2 }}>
                  If you have questions about the data deletion process or need assistance, please contact
                  us:
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:connect@algoqube.com"
                      style={{ color: "#667eea", textDecoration: "none" }}
                    >
                      connect@algoqube.com
                    </a>
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    <strong>Phone:</strong> +91 959-501-2234
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Paper>

          {/* Footer Actions */}
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Button
              variant="outlined"
              onClick={() => router.push("/privacy")}
              sx={{
                textTransform: "none",
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                mr: 2,
              }}
            >
              View Privacy Policy
            </Button>
            <Button
              variant="outlined"
              onClick={() => router.push("/authentication/login")}
              sx={{
                textTransform: "none",
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

export default DataDeletionPage;

