'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import { CATEGORY_COLORS, CATEGORY_LABELS, type CostBreakdown } from '@/types';

interface CostSummaryProps {
  breakdown: CostBreakdown;
  currency: string;
  numberOfPeople: number;
}

export function CostSummary({ breakdown, currency, numberOfPeople }: CostSummaryProps) {

  return (
    <Card className="sticky top-20">
      <CardHeader className="pb-2">
        <CardTitle className="font-[family-name:var(--font-display)] text-lg">
          Chi phí ước tính
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-4 bg-teal-50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Tổng chi phí</p>
          <p className="font-[family-name:var(--font-cost)] text-3xl font-bold text-teal-700">
            {formatCurrency(breakdown.total, currency)}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {formatCurrency(breakdown.perPerson, currency)} / người
            <span className="text-xs ml-1">({numberOfPeople} người)</span>
          </p>
        </div>

        <Separator />

        <div>
          <h4 className="text-sm font-medium mb-3">Theo danh mục</h4>
          <div className="space-y-2">
            {breakdown.byCategory.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-2">
                Chưa có chi phí nào
              </p>
            ) : (
              breakdown.byCategory.map((cat) => {
                const colors = CATEGORY_COLORS[cat.category];
                const percentage = (cat.total / breakdown.total) * 100;
                return (
                  <div key={cat.category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className={colors.text}>
                        {CATEGORY_LABELS[cat.category]}
                      </span>
                      <span className="font-[family-name:var(--font-cost)]">
                        {formatCurrency(cat.total, currency)}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: colors.text.replace('text-', '').includes('blue') ? '#3B82F6' :
                            colors.text.includes('orange') ? '#F97316' :
                            colors.text.includes('purple') ? '#8B5CF6' :
                            colors.text.includes('pink') ? '#EC4899' : '#6B7280',
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {breakdown.byDay.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium mb-3">Theo ngày</h4>
              <div className="space-y-1">
                {breakdown.byDay.map((day, index) => (
                  <div key={day.dayId} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ngày {index + 1}</span>
                    <span className="font-[family-name:var(--font-cost)]">
                      {formatCurrency(day.total, currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
