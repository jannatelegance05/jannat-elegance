import { MapPin, Truck } from 'lucide-react';
import type { DelhiveryShipment } from '@/types/shipping';

const formatDate = (value: string | null) => (value ? new Date(value).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }) : '');
const cleanLocation = (value: string) => value.replace(/_/g, ' ').replace(/\s*\(.*?\)\s*/g, ' ').trim();

export default function DelhiveryTimeline({ shipment, limit }: { shipment: DelhiveryShipment; limit?: number }) {
  const scans = [...(shipment.scans || [])].reverse();
  const visible = limit ? scans.slice(0, limit) : scans;
  return <div className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-maroon-50/60 p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-maroon-800 text-white"><Truck size={18} /></span>
        <div>
          <p className="text-sm font-bold text-maroon-950">{shipment.status || 'Shipment created'}</p>
          <p className="text-xs text-gray-600">{[cleanLocation(shipment.location), formatDate(shipment.statusAt)].filter(Boolean).join(' · ')}</p>
        </div>
      </div>
      {shipment.expectedDeliveryDate && <p className="text-xs font-semibold text-maroon-800">Expected by {new Date(shipment.expectedDeliveryDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</p>}
    </div>
    {visible.length > 0 && <ol className="relative ml-2 space-y-4 border-l border-maroon-100 pl-5">
      {visible.map((scan, index) => <li key={`${scan.status}-${scan.at}-${index}`} className="relative">
        <span className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-white ${index === 0 ? 'bg-maroon-800' : 'bg-maroon-200'}`} />
        <p className="text-sm font-semibold text-maroon-950">{scan.instructions || scan.status}</p>
        <p className="mt-0.5 flex flex-wrap items-center gap-1 text-xs text-gray-500">{scan.location && <><MapPin size={11} />{cleanLocation(scan.location)} · </>}{formatDate(scan.at)}</p>
      </li>)}
    </ol>}
  </div>;
}
