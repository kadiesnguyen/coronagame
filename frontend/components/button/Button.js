import { Button as ButtonMui } from "@mui/material";

const Button = (props) => {
  return (
    <ButtonMui
      sx={{
        backgroundColor: "#0a8080",
        color: "#fff",
        textTransform: "none",
        fontSize: "2rem",

        "&:hover": {
          backgroundColor: "#0a8080",
          opacity: 0.8,
        },
      }}
      {...props}
    />
  );
};
export default Button;
