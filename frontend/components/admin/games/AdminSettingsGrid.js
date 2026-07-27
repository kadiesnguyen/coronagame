import { Box } from "@mui/material";

const AdminSettingsGrid = ({ children }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
      gap: "20px",
      width: "100%",
      alignItems: "start",
    }}
  >
    {children}
  </Box>
);

export default AdminSettingsGrid;
