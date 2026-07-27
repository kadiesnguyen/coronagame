import OutlinedInput from "@/components/input/OutlinedInput";
import { MIN_LENGTH_PASSWORD, ROLE_USER, TINH_TRANG_USER, convertRole } from "@/configs/user.config";
import { OptionMenu, OptionMenuItem } from "@/custom/optionMenu";
import { InputComponent } from "@/custom/textfield";
import useGetDetailedUser from "@/hooks/admin/useGetDetailedUser";
import UserService from "@/services/admin/UserService";
import { convertJSXMoney } from "@/utils/convertMoney";
import { convertDateTime } from "@/utils/convertTime";
import { convertTinhTrangUser } from "@/utils/convertTinhTrang";
import { Backdrop, Box, Button, Card, CircularProgress, FormControl, Select, Typography } from "@mui/material";
import _ from "lodash";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import BreadcrumbBar from "../BreadcrumbBar";
const listStatus = Object.keys(TINH_TRANG_USER).map((key) => {
  return {
    tenStatus: convertTinhTrangUser(TINH_TRANG_USER[key]),
    value: TINH_TRANG_USER[key],
  };
});

const listRole = Object.keys(ROLE_USER).map((key) => {
  return {
    ten: convertRole(ROLE_USER[key]),
    value: ROLE_USER[key],
  };
});
const DetailedUser = ({ ID }) => {
  const BreadcrumbData = [
    {
      title: "Admin",
      href: "/admin",
    },
    {
      title: "Quản lý người dùng",
      href: "/admin/users",
    },
    {
      title: "Chi tiết",
      href: "/admin/users/" + ID,
    },
  ];
  const { data: dataQuery, isLoading, refetch } = useGetDetailedUser({ id: ID });

  const [isLoadingState, setIsLoadingState] = useState(false);
  const [status, setStatus] = useState(dataQuery?.status ?? true);
  const [role, setRole] = useState(dataQuery?.role ?? ROLE_USER.USER);
  const [congTien, setCongTien] = useState(0);
  const [truTien, setTruTien] = useState(0);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (dataQuery) {
      setStatus(dataQuery?.status ?? true);
      setRole(dataQuery?.role ?? ROLE_USER.USER);
    }
  }, [dataQuery]);

  const handleChangeStatus = (e) => {
    setStatus(e.target.value);
  };
  const handleChangeRole = (e) => {
    setRole(e.target.value);
  };
  const handleChangeCongTien = (e) => {
    let parseValue = parseInt(e.target.value);

    if (isNaN(parseValue)) {
      parseValue = 0;
    }
    setCongTien(parseValue);
  };
  const handleChangeTruTien = (e) => {
    let parseValue = parseInt(e.target.value);

    if (isNaN(parseValue)) {
      parseValue = 0;
    }
    setTruTien(parseValue);
  };
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleClickCongTruTien = async (type = 1) => {
    try {
      let moneyUpdate = type === 1 ? congTien : truTien;
      if (!_.isNumber(moneyUpdate) || moneyUpdate <= 0) {
        toast.error("Vui lòng nhập tiền hợp lệ");
        return;
      }
      setIsLoadingState(true);
      const res = await UserService.updateMoneyUser({
        userId: ID,
        moneyUpdate: type === 1 ? moneyUpdate : -moneyUpdate,
      });
      toast.success(res?.data?.message);
      if (type === 1) {
        setCongTien(0);
      } else {
        setTruTien(0);
      }
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Có lỗi khi cập nhật tiền");
    } finally {
      setIsLoadingState(false);
    }
  };

  const handleClickChangeInfo = async () => {
    try {
      if (!role) {
        toast.error("Vui lòng nhập đầy đủ thông tin");
        return;
      }
      if (!Object.values(ROLE_USER).includes(role)) {
        toast.error(`Vui lòng nhập đầy đủ thông tin`);
        return;
      }
      setIsLoadingState(true);
      const res = await UserService.updateInformationUser({
        userId: ID,
        status,
        role,
      });
      toast.success(res?.data?.message ?? "Cập nhật thông tin thành công");
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Có lỗi khi cập nhật thông tin");
    } finally {
      setIsLoadingState(false);
    }
  };

  const handleClickChangePassword = async () => {
    try {
      if (!password) {
        toast.error("Vui lòng nhập mật khẩu hợp lệ");
        return;
      }
      if (password.trim().length < MIN_LENGTH_PASSWORD) {
        toast.error(`Vui lòng nhập mật khẩu từ ${MIN_LENGTH_PASSWORD} kí tự trở lên`);
        return;
      }
      setIsLoadingState(true);
      const res = await UserService.updatePasswordUser({
        userId: ID,
        newPassword: password.trim(),
      });
      toast.success(res?.data?.message ?? "Cập nhật mật khẩu thành công");
      setPassword("");
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Có lỗi khi cập nhật mật khẩu");
    } finally {
      setIsLoadingState(false);
    }
  };

  return (
    <>
      <BreadcrumbBar data={BreadcrumbData} />
      <h1
        className="title"
        style={{
          fontSize: "2.5rem",
        }}
      >
        Chi Tiết Người Dùng
      </h1>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
          maxWidth: "60rem",
          gap: "1rem",
          color: (theme) => theme.palette.text.secondary,
        }}
      >
        {isLoadingState && (
          <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoadingState}>
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
        {isLoading && <CircularProgress color="inherit" />}
        {dataQuery && (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(1, minmax(0,1fr))",
                  sm: "repeat(2, minmax(0,1fr))",
                },
                gap: "2rem",
              }}
            >
              <Card
                sx={{
                  backgroundColor: "#ffffff",
                  color: "#201c58",
                  height: "22rem",

                  display: "flex",

                  padding: "2rem",

                  minWidth: "20rem",

                  boxShadow: "-1px 2px 14px 5px #edf0f8",
                  borderRadius: "3rem",
                }}
              >
                <Box
                  sx={{
                    display: "flex",

                    width: "100%",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      width: "4rem",
                      height: "4rem",
                      position: "relative",
                    }}
                  >
                    <Image src="https://i.imgur.com/EYUoMLa.png" layout="fill" />
                  </Box>

                  <Typography
                    component="span"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "2rem",
                    }}
                  >
                    {convertJSXMoney(dataQuery.tienCuoc)}
                  </Typography>
                  <Typography
                    component="span"
                    sx={{
                      fontSize: "1.5rem",
                    }}
                  >
                    Tổng tiền cược
                  </Typography>
                </Box>
              </Card>
              <Card
                sx={{
                  backgroundColor: "#ffffff",
                  color: "#201c58",
                  height: "22rem",

                  display: "flex",

                  padding: "2rem",

                  minWidth: "20rem",

                  boxShadow: "-1px 2px 14px 5px #edf0f8",
                  borderRadius: "3rem",
                }}
              >
                <Box
                  sx={{
                    display: "flex",

                    width: "100%",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      width: "4rem",
                      height: "4rem",
                      position: "relative",
                    }}
                  >
                    <Image src="https://i.imgur.com/QD9tfI3.png" layout="fill" />
                  </Box>

                  <Typography
                    component="span"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "2rem",
                    }}
                  >
                    {convertJSXMoney(dataQuery.tienThang)}
                  </Typography>
                  <Typography
                    component="span"
                    sx={{
                      fontSize: "1.5rem",
                    }}
                  >
                    Tổng tiền thắng
                  </Typography>
                </Box>
              </Card>
            </Box>
            <FormControl fullWidth>
              <Typography>Tài khoản</Typography>
              <OutlinedInput
                placeholder="Tài khoản"
                size="small"
                type="text"
                fullWidth
                value={dataQuery.taiKhoan}
                disabled
              />
            </FormControl>
            <FormControl fullWidth>
              <Typography>Số tiền</Typography>
              <InputComponent
                placeholder="Số tiền"
                size="small"
                type="text"
                fullWidth
                value={dataQuery.money}
                disabled
              />
            </FormControl>
            <FormControl fullWidth>
              <Typography>Thời gian tạo</Typography>
              <InputComponent
                placeholder="Thời gian tạo"
                size="small"
                type="text"
                fullWidth
                value={convertDateTime(dataQuery.createdAt)}
                disabled
              />
            </FormControl>
            <FormControl fullWidth>
              <Typography>Tình trạng</Typography>

              <Select
                labelId="select-status"
                id="select-status-option"
                label="Status"
                input={<OptionMenu />}
                value={status}
                onChange={handleChangeStatus}
              >
                {listStatus.map((item, i) => (
                  <OptionMenuItem key={item.value} value={item.value}>
                    {item.tenStatus}
                  </OptionMenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <Typography>Phân quyền</Typography>

              <Select
                labelId="select-role"
                id="select-role-option"
                label="Role"
                input={<OptionMenu />}
                value={role}
                onChange={handleChangeRole}
              >
                {listRole.map((item, i) => (
                  <OptionMenuItem key={item.value} value={item.value}>
                    {item.ten}
                  </OptionMenuItem>
                ))}
              </Select>
            </FormControl>
            <Button onClick={handleClickChangeInfo}>Chỉnh sửa</Button>

            <form
              style={{
                width: "100%",
              }}
              onSubmit={(e) => {
                e.preventDefault();
                handleClickCongTruTien(1);
              }}
            >
              <FormControl
                fullWidth
                sx={{
                  gap: "1rem",
                }}
              >
                <Typography>Cộng tiền</Typography>
                <InputComponent
                  placeholder="Số tiền"
                  size="small"
                  type="number"
                  fullWidth
                  onWheel={(e) => e.target.blur()}
                  value={congTien}
                  onChange={handleChangeCongTien}
                />
                <Box textAlign={"center"}>
                  <Button type="submit">Cộng</Button>
                </Box>
              </FormControl>
            </form>
            <form
              style={{
                width: "100%",
              }}
              onSubmit={(e) => {
                e.preventDefault();
                handleClickCongTruTien(2);
              }}
            >
              <FormControl
                fullWidth
                sx={{
                  gap: "1rem",
                }}
              >
                <Typography>Trừ tiền</Typography>
                <InputComponent
                  placeholder="Số tiền"
                  size="small"
                  type="number"
                  fullWidth
                  onWheel={(e) => e.target.blur()}
                  value={truTien}
                  onChange={handleChangeTruTien}
                />
                <Box textAlign={"center"}>
                  <Button type="submit">Trừ</Button>
                </Box>
              </FormControl>
            </form>

            <form
              style={{
                width: "100%",
              }}
              onSubmit={(e) => {
                e.preventDefault();
                handleClickChangePassword();
              }}
            >
              <FormControl
                fullWidth
                sx={{
                  gap: "1rem",
                }}
              >
                <Typography>Đổi mật khẩu</Typography>
                <InputComponent
                  placeholder="Mật khẩu"
                  size="small"
                  type="text"
                  fullWidth
                  value={password}
                  onChange={handleChangePassword}
                />
                <Box textAlign={"center"}>
                  <Button type="submit">Đổi</Button>
                </Box>
              </FormControl>
            </form>
          </>
        )}
      </Box>
    </>
  );
};
export default DetailedUser;
