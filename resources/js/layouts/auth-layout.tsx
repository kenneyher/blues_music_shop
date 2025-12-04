'use client';
import { Music } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="auth-layout" className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-1/2 w-1/2 min-h-screen m-2 rounded-[10px] overflow-hidden lg:min-h-[600px] bg-card flex flex-row shadow-lg">
        <div className="relative flex flex-row bg-linear-to-br from-primary to-secondary lg:min-h-[600px] w-1/2">
          <Music className="m-auto text-white" size={100} />
        </div>
        <div className="relative w-1/2 p-8 flex flex-col justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
