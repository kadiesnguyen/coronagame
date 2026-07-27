import { Box, Button, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import AccountBalance from "../user/AccountBalance";

const Header = () => {
  const { data: session, status } = useSession();

  return (
    <>
      <div className="header">
        <div className="header-top">
          <Link href="/">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              <Typography
                className="logo"
                sx={{
                  color: "#ffffff",
                  fontSize: "3rem",
                  fontWeight: "bold",
                  fontStyle: "italic",
                }}
              >
                Megalott
              </Typography>
            </Box>
          </Link>
          <Box
            className="header-right"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {status === "unauthenticated" && (
              <>
                <Link href="/login">
                  <Button
                    className="btn-login"
                    sx={{
                      background: "linear-gradient(124.32deg, #ffce1f 12.08%, #ccd26d 85.02%)",
                    }}
                  >
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    className="btn-register"
                    sx={{
                      background: "linear-gradient(124.32deg, #50a1f2 12.08%, #85daff 85.02%)",
                    }}
                  >
                    Đăng ký
                  </Button>
                </Link>
              </>
            )}
            {status === "authenticated" && <AccountBalance />}
          </Box>
        </div>
      </div>
    </>
  );
};
export default Header;
