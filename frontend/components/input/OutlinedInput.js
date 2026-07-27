import { OutlinedInput as OutlinedInputMui } from "@mui/material";
import { inputStyles, rootStyles } from "../../custom/textfield";

const isZeroValue = (value) => value === 0 || value === "0";

const OutlinedInput = ({ sx, inputProps, onFocus, onChange, value, clearZeroOnFocus = true, ...props }) => {
  const handleFocus = (e) => {
    const current = value !== undefined && value !== null ? value : e.target.value;
    if (clearZeroOnFocus && isZeroValue(current)) {
      if (typeof onChange === "function") {
        onChange({
          ...e,
          target: { ...e.target, value: "" },
        });
      }
      // Uncontrolled / type=number: clear DOM value immediately
      e.target.value = "";
    }
    onFocus?.(e);
  };

  return (
    <OutlinedInputMui
      {...props}
      value={value}
      onChange={onChange}
      onFocus={handleFocus}
      sx={{
        ...rootStyles,
        ...sx,
      }}
      inputProps={{
        ...inputProps,
        sx: {
          ...inputStyles,
          ...(inputProps?.sx || {}),
        },
      }}
    />
  );
};
export default OutlinedInput;
