import { Box, Container, Stack, Typography } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";

export default function Footer() {
  return (
    <Box sx={{ bgcolor: "#1f1f1f", color: "white", mt: 6, py: 2.5 }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
        >
          <Typography variant="body2">
            © 2026 Delish Restaurant. All rights reserved.
          </Typography>

          <Stack direction="row" spacing={1.5}>
            <FacebookIcon fontSize="small" />
            <InstagramIcon fontSize="small" />
            <XIcon fontSize="small" />
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
