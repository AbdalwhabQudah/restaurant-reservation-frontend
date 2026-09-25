import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MenuCard from "../components/MenuCard";
import { useRestaurant } from "../context/RestaurantContext";

const categories = ["All", "Starters", "Main Dishes", "Desserts", "Drinks"];

export default function MenuPage() {
  const { menuItems } = useRestaurant();
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    if (category === "All") return menuItems;
    return menuItems.filter((item) => item.category === category);
  }, [category, menuItems]);

  return (
    <>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 6, minHeight: "70vh" }}>
        <Typography variant="h3" textAlign="center">
          Our Menu
        </Typography>
        <Typography textAlign="center" color="text.secondary" sx={{ mt: 1 }}>
          Explore our delicious dishes.
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          flexWrap="wrap"
          useFlexGap
          sx={{ my: 4 }}
        >
          {categories.map((item) => (
            <Button
              key={item}
              variant={category === item ? "contained" : "outlined"}
              onClick={() => setCategory(item)}
            >
              {item}
            </Button>
          ))}
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
            gap: 3,
          }}
        >
          {filtered.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </Box>
      </Container>

      <Footer />
    </>
  );
}
