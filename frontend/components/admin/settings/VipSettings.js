import useGetVipLevelsConfig from "@/hooks/admin/useGetVipLevelsConfig";
import SystemService from "@/services/admin/SystemService";
import { Backdrop, Box, Button, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BreadcrumbBar from "../BreadcrumbBar";
import OutlinedInput from "@/components/input/OutlinedInput";

const BreadcrumbsData = [
  { title: "Admin", href: "/admin" },
  { title: "Settings", href: "/admin/settings" },
  { title: "Cấu hình VIP", href: "/admin/settings/vip" },
];

const defaultLevels = {
  vip1: { minMoney: 0, maxMoney: 100000000 },
  vip2: { minMoney: 100000000, maxMoney: 1000000000 },
  vip3: { minMoney: 1000000000, maxMoney: null },
};

const VipSettings = () => {
  const { data: dataQuery, isLoading, refetch } = useGetVipLevelsConfig();
  const [isSaving, setIsSaving] = useState(false);
  const [vipLevels, setVipLevels] = useState(defaultLevels);

  useEffect(() => {
    if (dataQuery) setVipLevels(dataQuery);
  }, [dataQuery]);

  const handleChange = (key, field, value) => {
    setVipLevels((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value === "" ? null : Number(value),
      },
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await SystemService.updateVipLevelsConfig({ vipLevels });
      refetch();
      toast.success(res?.data?.message ?? "Cập nhật thành công");
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Cập nhật thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <BreadcrumbBar data={BreadcrumbsData} />
      <h1 className="title" style={{ fontSize: "2.5rem" }}>
        Cấu hình VIP Keno 10P
      </h1>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "640px", margin: "0 auto" }}>
        {[1, 2, 3].map((level) => {
          const key = `vip${level}`;
          return (
            <Box key={key} sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <Typography sx={{ gridColumn: "1 / -1", fontWeight: 700 }}>VIP{level}</Typography>
              <Box>
                <Typography sx={{ marginBottom: "8px" }}>Min money</Typography>
                <OutlinedInput
                  value={vipLevels[key]?.minMoney ?? 0}
                  onChange={(e) => handleChange(key, "minMoney", e.target.value)}
                  fullWidth
                />
              </Box>
              <Box>
                <Typography sx={{ marginBottom: "8px" }}>Max money (trống = ∞)</Typography>
                <OutlinedInput
                  value={vipLevels[key]?.maxMoney ?? ""}
                  onChange={(e) => handleChange(key, "maxMoney", e.target.value)}
                  fullWidth
                />
              </Box>
            </Box>
          );
        })}
        <Button onClick={handleSave} disabled={isSaving}>
          Lưu cấu hình
        </Button>
      </Box>
      <Backdrop open={isLoading || isSaving}>
        <CircularProgress />
      </Backdrop>
    </>
  );
};

export default VipSettings;
