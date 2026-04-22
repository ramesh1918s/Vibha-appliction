export const formatCurrency = (amount: number, currency = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateStr: string, options?: Intl.DateTimeFormatOptions): string => {
  return new Date(dateStr).toLocaleDateString('en-IN', options || {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

export const formatTime = (dateStr: string): string => {
  return new Date(dateStr).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit',
  });
};

export const formatDateTime = (dateStr: string): string =>
  `${formatDate(dateStr)} • ${formatTime(dateStr)}`;

export const getRelativeTime = (dateStr: string): string => {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
};

export const maskAccountNumber = (num: string): string =>
  num.replace(/\d(?=\d{4})/g, '*');

export const getProgressPercent = (current: number, target: number): number =>
  Math.min(100, Math.round((current / target) * 100));

export const getDaysUntil = (dateStr: string): number => {
  const now = new Date();
  const target = new Date(dateStr);
  return Math.ceil((target.getTime() - now.getTime()) / 86400000);
};

export const getRemainingTenureMonths = (paidEMIs: number, totalEMIs: number): number =>
  totalEMIs - paidEMIs;

export const getCreditScoreLabel = (score: number): { label: string; color: string } => {
  if (score >= 750) return { label: 'Excellent', color: '#10b981' };
  if (score >= 700) return { label: 'Good', color: '#22c55e' };
  if (score >= 650) return { label: 'Fair', color: '#f59e0b' };
  if (score >= 600) return { label: 'Poor', color: '#f97316' };
  return { label: 'Very Poor', color: '#ef4444' };
};

export const getLoanTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    personal: 'Personal Loan', home: 'Home Loan', gold: 'Gold Loan',
    vehicle: 'Vehicle Loan', education: 'Education Loan',
    business: 'Business Loan', health: 'Health Loan',
  };
  return labels[type] || type;
};

export const getLoanTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    personal: '👤', home: '🏠', gold: '🪙',
    vehicle: '🚗', education: '🎓', business: '💼', health: '🏥',
  };
  return icons[type] || '💰';
};

export const generateId = (): string =>
  `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const classNames = (...classes: (string | undefined | null | false)[]): string =>
  classes.filter(Boolean).join(' ');
