import { Roboto } from 'next/font/google'

export const roboto = Roboto({
  subsets: ['latin'],
  weight: '400',
  preload: true,
  display: 'swap',
  fallback: ['system-ui', 'arial'],
})
