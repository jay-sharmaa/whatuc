import './globals.css';
import NavTabs from './components/NavTabs';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className='bg-black text-white'>
        <NavTabs />
        {children}
      </body>
    </html>
  );
}
