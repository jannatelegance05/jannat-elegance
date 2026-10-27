'use client';

import { useEffect, useState } from 'react';
import { Ban, Download, ExternalLink, PackagePlus, RefreshCw, Truck } from 'lucide-react';
import DelhiveryTimeline from '@/components/DelhiveryTimeline';
import type { ShippingInfo } from '@/types/shipping';

type Settings = { configured: boolean; environment: string; pickupLocation: string; shippingMode: string; defaults: { weightGrams: number; lengthCm: number; widthCm: number; heightCm: number } };
type Quote = { serviceability: { serviceable: boolean; prepaid: boolean; cod: boolean; city: string; state: string; remarks: string }; rate: { total: number } | null; paymentMode: string };
type Props = { orderId: string; orderStatus: string; shippingInfo: ShippingInfo; onUpdated: (update: { status: string; shippingInfo: ShippingInfo }) => void };

const inputClass = 'mt-1.5 w-full rounded-xl border border-maroon-100 p-2.5 text-sm font-normal';
const labelClass = 'block text-[11px] font-bold uppercase text-maroon-900';

async function request(path: string, init?: RequestInit) {
  const response = await fetch(path, { credentials: 'include', ...init, headers: init?.body ? { 'Content-Type': 'application/json' } : undefined });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) throw new Error(data.error || 'Delhivery request failed.');
  return data;
}

