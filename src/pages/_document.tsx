import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
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
      <body className="bg-gradient-to-r from-fuchsia-400 via-violet-900 to-indigo-500">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
