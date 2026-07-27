import { resolveMediaUrl } from "@/utils/branding";
import { Box, Typography } from "@mui/material";
import Link from "next/link";

const Item = ({ item }) => {
  const coverUrl = resolveMediaUrl(item.hinhAnh);
  return (
    <>
      <Link href={`/notifications/${item._id}`}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "7px",
            justifyContent: "center",
            cursor: "pointer",
            overflow: "hidden",
            alignItems: "center",

            color: (theme) => theme.palette.text.secondary,
            boxShadow: "0 0 5px 0 #d5c0c0",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "20rem",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundImage: coverUrl ? `url(${coverUrl})` : "none",
            }}
          ></Box>
          <Box
            sx={{
              padding: "10px",
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
              }}
            >
              {item.tieuDe}
            </Typography>
          </Box>
        </Box>
      </Link>
    </>
  );
};
export default Item;
