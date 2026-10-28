'use server';

import bcrypt from 'bcryptjs';
import { getUserByEmail, addUser } from '../db';
import { signToken, setSessionToken, clearSessionToken } from '../auth';
import { revalidatePath } from 'next/cache';
import { syncGuestData } from './cartActions';

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  if (!email || !password) {
    return { error: 'Email and password are required' };
  }
  
  const user = getUserByEmail(email);
  if (!user) {
    return { error: 'Invalid email or password' };
  }
  
  const isMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!isMatch) {
    return { error: 'Invalid email or password' };
  }
  
  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });
  
  await setSessionToken(token);
  await syncGuestData(user.id);
  
  return { success: true, user: { name: user.name, email: user.email, role: user.role } };
}

export async function signupAction(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  if (!name || !email || !password) {
    return { error: 'All fields are required' };
  }
  
  const existingUser = getUserByEmail(email);
  if (existingUser) {
    return { error: 'Email is already registered' };
  }
  
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);
  
  const newUser = addUser(name, email, passwordHash, 'user');
  
  const token = signToken({
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role
  });
  
  await setSessionToken(token);
  await syncGuestData(newUser.id);
  
  return { success: true, user: { name: newUser.name, email: newUser.email, role: newUser.role } };
}

export async function logoutAction() {
  await clearSessionToken();
  revalidatePath('/');
  return { success: true };
}
