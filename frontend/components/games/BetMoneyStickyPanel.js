import OutlinedInput from "@/components/input/OutlinedInput";
import convertMoney from "@/utils/convertMoney";
import { Box, Button, Typography } from "@mui/material";
import StickyBetBar from "./StickyBetBar";

const chipSx = (active) => ({
  flex: "0 0 auto",
  minWidth: "52px",
  height: "40px",
  px: "12px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: "1.4rem",
  lineHeight: 1,
  whiteSpace: "nowrap",
  color: active ? "#0b1528" : "#e5c05b",
  backgroundColor: active ? "#d4af37" : "#0b1528",
  border: active ? "1px solid #e5c05b" : "1px solid rgba(255,255,255,.15)",
});

/**
 * Sticky amount chips + input + confirm/reset above mobile nav.
 * `amounts` accepts number[] or { amount }[].
 */
const BetMoneyStickyPanel = ({
  amounts = [],
  tienCuoc,
  onSelectAmount,
  onChangeInput,
  onSubmit,
  onReset,
  inputRef,
  titleRef,
  isSpinning = false,
  resetDisabled = false,
  showReset = true,
  submitLabel = "Xác nhận",
  spinningLabel = "Chờ phiên mới",
  resetLabel = "Đặt lại",
  extra = null,
}) => {
  const values = amounts.map((item) => (typeof item === "number" ? item : item.amount));

  return (
    <StickyBetBar>
      <Typography
        ref={titleRef}
        sx={{ fontWeight: 700, fontSize: "1.25rem", color: "#e5c05b", lineHeight: 1.2 }}
      >
        Chọn tiền cược
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          flexWrap: "nowrap",
          WebkitOverflowScrolling: "touch",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {values.map((value) => (
          <Box key={value} onClick={() => onSelectAmount(value)} sx={chipSx(tienCuoc == value)}>
            {convertMoney(value)}
          </Box>
        ))}
      </Box>
      <OutlinedInput
        inputRef={inputRef}
        value={tienCuoc}
        onChange={onChangeInput}
        onWheel={(e) => e.target.blur()}
        placeholder="Nhập số tiền"
        size="small"
        type="text"
        fullWidth
        sx={{
          minHeight: "44px",
          backgroundColor: "#0b1528",
          "& .MuiOutlinedInput-input": { py: "10px" },
        }}
      />
      {extra}
      <Box sx={{ display: "flex", gap: "8px", width: "100%" }}>
        <Button
          disabled={isSpinning}
          onClick={onSubmit}
          sx={{
            flex: 1,
            minHeight: "44px",
            maxWidth: "none",
            fontSize: "1.5rem",
            fontWeight: 800,
          }}
        >
          {isSpinning ? spinningLabel : submitLabel}
        </Button>
        {showReset && (
          <Button
            disabled={resetDisabled}
            onClick={onReset}
            sx={{
              flex: 1,
              minHeight: "44px",
              maxWidth: "none",
              fontSize: "1.5rem",
              fontWeight: 800,
              opacity: resetDisabled ? 0.5 : 1,
            }}
          >
            {resetLabel}
          </Button>
        )}
      </Box>
    </StickyBetBar>
  );
};

export default BetMoneyStickyPanel;
