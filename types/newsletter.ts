export interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
  is_active: boolean;
  source: 'modal' | 'footer';
  has_promo: boolean;
  promo: string;
}

export interface NewsletterSubscriberFormData {
  email: string;
  source: 'modal' | 'footer';
  has_promo: boolean;
}

export interface NewsletterSubscription {
  id: number;
  email: string;
  source: string;
  has_promo: boolean;
  promo_code: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewsletterSubscriptionInput {
  email: string;
  source: string;
  has_promo?: boolean;
  promo_code?: string;
  is_active?: boolean;
}
