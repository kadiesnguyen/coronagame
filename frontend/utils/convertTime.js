import dayjs from "dayjs";
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const convertTime = (timeISOString) => {
  const now = dayjs(new Date());
  let result = dayjs(timeISOString).from(now);

  return result;
};
export const convertDateTime = (timeISOString) => {
  let result = dayjs(timeISOString).format("YYYY-MM-DD HH:mm");

  return result;
};
export default convertTime;
