import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
  const [tab, setTab] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectUser = (loggedUser) => {
    if (loggedUser.role === "admin") {
      navigate("/admin-dashboard", { replace: true });
    } else {
      navigate(location.state?.from || "/customer-dashboard", { replace: true });
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage("");
    setSubmitting(true);

    const result = await login(loginForm.email, loginForm.password);

    setSubmitting(false);

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    redirectUser(result.user);
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setMessage("");

    if (
      !registerForm.fullName ||
      !registerForm.email ||
      !registerForm.phone ||
      !registerForm.password
    ) {
      setMessage("Please complete the required fields.");
      return;
    }

    if (registerForm.password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    const result = await register(registerForm);

    setSubmitting(false);

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    redirectUser(result.user);
  };

  return (
    <>
      <Navbar />

      <Container maxWidth="md" sx={{ py: 6, minHeight: "72vh" }}>
        <Paper variant="outlined" sx={{ overflow: "hidden" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
            }}
          >
            <Box sx={{ p: { xs: 3, md: 5 } }}>
              <Tabs
                value={tab}
                onChange={(_, value) => {
                  setTab(value);
                  setMessage("");
                }}
                sx={{ mb: 3 }}
              >
                <Tab label="Login" />
                <Tab label="Register" />
              </Tabs>

              {message && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {message}
                </Alert>
              )}

              {tab === 0 ? (
                <Box component="form" onSubmit={handleLogin}>
                  <Stack spacing={2.5}>
                    <TextField
                      label="Email"
                      type="email"
                      required
                      value={loginForm.email}
                      onChange={(event) =>
                        setLoginForm({ ...loginForm, email: event.target.value })
                      }
                      fullWidth
                    />

                    <TextField
                      label="Password"
                      type="password"
                      required
                      value={loginForm.password}
                      onChange={(event) =>
                        setLoginForm({ ...loginForm, password: event.target.value })
                      }
                      fullWidth
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={submitting}
                    >
                      {submitting ? <CircularProgress size={24} /> : "Login"}
                    </Button>

                    <Alert severity="info">
                      Test customer: testcustomer@delish.com / Password123!
                      <br />
                      Test admin: testadmin@delish.com / Admin123!
                    </Alert>
                  </Stack>
                </Box>
              ) : (
                <Box component="form" onSubmit={handleRegister}>
                  <Stack spacing={2}>
                    <TextField
                      label="Full Name"
                      required
                      value={registerForm.fullName}
                      onChange={(event) =>
                        setRegisterForm({
                          ...registerForm,
                          fullName: event.target.value,
                        })
                      }
                      fullWidth
                    />

                    <TextField
                      label="Email"
                      type="email"
                      required
                      value={registerForm.email}
                      onChange={(event) =>
                        setRegisterForm({ ...registerForm, email: event.target.value })
                      }
                      fullWidth
                    />

                    <TextField
                      label="Phone Number"
                      required
                      value={registerForm.phone}
                      onChange={(event) =>
                        setRegisterForm({ ...registerForm, phone: event.target.value })
                      }
                      fullWidth
                    />

                    <TextField
                      label="Password"
                      type="password"
                      required
                      value={registerForm.password}
                      onChange={(event) =>
                        setRegisterForm({
                          ...registerForm,
                          password: event.target.value,
                        })
                      }
                      fullWidth
                    />

                    <TextField
                      label="Confirm Password"
                      type="password"
                      required
                      value={registerForm.confirmPassword}
                      onChange={(event) =>
                        setRegisterForm({
                          ...registerForm,
                          confirmPassword: event.target.value,
                        })
                      }
                      fullWidth
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={submitting}
                    >
                      {submitting ? <CircularProgress size={24} /> : "Create Account"}
                    </Button>
                  </Stack>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                bgcolor: "#eeeeee",
                minHeight: 430,
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                textAlign: "center",
                p: 4,
              }}
            >
              <RestaurantIcon sx={{ fontSize: 100, color: "text.secondary" }} />
              <Typography variant="h5" sx={{ mt: 2 }}>
                Delish Restaurant
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Manage your reservations quickly and easily.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>

      <Footer />
    </>
  );
}
