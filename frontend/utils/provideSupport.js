/** ProvideSupport.com live chat helpers. */

export const DEFAULT_PS_HASH = "1pwnw71rbyasn0gk3p7lzo2mzy";
export const DEFAULT_PS_HANDLE = "6AIb";

export const DEFAULT_CHAT_SCRIPT = `(function(D){function f(){function n(n,e){e=D.createElement("script");e.src="https://image.providesupport.com/"+n,D.body.appendChild(e)}n("js/${DEFAULT_PS_HASH}/safe-textlink-sync.js?ps_h=${DEFAULT_PS_HANDLE}&ps_t="+Date.now()+"&online-link-html=Live%20Chat%20Online&offline-link-html=Live%20Chat%20Offline"),n("sjs/static.js")}D.readyState=="complete"?f():window.addEventListener("load",f)})(document)`;

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
  // Reject leftover SaleSmartly / other vendors — only ProvideSupport
  if (!/providesupport\.com/i.test(trimmed)) return DEFAULT_CHAT_SCRIPT;
  // Strip outer <script> tags if pasted as HTML
  const inner = trimmed.replace(/^[\s\S]*?<script[^>]*>/i, "").replace(/<\/script>[\s\S]*$/i, "");
  return inner.trim() || DEFAULT_CHAT_SCRIPT;
}

function parseInlineScripts(html) {
  const results = [];
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    const attrs = match[1] ?? "";
    const body = (match[2] ?? "").trim();
    const srcMatch = attrs.match(/\bsrc\s*=\s*["']([^"']+)["']/i);
    const src = srcMatch?.[1]?.trim();
    if (src) results.push({ src });
    else if (body) results.push({ code: body });
  }
  if (results.length === 0 && html.trim()) {
    results.push({ code: html.trim() });
  }
  return results;
}

function isProvideSupportLoaded() {
  return !!(
    typeof window !== "undefined" &&
    (window.psOpenWindow || document.querySelector('script[data-corona-ps="1"]'))
  );
}

let loadPromise = null;

/** Inject ProvideSupport script once. */
export function ensureProvideSupportLoaded(rawScript = DEFAULT_CHAT_SCRIPT) {
  if (typeof document === "undefined") return Promise.resolve();
  if (isProvideSupportLoaded()) return Promise.resolve();
  if (loadPromise) return loadPromise;

  const script = resolveChatScript(rawScript);
  const nodes = parseInlineScripts(
    /<script/i.test(String(rawScript)) ? String(rawScript) : `<script>${script}</script>`
  );

  loadPromise = nodes
    .reduce(
      (chain, item) =>
        chain.then(
          () =>
            new Promise((resolve) => {
              const el = document.createElement("script");
              el.dataset.coronaPs = "1";
              if (item.src) {
                el.src = item.src;
                el.async = true;
                el.onload = () => resolve();
                el.onerror = () => resolve();
              } else {
                el.text = item.code;
              }
              document.body.appendChild(el);
              if (!item.src) {
                // Inline bootstrap may append more scripts async
                setTimeout(resolve, 50);
              }
            })
        ),
      Promise.resolve()
    )
    .catch(() => {
      loadPromise = null;
    });

  return loadPromise;
}

/** Open ProvideSupport chat window (embedded/modal). Falls back to false if API missing. */
export function openProvideSupportChat() {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    let n = 0;
    const tick = () => {
      const open = window.psOpenWindow;
      if (typeof open === "function") {
        try {
          open();
          resolve(true);
          return;
        } catch {
          resolve(false);
          return;
        }
      }
      // Some builds expose it as window.psOpenWindow without call binding
      if (open) {
        try {
          window.psOpenWindow();
          resolve(true);
          return;
        } catch {
          /* continue */
        }
      }
      if (n >= 40) {
        resolve(false);
        return;
      }
      n += 1;
      setTimeout(tick, 150);
    };
    tick();
  });
}
