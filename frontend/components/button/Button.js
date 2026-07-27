import { Button as ButtonMui } from "@mui/material";

const Button = (props) => {
  return (
    <ButtonMui
      sx={{
        background: "linear-gradient(180deg, #e5c05b, #d4af37)",
        color: "#0b1528",
        textTransform: "none",
        fontSize: "2rem",
        fontWeight: 700,
        borderRadius: "12px",
        minHeight: "46px",

        "&:hover": {
          background: "linear-gradient(180deg, #e5c05b, #d4af37)",
          opacity: 0.9,
        },
        "&.Mui-disabled": {
          color: "rgba(11,21,40,.55)",
        },
      }}
      {...props}
    />
  );
};
export default Button;
