import { InputBase, MenuItem } from "@mui/material";

import { styled } from "@mui/material/styles";
export const OptionMenu = styled(InputBase)(({ theme }) => ({
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
export const OptionMenuItem = styled(MenuItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));
