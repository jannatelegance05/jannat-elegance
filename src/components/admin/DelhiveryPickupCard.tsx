'use client';

import { FormEvent, useEffect, useState } from 'react';
import { CalendarClock, RefreshCw, Truck } from 'lucide-react';

type PendingOrder = { id: string; orderNumber: string; customerName: string; waybill: string };

const tomorrow = () => {
  const date = new Date(); date.setDate(date.getDate() + 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export default function DelhiveryPickupCard({ onSynced }: { onSynced?: () => void }) {
  const [configured, setConfigured] = useState(false);
  const [pending, setPending] = useState<PendingOrder[]>([]);
  const [pickupDate, setPickupDate] = useState(tomorrow);
  const [pickupTime, setPickupTime] = useState('11:00');
  const [packageCount, setPackageCount] = useState('1');
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadPending = async () => {
    const response = await fetch('/api/admin/shipping/pending-pickup', { credentials: 'include' });
    const data = await response.json().catch(() => null);
    if (data?.success) { setPending(data.orders); setPackageCount(String(Math.max(1, data.orders.length))); }
  };

  useEffect(() => {
    fetch('/api/admin/shipping/status', { credentials: 'include' }).then((response) => response.json()).then((data) => {
      if (data?.configured) { setConfigured(true); loadPending(); }
    }).catch(() => setConfigured(false));
  }, []);

  if (!configured) return null;

  const call = async (key: string, path: string, body?: object) => {
    setBusy(key); setError(''); setMessage('');
    try {
      const response = await fetch(path, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) throw new Error(data.error || 'Delhivery request failed.');
      return data;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Delhivery request failed.');
      return null;
    } finally { setBusy(''); }
  };

  const schedule = async (event: FormEvent) => {
    event.preventDefault();
    const data = await call('pickup', '/api/admin/shipping/pickup', { pickupDate, pickupTime, packageCount: Number(packageCount) || 1, orderIds: pending.map((order) => order.id) });
    if (data) { setMessage(`Pickup scheduled${data.pickupId ? ` (ID ${data.pickupId})` : ''} for ${pickupDate} at ${pickupTime}.`); loadPending(); }
  };

  const syncAll = async () => {
    const data = await call('sync', '/api/admin/shipping/sync-all');
    if (data) { setMessage(`Checked ${data.checked} shipment(s): ${data.updated} updated${data.failed ? `, ${data.failed} failed` : ''}.`); onSynced?.(); }
  };

  return <section className="mb-5 rounded-3xl border border-maroon-100 bg-white p-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-maroon-50 text-maroon-800"><Truck size={18} /></span>
        <div><h2 className="font-serif text-lg text-maroon-950">Delhivery pickups</h2><p className="text-xs text-gray-500">{pending.length} shipment{pending.length === 1 ? '' : 's'} awaiting pickup request</p></div>
      </div>
      <button type="button" onClick={syncAll} disabled={!!busy} className="inline-flex items-center gap-1.5 rounded-full border border-maroon-200 px-4 py-2 text-xs font-bold uppercase text-maroon-800 disabled:opacity-50"><RefreshCw size={13} className={busy === 'sync' ? 'animate-spin' : ''} />Sync all tracking</button>
    </div>
    <form onSubmit={schedule} className="mt-4 grid gap-3 sm:grid-cols-4">
      <label className="block text-[11px] font-bold uppercase text-maroon-900">Date<input type="date" required min={new Date().toISOString().slice(0, 10)} value={pickupDate} onChange={(event) => setPickupDate(event.target.value)} className="mt-1.5 w-full rounded-xl border border-maroon-100 p-2.5 text-sm font-normal" /></label>
      <label className="block text-[11px] font-bold uppercase text-maroon-900">Time<input type="time" required value={pickupTime} onChange={(event) => setPickupTime(event.target.value)} className="mt-1.5 w-full rounded-xl border border-maroon-100 p-2.5 text-sm font-normal" /></label>
      <label className="block text-[11px] font-bold uppercase text-maroon-900">Packages<input type="number" required min={1} value={packageCount} onChange={(event) => setPackageCount(event.target.value)} className="mt-1.5 w-full rounded-xl border border-maroon-100 p-2.5 text-sm font-normal" /></label>
      <button disabled={!!busy} className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-maroon-800 py-3 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50"><CalendarClock size={14} />{busy === 'pickup' ? 'Scheduling…' : 'Request pickup'}</button>
    </form>
    {pending.length > 0 && <p className="mt-3 text-xs text-gray-500">Awaiting: {pending.slice(0, 6).map((order) => `${order.orderNumber} (${order.waybill})`).join(', ')}{pending.length > 6 ? ` +${pending.length - 6} more` : ''}</p>}
    {error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {message && <p className="mt-3 rounded-xl bg-green-50 p-3 text-sm text-green-700">{message}</p>}
  </section>;
}
