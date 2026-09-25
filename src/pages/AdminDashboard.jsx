import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventNoteIcon from "@mui/icons-material/EventNote";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useRestaurant } from "../context/RestaurantContext";

const navItems = [
  { key: "overview", label: "Overview", icon: <DashboardIcon /> },
  { key: "reservations", label: "Reservations", icon: <EventNoteIcon /> },
  { key: "menu", label: "Menu Management", icon: <RestaurantMenuIcon /> },
  { key: "tables", label: "Table Management", icon: <TableRestaurantIcon /> },
  { key: "customers", label: "Customers", icon: <PeopleIcon /> },
];

const emptyMenuForm = {
  name: "",
  category: "Main Dishes",
  price: "",
  description: "",
  image: "",
};

const emptyTableForm = {
  tableNumber: "",
  capacity: 2,
  location: "Indoor",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { users, logout } = useAuth();
  const {
    reservations,
    menuItems,
    tables,
    updateReservation,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addTable,
    updateTable,
    deleteTable,
  } = useRestaurant();

  const [section, setSection] = useState("overview");
  const [menuDialog, setMenuDialog] = useState(null);
  const [tableDialog, setTableDialog] = useState(null);

  const customers = users.filter((item) => item.role === "customer");
  const pendingCount = reservations.filter((item) => item.status === "Pending").length;
  const today = new Date().toISOString().split("T")[0];
  const todayCount = reservations.filter((item) => item.date === today).length;

  const recentReservations = useMemo(
    () =>
      [...reservations]
        .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`))
        .slice(0, 6),
    [reservations]
  );

  const tableNumber = (id) =>
    tables.find((item) => item.id === id)?.tableNumber ?? "-";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const openNewMenu = () => setMenuDialog({ mode: "add", data: { ...emptyMenuForm } });
  const openEditMenu = (item) => setMenuDialog({ mode: "edit", data: { ...item } });

  const saveMenu = () => {
    if (!menuDialog?.data.name || !menuDialog?.data.price) return;

    const data = {
      ...menuDialog.data,
      price: Number(menuDialog.data.price),
      image:
        menuDialog.data.image ||
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80",
    };

    if (menuDialog.mode === "add") addMenuItem(data);
    else updateMenuItem(data.id, data);

    setMenuDialog(null);
  };

  const openNewTable = () => setTableDialog({ mode: "add", data: { ...emptyTableForm } });
  const openEditTable = (item) => setTableDialog({ mode: "edit", data: { ...item } });

  const saveTable = () => {
    if (!tableDialog?.data.tableNumber) return;

    const data = {
      ...tableDialog.data,
      tableNumber: Number(tableDialog.data.tableNumber),
      capacity: Number(tableDialog.data.capacity),
    };

    if (tableDialog.mode === "add") addTable(data);
    else updateTable(data.id, data);

    setTableDialog(null);
  };

  return (
    <>
      <Navbar />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "230px 1fr" },
            gap: 3,
          }}
        >
          <Paper variant="outlined" sx={{ p: 1.5, height: "fit-content" }}>
            <Typography variant="h6" sx={{ px: 1, py: 1 }}>
              Admin Dashboard
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <Stack spacing={0.5}>
              {navItems.map((item) => (
                <Button
                  key={item.key}
                  startIcon={item.icon}
                  variant={section === item.key ? "contained" : "text"}
                  onClick={() => setSection(item.key)}
                  sx={{ justifyContent: "flex-start" }}
                >
                  {item.label}
                </Button>
              ))}
              <Divider sx={{ my: 1 }} />
              <Button
                startIcon={<LogoutIcon />}
                color="error"
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
                <Typography variant="h4" sx={{ mb: 3 }}>
                  Overview
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "repeat(2, 1fr)",
                      lg: "repeat(4, 1fr)",
                    },
                    gap: 2,
                    mb: 4,
                  }}
                >
                  {[
                    ["Today's Bookings", todayCount],
                    ["Pending Bookings", pendingCount],
                    ["Customers", customers.length],
                    ["Tables", tables.length],
                  ].map(([label, value]) => (
                    <Card variant="outlined" key={label}>
                      <CardContent>
                        <Typography color="text.secondary">{label}</Typography>
                        <Typography variant="h3" sx={{ mt: 1 }}>
                          {value}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>

                <Typography variant="h6" sx={{ mb: 1.5 }}>
                  Recent Reservations
                </Typography>
                <ReservationTable
                  reservations={recentReservations}
                  tables={tables}
                  updateReservation={updateReservation}
                />
              </>
            )}

            {section === "reservations" && (
              <>
                <Typography variant="h4" sx={{ mb: 3 }}>
                  Reservation Management
                </Typography>
                <ReservationTable
                  reservations={reservations}
                  tables={tables}
                  updateReservation={updateReservation}
                />
              </>
            )}

            {section === "menu" && (
              <>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ sm: "center" }}
                  spacing={2}
                  sx={{ mb: 3 }}
                >
                  <Typography variant="h4">Menu Management</Typography>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={openNewMenu}>
                    Add Item
                  </Button>
                </Stack>

                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {menuItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Typography fontWeight={700}>{item.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.description}
                            </Typography>
                          </TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{Number(item.price).toFixed(2)} JOD</TableCell>
                          <TableCell align="right">
                            <Button onClick={() => openEditMenu(item)}>Edit</Button>
                            <Button color="error" onClick={() => deleteMenuItem(item.id)}>
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}

            {section === "tables" && (
              <>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ sm: "center" }}
                  spacing={2}
                  sx={{ mb: 3 }}
                >
                  <Typography variant="h4">Table Management</Typography>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={openNewTable}>
                    Add Table
                  </Button>
                </Stack>

                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Table Number</TableCell>
                        <TableCell>Capacity</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tables.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>Table {item.tableNumber}</TableCell>
                          <TableCell>{item.capacity}</TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell align="right">
                            <Button onClick={() => openEditTable(item)}>Edit</Button>
                            <Button color="error" onClick={() => deleteTable(item.id)}>
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}

            {section === "customers" && (
              <>
                <Typography variant="h4" sx={{ mb: 3 }}>
                  Customers
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Reservations</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {customers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell>{customer.fullName}</TableCell>
                          <TableCell>{customer.email}</TableCell>
                          <TableCell>{customer.phone || "-"}</TableCell>
                          <TableCell>
                            {
                              reservations.filter((item) => item.userId === customer.id)
                                .length
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Box>
        </Box>
      </Container>

      <Dialog
        open={Boolean(menuDialog)}
        onClose={() => setMenuDialog(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {menuDialog?.mode === "add" ? "Add Menu Item" : "Edit Menu Item"}
        </DialogTitle>
        {menuDialog && (
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Name"
                value={menuDialog.data.name}
                onChange={(e) =>
                  setMenuDialog({
                    ...menuDialog,
                    data: { ...menuDialog.data, name: e.target.value },
                  })
                }
              />
              <TextField
                label="Category"
                select
                value={menuDialog.data.category}
                onChange={(e) =>
                  setMenuDialog({
                    ...menuDialog,
                    data: { ...menuDialog.data, category: e.target.value },
                  })
                }
              >
                {["Starters", "Main Dishes", "Desserts", "Drinks"].map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Price (JOD)"
                type="number"
                value={menuDialog.data.price}
                onChange={(e) =>
                  setMenuDialog({
                    ...menuDialog,
                    data: { ...menuDialog.data, price: e.target.value },
                  })
                }
              />
              <TextField
                label="Description"
                multiline
                minRows={2}
                value={menuDialog.data.description}
                onChange={(e) =>
                  setMenuDialog({
                    ...menuDialog,
                    data: { ...menuDialog.data, description: e.target.value },
                  })
                }
              />
              <TextField
                label="Image URL"
                value={menuDialog.data.image}
                onChange={(e) =>
                  setMenuDialog({
                    ...menuDialog,
                    data: { ...menuDialog.data, image: e.target.value },
                  })
                }
              />
            </Stack>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={() => setMenuDialog(null)}>Cancel</Button>
          <Button variant="contained" onClick={saveMenu}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(tableDialog)}
        onClose={() => setTableDialog(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {tableDialog?.mode === "add" ? "Add Table" : "Edit Table"}
        </DialogTitle>
        {tableDialog && (
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Table Number"
                type="number"
                value={tableDialog.data.tableNumber}
                onChange={(e) =>
                  setTableDialog({
                    ...tableDialog,
                    data: { ...tableDialog.data, tableNumber: e.target.value },
                  })
                }
              />
              <TextField
                label="Capacity"
                select
                value={tableDialog.data.capacity}
                onChange={(e) =>
                  setTableDialog({
                    ...tableDialog,
                    data: { ...tableDialog.data, capacity: e.target.value },
                  })
                }
              >
                {[2, 4, 6, 8].map((number) => (
                  <MenuItem key={number} value={number}>
                    {number}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Location"
                select
                value={tableDialog.data.location}
                onChange={(e) =>
                  setTableDialog({
                    ...tableDialog,
                    data: { ...tableDialog.data, location: e.target.value },
                  })
                }
              >
                <MenuItem value="Indoor">Indoor</MenuItem>
                <MenuItem value="Outdoor">Outdoor</MenuItem>
              </TextField>
            </Stack>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={() => setTableDialog(null)}>Cancel</Button>
          <Button variant="contained" onClick={saveTable}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </>
  );
}

function ReservationTable({ reservations, tables, updateReservation }) {
  const tableNumber = (id) =>
    tables.find((item) => item.id === id)?.tableNumber ?? "-";

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Customer</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Guests</TableCell>
            <TableCell>Table</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reservations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>
                <Alert severity="info">No reservations found.</Alert>
              </TableCell>
            </TableRow>
          ) : (
            reservations.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.customerName}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.time}</TableCell>
                <TableCell>{item.guests}</TableCell>
                <TableCell>Table {tableNumber(item.tableId)}</TableCell>
                <TableCell sx={{ minWidth: 150 }}>
                  <TextField
                    select
                    size="small"
                    value={item.status}
                    onChange={(e) =>
                      updateReservation(item.id, { status: e.target.value })
                    }
                    fullWidth
                  >
                    {["Pending", "Confirmed", "Completed", "Cancelled", "Rejected"].map(
                      (status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      )
                    )}
                  </TextField>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
