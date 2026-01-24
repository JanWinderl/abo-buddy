/**
 * Actions Service
 * API-Schnittstelle für spezielle Aktionen
 */

import { api } from './api';

export interface JobStatus {
  id: string;
  name: string;
  lastRun: string | null;
  nextRun: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
}

export interface ActionResult {
  success: boolean;
  message: string;
  affectedCount?: number;
}

/**
 * Automatische Erinnerungen senden
 */
export async function sendReminders(role?: string): Promise<ActionResult> {
  return api.post<ActionResult>('/actions/send-reminders', {}, role);
}

/**
 * Abgelaufene Abos deaktivieren
 */
export async function deactivateExpired(role?: string): Promise<ActionResult> {
  return api.post<ActionResult>('/actions/deactivate-expired', {}, role);
}

/**
 * Statistiken berechnen
 */
export async function calculateStatistics(role?: string): Promise<ActionResult> {
  return api.post<ActionResult>('/actions/calculate-statistics', {}, role);
}

/**
 * Job-Status abrufen
 */
export async function getJobStatus(role?: string): Promise<JobStatus[]> {
  return api.get<JobStatus[]>('/jobs', role);
}

/**
 * Job manuell ausführen
 */
export async function runJob(jobName: string, role?: string): Promise<ActionResult> {
  return api.post<ActionResult>(`/jobs/${jobName}/run`, {}, role);
}

export const actionsService = {
  sendReminders,
  deactivateExpired,
  calculateStatistics,
  getJobStatus,
  runJob,
};
