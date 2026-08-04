import useGetListNotifications from "@/hooks/useGetListNotifications";
import CampaignIcon from "@mui/icons-material/Campaign";
import { Box, Typography } from "@mui/material";

const HomeNotification = () => {
  const { data } = useGetListNotifications({ limitItems: 1 });
  return (
    <>
      {data?.map((item) => (
        <Box
          key={item._id}
          sx={{
            borderRadius: "8px",
            marginTop: "16px",
            display: "flex",
            gap: "8px",
            padding: "8px 12px",
            minHeight: "40px",
            maxHeight: "40px",
            backgroundColor: "rgba(212,175,55,.12)",
            border: "1px solid rgba(212,175,55,.35)",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <CampaignIcon
            sx={{
              color: "#e5c05b",
              fontSize: "20px",
              flexShrink: 0,
            }}
          />
          <Box
            id="scroll-container"
            sx={{
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
              height: "24px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              id="scroll-text"
              component="span"
              sx={{
                color: "#e5c05b",
                fontSize: "14px",
                lineHeight: "24px",
                whiteSpace: "nowrap",
                display: "inline-block",
              }}
            >
              {String(item.tieuDe || "").replace(/\s+/g, " ").trim()}
            </Typography>
          </Box>
        </Box>
      ))}
    </>
  );
};
export default HomeNotification;
