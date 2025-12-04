"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Link } from "@inertiajs/react";

import AuthLayout from "@/layouts/auth-layout";

export default function Login() {
  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to Blue's Music Shop</h1>

        <form className="w-full max-w-sm">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="******************"
            />
          </div>
          <div className="flex items-center justify-between">
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Sign In
            </Button>
            <div>
              <p>Not with us? <Link href="/register" className="text-primary hover:underline">Sign up</Link></p>
            </div>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}