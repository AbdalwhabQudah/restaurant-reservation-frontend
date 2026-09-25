import {
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

export default function MenuCard({ item }) {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardMedia component="img" height="190" image={item.image} alt={item.name} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Typography variant="h6">{item.name}</Typography>
          <Typography fontWeight={800}>{Number(item.price).toFixed(2)} JOD</Typography>
        </Stack>
        <Chip label={item.category} size="small" sx={{ my: 1 }} />
        <Typography variant="body2" color="text.secondary">
          {item.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
