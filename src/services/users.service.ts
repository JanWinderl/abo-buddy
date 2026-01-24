/**
 * Users Service
 * API-Schnittstelle für Benutzer-Operationen (Admin)
 */

import { api } from './api';
import type { UserRole } from '@/types/subscription';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  subscriptionCount?: number;
}

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
  role?: UserRole;
}

/**
 * Alle Benutzer abrufen (Admin only)
 */
export async function getUsers(role?: string): Promise<User[]> {
  return api.get<User[]>('/users', role);
}

/**
 * Einen einzelnen Benutzer abrufen
 */
export async function getUser(id: string, role?: string): Promise<User> {
  return api.get<User>(`/users/${id}`, role);
}

/**
 * Neuen Benutzer erstellen (Admin only)
 */
export async function createUser(
  data: CreateUserDto,
  role?: string
): Promise<User> {
  return api.post<User>('/users', data, role);
}

/**
 * Benutzer aktualisieren
 */
export async function updateUser(
  id: string,
  data: UpdateUserDto,
  role?: string
): Promise<User> {
  return api.patch<User>(`/users/${id}`, data, role);
}

/**
 * Benutzer löschen (Admin only)
 */
export async function deleteUser(id: string, role?: string): Promise<void> {
  return api.delete<void>(`/users/${id}`, role);
}

export const usersService = {
  getAll: getUsers,
  getOne: getUser,
  create: createUser,
  update: updateUser,
  delete: deleteUser,
};
