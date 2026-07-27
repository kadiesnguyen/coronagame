import { InputBase } from "@mui/material";

import { styled } from "@mui/material/styles";
export const rootStyles = {
  backgroundColor: "background.default",
  borderRadius: "1.5rem",
  "& .MuiInputBase-input": {
    borderRadius: "1.5rem",
    borderWidth: "1px ",
  },
  "& .Mui-focused": {
    backgroundColor: "red",
    borderRadius: "1.5rem",
  },
  "&:hover": {
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#1976d2",
      borderWidth: "1px ",
    },
  },
};
export const inputStyles = {
  "& .MuiInputBase-input": {
    borderRadius: "1.5rem",
  },
  color: "text.secondary",
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
    border: "1px solid #62b4f6!important",
    borderRadius: "1.5rem",
  },
  "&:focus-within fieldset, &:focus-visible fieldset": {
    border: "1px solid #62b4f6!important",
  },
};

export const InputComponent = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.secondary,
  "label + &": {
    marginTop: "18px",
  },
  "&.Mui-error .MuiInputBase-input": {
    border: "1px solid #d84848",
  },
  "& .MuiInputBase-input": {
    position: "relative",
    padding: "1.5rem",
    borderRadius: "1.5rem",
    border: "1px solid #ced4da",
    backgroundColor: theme.palette.background.default,

    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:hover": {
      border: "1px solid #62b4f6!important",
      borderRadius: "1.5rem",
    },
    "&:focus": {
      border: "1px solid #62b4f6!important",
      borderRadius: "1.5rem",
    },
  },
}));
