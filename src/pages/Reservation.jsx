import {
  Alert,
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useRestaurant } from "../context/RestaurantContext";

const times = ["17:00", "18:00", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];

export default function Reservation() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { findAvailableTable, addReservation } = useRestaurant();

  const [form, setForm] = useState({
    date: "",
    time: "",
    guests: 2,
    specialRequest: "",
  });
  const [availableTable, setAvailableTable] = useState(null);
  const [message, setMessage] = useState("");

  const minDate = new Date().toISOString().split("T")[0];

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setAvailableTable(null);
    setMessage("");
  };

  const checkAvailability = () => {
    if (!form.date || !form.time || !form.guests) {
      setMessage("Please select a date, time and number of guests.");
      return;
    }

    const table = findAvailableTable(form.date, form.time, form.guests);
    setAvailableTable(table);
    setMessage(table ? "A table is available." : "No suitable table is available for this time.");
  };

  const confirmBooking = () => {
    if (!availableTable) {
      setMessage("Check availability before confirming your booking.");
      return;
    }

    if (!user) {
      navigate("/auth", { state: { from: "/reservation" } });
      return;
    }

    if (user.role !== "customer") {
      setMessage("Reservations are created using a customer account.");
      return;
    }

    addReservation({
      userId: user.id,
      customerName: user.fullName,
      date: form.date,
      time: form.time,
      guests: Number(form.guests),
      tableId: availableTable.id,
      specialRequest: form.specialRequest.trim(),
    });

    navigate("/customer-dashboard");
  };

  return (
    <>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 6, minHeight: "72vh" }}>
        <Typography variant="h3" textAlign="center">
          Reserve a Table
        </Typography>
        <Typography textAlign="center" color="text.secondary" sx={{ mt: 1, mb: 4 }}>
          Choose a suitable date and time.
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 0.85fr" },
            gap: 3,
          }}
        >
          <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 4 } }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Reservation Details
            </Typography>

            <Stack spacing={2.5}>
              <TextField
                label="Date"
                name="date"
                type="date"
                value={form.date}
                onChange={updateField}
                slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: minDate } }}
                fullWidth
              />

              <TextField
                label="Time"
                name="time"
                select
                value={form.time}
                onChange={updateField}
                fullWidth
              >
                {times.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Number of Guests"
                name="guests"
                select
                value={form.guests}
                onChange={updateField}
                fullWidth
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                  <MenuItem key={number} value={number}>
                    {number} {number === 1 ? "Guest" : "Guests"}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Special Request (Optional)"
                name="specialRequest"
                value={form.specialRequest}
                onChange={updateField}
                minRows={3}
                multiline
                fullWidth
              />

              <Button variant="contained" size="large" onClick={checkAvailability}>
                Check Availability
              </Button>

              {message && (
                <Alert severity={availableTable ? "success" : "info"}>{message}</Alert>
              )}
            </Stack>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2.5, md: 4 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              minHeight: 380,
            }}
          >
            <TableRestaurantIcon sx={{ fontSize: 90, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5">
              {availableTable ? `Table ${availableTable.tableNumber}` : "Available Table"}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {availableTable
                ? `Capacity: ${availableTable.capacity} guests • ${availableTable.location}`
                : "Check availability to find a suitable table."}
            </Typography>

            <Button
              variant="contained"
              size="large"
              disabled={!availableTable}
              onClick={confirmBooking}
              sx={{ mt: 4, width: "100%" }}
            >
              Confirm Booking
            </Button>
          </Paper>
        </Box>
      </Container>

      <Footer />
    </>
  );
}
