import OutlinedInput from "@/components/input/OutlinedInput";
import { Box, FormControl, Typography } from "@mui/material";
import { useDebounceCallback } from "usehooks-ts";

const BoxSearch = ({ searchValue, setSearchValue }) => {
  const handleChangeSearchValue = useDebounceCallback(setSearchValue, 500);

  return (
    <Box
      sx={{
        color: "text.secondary",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        maxWidth: "40rem",
        width: "100%",
        marginBottom: "16px",
      }}
    >
      <FormControl fullWidth>
        <Typography sx={{ marginBottom: "4px", color: "#b8c0d4" }}>Tìm theo phiên</Typography>
        <OutlinedInput
          placeholder="Nhập số phiên"
          size="small"
          type="number"
          defaultValue={searchValue}
          onChange={(e) => handleChangeSearchValue(e.target.value)}
          onWheel={(e) => e.target.blur()}
        />
      </FormControl>
    </Box>
  );
};
export default BoxSearch;
