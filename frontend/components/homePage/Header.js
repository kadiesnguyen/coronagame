import { Box, Button } from "@mui/material";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import useGetBranding from "@/hooks/useGetBranding";
import { resolveMediaUrl } from "@/utils/branding";
import AccountBalance from "../user/AccountBalance";

const Header = () => {
  const { status } = useSession();
  const { data: branding } = useGetBranding();
  const logoSrc = resolveMediaUrl(branding.logoUrl);

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
                height: { xs: "36px", md: "44px" },
                maxWidth: { xs: "180px", md: "240px" },
              }}
            >
              <Image
                src={logoSrc}
                alt="Corona Casin"
                width={240}
                height={50}
                unoptimized
                style={{
                  width: "auto",
                  height: "100%",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
                priority
              />
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
                      background: "linear-gradient(124.32deg, #e5c05b 12.08%, #d4af37 85.02%)",
                      color: "#0b1528",
                    }}
                  >
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    className="btn-register"
                    sx={{
                      background: "linear-gradient(124.32deg, #3a86ff 12.08%, #5aa0ff 85.02%)",
                      color: "#fff",
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
