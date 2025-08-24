export interface Affiliate {
  id: string; 
  name: string;
  createdAt: string;
  clicks: Click[];
}

export interface Campaign {
  id: string;
  name: string;
  createdAt: string;
  clicks: Click[];
}

export interface Click {
  id: number;
  affiliateId: string; // (FK -> Affiliate.id)
  campaignId: string; // (FK -> Campaign.id)
  clickId: string; // Unique string
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;

  affiliate: Affiliate;
  campaign: Campaign;
  conversions: Conversion[];
}

export interface Conversion {
  id: string;
  clickId: string; // FK -> Click.clickId
  amount?: number | null;
  currency: string; // Default "USD"
  createdAt: string;

  click: Click;
}
