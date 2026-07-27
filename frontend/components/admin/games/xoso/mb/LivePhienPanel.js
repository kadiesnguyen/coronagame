import LichSuCuoc from "../LichSuCuoc";
import LivePhienPanel from "../../LivePhienPanel";
import ChiTietPhien from "./ChiTietPhien";

const XoSoMbLivePhienPanel = ({ TYPE_GAME }) => (
  <LivePhienPanel TYPE_GAME={TYPE_GAME} ChiTietPhien={ChiTietPhien} LichSuCuoc={LichSuCuoc} />
);

export default XoSoMbLivePhienPanel;
