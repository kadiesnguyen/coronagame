/**
 * CSKH chat script helpers — SaleSmartly (primary) + ProvideSupport fallback.
 */
import { ensureCskhLoaded } from "@/utils/cskh";

export {
  DEFAULT_CSKH_SCRIPT as DEFAULT_CHAT_SCRIPT,
  ensureCskhLoaded as ensureChatScriptLoaded,
  openCskhChat as openProvideSupportChat,
} from "@/utils/cskh";

export {
  extractProvideSupportHash,
  getProvideSupportChatUrl,
  resolveChatScript,
} from "@/utils/provideSupport";

export function injectChatScripts(html) {
  return ensureCskhLoaded(html).then(() => () => undefined);
}
