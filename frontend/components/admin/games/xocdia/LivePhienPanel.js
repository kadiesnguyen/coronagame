import ChiTietPhien from "./ChiTietPhien";
import LichSuCuoc from "./LichSuCuoc";
import LivePhienPanel from "../LivePhienPanel";

const XocDiaLivePhienPanel = ({ TYPE_GAME }) => (
  <LivePhienPanel TYPE_GAME={TYPE_GAME} ChiTietPhien={ChiTietPhien} LichSuCuoc={LichSuCuoc} />
);

export default XocDiaLivePhienPanel;
