import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { AuthProvider } from "./context/AuthContext";
import { RestaurantProvider } from "./context/RestaurantContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import MenuPage from "./pages/Menu";
import Reservation from "./pages/Reservation";
import Auth from "./pages/Auth";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1f1f1f",
    },
    secondary: {
      main: "#757575",
    },
    background: {
      default: "#f7f7f7",
      paper: "#ffffff",
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: "Arial, Helvetica, sans-serif",
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: {
      textTransform: "none",
      fontWeight: 700,
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <RestaurantProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/reservation" element={<Reservation />} />
              <Route path="/auth" element={<Auth />} />

              <Route
                path="/customer-dashboard"
                element={
                  <ProtectedRoute role="customer">
                    <CustomerDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </RestaurantProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
