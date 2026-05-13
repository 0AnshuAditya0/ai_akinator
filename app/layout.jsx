import './globals.css';

export const metadata = {
  title: 'IPL Selector — AI Player Guessing Engine',
  description: 'Think of any IPL player. Our Bayesian AI will guess who it is within 12 questions.',
  keywords: 'IPL, cricket, akinator, AI, guessing game, DeepSeek',
  openGraph: {
    title: 'IPL Selector — AI Player Guessing Engine',
    description: 'Think of any IPL player. Our Bayesian AI will guess who it is within 12 questions.',
    type: 'website',
  },
  icons: {
    icon: '/ipl.jpeg',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
