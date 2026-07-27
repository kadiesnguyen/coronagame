import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
const Sidebar = (props) => {
  const theme = useTheme();

  const BoxMenuSideBar = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    backgroundColor: theme.palette.header.background.default,
    padding: "10px",
    justifyContent: "space-between",
    position: "fixed",
    zIndex: 1000,
    width: "100%",
    height: "70px",
    borderBottom: theme.palette.mode === "light" ? "1px solid #dcdee0" : "1px solid #4b4c4e",
  }));

  return (
    <>
      <BoxMenuSideBar></BoxMenuSideBar>
    </>
  );
};
export default Sidebar;
