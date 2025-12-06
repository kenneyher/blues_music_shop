"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Link, useForm } from "@inertiajs/react";

import AuthLayout from "@/layouts/auth-layout";

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
    password: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    post("/login");
  }

  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to Blue's Music Shop</h1>

        <form method="post" onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
            />
            {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="******************"
              value={data.password}
              onChange={(e) => setData("password", e.target.value)}
            />
            {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
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