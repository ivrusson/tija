import { ConfigProvider, theme } from 'antd';
import { NextPage } from 'next';
import { AppProps } from 'next/app';
import { ReactElement, ReactNode } from 'react';
import colors from 'tailwindcss/colors';

import '@/styles/globals.css';

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const { defaultAlgorithm, defaultSeed } = theme;
const mapToken = defaultAlgorithm({
  ...defaultSeed,
});

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout || ((page) => page);
  return getLayout(
    <ConfigProvider
      prefixCls='tj'
      theme={{
        token: {
          colorPrimary: colors.purple[600],
          colorLink: colors.purple[600],
          colorLinkActive: colors.purple[400],
          colorLinkHover: colors.purple[500],
          fontFamily: 'Mulish, sans-serif',
          fontSize: 16,
        },
        // ...mapToken,
      }}
    >
      <Component {...pageProps} />
    </ConfigProvider>
  );
};

export default MyApp;
