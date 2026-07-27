import Avatar from "@/public/assets/images/avatar.png";
import { openCskh } from "@/utils/openCskh";
import AddCardOutlinedIcon from "@mui/icons-material/AddCardOutlined";
import PriceChangeOutlinedIcon from "@mui/icons-material/PriceChangeOutlined";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import Money from "./Money";

const TitleLeft = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.color.primary,
  height: "2.3rem",
  position: "absolute",
  top: "-12px",
  transform: "translate(-50%)",
  clipPath: "polygon(50% 0,100% 0,50% 50%,100% 100%,50% 100%,0 50%)",
  left: "calc(50% - 50px)",
  width: "1rem",
}));
const TitleCenter = styled(TitleLeft)(({ theme }) => ({
  clipPath: "polygon(7% 0,93% 0,100% 50%,93% 100%,7% 100%,0 50%)",
  width: "unset",
  fontSize: "1.5rem",
  left: "50%",
  textAlign: "center",
  padding: "0 10px",
}));
const TitleRight = styled(TitleLeft)(({ theme }) => ({
  clipPath: "polygon(50% 0,100% 0,50% 50%,100% 100%,50% 100%,0 50%)",

  left: "calc(50% + 50px)",
  transform: "translate(-50%) rotate(180deg)",

  textAlign: "center",
}));

const TransactionBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: "-3.5rem",
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  background: "linear-gradient(180deg, #e5c05b, #d4af37)",
  color: "#0b1528",
  padding: "1rem",
  borderRadius: "1rem",
  fontSize: "1.5rem",

  "& .item": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0 1.5rem",
    gap: "1rem",
    color: "#0b1528",
    "& svg": {
      color: "#0b1528",
    },
    "&:first-of-type": {
      borderRight: "1px solid rgba(11, 21, 40, 0.25)",
    },
    "& p": {
      textWrap: "nowrap",
      color: "#0b1528",
      fontWeight: 600,
    },
  },
}));

const SplitBorder = styled(Box)(({ theme }) => ({
  left: "50%",

  position: "absolute",
  textAlign: "center",
  top: 0,
  transform: "translate(-50%)",
  width: "100%",
  "& span": {
    borderTop: "1rem solid #162948",
    display: "inline-block",
    position: "relative",
    top: "1rem",
    width: "2.4rem",
  },
}));

const BorderTopStyle = styled(Box)(({ theme }) => ({
  left: "50%",

  position: "absolute",
  top: 0,
  textAlign: "center",
  transform: "translate(-50%)",
  width: "100%",
  "& span": {
    position: "absolute",
    top: 0,
    "&:first-of-type": {
      borderLeft: `3px solid ${theme.palette.color.primary}`,
      borderTop: `3px solid${theme.palette.color.primary}`,
      borderTopLeftRadius: "16px",
      height: "3rem",
      left: "0",
      width: "3rem",
      "&:after": {
        backgroundColor: theme.palette.color.primary,
        borderRadius: "50%",
        content: `""`,
        height: "0.5rem",
        left: "1rem",
        position: "absolute",
        top: "1rem",
        width: "0.5rem",
      },
    },
    "&:last-of-type": {
      borderRight: `3px solid ${theme.palette.color.primary}`,
      borderTop: `3px solid ${theme.palette.color.primary}`,
      borderTopRightRadius: "16px",
      height: "3rem",
      right: "0",
      width: "3rem",
      "&:after": {
        backgroundColor: theme.palette.color.primary,
        borderRadius: "50%",
        content: `""`,
        height: "0.5rem",
        right: "1rem",
        position: "absolute",
        top: "1rem",
        width: "0.5rem",
      },
    },
  },
}));
const AccountInfo = ({ user }) => {
  return (
    <>
      <Box
        sx={{
          borderRadius: "2rem",
          backgroundColor: "#162948",
          border: (theme) => `2px solid ${theme.palette.color.primary}`,
          position: "relative",
          height: "30rem",
          marginTop: "3rem",
          boxShadow: "0 8px 28px rgba(0,0,0,.35)",
        }}
      >
        <SplitBorder>
          <span></span>
        </SplitBorder>
        <BorderTopStyle>
          <span></span>
          <span></span>
        </BorderTopStyle>
        <TitleLeft />
        <TitleCenter>Tài khoản</TitleCenter>
        <TitleRight />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              paddingTop: "30px",
              color: "#fff",
            }}
          >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                "& img": {
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #d4af37",
                },
              }}
            >
              <Image
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #d4af37",
                }}
                src={Avatar}
                width={80}
                height={80}
                alt={user.taiKhoan}
              />
            </Box>
            <Typography sx={{ color: "#fff", mt: 1 }}>{user.taiKhoan}</Typography>
            <Typography
              sx={{
                fontSize: "3rem",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              <Money />
            </Typography>
          </Box>
        </Box>
        <TransactionBox>
          <Box
            className="item"
            sx={{ cursor: "pointer" }}
            onClick={() => openCskh()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") openCskh();
            }}
          >
            <AddCardOutlinedIcon />
            <Typography>Nạp tiền</Typography>
          </Box>
          <Link href="/withdraw">
            <Box
              sx={{
                cursor: "pointer",
              }}
              className="item"
            >
              <PriceChangeOutlinedIcon />
              <Typography>Rút tiền</Typography>
            </Box>
          </Link>
        </TransactionBox>
      </Box>
    </>
  );
};
export default AccountInfo;
