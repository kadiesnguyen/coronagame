import OutlinedInput from "@/components/input/OutlinedInput";
import SearchIcon from "@mui/icons-material/Search";
import { Box, InputAdornment } from "@mui/material";
import { useDebounceCallback } from "usehooks-ts";

const BoxSearch = ({ searchValue, setSearchValue }) => {
  const handleChangeSearchValue = useDebounceCallback(setSearchValue, 500);

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        maxWidth: "48rem",
        marginBottom: "16px",
      }}
    >
      <OutlinedInput
        placeholder="Tìm tài khoản..."
        size="small"
        type="text"
        fullWidth
        defaultValue={searchValue}
        onChange={(e) => handleChangeSearchValue(e.target.value)}
        onWheel={(e) => e.target.blur()}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon sx={{ color: "#e5c05b", fontSize: 20 }} />
          </InputAdornment>
        }
        sx={{
          backgroundColor: "#101d33",
          borderRadius: "10px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(212,175,55,.3)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(212,175,55,.55)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#e5c05b",
          },
        }}
      />
    </Box>
  );
};

export default BoxSearch;
