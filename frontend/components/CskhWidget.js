import useGetTawkToConfig from "@/hooks/useGetTawkToConfig";
import { detectCskhProvider, resolveCskhConfig } from "@/utils/cskh";
import { setCskhConfigCache } from "@/utils/openCskh";
import { scrubProvideSupportTextLinks } from "@/utils/provideSupport";
import { ensureSaleSmartlyLoaded } from "@/utils/saleSmartly";
import { useEffect } from "react";

/**
 * Sync admin CSKH config + ensure SaleSmartly ready (script also in _document for crawler).
 */
const CskhWidget = () => {
  const { data } = useGetTawkToConfig({ throwOnError: false });

  useEffect(() => {
    const cfg = resolveCskhConfig(data?.link);
    setCskhConfigCache(cfg);
    if (detectCskhProvider(cfg) === "salesmartly") {
      // Safe: does not pre-create window.ssq (that blocked their loader before)
      ensureSaleSmartlyLoaded(cfg);
    } else {
      scrubProvideSupportTextLinks();
    }
  }, [data?.link]);

  return null;
};

export default CskhWidget;
