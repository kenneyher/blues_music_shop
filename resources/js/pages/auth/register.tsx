"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Link } from "@inertiajs/react";

import AuthLayout from "@/layouts/auth-layout";

export default function Register() {
  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to Blue's Music Shop</h1>

        <form className="w-full max-w-sm">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="first-name">
              First Name
            </label>
            <Input
              id="first-name"
              type="text"
              placeholder="First Name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="last-name">
              Last Name
            </label>
            <Input
              id="last-name"
              type="text"
              placeholder="Last Name"
            />
          </div>
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
              <p>Already joined? <Link href="/login" className="text-primary hover:underline">Sign in</Link></p>
            </div>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}