import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Subscription, BillingCycle, SubscriptionCategory } from '@/types/subscription';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const subscriptionSchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich').max(100, 'Name ist zu lang'),
  price: z.coerce.number().min(0, 'Preis muss positiv sein'),
  billingCycle: z.enum(['weekly', 'monthly', 'quarterly', 'yearly']),
  category: z.enum(['streaming', 'software', 'fitness', 'cloud', 'gaming', 'news', 'other']),
  nextBillingDate: z.string().min(1, 'Datum ist erforderlich'),
  cancellationDeadline: z.string().optional(),
  icon: z.string().optional(),
  notes: z.string().max(500, 'Notiz ist zu lang').optional(),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof subscriptionSchema>;

interface SubscriptionFormProps {
  subscription?: Subscription;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

const categoryOptions: { value: SubscriptionCategory; label: string }[] = [
  { value: 'streaming', label: '🎬 Streaming' },
  { value: 'software', label: '💻 Software' },
  { value: 'fitness', label: '💪 Fitness' },
  { value: 'cloud', label: '☁️ Cloud' },
  { value: 'gaming', label: '🎮 Gaming' },
  { value: 'news', label: '📰 News' },
  { value: 'other', label: '📦 Sonstiges' },
];

const billingOptions: { value: BillingCycle; label: string }[] = [
  { value: 'weekly', label: 'Wöchentlich' },
  { value: 'monthly', label: 'Monatlich' },
  { value: 'quarterly', label: 'Vierteljährlich' },
  { value: 'yearly', label: 'Jährlich' },
];

export const SubscriptionForm = ({ subscription, onSubmit, onCancel }: SubscriptionFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: subscription?.name || '',
      price: subscription?.price || 0,
      billingCycle: subscription?.billingCycle || 'monthly',
      category: subscription?.category || 'other',
      nextBillingDate: subscription?.nextBillingDate || '',
      cancellationDeadline: subscription?.cancellationDeadline || '',
      icon: subscription?.icon || '',
      notes: subscription?.notes || '',
      isActive: subscription?.isActive ?? true,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="z.B. Netflix" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon (Emoji)</FormLabel>
                <FormControl>
                  <Input placeholder="🎬" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preis (€)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="billingCycle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Abrechnungszyklus</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Zyklus wählen" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {billingOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategorie</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategorie wählen" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nextBillingDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nächste Zahlung</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cancellationDeadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kündigungsfrist (optional)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notizen (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="z.B. 3 Monate Kündigungsfrist"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <FormLabel>Aktiv</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Abo wird in Kostenanalyse einbezogen
                </p>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            {subscription ? 'Speichern' : 'Hinzufügen'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Abbrechen
          </Button>
        </div>
      </form>
    </Form>
  );
};
