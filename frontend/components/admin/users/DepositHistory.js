import ListDepositHistory from "../settings/Deposit/ListDepositHistory";
const DepositHistory = ({ ID }) => {
  return (
    <>
      <h2
        className="title"
        style={{
          fontSize: "2.5rem",
        }}
      >
        Lịch sử nạp
      </h2>

      <ListDepositHistory userId={ID} />
    </>
  );
};
export default DepositHistory;
