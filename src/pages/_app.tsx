import { AppProps } from 'next/app';
import { ConfigProvider } from 'antd';
import { ReactElement, ReactNode } from "react";


import 'antd/dist/reset.css';
import '@/styles/globals.css';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout || ((page) => page);
  return getLayout(
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#7c3aed',
        },
      }}
    >
      <Component {...pageProps} />
    </ ConfigProvider>
  );
}

export default MyApp;
