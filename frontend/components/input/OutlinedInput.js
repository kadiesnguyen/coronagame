import { OutlinedInput as OutlinedInputMui } from "@mui/material";
import { inputStyles, rootStyles } from "../../custom/textfield";

const OutlinedInput = (props) => {
  return (
    <OutlinedInputMui
      {...props}
      sx={{
        ...rootStyles,
      }}
      inputProps={{
        sx: {
          ...inputStyles,
        },
      }}
    />
  );
};
export default OutlinedInput;
