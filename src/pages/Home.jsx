import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import { Link as RouterLink } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MenuCard from "../components/MenuCard";
import { useRestaurant } from "../context/RestaurantContext";

export default function Home() {
  const { menuItems } = useRestaurant();
  const featured = menuItems.slice(0, 3);

  return (
    <>
      <Navbar />

      <Box sx={{ bgcolor: "white", py: { xs: 5, md: 8 } }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1.15fr" },
              gap: 5,
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h3" sx={{ mb: 2 }}>
                Welcome to Delish Restaurant
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                Fresh Food. Great Moments.
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
                Enjoy delicious meals in a cozy atmosphere with friendly service.
                Reserve your table online in just a few simple steps.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  component={RouterLink}
                  to="/reservation"
                  variant="contained"
                  size="large"
                >
                  Book a Table
                </Button>
                <Button
                  component={RouterLink}
                  to="/menu"
                  variant="outlined"
                  size="large"
                >
                  View Menu
                </Button>
              </Stack>
            </Box>

            <Box
              component="img"
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80"
              alt="Restaurant interior"
              sx={{
                width: "100%",
                height: { xs: 280, md: 420 },
                objectFit: "cover",
                borderRadius: 3,
              }}
            />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" textAlign="center">
          Featured Dishes
        </Typography>
        <Typography textAlign="center" color="text.secondary" sx={{ mt: 1, mb: 4 }}>
          A few customer favorites from our menu.
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
            gap: 3,
          }}
        >
          {featured.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </Box>
      </Container>

      <Box sx={{ bgcolor: "white", py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" textAlign="center" sx={{ mb: 4 }}>
            Visit Us
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 3,
            }}
          >
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Stack spacing={1}>
                <LocationOnIcon />
                <Typography variant="h6">Location</Typography>
                <Typography color="text.secondary">
                  123 Main Street, Amman, Jordan
                </Typography>
              </Stack>
            </Paper>

            <Paper variant="outlined" sx={{ p: 3 }}>
              <Stack spacing={1}>
                <AccessTimeIcon />
                <Typography variant="h6">Opening Hours</Typography>
                <Typography color="text.secondary">
                  Sun–Thu: 10:00 AM – 11:00 PM
                </Typography>
                <Typography color="text.secondary">
                  Fri–Sat: 10:00 AM – 12:00 AM
                </Typography>
              </Stack>
            </Paper>

            <Paper variant="outlined" sx={{ p: 3 }}>
              <Stack spacing={1}>
                <PhoneIcon />
                <Typography variant="h6">Contact</Typography>
                <Typography color="text.secondary">+962 79 123 4567</Typography>
                <Typography color="text.secondary">info@delish.com</Typography>
              </Stack>
            </Paper>
          </Box>
        </Container>
      </Box>

      <Footer />
    </>
  );
}
