import {
  DEFAULT_SALESMARTLY_SCRIPT,
  ensureSaleSmartlyLoaded,
  isSaleSmartlyConfig,
  openSaleSmartlyChat,
} from "@/utils/saleSmartly";
import {
  ensureProvideSupportLoaded,
  getProvideSupportChatUrl,
  isProvideSupportConfig,
  scrubProvideSupportTextLinks,
} from "@/utils/provideSupport";

export const DEFAULT_CSKH_SCRIPT = DEFAULT_SALESMARTLY_SCRIPT;

export function detectCskhProvider(raw) {
  if (isSaleSmartlyConfig(raw)) return "salesmartly";
  if (isProvideSupportConfig(raw)) return "providesupport";
  // Empty / unknown → SaleSmartly default
  if (!String(raw || "").trim()) return "salesmartly";
  return "salesmartly";
}

export function resolveCskhConfig(raw) {
  const trimmed = String(raw || "").trim();
  if (!trimmed) return DEFAULT_CSKH_SCRIPT;
  return trimmed;
}

/** Load active CSKH provider widget (SaleSmartly floating bubble). */
export function ensureCskhLoaded(raw) {
  const cfg = resolveCskhConfig(raw);
  const provider = detectCskhProvider(cfg);
  if (provider === "salesmartly") {
    scrubProvideSupportTextLinks();
    return ensureSaleSmartlyLoaded(cfg);
  }
  return ensureProvideSupportLoaded(cfg);
}

export function openCskhChat(raw) {
  const cfg = resolveCskhConfig(raw);
  const provider = detectCskhProvider(cfg);
  if (provider === "salesmartly") {
    return openSaleSmartlyChat(cfg);
  }
  scrubProvideSupportTextLinks();
  return Promise.resolve(false);
}

export function getCskhIframeUrl(raw) {
  const cfg = resolveCskhConfig(raw);
  if (detectCskhProvider(cfg) !== "providesupport") return null;
  return getProvideSupportChatUrl(cfg);
}
