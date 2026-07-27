import { Backdrop, Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { BsCheckSquare } from "react-icons/bs";
import { Bars } from "react-loading-icons";
const BoxLoading = styled(Box)({
  borderRadius: "20px",
  backgroundColor: "#162948",
  color: "#fff",
  border: "1px solid rgba(212,175,55,.35)",
  width: "200px",
  height: "200px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
});
const LoadingContent = styled(Typography)({
  fontWeight: "500",
  opacity: "0.85",
  color: "#b8c0d4",
});
const LoadingIconSuccess = styled(BsCheckSquare)({
  fontSize: "5rem",
  color: "#e5c05b",
});
const LoadingBox = ({ isSuccess, isLoading }) => {
  return (
    <>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 2,
          width: "100%",
          maxWidth: "540px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
        open={isLoading}
      >
        <BoxLoading>
          {!isSuccess && (
            <>
              <Bars fill="#d4af37" width={50} height={50} speed={0.75} />
              <LoadingContent>Loading...</LoadingContent>
            </>
          )}
          {isSuccess && (
            <>
              <LoadingIconSuccess />
              <LoadingContent>Success</LoadingContent>
            </>
          )}
        </BoxLoading>
      </Backdrop>
    </>
  );
};
export default LoadingBox;
