import { NextPage } from 'next';
import { AppProps } from 'next/app';
import getConfig from 'next/config';
import { ReactElement, ReactNode } from 'react';

import '@/styles/globals.css';

import { TijaThemeProvider } from '@/hooks/useTheme';

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  theme?: {
    color: string;
    bgColor: string;
  };
};

const MyApp = ({ Component, pageProps, theme }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(
    <TijaThemeProvider theme={theme}>
      <Component {...pageProps} theme={theme} />
    </TijaThemeProvider>
  );
};

MyApp.getInitialProps = async () => {
  const { serverRuntimeConfig } = getConfig();

  return {
    theme: {
      // color: 'red',
      // bgColor: 'bg-red-500',
      // logo: 'https://img.logoipsum.com/288.svg',
      color: serverRuntimeConfig.tijaConfig.THEME_BASE_COLOR,
      bgColor: serverRuntimeConfig.tijaConfig.THEME_BG_COLOR,
      logo: serverRuntimeConfig.tijaConfig.SITE_LOGO,
    },
  };
};

export default MyApp;
