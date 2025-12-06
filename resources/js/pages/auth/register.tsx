"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Link, useForm  } from "@inertiajs/react";

import AuthLayout from "@/layouts/auth-layout";

export default function Register() {
  const { data, setData, post, processing, errors } = useForm({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/register');
  }

  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to Blue's Music Shop</h1>

        <form onSubmit={submit} method="POST" className="w-full max-w-sm">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="first-name">
              First Name
            </label>
            <Input
              onChange={e => setData('first_name', e.target.value)}
              id="first-name"
              type="text"
              placeholder="First Name"
            />
            {/* Display Backend Validation Errors */}
            {errors.first_name && <div className="text-red-500 text-sm mt-1">{errors.first_name}</div>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="last-name">
              Last Name
            </label>
            <Input
              onChange={e => setData('last_name', e.target.value)}
              id="last-name"
              type="text"
              placeholder="Last Name"
            />
            {/* Display Backend Validation Errors */}
            {errors.last_name && <div className="text-red-500 text-sm mt-1">{errors.last_name}</div>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <Input
              onChange={e => setData('email', e.target.value)}
              id="email"
              type="email"
              placeholder="Email"
            />
            {/* Display Backend Validation Errors */}
            {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <Input
              onChange={e => setData('password', e.target.value)}
              id="password"
              type="password"
              placeholder="******************"
            />
            {/* Display Backend Validation Errors */}
            {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
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