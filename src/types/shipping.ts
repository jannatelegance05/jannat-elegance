export type DelhiveryScan = {
  status: string;
  statusType: string;
  location: string;
  instructions: string;
  at: string | null;
};

export type DelhiveryShipment = {
  waybill: string;
  reference: string;
  paymentMode: string;
  shippingMode: string;
  weightGrams: number;
  status: string;
  statusType: string;
  location: string;
  instructions: string;
  statusAt: string | null;
  expectedDeliveryDate: string | null;
  createdAt: string | null;
  cancelledAt: string | null;
  lastSyncedAt: string | null;
  lastError: string;
  pickupRequestedAt: string | null;
  pickupId: string;
  scans: DelhiveryScan[];
};

export type ShippingInfo = {
  courierName: string;
  trackingNumber: string;
  trackingUrl: string;
  provider?: 'manual' | 'delhivery';
  delhivery?: DelhiveryShipment | null;
};