export default function DelhiveryPanel({ orderId, orderStatus, shippingInfo, onUpdated }: Props) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [weightGrams, setWeightGrams] = useState('');
  const [lengthCm, setLengthCm] = useState('');
  const [widthCm, setWidthCm] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [shippingMode, setShippingMode] = useState('Surface');
  const [sendEmail, setSendEmail] = useState(true);
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const shipment = shippingInfo?.delhivery && !shippingInfo.delhivery.cancelledAt ? shippingInfo.delhivery : null;
  const closed = ['cancelled', 'delivered', 'returned'].includes(orderStatus);

  useEffect(() => {
    request('/api/admin/shipping/status').then((data: Settings) => {
      setSettings(data);
      setWeightGrams(String(data.defaults.weightGrams)); setLengthCm(String(data.defaults.lengthCm)); setWidthCm(String(data.defaults.widthCm)); setHeightCm(String(data.defaults.heightCm)); setShippingMode(data.shippingMode);
    }).catch(() => setSettings(null));
  }, []);

  useEffect(() => {
    if (!settings?.configured || shipment || closed) return;
    const timer = setTimeout(() => {
      request(`/api/admin/shipping/orders/${orderId}/quote?weightGrams=${Number(weightGrams) || ''}&shippingMode=${shippingMode}`).then(setQuote).catch(() => setQuote(null));
    }, 400);
    return () => clearTimeout(timer);
  }, [settings?.configured, shipment, closed, orderId, weightGrams, shippingMode]);

  const run = async (key: string, action: () => Promise<void>) => {
    setBusy(key); setError(''); setMessage('');
    try { await action(); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Delhivery request failed.'); } finally { setBusy(''); }
  };

  const createShipment = () => run('create', async () => {
    const data = await request(`/api/admin/shipping/orders/${orderId}/shipment`, { method: 'POST', body: JSON.stringify({ weightGrams: Number(weightGrams) || undefined, lengthCm: Number(lengthCm) || undefined, widthCm: Number(widthCm) || undefined, heightCm: Number(heightCm) || undefined, shippingMode, sendEmail }) });
    onUpdated(data); setMessage(`Shipment created. AWB ${data.shippingInfo.trackingNumber}.${data.notificationFailed ? ' Customer email could not be sent.' : ''}`);
  });
  const sync = () => run('sync', async () => {
    const data = await request(`/api/admin/shipping/orders/${orderId}/sync`, { method: 'POST' });
    onUpdated(data); setMessage(data.statusChanged ? 'Tracking synced and order status updated.' : 'Tracking synced.');
  });
  const label = () => run('label', async () => {
    const data = await request(`/api/admin/shipping/orders/${orderId}/label`);
    window.open(data.url, '_blank', 'noopener,noreferrer');
  });
  const cancel = () => {
    if (!window.confirm('Cancel this Delhivery shipment? The AWB will be voided and you can create a new shipment later.')) return;
    run('cancel', async () => {
      const data = await request(`/api/admin/shipping/orders/${orderId}/cancel`, { method: 'POST' });
      onUpdated(data); setMessage('Delhivery shipment cancelled.');
    });
  };

  return <div className="space-y-4 rounded-3xl border border-maroon-100 bg-white p-6">
    <div className="flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2 font-serif text-xl text-maroon-950"><Truck size={20} />Delhivery One</h2>
      {settings?.configured && <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${settings.environment === 'production' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>{settings.environment}</span>}
    </div>
    {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {message && <p className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{message}</p>}

    {!settings ? <p className="text-sm text-gray-500">Loading Delhivery settings…</p>
      : !settings.configured ? <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">Delhivery is not configured. Add <code>DELHIVERY_API_TOKEN</code> and <code>DELHIVERY_PICKUP_LOCATION</code> to the backend environment.</p>
      : shipment ? <>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><p className="text-[11px] font-bold uppercase text-gray-500">AWB</p><p className="font-mono font-bold text-maroon-950">{shipment.waybill}</p></div>
          <div><p className="text-[11px] font-bold uppercase text-gray-500">Mode</p><p className="font-semibold">{shipment.shippingMode} · {shipment.paymentMode}</p></div>
          <div><p className="text-[11px] font-bold uppercase text-gray-500">Weight</p><p className="font-semibold">{shipment.weightGrams} g</p></div>
          <div><p className="text-[11px] font-bold uppercase text-gray-500">Last synced</p><p className="font-semibold">{shipment.lastSyncedAt ? new Date(shipment.lastSyncedAt).toLocaleString('en-IN') : '—'}</p></div>
        </div>
        {shipment.pickupRequestedAt && <p className="text-xs font-semibold text-green-700">Pickup requested {new Date(shipment.pickupRequestedAt).toLocaleDateString('en-IN')}{shipment.pickupId ? ` · ID ${shipment.pickupId}` : ''}</p>}
        {shipment.lastError && <p className="rounded-xl bg-amber-50 p-2.5 text-xs text-amber-800">Last sync error: {shipment.lastError}</p>}
        <DelhiveryTimeline shipment={shipment} limit={8} />
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={sync} disabled={!!busy} className="inline-flex items-center justify-center gap-1.5 rounded-full border border-maroon-200 py-2.5 text-xs font-bold uppercase text-maroon-800 disabled:opacity-50"><RefreshCw size={13} className={busy === 'sync' ? 'animate-spin' : ''} />Sync</button>
          <button type="button" onClick={label} disabled={!!busy} className="inline-flex items-center justify-center gap-1.5 rounded-full border border-maroon-200 py-2.5 text-xs font-bold uppercase text-maroon-800 disabled:opacity-50"><Download size={13} />{busy === 'label' ? 'Loading…' : 'Label'}</button>
          {shippingInfo.trackingUrl && <a href={shippingInfo.trackingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 rounded-full border border-maroon-200 py-2.5 text-xs font-bold uppercase text-maroon-800"><ExternalLink size={13} />Track</a>}
          {!['delivered', 'returned', 'out_for_delivery', 'in_transit'].includes(orderStatus) && <button type="button" onClick={cancel} disabled={!!busy} className="inline-flex items-center justify-center gap-1.5 rounded-full border border-red-200 py-2.5 text-xs font-bold uppercase text-red-700 disabled:opacity-50"><Ban size={13} />{busy === 'cancel' ? 'Cancelling…' : 'Cancel'}</button>}
        </div>
      </>
      : closed ? <p className="text-sm text-gray-500">This order is {orderStatus.replace(/_/g, ' ')} and cannot be shipped.</p>
      : <>
        {quote && <div className={`rounded-xl p-3 text-sm ${quote.serviceability.serviceable ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>
          {quote.serviceability.serviceable ? <>Pincode serviceable{quote.serviceability.city ? ` (${quote.serviceability.city})` : ''} · {quote.paymentMode}</> : <>Delhivery does not serve this pincode{quote.serviceability.remarks ? `: ${quote.serviceability.remarks}` : ''}.</>}
          {quote.rate && quote.rate.total > 0 && <span className="block text-xs font-semibold">Estimated charge: ₹{quote.rate.total.toLocaleString('en-IN')}</span>}
        </div>}
        <div className="grid grid-cols-2 gap-3">
          <label className={labelClass}>Weight (g)<input type="number" min={1} value={weightGrams} onChange={(event) => setWeightGrams(event.target.value)} className={inputClass} /></label>
          <label className={labelClass}>Mode<select value={shippingMode} onChange={(event) => setShippingMode(event.target.value)} className={inputClass}><option>Surface</option><option>Express</option></select></label>
          <label className={labelClass}>Length (cm)<input type="number" min={1} value={lengthCm} onChange={(event) => setLengthCm(event.target.value)} className={inputClass} /></label>
          <label className={labelClass}>Width (cm)<input type="number" min={1} value={widthCm} onChange={(event) => setWidthCm(event.target.value)} className={inputClass} /></label>
          <label className={labelClass}>Height (cm)<input type="number" min={1} value={heightCm} onChange={(event) => setHeightCm(event.target.value)} className={inputClass} /></label>
        </div>
        <p className="text-xs text-gray-500">Pickup from <span className="font-semibold">{settings.pickupLocation || '— not set —'}</span></p>
        <label className="flex items-center gap-2 text-sm font-semibold text-maroon-900"><input type="checkbox" checked={sendEmail} onChange={(event) => setSendEmail(event.target.checked)} />Email tracking details to customer</label>
        <button type="button" onClick={createShipment} disabled={!!busy || quote?.serviceability.serviceable === false} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-maroon-800 py-3 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50"><PackagePlus size={15} />{busy === 'create' ? 'Creating shipment…' : 'Create Delhivery shipment'}</button>
      </>}
  </div>;
}
