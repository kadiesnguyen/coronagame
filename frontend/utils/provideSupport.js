/** ProvideSupport.com — iframe chat only (no text-link inject; that breaks Footer CSKH). */

export const DEFAULT_PS_HASH = "1pwnw71rbyasn0gk3p7lzo2mzy";
export const DEFAULT_PS_HANDLE = "6AIb";

/** Kept for admin paste compatibility / hash extraction only — do NOT inject this on the client. */
export const DEFAULT_CHAT_SCRIPT = `(function(D){function f(){function n(n,e){e=D.createElement("script");e.src="https://image.providesupport.com/"+n,D.body.appendChild(e)}n("js/${DEFAULT_PS_HASH}/safe-textlink-sync.js?ps_h=${DEFAULT_PS_HANDLE}&ps_t="+Date.now()+"&online-link-html=Live%20Chat%20Online&offline-link-html=Live%20Chat%20Offline"),n("sjs/static.js")}D.readyState=="complete"?f():window.addEventListener("load",f)})(document)`;

export function isProvideSupportConfig(raw) {
  return /providesupport\.com/i.test(String(raw || ""));
}

export function extractProvideSupportHash(raw) {
  const s = String(raw || "");
  const m =
    s.match(/providesupport\.com\/js\/([a-z0-9]+)\//i) ||
    s.match(/vm\.providesupport\.com\/([a-z0-9]+)/i) ||
    s.match(/image\.providesupport\.com\/[^"'/\s]*\/([a-z0-9]{10,})\//i);
  return m?.[1] || DEFAULT_PS_HASH;
}

export function getProvideSupportChatUrl(raw) {
  return `https://vm.providesupport.com/${extractProvideSupportHash(raw)}`;
}

export function resolveChatScript(raw) {
  if (typeof raw !== "string") return DEFAULT_CHAT_SCRIPT;
  const trimmed = raw.trim();
  if (!trimmed) return DEFAULT_CHAT_SCRIPT;
  if (!/providesupport\.com/i.test(trimmed)) return DEFAULT_CHAT_SCRIPT;
  const inner = trimmed.replace(/^[\s\S]*?<script[^>]*>/i, "").replace(/<\/script>[\s\S]*$/i, "");
  return inner.trim() || DEFAULT_CHAT_SCRIPT;
}

/** Remove ProvideSupport text-link junk that overlaps Footer CSKH. */
export function scrubProvideSupportTextLinks() {
  if (typeof document === "undefined") return;
  try {
    // Note: IDs starting with a digit are invalid as #id — use [id="..."] only
    const nodes = document.querySelectorAll(
      '[id="6AIb"], a[href*="providesupport.com"], a[href*="vm.providesupport.com"], [id^="psLink"]'
    );
    nodes.forEach((el) => {
      if (el.closest?.("[data-corona-ps-chat]")) return;
      el.remove();
    });
    document.querySelectorAll("body *").forEach((el) => {
      if (el.children?.length) return;
      const t = (el.textContent || "").trim();
      if (t === "Live Chat Online" || t === "Live Chat Offline") {
        el.remove();
      }
    });
  } catch {
    /* never crash the app over cleanup */
  }
}

/** No-op: never inject PS textlink/static scripts (they pollute Footer). */
export function ensureProvideSupportLoaded() {
  scrubProvideSupportTextLinks();
  return Promise.resolve();
}

/** No floating PS window — chat lives in /contact iframe. */
export function openProvideSupportChat() {
  scrubProvideSupportTextLinks();
  return Promise.resolve(false);
}
