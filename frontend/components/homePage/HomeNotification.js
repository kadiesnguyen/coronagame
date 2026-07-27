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
            backgroundColor: "rgba(212,175,55,.12)",
            border: "1px solid rgba(212,175,55,.35)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CampaignIcon
            sx={{
              color: "#e5c05b",
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
                color: "#e5c05b",
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
