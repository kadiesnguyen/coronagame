import { convertJSXMoney } from "@/utils/convertMoney";
import { useSelector } from "react-redux";
const Money = () => {
  const { balance } = useSelector((state) => state.balance);

  return <>{convertJSXMoney(balance)}</>;
};
export default Money;
