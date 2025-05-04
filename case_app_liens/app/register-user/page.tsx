'use client';

import React, { useState, useEffect } from 'react';
import Parse from '@/utils/back4app';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface User {
  objectId: string;
  username: string;
  email: string;
  createdAt: Date;
}

const RegisterUserPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [userToChangePassword, setUserToChangePassword] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const query = new Parse.Query(Parse.User);
      const results = await query.find();
      const fetchedUsers = results.map((user) => ({
        objectId: user.id ?? '',
        username: user.get('username'),
        email: user.get('email'),
        createdAt: user.createdAt ?? new Date(),
      }));
      setUsers(fetchedUsers);
    } catch (error: unknown) {
      if (error instanceof Parse.Error) {
        toast.error(`Error fetching users: ${error.message}`);
      } else if (error instanceof Error) {
        toast.error(`An unexpected error occurred while fetching users: ${error.message}`);
      } else {
        toast.error('An unknown error occurred while fetching users.');
      }
    } finally {
      setLoadingUsers(false);
    }
  };

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
      fetchUsers();
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

  const openPasswordChangeDialog = (user: User) => {
    setUserToChangePassword(user);
    setOpenChangePasswordModal(true);
    setNewPassword(''); // Limpa a senha ao abrir o modal
  };

  const closePasswordChangeDialog = () => {
    setOpenChangePasswordModal(false);
    setUserToChangePassword(null);
    setNewPassword('');
  };

  const handleUpdatePassword = async () => {
    if (!userToChangePassword || !newPassword) {
      return;
    }
    try {
      const user = new Parse.User();
      user.id = userToChangePassword.objectId;
      await user.setPassword(newPassword); // Requer Master Key
      await user.save(null, { useMasterKey: true });
      toast.success('Password updated successfully!');
      closePasswordChangeDialog();
    } catch (error: unknown) {
      if (error instanceof Parse.Error) {
        toast.error(`Error updating password: ${error.message}`);
      } else if (error instanceof Error) {
        toast.error(`An unexpected error occurred while updating the password: ${error.message}`);
      } else {
        toast.error('An unknown error occurred while updating the password.');
      }
    }
  };

  const handleOpenDeleteConfirmation = (user: User) => {
    setUserToDelete(user);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) {
      return;
    }
    try {
      const userToDeleteOnParse = new Parse.User();
      userToDeleteOnParse.id = userToDelete.objectId;
      await userToDeleteOnParse.destroy(); // Requer Master Key
      toast.success('User deleted successfully!');
      setUserToDelete(null); // Limpa o usuário a ser deletado após a exclusão
      fetchUsers();
    } catch (error: unknown) {
      if (error instanceof Parse.Error) {
        toast.error(`Error deleting user: ${error.message}`);
      } else if (error instanceof Error) {
        toast.error(`An unexpected error occurred while deleting the user: ${error.message}`);
      } else {
        toast.error('An unknown error occurred while deleting the user.');
      }
    }
  };

  if (loadingUsers) {
    return <div className="p-6 m-8 max-w-5xl mx-auto">Carregando usuários...</div>;
  }

  return (
    <div className="p-6 m-8 max-w-5xl mx-auto space-y-6">
      {/* Formulário de Registro */}
      <div className="bg-white shadow-md rounded-md p-6">
        <h2 className="text-xl font-semibold mb-4">Register New User</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          {/* ... Campos do formulário ... */}
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

      {/* Tabela de Usuários */}
      <div className="bg-white shadow-md rounded-md p-6">
        <h2 className="text-xl font-semibold mb-4">Registered Users</h2>
        {users.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Registered At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.objectId}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.createdAt.toLocaleDateString()} {user.createdAt.toLocaleTimeString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button className='cursor-pointer' size="sm" onClick={() => openPasswordChangeDialog(user)}>
                      Change Password
                    </Button>
                    <AlertDialog open={userToDelete?.objectId === user.objectId} onOpenChange={(open) => {
                      if (!open) setUserToDelete(null);
                    }}>
                      <AlertDialogTrigger asChild>
                        <Button className='cursor-pointer' size="sm" variant="destructive" onClick={() => handleOpenDeleteConfirmation(user)}>
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. Are you sure you want to delete user: {user.username}?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className='cursor-pointer' onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
                          <AlertDialogAction className='cursor-pointer' onClick={handleDeleteUser}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>No users registered yet.</p>
        )}
      </div>

      {/* Change Password Modal */}
      <Dialog open={openChangePasswordModal} onOpenChange={setOpenChangePasswordModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-password" className="text-right">
                New Password
              </Label>
              <Input
                id="new-password"
                type="password"
                className="col-span-3"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button className='cursor-pointer' type="button" variant="secondary" onClick={closePasswordChangeDialog}>
              Cancel
            </Button>
            <Button className='cursor-pointer' onClick={handleUpdatePassword} disabled={!newPassword}>
              Save Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegisterUserPage;