import NextSeoConfig from "@/configs/next-seo.config";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SessionProvider } from "next-auth/react";
import { DefaultSeo } from "next-seo";
import "nprogress/nprogress.css";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "simplebar-react/dist/simplebar.min.css";

import { Toaster } from "react-hot-toast";
import RefreshTokenHandler from "../components/RefreshTokenHandler";
import ThemeLayout from "../components/ThemeLayout";
import SocketProvider from "../providers/SocketProvider";
import { store } from "../redux/reducers/store";
import "../styles/globals.css";
import "../styles/layout.scss";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      cacheTime: Infinity,
    },
  },
});

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [interval, setInterval] = useState(0);

  return (
    <>
      <SessionProvider session={session} refetchOnWindowFocus={false} refetchInterval={interval}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <Provider store={store}>
            <SocketProvider>
              <ThemeLayout>
                <DefaultSeo {...NextSeoConfig} />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Component {...pageProps} />
                </LocalizationProvider>
                <ToastContainer
                  position="top-center"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss={false}
                  draggable
                  pauseOnHover={false}
                />
                <Toaster
                  position="top-center"
                  reverseOrder={false}
                  gutter={8}
                  containerClassName=""
                  containerStyle={{}}
                  toastOptions={{
                    // Define default options
                    className: "",
                    duration: 5000,
                    style: {
                      fontSize: "1.5rem",
                    },
                  }}
                />
              </ThemeLayout>
            </SocketProvider>
          </Provider>
        </QueryClientProvider>
        <RefreshTokenHandler setInterval={setInterval} />
      </SessionProvider>
    </>
  );
}

export default MyApp;
