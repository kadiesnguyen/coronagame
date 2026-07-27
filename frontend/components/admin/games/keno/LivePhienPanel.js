import ChiTietPhien from "./ChiTietPhien";
import LichSuCuoc from "./LichSuCuoc";
import LivePhienPanel from "../LivePhienPanel";

const KenoLivePhienPanel = ({ TYPE_GAME }) => (
  <LivePhienPanel TYPE_GAME={TYPE_GAME} ChiTietPhien={ChiTietPhien} LichSuCuoc={LichSuCuoc} />
);

export default KenoLivePhienPanel;
