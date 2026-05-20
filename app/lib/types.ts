export interface Thread {
  thread_id: string;
  subject: string;
  counterparty: string;
  last_reply_at: string;
  days_silent: number;
  sla_breach: boolean;
  thread_link: string;
}
