import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../../storage/subscription.entity';

type JobStatus = 'queued' | 'running' | 'succeeded' | 'failed';

interface JobRecord {
  id: string;
  status: JobStatus;
  result?: any;
  error?: string;
}

@Injectable()
export class JobsService {
  private jobs = new Map<string, JobRecord>();

  constructor(@InjectRepository(Subscription) private subsRepo: Repository<Subscription>) {}

  private newJob(): JobRecord {
    const id = Math.random().toString(36).slice(2);
    const job: JobRecord = { id, status: 'queued' };
    this.jobs.set(id, job);
    return job;
  }

  get(jobId: string) {
    return this.jobs.get(jobId) ?? { id: jobId, status: 'failed', error: 'Unbekannter Job' };
  }

  // A4: Importiere eine Liste von Abos (simuliert langsam)
  async importSubscriptions(items: Partial<Subscription>[]): Promise<JobRecord> {
    const job = this.newJob();
    job.status = 'running';
    setTimeout(async () => {
      try {
        for (const item of items) {
          const toSave = this.subsRepo.create({
            name: item.name ?? 'Unbenannt',
            price: item.price ?? 0,
            billingCycle: (item as any).billingCycle ?? 'monthly',
            category: (item as any).category ?? 'other',
            nextBillingDate: item.nextBillingDate ?? new Date().toISOString().slice(0,10),
            userId: item.userId ?? '1',
            isActive: item.isActive ?? true,
          });
          await this.subsRepo.save(toSave);
        }
        job.status = 'succeeded';
        job.result = { imported: items.length };
      } catch (e: any) {
        job.status = 'failed';
        job.error = e?.message ?? 'Fehler beim Import';
      }
    }, 1500);
    return job;
  }

  // A4: Löschen als Hintergrundjob
  async deleteSubscription(id: string): Promise<JobRecord> {
    const job = this.newJob();
    job.status = 'running';
    setTimeout(async () => {
      try {
        await this.subsRepo.delete(id);
        job.status = 'succeeded';
        job.result = { deletedId: id };
      } catch (e: any) {
        job.status = 'failed';
        job.error = e?.message ?? 'Fehler beim Löschen';
      }
    }, 1200);
    return job;
  }
}