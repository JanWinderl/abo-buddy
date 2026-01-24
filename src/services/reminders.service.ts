/**
 * Reminders Service
 * API-Schnittstelle für Erinnerungs-Operationen
 */

import { api } from './api';
import type { Reminder } from '@/types/subscription';

export interface CreateReminderDto {
  subscriptionId: string;
  reminderDate: string;
  message: string;
  type: 'cancellation' | 'payment' | 'price_change';
}

export interface UpdateReminderDto extends Partial<CreateReminderDto> {
  isActive?: boolean;
}

/**
 * Alle Erinnerungen abrufen
 */
export async function getReminders(role?: string): Promise<Reminder[]> {
  return api.get<Reminder[]>('/reminders', role);
}

/**
 * Eine einzelne Erinnerung abrufen
 */
export async function getReminder(id: string, role?: string): Promise<Reminder> {
  return api.get<Reminder>(`/reminders/${id}`, role);
}

/**
 * Neue Erinnerung erstellen
 */
export async function createReminder(
  data: CreateReminderDto,
  role?: string
): Promise<Reminder> {
  return api.post<Reminder>('/reminders', data, role);
}

/**
 * Erinnerung aktualisieren
 */
export async function updateReminder(
  id: string,
  data: UpdateReminderDto,
  role?: string
): Promise<Reminder> {
  return api.patch<Reminder>(`/reminders/${id}`, data, role);
}

/**
 * Erinnerung löschen
 */
export async function deleteReminder(id: string, role?: string): Promise<void> {
  return api.delete<void>(`/reminders/${id}`, role);
}

/**
 * Erinnerung aktivieren/deaktivieren
 */
export async function toggleReminder(id: string, isActive: boolean, role?: string): Promise<Reminder> {
  return api.patch<Reminder>(`/reminders/${id}`, { isActive }, role);
}

export const remindersService = {
  getAll: getReminders,
  getOne: getReminder,
  create: createReminder,
  update: updateReminder,
  delete: deleteReminder,
  toggle: toggleReminder,
};
