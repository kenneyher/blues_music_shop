'use client';
import { Music } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="auth-layout" className="flex min-h-screen items-center justify-center bg-gray-100 ">
      <div className="m-8 flex min-h-full w-full flex-col lg:flex-row lg:max-w-1/2 overflow-hidden rounded-[10px] bg-card shadow-lg lg:max-h-[600px] lg:min-h-[600px]">
        <div className="relative flex lg:w-1/2 flex-row bg-linear-to-br from-primary to-secondary w-full h-[300px] lg:h-[600px] p-8">
          <Music className="m-auto text-white" size={100} />
        </div>
        <div className="relative flex w-1/2 flex-col justify-center p-8">{children}</div>
      </div>
    </div>
  );
}
