/**
 * CSKH chat script helpers — ProvideSupport.com
 * Re-exports for existing imports.
 */
import { ensureProvideSupportLoaded } from "@/utils/provideSupport";

export {
  DEFAULT_CHAT_SCRIPT,
  ensureProvideSupportLoaded as ensureChatScriptLoaded,
  extractProvideSupportHash,
  getProvideSupportChatUrl,
  openProvideSupportChat,
  resolveChatScript,
} from "@/utils/provideSupport";

export function injectChatScripts(html) {
  return ensureProvideSupportLoaded(html).then(() => () => undefined);
}
