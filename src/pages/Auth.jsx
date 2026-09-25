import {
  Alert,
  Box,
  Button,
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

  const handleLogin = (event) => {
    event.preventDefault();
    setMessage("");

    const result = login(loginForm.email, loginForm.password);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    redirectUser(result.user);
  };

  const handleRegister = (event) => {
    event.preventDefault();
    setMessage("");

    if (!registerForm.fullName || !registerForm.email || !registerForm.password) {
      setMessage("Please complete the required fields.");
      return;
    }

    if (registerForm.password.length < 6) {
      setMessage("Password must contain at least 6 characters.");
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const result = register(registerForm);
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
              <Tabs value={tab} onChange={(_, value) => { setTab(value); setMessage(""); }} sx={{ mb: 3 }}>
                <Tab label="Login" />
                <Tab label="Register" />
              </Tabs>

              {message && <Alert severity="error" sx={{ mb: 2 }}>{message}</Alert>}

              {tab === 0 ? (
                <Box component="form" onSubmit={handleLogin}>
                  <Stack spacing={2.5}>
                    <TextField
                      label="Email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      fullWidth
                    />
                    <TextField
                      label="Password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      fullWidth
                    />
                    <Button type="submit" variant="contained" size="large">
                      Login
                    </Button>

                    <Alert severity="info">
                      Demo customer: customer@delish.com / Customer123!
                      <br />
                      Demo admin: admin@delish.com / Admin123!
                    </Alert>
                  </Stack>
                </Box>
              ) : (
                <Box component="form" onSubmit={handleRegister}>
                  <Stack spacing={2}>
                    <TextField
                      label="Full Name"
                      value={registerForm.fullName}
                      onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                      fullWidth
                    />
                    <TextField
                      label="Email"
                      type="email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      fullWidth
                    />
                    <TextField
                      label="Phone Number"
                      value={registerForm.phone}
                      onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                      fullWidth
                    />
                    <TextField
                      label="Password"
                      type="password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      fullWidth
                    />
                    <TextField
                      label="Confirm Password"
                      type="password"
                      value={registerForm.confirmPassword}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, confirmPassword: e.target.value })
                      }
                      fullWidth
                    />
                    <Button type="submit" variant="contained" size="large">
                      Create Account
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
