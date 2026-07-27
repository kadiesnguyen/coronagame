import { Box, Typography } from "@mui/material";

const AdminSection = ({ title, subtitle, children, sx = {} }) => {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#162948",
        border: "1px solid rgba(212,175,55,.25)",
        borderRadius: "16px",
        padding: { xs: "16px", md: "24px" },
        boxShadow: "0 8px 24px rgba(0,0,0,.25)",
        ...sx,
      }}
    >
      {title ? (
        <Typography
          sx={{
            fontSize: "1.8rem",
            fontWeight: 700,
            color: "#e5c05b",
            marginBottom: subtitle ? "4px" : "16px",
          }}
        >
          {title}
        </Typography>
      ) : null}
      {subtitle ? (
        <Typography sx={{ fontSize: "1.3rem", color: "#b8c0d4", marginBottom: "16px" }}>{subtitle}</Typography>
      ) : null}
      {children}
    </Box>
  );
};

export default AdminSection;
