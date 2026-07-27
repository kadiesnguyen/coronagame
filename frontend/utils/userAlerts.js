const STORAGE_KEY = "corona_user_alerts_v1";
const MAX_ITEMS = 50;

const emptyState = () => ({ items: [], readIds: [] });

export const loadUserAlerts = () => {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      readIds: Array.isArray(parsed.readIds) ? parsed.readIds : [],
    };
  } catch (_err) {
    return emptyState();
  }
};

export const saveUserAlerts = (state) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        items: (state.items || []).slice(0, MAX_ITEMS),
        readIds: state.readIds || [],
      })
    );
  } catch (_err) {
    // ignore
  }
};

export const upsertUserAlert = (state, alert) => {
  if (!alert?.id) return state;
  const items = [alert, ...(state.items || []).filter((x) => x.id !== alert.id)].slice(0, MAX_ITEMS);
  return { ...state, items };
};

export const markUserAlertRead = (state, id) => {
  if (!id) return state;
  const readIds = state.readIds.includes(id) ? state.readIds : [...state.readIds, id];
  return { ...state, readIds };
};

export const markAllUserAlertsRead = (state) => {
  const readIds = Array.from(new Set([...(state.readIds || []), ...(state.items || []).map((x) => x.id)]));
  return { ...state, readIds };
};

export const countUnreadUserAlerts = (state) =>
  (state.items || []).filter((item) => !(state.readIds || []).includes(item.id)).length;
