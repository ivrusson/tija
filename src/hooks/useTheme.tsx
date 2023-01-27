import { ConfigProvider } from 'antd';
import { createContext, ReactNode, useContext } from 'react';
import colors from 'tailwindcss/colors';

interface ThemeContextType {
  color?: string;
  bgColor?: string;
  logo?: string;
}

const TijaThemeContext = createContext<ThemeContextType>(
  {} as ThemeContextType
);

const defaultColor = 'purple';
// const defualtBgColor =
//   'bg-gradient-to-r from-fuchsia-400 via-violet-900 to-indigo-500';

export const TijaThemeProvider = ({
  theme,
  children,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme: any;
  children: ReactNode;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const colorList = colors as any;
  const baseColor = theme?.color || defaultColor;
  return (
    <TijaThemeContext.Provider value={theme}>
      <ConfigProvider
        prefixCls='tj'
        theme={{
          token: {
            colorPrimary: colorList[baseColor][600],
            colorLink: colorList[baseColor][600],
            colorLinkActive: colorList[baseColor][400],
            colorLinkHover: colorList[baseColor][500],
            fontFamily: 'Mulish, sans-serif',
            fontSize: 16,
          },
        }}
      >
        {children}
      </ConfigProvider>
    </TijaThemeContext.Provider>
  );
};
export default function useTheme() {
  return useContext(TijaThemeContext);
}
