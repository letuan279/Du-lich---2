'use client';

import { useRouter } from 'next/navigation';
import { Plus, MapPin, Calendar, Users, Trash2 } from 'lucide-react';
import { useMounted } from '@/hooks/use-mounted';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTripStore } from '@/stores/trip-store';
import { formatDateRange, formatCurrency } from '@/lib/utils';
import type { Trip } from '@/types';

function TripCard({ trip, onDelete }: { trip: Trip; onDelete: () => void }) {
  const router = useRouter();
  const getCostBreakdown = useTripStore((state) => state.getCostBreakdown);
  const breakdown = getCostBreakdown(trip.id);
  
  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer group relative"
      onClick={() => router.push(`/trip/${trip.id}`)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="font-[family-name:var(--font-display)] text-lg">
              {trip.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDateRange(trip.startDate, trip.endDate)}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {trip.numberOfPeople} người
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {trip.days.length} ngày
          </span>
        </div>
        {breakdown.total > 0 && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Tổng chi phí</span>
              <span className="font-[family-name:var(--font-cost)] font-medium text-primary">
                {formatCurrency(breakdown.total, trip.currency)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-muted-foreground">Mỗi người</span>
              <span className="font-[family-name:var(--font-cost)] text-sm">
                {formatCurrency(breakdown.perPerson, trip.currency)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  const router = useRouter();
  const trips = useTripStore((state) => state.trips);
  const deleteTrip = useTripStore((state) => state.deleteTrip);
  const mounted = useMounted();

  if (!mounted) {
    return (
      <main className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-gray-900">
            Du Lịch Hạ Long
          </h1>
          <p className="text-muted-foreground mt-1">
            Lập kế hoạch chuyến đi với chi phí rõ ràng
          </p>
        </header>

        <Button 
          onClick={() => router.push('/trip/new')}
          className="mb-6 bg-teal-600 hover:bg-teal-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tạo chuyến đi mới
        </Button>

        {trips.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-[family-name:var(--font-display)] text-lg font-medium text-gray-700">
                Chưa có chuyến đi nào
              </h3>
              <p className="text-muted-foreground mt-1 mb-4">
                Bắt đầu lập kế hoạch chuyến du lịch đầu tiên của bạn
              </p>
              <Button 
                variant="outline"
                onClick={() => router.push('/trip/new')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Tạo chuyến đi
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {trips.map((trip) => (
              <TripCard 
                key={trip.id} 
                trip={trip} 
                onDelete={() => deleteTrip(trip.id)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
