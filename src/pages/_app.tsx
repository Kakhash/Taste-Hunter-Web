import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import { DefaultSeo } from 'next-seo';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo
        titleTemplate="%s | Taste Hunter Bistro"
        defaultTitle="Taste Hunter Bistro"
        description="Taste Hunter Bistro in Tbilisi — burgers, pizzas & street food. Order online with secure BOG payments."
        openGraph={{ type: 'website', site_name: 'Taste Hunter Bistro' }}
      />
      <div className="min-h-screen flex flex-col">
        <Component {...pageProps} />
      </div>
    </>
  );
}
