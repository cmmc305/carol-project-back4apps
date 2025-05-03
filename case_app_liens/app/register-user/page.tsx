'use client';

import React, { useState } from 'react';
import Parse from '@/utils/back4app';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserRegistrationForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = new Parse.User();
      user.set('username', username);
      user.set('email', email);
      user.set('password', password);
      await user.signUp();
      toast.success('User registered successfully!');
      setUsername('');
      setEmail('');
      setPassword('');
      // Aqui você pode adicionar a lógica para atualizar a lista de usuários, se necessário
    } catch (error: unknown) {
      if (error instanceof Parse.Error) {
        toast.error(`Error registering user: ${error.message}`);
      } else if (error instanceof Error) {
        toast.error(`An unexpected error occurred: ${error.message}`);
      } else {
        toast.error('An unknown error occurred during registration.');
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded-md p-6 m-8 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Register New User</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
            Username
          </label>
          <Input
            type="text"
            id="username"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <Input
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <Input
            type="password"
            id="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:cursor-pointer">
          Register User
        </Button>
      </form>
    </div>
  );
};

export default UserRegistrationForm;