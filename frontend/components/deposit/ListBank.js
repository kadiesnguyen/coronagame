import { Box } from "@mui/material";
import { useState } from "react";
import FormNap from "./FormDeposit";
import HuongDan from "./HuongDan";

const DanhSachBank = ({ danhSachNganHang }) => {
  const [selectedBank, setSelectedBank] = useState(null);
  const handleClickSelectBank = (bank) => {
    setSelectedBank(bank);
  };
  return (
    <>
      <h2 className="title">Chọn ngân hàng muốn nạp tiền</h2>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0,1fr))",
          gap: "1rem",
          marginTop: "1rem",

          color: (theme) => theme.palette.text.secondary,
        }}
      >
        {danhSachNganHang &&
          danhSachNganHang.map((item) => (
            <Box
              key={item.tenBank}
              onClick={() => handleClickSelectBank(item)}
              sx={{
                border:
                  selectedBank && selectedBank.tenBank === item.tenBank
                    ? (theme) => `1px solid ${theme.palette.color.primary}`
                    : `1px solid transparent`,
                padding: "1rem",
                boxShadow: "0 5px 5px #c5c5da40",
                display: "flex",
                borderRadius: "1.5rem",
                backgroundColor: "#ffffff",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Box
                sx={{
                  "& img": {
                    objectFit: "contain",
                    maxWidth: "8rem",

                    width: "100%",
                    borderRadius: "10px",
                  },
                }}
              >
                <img src={item.image} />
              </Box>
            </Box>
          ))}
      </Box>

      {selectedBank && (
        <>
          <FormNap selectedBank={selectedBank} />
        </>
      )}
      <HuongDan />
    </>
  );
};
export default DanhSachBank;
