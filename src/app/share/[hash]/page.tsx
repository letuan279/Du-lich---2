'use client';

import { use, useMemo } from 'react';
import { Calendar, Users, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { decodeTripFromShare } from '@/lib/share';
import { formatDate, formatDateRange, formatCurrency } from '@/lib/utils';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/types';

export default function ShareViewPage({ params }: { params: Promise<{ hash: string }> }) {
  const { hash } = use(params);
  
  const { trip, error } = useMemo(() => {
    const decoded = decodeTripFromShare(hash);
    return { trip: decoded, error: !decoded };
  }, [hash]);

  if (error || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-12 text-center">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold mb-2">
              Không tìm thấy chuyến đi
            </h2>
            <p className="text-muted-foreground">
              Link chia sẻ không hợp lệ hoặc đã hết hạn.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalCost = trip.days.reduce(
    (sum, day) => sum + day.activities.reduce((daySum, a) => daySum + (a.costEstimate || 0), 0),
    0
  );
  const perPerson = trip.numberOfPeople > 0 ? Math.ceil(totalCost / trip.numberOfPeople) : totalCost;

  const categoryTotals = trip.days.flatMap(d => d.activities).reduce((acc, a) => {
    acc[a.category] = (acc[a.category] || 0) + (a.costEstimate || 0);
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white print:bg-white">
      {/* Hero Section */}
      <header className="px-4 py-12 md:py-16 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {trip.title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-muted-foreground mb-6">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDateRange(trip.startDate, trip.endDate)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {trip.numberOfPeople} người
          </span>
        </div>

        {/* Stats Cards */}
        <div className="flex justify-center gap-4 flex-wrap max-w-lg mx-auto">
          <Card className="flex-1 min-w-[140px]">
            <CardContent className="py-4 text-center">
              <p className="text-sm text-muted-foreground">Tổng chi phí</p>
              <p className="font-[family-name:var(--font-cost)] text-2xl font-bold text-teal-700">
                {formatCurrency(totalCost, trip.currency)}
              </p>
            </CardContent>
          </Card>
          <Card className="flex-1 min-w-[140px]">
            <CardContent className="py-4 text-center">
              <p className="text-sm text-muted-foreground">Mỗi người</p>
              <p className="font-[family-name:var(--font-cost)] text-2xl font-bold">
                {formatCurrency(perPerson, trip.currency)}
              </p>
            </CardContent>
          </Card>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pb-12">
        {/* Timeline */}
        <div className="space-y-8">
          {trip.days.map((day, dayIndex) => (
            <section key={day.id}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-semibold">
                  {dayIndex + 1}
                </div>
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">
                    Ngày {dayIndex + 1}
                  </h2>
                  <p className="text-sm text-muted-foreground">{formatDate(day.date)}</p>
                </div>
              </div>

              <div className="ml-5 border-l-2 border-teal-200 pl-6 space-y-3">
                {day.activities.length === 0 ? (
                  <p className="text-muted-foreground italic py-2">Chưa có hoạt động</p>
                ) : (
                  day.activities.map((activity) => {
                    const colors = CATEGORY_COLORS[activity.category];
                    return (
                      <Card key={activity.id} className={`border-l-4 ${colors.border}`}>
                        <CardContent className="py-3 px-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="font-medium">{activity.title}</h3>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <Badge variant="secondary" className={`${colors.bg} ${colors.text}`}>
                                  {CATEGORY_LABELS[activity.category]}
                                </Badge>
                                {activity.timeStart && (
                                  <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                                    <Clock className="h-3 w-3" />
                                    {activity.timeStart}
                                    {activity.timeEnd && ` - ${activity.timeEnd}`}
                                  </span>
                                )}
                                {activity.locationText && (
                                  <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                                    <MapPin className="h-3 w-3" />
                                    {activity.locationText}
                                  </span>
                                )}
                              </div>
                              {activity.notes && (
                                <p className="text-sm text-muted-foreground mt-2">{activity.notes}</p>
                              )}
                            </div>
                            {activity.costEstimate && activity.costEstimate > 0 && (
                              <span className="font-[family-name:var(--font-cost)] text-sm font-medium shrink-0">
                                {formatCurrency(activity.costEstimate, trip.currency)}
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </section>
          ))}
        </div>

        {/* Cost Breakdown */}
        {totalCost > 0 && (
          <>
            <Separator className="my-8" />
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold mb-4">
                Chi phí theo danh mục
              </h2>
              <div className="space-y-3">
                {Object.entries(categoryTotals)
                  .filter(([_, total]) => total > 0)
                  .sort((a, b) => (b[1] as number) - (a[1] as number))
                  .map(([category, total]) => {
                    const colors = CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS];
                    const percentage = (total / totalCost) * 100;
                    return (
                      <div key={category}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className={colors.text}>
                            {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                          </span>
                          <span className="font-[family-name:var(--font-cost)]">
                            {formatCurrency(total, trip.currency)}
                          </span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: category === 'transport' ? '#3B82F6' :
                                category === 'food' ? '#F97316' :
                                category === 'stay' ? '#8B5CF6' :
                                category === 'tickets' ? '#EC4899' : '#6B7280',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </section>
          </>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground print:hidden">
          <p>Được tạo bằng Du Lịch Hạ Long Trip Planner</p>
        </footer>
      </main>
    </div>
  );
}
