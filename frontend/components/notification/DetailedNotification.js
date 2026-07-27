import useGetDetailedNotification from "@/hooks/useGetDetailedNotification";
import { resolveMediaUrl } from "@/utils/branding";
import { convertDateTime } from "@/utils/convertTime";
import { Box, Typography } from "@mui/material";
import { Bars } from "react-loading-icons";
const DetailedNotification = ({ id }) => {
  const { data, isLoading } = useGetDetailedNotification({ id });
  const coverUrl = resolveMediaUrl(data?.hinhAnh);

  return (
    <>
      {isLoading && (
        <Box
          sx={{
            textAlign: "center",
          }}
        >
          <Bars fill="red" width={50} height={50} speed={0.75} />
        </Box>
      )}
      {data && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "7px",
            justifyContent: "center",

            overflow: "hidden",
            alignItems: "center",

            color: (theme) => theme.palette.text.secondary,
            boxShadow: "0 0 5px 0 #d5c0c0",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 360,
              aspectRatio: "1 / 1",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundImage: coverUrl ? `url(${coverUrl})` : "none",
              alignSelf: "center",
            }}
          >
            {coverUrl ? (
              <img
                src={coverUrl}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                }}
              />
            ) : null}
          </Box>
          <Box
            sx={{
              padding: "1rem",
              width: "100%",
              textAlign: "center",
              backgroundColor: "#162948",
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
              }}
            >
              {data.tieuDe}
            </Typography>
            <Typography sx={{}}>Thời gian tạo: {convertDateTime(data.createdAt)}</Typography>
            <Typography component={"div"} className="content-html" dangerouslySetInnerHTML={{ __html: data.noiDung }} />
          </Box>
        </Box>
      )}
    </>
  );
};
export default DetailedNotification;
