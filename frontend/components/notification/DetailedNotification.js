import useGetDetailedNotification from "@/hooks/useGetDetailedNotification";
import { convertDateTime } from "@/utils/convertTime";
import { Box, Typography } from "@mui/material";
import { Bars } from "react-loading-icons";
const DetailedNotification = ({ id }) => {
  const { data, isLoading } = useGetDetailedNotification({ id });

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
              height: "20rem",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundImage: `url(${data.hinhAnh})`,
            }}
          >
            <img
              src={data.hinhAnh}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
          <Box
            sx={{
              padding: "1rem",
              width: "100%",
              textAlign: "center",
              backgroundColor: "#ffffff",
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
