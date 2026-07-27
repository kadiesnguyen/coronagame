import { InputBase } from "@mui/material";

import { styled } from "@mui/material/styles";
export const rootStyles = {
  backgroundColor: "#162948",
  borderRadius: "1.5rem",
  color: "#fff",
  "& .MuiInputBase-input": {
    borderRadius: "1.5rem",
    borderWidth: "1px ",
    color: "#fff",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(212,175,55,.35)",
  },
  "& .Mui-focused": {
    backgroundColor: "#1a2f4d",
    borderRadius: "1.5rem",
  },
  "&:hover": {
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#d4af37",
      borderWidth: "1px ",
    },
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#e5c05b",
  },
};
export const inputStyles = {
  "& .MuiInputBase-input": {
    borderRadius: "1.5rem",
  },
  color: "#fff",
  paddingLeft: "15px",
  fontSize: "1.5rem",
  padding: "1.5rem",
  borderRadius: "1.5rem",
};

export const rootInputStyles = {
  "& .MuiInputBase-input": {
    borderRadius: "1.5rem",
  },
  "&:hover fieldset": {
    border: "1px solid #d4af37!important",
    borderRadius: "1.5rem",
  },
  "&:focus-within fieldset, &:focus-visible fieldset": {
    border: "1px solid #e5c05b!important",
  },
};

export const InputComponent = styled(InputBase)(({ theme }) => ({
  color: "#fff",
  "label + &": {
    marginTop: "18px",
  },
  "&.Mui-error .MuiInputBase-input": {
    border: "1px solid #e85d5d",
  },
  "& .MuiInputBase-input": {
    position: "relative",
    padding: "1.5rem",
    borderRadius: "1.5rem",
    border: "1px solid rgba(212,175,55,.35)",
    backgroundColor: "#162948",
    color: "#fff",

    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:hover": {
      border: "1px solid #d4af37!important",
      borderRadius: "1.5rem",
    },
    "&:focus": {
      border: "1px solid #e5c05b!important",
      borderRadius: "1.5rem",
    },
  },
}));
