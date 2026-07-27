import { Typography } from "@mui/material";

const ErrorMessageLabel = ({ children }) => {
  return (
    <Typography
      sx={{
        fontWeight: "400",
        fontSize: "1.7rem",
        textAlign: "center",
        lineHeight: 1.66,

        color: "#f44336",
      }}
    >
      {children}
    </Typography>
  );
};
export default ErrorMessageLabel;
