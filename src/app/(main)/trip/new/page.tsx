'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar as CalendarIcon, Users, Coins } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useTripStore } from '@/stores/trip-store';
import { DEFAULT_CURRENCY, DEFAULT_NUMBER_OF_PEOPLE, CURRENCIES } from '@/lib/constants';

export default function NewTripPage() {
  const router = useRouter();
  const createTrip = useTripStore((state) => state.createTrip);
  
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
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
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        numberOfPeople,
        currency,
      });
      router.push(`/trip/${trip.id}`);
    } catch (error) {
      console.error('Failed to create trip:', error);
      setIsSubmitting(false);
    }
  };

  const isValid = title && startDate && endDate && endDate >= startDate;

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
            <TooltipProvider>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Tên chuyến đi *</Label>
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
                    <Label className="flex items-center gap-1.5">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      Ngày đi *
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !startDate && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, 'dd/MM/yyyy', { locale: vi }) : 'Chọn ngày'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => {
                            setStartDate(date);
                            if (date && (!endDate || date > endDate)) {
                              setEndDate(date);
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      Ngày về *
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !endDate && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, 'dd/MM/yyyy', { locale: vi }) : 'Chọn ngày'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          disabled={(date) => startDate ? date < startDate : false}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numberOfPeople" className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      Số người
                    </Label>
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
                    <Label className="flex items-center gap-1.5">
                      <Coins className="h-4 w-4 text-muted-foreground" />
                      Tiền tệ
                    </Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.symbol} {c.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="flex-1">
                        <Button 
                          type="submit" 
                          disabled={!isValid || isSubmitting}
                          className="w-full bg-teal-600 hover:bg-teal-700"
                        >
                          {isSubmitting ? 'Đang tạo...' : 'Tạo chuyến đi'}
                        </Button>
                      </span>
                    </TooltipTrigger>
                    {!isValid && (
                      <TooltipContent>
                        <p>Vui lòng điền đầy đủ thông tin</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </div>
              </form>
            </TooltipProvider>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
