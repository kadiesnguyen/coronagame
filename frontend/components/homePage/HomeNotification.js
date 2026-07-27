import useGetListNotifications from "@/hooks/useGetListNotifications";
import CampaignIcon from "@mui/icons-material/Campaign";
import { Box, Typography } from "@mui/material";
const HomeNotification = () => {
  const { data, isLoading } = useGetListNotifications({ limitItems: 1 });
  return (
    <>
      {data?.map((item) => (
        <Box
          key={item._id}
          sx={{
            borderRadius: "1rem",
            marginTop: "1rem",
            display: "flex",
            gap: "1rem",
            padding: "1rem",
            backgroundColor: "#f1e7bd",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CampaignIcon
            sx={{
              color: "#e97d4a",
            }}
          />
          <Box
            id="scroll-container"
            sx={{
              flex: 1,
            }}
          >
            <Typography
              id="scroll-text"
              sx={{
                color: "#e97d4a",
              }}
            >
              {item.tieuDe}
            </Typography>
          </Box>
        </Box>
      ))}
    </>
  );
};
export default HomeNotification;
