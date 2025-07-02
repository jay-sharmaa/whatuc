'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between p-4 border-b border-white bg-black">
      {/* Home on the left */}
      <div className="flex">
        <Link
          href="/"
          className={`text-white transform transition-transform duration-200 hover:scale-110 ${
            pathname === '/' ? 'underline font-bold' : ''
          }`}
        >
          Home
        </Link>
      </div>

      {/* About on the right */}
      <div className="flex">
        <Link
          href="/about"
          className={`text-white transform transition-transform duration-200 hover:scale-110 ${
            pathname === '/about' ? 'underline font-bold' : ''
          }`}
        >
          About
        </Link>
      </div>
    </nav>
  );
}
