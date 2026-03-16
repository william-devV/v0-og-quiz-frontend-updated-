import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Web3Provider } from '@/providers/web3-provider'
import { FarcasterInit } from '@/components/farcaster-init'
import './globals.css'

const _spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

const _dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'Arbitrum OG Quiz — Prove You\'re an OG',
  description: 'Take the Arbitrum OG Quiz: 20 questions, 15 seconds each. Score 70% to earn a verifiable NFT badge. Only 36% make it.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#F7F8FA',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const fcFrame = JSON.stringify({
    version: 'next',
    imageUrl: 'https://arbitrum-og-quiz.vercel.app/manifest_imgs/hero_img.png',
    button: {
      title: 'Take Quiz',
      action: {
        type: 'launch_frame',
        name: 'Arbitrum OG Quiz',
        url: 'https://arbitrum-og-quiz.vercel.app',
        splashImageUrl: 'https://arbitrum-og-quiz.vercel.app/manifest_imgs/splash_img.png',
        splashBackgroundColor: '#e2eefe',
      },
    },
  })

  return (
    <html lang="en">
      <head>
        <meta name="fc:frame" content={fcFrame} />
      </head>
      <body className={`${_spaceGrotesk.variable} ${_dmSans.variable} font-sans antialiased`}>
        <Web3Provider>
          <FarcasterInit />
          {children}
        </Web3Provider>
        <Analytics />
      </body>
    </html>
  )
}
