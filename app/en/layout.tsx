import type { Viewport } from 'next';
import { Document } from '@/components/site/Document';

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0e1e3a' };

export default function Root({ children }: { children: React.ReactNode }) {
  return <Document langue="en">{children}</Document>;
}
