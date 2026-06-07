import { Metadata } from 'next';
import VerifyHumanClient from '@/components/VerifyHumanClient';

export const metadata: Metadata = {
  title: 'Security Check | FigTracker',
  description: 'Please complete this quick security check to continue',
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerifyHumanPage() {
  return <VerifyHumanClient />;
}
