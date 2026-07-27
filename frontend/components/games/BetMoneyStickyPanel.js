import OutlinedInput from "@/components/input/OutlinedInput";
import { Box, Button, Typography } from "@mui/material";
import StickyBetBar from "./StickyBetBar";

/**
 * Sticky bet input + confirm/reset above mobile nav (manual amount only).
 */
const BetMoneyStickyPanel = ({
  tienCuoc,
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
  return (
    <StickyBetBar>
      <Typography
        ref={titleRef}
        sx={{ fontWeight: 700, fontSize: "1.25rem", color: "#e5c05b", lineHeight: 1.2 }}
      >
        Nhập tiền cược
      </Typography>
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
