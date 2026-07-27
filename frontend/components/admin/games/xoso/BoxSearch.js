import OutlinedInput from "@/components/input/OutlinedInput";
import { Box, FormControl, Typography } from "@mui/material";
import { useDebounceCallback } from "usehooks-ts";

const BoxSearch = ({ searchValue, setSearchValue }) => {
  const handleChangeSearchValue = useDebounceCallback(setSearchValue, 500);

  return (
    <>
      <Box
        sx={{
          color: "text.secondary",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "60rem",
          width: "100%",
          alignItems: "center",
          textAlign: "center",
          margin: "1rem auto",
        }}
      >
        <FormControl fullWidth>
          <Typography>Tìm kiếm</Typography>
          <OutlinedInput
            placeholder="Phiên"
            size="small"
            type="number"
            defaultValue={searchValue}
            onChange={(e) => handleChangeSearchValue(e.target.value)}
            onWheel={(e) => e.target.blur()}
          />
        </FormControl>
      </Box>
    </>
  );
};
export default BoxSearch;
