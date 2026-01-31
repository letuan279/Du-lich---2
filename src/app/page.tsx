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
      className="hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer group relative border-2 border-transparent hover:border-teal-200 rounded-2xl"
      onClick={() => router.push(`/trip/${trip.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="font-[family-name:var(--font-display)] text-xl font-bold text-gray-800">
              {trip.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-1.5 mt-2 text-base">
              <Calendar className="h-4 w-4 text-teal-500" />
              {formatDateRange(trip.startDate, trip.endDate)}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity h-10 w-10 rounded-full hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-5 w-5 text-destructive" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-5 text-base text-gray-600">
          <span className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-full">
            <Users className="h-4 w-4 text-blue-500" />
            <span className="font-medium">{trip.numberOfPeople}</span> người
          </span>
          <span className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-full">
            <MapPin className="h-4 w-4 text-green-500" />
            <span className="font-medium">{trip.days.length}</span> ngày
          </span>
        </div>
        {breakdown.total > 0 && (
          <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-base text-gray-500">Tổng chi phí</span>
              <span className="font-[family-name:var(--font-cost)] font-bold text-xl text-teal-600">
                {formatCurrency(breakdown.total, trip.currency)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-400">Mỗi người</span>
              <span className="font-[family-name:var(--font-cost)] text-base text-gray-600">
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
    <main className="min-h-screen bg-gradient-ocean p-5 md:p-10">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center md:text-left">
          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold text-gray-800">
            🌊 Du Lịch Hạ Long
          </h1>
          <p className="text-gray-500 mt-3 text-lg">
            Lập kế hoạch chuyến đi với chi phí rõ ràng
          </p>
        </header>

        <Button 
          onClick={() => router.push('/trip/new')}
          className="mb-8 bg-teal-500 hover:bg-teal-600 text-white h-12 px-6 text-base rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="h-5 w-5 mr-2" />
          Tạo chuyến đi mới
        </Button>

        {trips.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-200 rounded-2xl bg-white/80 backdrop-blur">
            <CardContent className="py-16 text-center">
              <div className="animate-bounce-soft">
                <MapPin className="h-16 w-16 mx-auto text-teal-300 mb-6" />
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-gray-700">
                Chưa có chuyến đi nào
              </h3>
              <p className="text-gray-500 mt-3 mb-6 text-lg">
                Bắt đầu lập kế hoạch chuyến du lịch đầu tiên của bạn
              </p>
              <Button 
                variant="outline"
                onClick={() => router.push('/trip/new')}
                className="h-11 px-6 text-base rounded-xl border-2 hover:bg-teal-50 hover:border-teal-300"
              >
                <Plus className="h-5 w-5 mr-2" />
                Tạo chuyến đi
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
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
