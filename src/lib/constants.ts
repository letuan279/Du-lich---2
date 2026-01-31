export const DEFAULT_CURRENCY = 'VND';
export const DEFAULT_TIMEZONE = 'Asia/Ho_Chi_Minh';
export const DEFAULT_NUMBER_OF_PEOPLE = 2;

export const CURRENCIES = [
  { code: 'VND', symbol: '₫', name: 'Việt Nam Đồng' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
] as const;

export const ACTIVITY_CATEGORIES = [
  { id: 'transport', label: 'Di chuyển', icon: 'Car' },
  { id: 'food', label: 'Ăn uống', icon: 'Utensils' },
  { id: 'stay', label: 'Lưu trú', icon: 'Bed' },
  { id: 'tickets', label: 'Vé tham quan', icon: 'Ticket' },
  { id: 'other', label: 'Khác', icon: 'Package' },
] as const;
