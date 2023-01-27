import { DocumentProps, Head, Html, Main, NextScript } from 'next/document';



const Document = (props: DocumentProps) => {
  const { theme } = props.__NEXT_DATA__.props;
  return (
    <Html lang='en'>
      <Head>
        <link
          rel='preload'
          href='/fonts/inter-var-latin.woff2'
          as='font'
          type='font/woff2'
          crossOrigin='anonymous'
        />
      </Head>
      <body className={theme.bgColor}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
