'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Users, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTripStore } from '@/stores/trip-store';
import { DEFAULT_CURRENCY, DEFAULT_NUMBER_OF_PEOPLE, CURRENCIES } from '@/lib/constants';

export default function NewTripPage() {
  const router = useRouter();
  const createTrip = useTripStore((state) => state.createTrip);
  
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(DEFAULT_NUMBER_OF_PEOPLE);
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startDate || !endDate) return;
    
    setIsSubmitting(true);
    try {
      const trip = createTrip({
        title,
        startDate,
        endDate,
        numberOfPeople,
        currency,
      });
      router.push(`/trip/${trip.id}`);
    } catch (error) {
      console.error('Failed to create trip:', error);
      setIsSubmitting(false);
    }
  };

  const isValid = title && startDate && endDate && new Date(endDate) >= new Date(startDate);

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="font-[family-name:var(--font-display)] text-2xl">
              Tạo chuyến đi mới
            </CardTitle>
            <CardDescription>
              Điền thông tin cơ bản để bắt đầu lập kế hoạch
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Tên chuyến đi *
                </label>
                <Input
                  id="title"
                  placeholder="VD: Du lịch Hạ Long 3 ngày 2 đêm"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="startDate" className="text-sm font-medium flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Ngày đi *
                  </label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (!endDate || new Date(e.target.value) > new Date(endDate)) {
                        setEndDate(e.target.value);
                      }
                    }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="endDate" className="text-sm font-medium flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Ngày về *
                  </label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="numberOfPeople" className="text-sm font-medium flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Số người
                  </label>
                  <Input
                    id="numberOfPeople"
                    type="number"
                    min={1}
                    max={50}
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="currency" className="text-sm font-medium flex items-center gap-1.5">
                    <Coins className="h-4 w-4 text-muted-foreground" />
                    Tiền tệ
                  </label>
                  <select
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.symbol} {c.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  disabled={!isValid || isSubmitting}
                  className="flex-1 bg-teal-600 hover:bg-teal-700"
                >
                  {isSubmitting ? 'Đang tạo...' : 'Tạo chuyến đi'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
