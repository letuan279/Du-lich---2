'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatCurrency } from '@/lib/utils';
import { CATEGORY_COLORS, CATEGORY_LABELS, type CostBreakdown } from '@/types';

const CATEGORY_HEX: Record<string, string> = {
  transport: '#3B82F6',
  food: '#F97316',
  stay: '#8B5CF6',
  tickets: '#EC4899',
  other: '#6B7280',
};

interface CostSummaryProps {
  breakdown: CostBreakdown;
  currency: string;
  numberOfPeople: number;
}

export function CostSummary({ breakdown, currency, numberOfPeople }: CostSummaryProps) {
  return (
    <TooltipProvider>
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
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-sm text-muted-foreground mt-2 cursor-help">
                  {formatCurrency(breakdown.perPerson, currency)} / người
                  <span className="text-xs ml-1">({numberOfPeople} người)</span>
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p>Chia đều cho {numberOfPeople} người</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-3">Theo danh mục</h4>
            <div className="space-y-3">
              {breakdown.byCategory.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-2">
                  Chưa có chi phí nào
                </p>
              ) : (
                breakdown.byCategory.map((cat) => {
                  const colors = CATEGORY_COLORS[cat.category];
                  const percentage = Math.round((cat.total / breakdown.total) * 100);
                  const hexColor = CATEGORY_HEX[cat.category] || '#6B7280';
                  return (
                    <Tooltip key={cat.category}>
                      <TooltipTrigger asChild>
                        <div className="cursor-default">
                          <div className="flex justify-between text-sm mb-1">
                            <span className={colors.text}>
                              {CATEGORY_LABELS[cat.category]}
                            </span>
                            <span className="font-[family-name:var(--font-cost)]">
                              {formatCurrency(cat.total, currency)}
                            </span>
                          </div>
                          <Progress 
                            value={percentage} 
                            className="h-2"
                            style={{ 
                              '--progress-background': hexColor 
                            } as React.CSSProperties}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{percentage}% tổng chi phí</p>
                      </TooltipContent>
                    </Tooltip>
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
                <ScrollArea className={breakdown.byDay.length > 5 ? 'h-32' : ''}>
                  <div className="space-y-1 pr-2">
                    {breakdown.byDay.map((day, index) => (
                      <div key={day.dayId} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Ngày {index + 1}</span>
                        <span className="font-[family-name:var(--font-cost)]">
                          {formatCurrency(day.total, currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
