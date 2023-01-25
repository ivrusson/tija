import Footer from './Footer';
import Header from './Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  // Put Header or Footer Here
  return (
    <div className='relative h-full min-h-screen w-full'>
      <Header />
      <main className='container pb-32'>{children}</main>
      <Footer />
    </div>
  );
}
