import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useRestaurant } from "../context/RestaurantContext";

const statusColor = {
  Pending: "warning",
  Confirmed: "success",
  Completed: "default",
  Cancelled: "error",
  Rejected: "error",
};

const dashboardItems = [
  { key: "overview", label: "Overview", icon: <DashboardIcon /> },
  { key: "reservations", label: "My Reservations", icon: <EventNoteIcon /> },
  { key: "profile", label: "Profile", icon: <PersonIcon /> },
];

export default function CustomerDashboard() {
  const { user, logout, updateProfile } = useAuth();
  const { reservations, tables, updateReservation } = useRestaurant();
  const navigate = useNavigate();

  const [section, setSection] = useState("overview");
  const [editing, setEditing] = useState(null);
  const [profile, setProfile] = useState({
    fullName: user.fullName,
    phone: user.phone || "",
  });
  const [saved, setSaved] = useState(false);

  const myReservations = useMemo(
    () =>
      reservations
        .filter((item) => item.userId === user.id)
        .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`)),
    [reservations, user.id]
  );

  const activeReservations = myReservations.filter((item) =>
    ["Pending", "Confirmed"].includes(item.status)
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const tableLabel = (tableId) => {
    const table = tables.find((item) => item.id === tableId);
    return table ? `Table ${table.tableNumber}` : "-";
  };

  const cancelReservation = (id) => {
    updateReservation(id, { status: "Cancelled" });
  };

  const saveEdit = () => {
    if (!editing) return;
    updateReservation(editing.id, {
      date: editing.date,
      time: editing.time,
      guests: Number(editing.guests),
    });
    setEditing(null);
  };

  const saveProfile = () => {
    updateProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "220px 1fr" },
            gap: 3,
          }}
        >
          <Paper variant="outlined" sx={{ p: 1.5, height: "fit-content" }}>
            <Stack spacing={0.5}>
              {dashboardItems.map((item) => (
                <Button
                  key={item.key}
                  startIcon={item.icon}
                  onClick={() => setSection(item.key)}
                  variant={section === item.key ? "contained" : "text"}
                  sx={{ justifyContent: "flex-start" }}
                >
                  {item.label}
                </Button>
              ))}
              <Divider sx={{ my: 1 }} />
              <Button
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{ justifyContent: "flex-start" }}
              >
                Logout
              </Button>
            </Stack>
          </Paper>

          <Box>
            {section === "overview" && (
              <>
                <Typography variant="h4">Welcome, {user.fullName}!</Typography>
                <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                  Here is your reservation overview.
                </Typography>

                <Typography variant="h6" sx={{ mb: 1.5 }}>
                  Upcoming Reservations
                </Typography>

                <Stack spacing={2}>
                  {activeReservations.length === 0 && (
                    <Alert severity="info">You have no upcoming reservations.</Alert>
                  )}

                  {activeReservations.map((item) => (
                    <Paper key={item.id} variant="outlined" sx={{ p: 2.5 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          justifyContent: "space-between",
                          gap: 2,
                        }}
                      >
                        <Box>
                          <Typography fontWeight={800}>
                            {item.date} at {item.time}
                          </Typography>
                          <Typography color="text.secondary">
                            {item.guests} guests • {tableLabel(item.tableId)}
                          </Typography>
                          <Chip
                            label={item.status}
                            color={statusColor[item.status] || "default"}
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        </Box>

                        <Stack direction="row" spacing={1} alignItems="center">
                          <Button variant="outlined" onClick={() => setEditing({ ...item })}>
                            Edit
                          </Button>
                          <Button
                            color="error"
                            variant="outlined"
                            onClick={() => cancelReservation(item.id)}
                          >
                            Cancel
                          </Button>
                        </Stack>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              </>
            )}

            {section === "reservations" && (
              <>
                <Typography variant="h4" sx={{ mb: 3 }}>
                  My Reservations
                </Typography>

                <Stack spacing={2}>
                  {myReservations.length === 0 ? (
                    <Alert severity="info">No reservations found.</Alert>
                  ) : (
                    myReservations.map((item) => (
                      <Paper key={item.id} variant="outlined" sx={{ p: 2.5 }}>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          justifyContent="space-between"
                          spacing={2}
                        >
                          <Box>
                            <Typography fontWeight={800}>
                              {item.date} • {item.time}
                            </Typography>
                            <Typography color="text.secondary">
                              {item.guests} guests • {tableLabel(item.tableId)}
                            </Typography>
                          </Box>
                          <Chip
                            label={item.status}
                            color={statusColor[item.status] || "default"}
                          />
                        </Stack>
                      </Paper>
                    ))
                  )}
                </Stack>
              </>
            )}

            {section === "profile" && (
              <Paper variant="outlined" sx={{ p: 3, maxWidth: 650 }}>
                <Typography variant="h4" sx={{ mb: 3 }}>
                  Profile
                </Typography>
                {saved && <Alert severity="success" sx={{ mb: 2 }}>Profile updated.</Alert>}
                <Stack spacing={2}>
                  <TextField
                    label="Full Name"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  />
                  <TextField label="Email" value={user.email} disabled />
                  <TextField
                    label="Phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                  <Button variant="contained" onClick={saveProfile}>
                    Update Profile
                  </Button>
                </Stack>
              </Paper>
            )}
          </Box>
        </Box>
      </Container>

      <Dialog open={Boolean(editing)} onClose={() => setEditing(null)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Reservation</DialogTitle>
        {editing && (
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Date"
                type="date"
                value={editing.date}
                onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label="Time"
                value={editing.time}
                onChange={(e) => setEditing({ ...editing, time: e.target.value })}
              />
              <TextField
                label="Guests"
                select
                value={editing.guests}
                onChange={(e) => setEditing({ ...editing, guests: e.target.value })}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                  <MenuItem key={number} value={number}>
                    {number}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={() => setEditing(null)}>Cancel</Button>
          <Button variant="contained" onClick={saveEdit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </>
  );
}
