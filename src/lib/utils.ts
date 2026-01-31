import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'VND'): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string, locale: string = 'vi-VN'): string {
  return new Date(date).toLocaleDateString(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const sameMonth = start.getMonth() === end.getMonth();
  const sameYear = start.getFullYear() === end.getFullYear();
  
  if (sameMonth && sameYear) {
    return `${start.getDate()} - ${end.getDate()} Th${start.getMonth() + 1}, ${start.getFullYear()}`;
  }
  if (sameYear) {
    return `${start.getDate()} Th${start.getMonth() + 1} - ${end.getDate()} Th${end.getMonth() + 1}, ${start.getFullYear()}`;
  }
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

export function getDayNumber(tripStartDate: string, dayDate: string): number {
  const start = new Date(tripStartDate);
  const day = new Date(dayDate);
  return Math.floor((day.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}
