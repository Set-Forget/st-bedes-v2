import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const result = await signIn('credentials', {
      redirect: false, 
      email: email,
      password: password,
    });

    if (result?.error) {
      console.error(result.error);
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-64 space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit" className="flex justify-center items-center h-9 w-64 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
        <span className="font-semibold">Sign in</span>
      </button>
    </form>
  );
};

export default LoginForm;