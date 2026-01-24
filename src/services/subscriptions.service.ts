/**
 * Subscriptions Service
 * API-Schnittstelle für Abonnement-Operationen
 */

import { api } from './api';
import type { Subscription } from '@/types/subscription';

export interface CreateSubscriptionDto {
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly' | 'weekly';
  category: string;
  nextPayment: string;
  description?: string;
  logoUrl?: string;
}

export interface UpdateSubscriptionDto extends Partial<CreateSubscriptionDto> {
  isActive?: boolean;
}

/**
 * Alle Abonnements abrufen
 */
export async function getSubscriptions(role?: string): Promise<Subscription[]> {
  return api.get<Subscription[]>('/subscriptions', role);
}

/**
 * Ein einzelnes Abonnement abrufen
 */
export async function getSubscription(id: string, role?: string): Promise<Subscription> {
  return api.get<Subscription>(`/subscriptions/${id}`, role);
}

/**
 * Neues Abonnement erstellen
 */
export async function createSubscription(
  data: CreateSubscriptionDto,
  role?: string
): Promise<Subscription> {
  return api.post<Subscription>('/subscriptions', data, role);
}

/**
 * Abonnement aktualisieren
 */
export async function updateSubscription(
  id: string,
  data: UpdateSubscriptionDto,
  role?: string
): Promise<Subscription> {
  return api.patch<Subscription>(`/subscriptions/${id}`, data, role);
}

/**
 * Abonnement löschen
 */
export async function deleteSubscription(id: string, role?: string): Promise<void> {
  return api.delete<void>(`/subscriptions/${id}`, role);
}

/**
 * Abonnement aktivieren/deaktivieren
 */
export async function toggleSubscription(id: string, isActive: boolean, role?: string): Promise<Subscription> {
  return api.patch<Subscription>(`/subscriptions/${id}`, { isActive }, role);
}

export const subscriptionsService = {
  getAll: getSubscriptions,
  getOne: getSubscription,
  create: createSubscription,
  update: updateSubscription,
  delete: deleteSubscription,
  toggle: toggleSubscription,
};
