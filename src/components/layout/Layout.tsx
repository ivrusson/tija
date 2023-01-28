import Footer from './Footer';
import Header from './Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div>
        <Header />
        <main className='container min-h-[400px]'>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
