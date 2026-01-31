import type { Trip } from '@/types';

// Encode trip data to URL-safe base64 for sharing
export function encodeTripForShare(trip: Trip): string {
  const shareData = {
    t: trip.title,
    sd: trip.startDate,
    ed: trip.endDate,
    c: trip.currency,
    np: trip.numberOfPeople,
    d: trip.days.map((day) => ({
      dt: day.date,
      a: day.activities.map((activity) => ({
        ti: activity.title,
        ts: activity.timeStart,
        te: activity.timeEnd,
        l: activity.locationText,
        ml: activity.mapLink,
        cat: activity.category,
        co: activity.costEstimate,
        n: activity.notes,
      })),
    })),
  };
  
  const jsonStr = JSON.stringify(shareData);
  // Use base64url encoding (URL-safe)
  const base64 = btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (_, p1) =>
    String.fromCharCode(parseInt(p1, 16))
  ));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Decode trip data from URL-safe base64
export function decodeTripFromShare(encoded: string): Trip | null {
  try {
    // Restore base64 padding and characters
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    
    const jsonStr = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const data = JSON.parse(jsonStr);
    
    // Reconstruct Trip object
    const trip: Trip = {
      id: 'shared-' + Date.now(),
      title: data.t,
      startDate: data.sd,
      endDate: data.ed,
      timezone: 'Asia/Ho_Chi_Minh',
      currency: data.c || 'VND',
      numberOfPeople: data.np || 2,
      days: data.d.map((day: { dt: string; a: Array<{ ti: string; ts?: string; te?: string; l?: string; ml?: string; cat: string; co?: number; n?: string }> }, dayIndex: number) => ({
        id: `day-${dayIndex}`,
        tripId: 'shared',
        date: day.dt,
        orderIndex: dayIndex,
        activities: day.a.map((a, actIndex: number) => ({
          id: `activity-${dayIndex}-${actIndex}`,
          dayId: `day-${dayIndex}`,
          title: a.ti,
          timeStart: a.ts,
          timeEnd: a.te,
          locationText: a.l,
          mapLink: a.ml,
          category: a.cat,
          costEstimate: a.co,
          notes: a.n,
          orderIndex: actIndex,
        })),
      })),
      costSettings: { splitMode: 'equal' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return trip;
  } catch (e) {
    console.error('Failed to decode share link:', e);
    return null;
  }
}

export function generateShareUrl(trip: Trip): string {
  const encoded = encodeTripForShare(trip);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}/share/${encoded}`;
}
