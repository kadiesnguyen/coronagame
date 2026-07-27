import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { isNaN } from "lodash";
import { useEffect, useState } from "react";

const CountdownBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& .notime": {
    background: "transparent",
    background: "linear-gradient(-45deg,transparent 0,#da2031 0)",
  },
  "& div": {
    background: "linear-gradient(-45deg,transparent 0,#da2031 0)",

    color: theme.palette.text.primary,
    fontSize: "1.6rem",
    fontWeight: "600",
    padding: "5px 2.5px",
    textAlign: "center",
    "&:first-child": {
      borderTopLeftRadius: "5px",
      paddingLeft: "5px",
    },
    "&:last-child": {
      borderBottomRightRadius: "5px",
      paddingRight: "5px",
    },
  },
}));
const CountdownTimer = ({ countdownTime }) => {
  const [hoursFirst, setHoursFirst] = useState(0);
  const [hoursSecond, setHoursSecond] = useState(0);
  const [minutesFirst, setMinutesFirst] = useState(0);
  const [minutesSecond, setMinutesSecond] = useState(0);
  const [secondsFirst, setSecondsFirst] = useState(0);
  const [secondsSecond, setSecondsSecond] = useState(0);

  useEffect(() => {
    if (isNaN(countdownTime) || countdownTime === undefined || countdownTime === null) {
      return;
    }
    let hours = Math.floor((countdownTime % (60 * 60 * 24)) / (60 * 60));
    let minutes = Math.floor((countdownTime % (60 * 60)) / 60);
    let seconds = Math.floor(countdownTime % 60);

    if (hours < 10) {
      setHoursFirst(0);
      setHoursSecond(hours);
    } else {
      setHoursFirst(Math.floor(hours / 10));
      setHoursSecond(Math.floor(hours % 10));
    }
    if (minutes < 10) {
      setMinutesFirst(0);
      setMinutesSecond(minutes);
    } else {
      setMinutesFirst(Math.floor(minutes / 10));
      setMinutesSecond(Math.floor(minutes % 10));
    }
    if (seconds < 10) {
      setSecondsFirst(0);
      setSecondsSecond(seconds);
    } else {
      setSecondsFirst(Math.floor(seconds / 10));
      setSecondsSecond(Math.floor(seconds % 10));
    }
  }, [countdownTime]);
  return (
    <>
      <CountdownBox>
        <div>{hoursFirst < 0 ? 0 : hoursFirst}</div>
        <div>{hoursSecond < 0 ? 0 : hoursSecond}</div>
        <div className="notime">:</div>
        <div>{minutesFirst < 0 ? 0 : minutesFirst}</div>
        <div>{minutesSecond < 0 ? 0 : minutesSecond}</div>
        <div className="notime">:</div>
        <div>{secondsFirst < 0 ? 0 : secondsFirst}</div>
        <div>{secondsSecond < 0 ? 0 : secondsSecond}</div>
      </CountdownBox>
    </>
  );
};
export default CountdownTimer;
