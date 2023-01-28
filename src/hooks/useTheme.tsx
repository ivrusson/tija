import { ConfigProvider } from 'antd';
import { createContext, ReactNode, useContext } from 'react';

interface ThemeContextType {
  color?: string;
  bgColor?: string;
  logo?: string;
  title?: string;
  description?: string;
}

const TijaThemeContext = createContext<ThemeContextType>(
  {} as ThemeContextType
);

export const TijaThemeProvider = ({
  theme,
  children,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme: any;
  children: ReactNode;
}) => {
  return (
    <TijaThemeContext.Provider value={theme}>
      <ConfigProvider prefixCls='tj' theme={theme.antdTheme}>
        {children}
      </ConfigProvider>
    </TijaThemeContext.Provider>
  );
};
export default function useTheme() {
  return useContext(TijaThemeContext);
}
