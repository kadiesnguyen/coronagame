import { setDisplayBalance } from "@/redux/actions/balance";
import { convertJSXMoney } from "@/utils/convertMoney";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
const AccountBalance = () => {
  const dispatch = useDispatch();
  const { display: isDisplayBalance, balance } = useSelector((state) => state.balance);
  const handleDisplayBalance = (status) => {
    dispatch(setDisplayBalance(status));
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          color: "#fff",
          "& svg": { color: "#e5c05b", cursor: "pointer" },
        }}
      >
        <Typography component={"div"} sx={{ color: "#fff", fontWeight: 600 }}>
          Số dư: {isDisplayBalance ? convertJSXMoney(balance) : "******"}
        </Typography>
        {!isDisplayBalance && <VisibilityIcon onClick={() => handleDisplayBalance(!isDisplayBalance)} />}
        {isDisplayBalance && <VisibilityOffIcon onClick={() => handleDisplayBalance(!isDisplayBalance)} />}
      </Box>
    </>
  );
};
export default AccountBalance;
