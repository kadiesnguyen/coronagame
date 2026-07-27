import Keno1P from "@/public/assets/images/keno1p.png";
import Keno3P from "@/public/assets/images/keno3p.png";
import Keno5P from "@/public/assets/images/keno5p.png";
import XocDia1P from "@/public/assets/images/xocdia1p.png";
import XoSo3P from "@/public/assets/images/xoso3p.png";
import XoSo5P from "@/public/assets/images/xoso5p.png";
import XucXac1P from "@/public/assets/images/xucxac1p.png";
import XucXac3P from "@/public/assets/images/xucxac3p.png";
import { LOAI_GAME } from "@/configs/game.config";

const GAME_IMAGES = {
  [LOAI_GAME.KENO1P]: Keno1P,
  [LOAI_GAME.KENO3P]: Keno3P,
  [LOAI_GAME.KENO5P]: Keno5P,
  [LOAI_GAME.KENO10P]: Keno5P,
  [LOAI_GAME.XUCXAC1P]: XucXac1P,
  [LOAI_GAME.XUCXAC3P]: XucXac3P,
  [LOAI_GAME.XUCXAC5P]: XucXac3P,
  [LOAI_GAME.XUCXAC10P]: XucXac3P,
  [LOAI_GAME.XOCDIA1P]: XocDia1P,
  [LOAI_GAME.XOSO3P]: XoSo3P,
  [LOAI_GAME.XOSO5P]: XoSo5P,
  [LOAI_GAME.XOSOMB]: XoSo5P,
};

export const getAdminGameImage = (typeGame) => GAME_IMAGES[typeGame] || Keno1P;
