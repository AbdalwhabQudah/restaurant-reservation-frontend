import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ bgcolor: "white", color: "text.primary", borderBottom: "1px solid #ddd" }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 68, gap: 2 }}>
          <Stack
            component={RouterLink}
            to="/"
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ mr: "auto" }}
          >
            <RestaurantMenuIcon />
            <Box>
              <Typography variant="h6" lineHeight={1}>
                Delish
              </Typography>
              <Typography variant="caption" color="text.secondary">
                RESTAURANT
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={{ xs: 0, sm: 1 }}
            alignItems="center"
            sx={{
              overflowX: "auto",
              "& .MuiButton-root": { whiteSpace: "nowrap", minWidth: "auto" },
            }}
          >
            <Button component={RouterLink} to="/" color="inherit">
              Home
            </Button>
            <Button component={RouterLink} to="/menu" color="inherit">
              Menu
            </Button>
            <Button component={RouterLink} to="/reservation" color="inherit">
              Reservation
            </Button>

            {user ? (
              <>
                <Button
                  component={RouterLink}
                  to={
                    user.role === "admin"
                      ? "/admin-dashboard"
                      : "/customer-dashboard"
                  }
                  color="inherit"
                >
                  Dashboard
                </Button>
                <Button variant="contained" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button component={RouterLink} to="/auth" variant="contained">
                Login
              </Button>
            )}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
