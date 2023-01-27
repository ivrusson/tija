import Footer from './Footer';
import Header from './Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='h-full min-h-screen w-full'>
      <Header />
      <main className='container pb-32'>{children}</main>
      <Footer />
    </div>
  );
}
