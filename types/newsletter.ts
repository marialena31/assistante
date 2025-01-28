export interface NewsletterSubscription {
  id: string;
  email: string;
  created_at: string;
  is_deleted: boolean;
  categories: string[];
  promo_code_used?: boolean;
  last_modal_shown?: string;
}
