import type {Metadata} from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Obsidian AI - The Latest in Artificial Intelligence',
  description: 'News, research, and insights from the frontier of AI.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} dark`}>
      <body className="bg-black text-white font-sans antialiased selection:bg-red-500/30 selection:text-red-200" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
