import { Box } from "@mui/material";
import { useEffect, useState } from "react";

/** Matches `homePage/Footer.js` fixed nav height */
export const MOBILE_NAV_HEIGHT = "7.8rem";

/** Anchor on history section (scroll target / padding) */
export const GAME_LICH_SU_ID = "game-lich-su";

/** Anchor on bet board — sticky bar stays visible while this is on screen */
export const GAME_DAT_CUOC_ID = "game-dat-cuoc";

/**
 * Fixed bet controls above the mobile bottom nav (maxWidth 540 app shell).
 * Stays visible while bàn cược is on screen; hides only after user scrolls past it
 * so lịch sử can be read without the bar blocking touch scroll.
 */
const StickyBetBar = ({ children }) => {
  const [hidePastBetBoard, setHidePastBetBoard] = useState(false);

  useEffect(() => {
    let io;
    let timer;
    let cancelled = false;

    const attach = () => {
      const el = document.getElementById(GAME_DAT_CUOC_ID);
      if (!el || cancelled) return false;
      io = new IntersectionObserver(
        ([entry]) => {
          // Hide only when bet board fully left the viewport (scrolled up to history)
          setHidePastBetBoard(!entry.isIntersecting);
        },
        { root: null, threshold: 0, rootMargin: "0px" }
      );
      io.observe(el);
      return true;
    };

    if (!attach()) {
      timer = window.setInterval(() => {
        if (attach()) window.clearInterval(timer);
      }, 200);
    }

    return () => {
      cancelled = true;
      if (timer) window.clearInterval(timer);
      io?.disconnect();
    };
  }, []);

  return (
    <Box
      className="sticky-bet-bar"
      sx={{
        position: "fixed",
        bottom: MOBILE_NAV_HEIGHT,
        left: "50%",
        transform: hidePastBetBoard ? "translate(-50%, 110%)" : "translateX(-50%)",
        opacity: hidePastBetBoard ? 0 : 1,
        pointerEvents: hidePastBetBoard ? "none" : "auto",
        transition: "transform .2s ease, opacity .2s ease",
        width: "100%",
        maxWidth: "540px",
        zIndex: (t) => t.zIndex.drawer,
        background: "linear-gradient(180deg, rgba(22,41,72,.98) 0%, #101d33 100%)",
        borderTop: "1px solid rgba(212,175,55,.4)",
        boxShadow: "0 -6px 20px rgba(0,0,0,.4)",
        padding: "8px 12px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {children}
    </Box>
  );
};

export default StickyBetBar;
