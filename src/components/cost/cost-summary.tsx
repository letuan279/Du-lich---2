'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn, formatCurrency } from '@/lib/utils';
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
      <Card className="sticky top-20 rounded-2xl shadow-lg border-2 border-teal-100">
        <CardHeader className="pb-3">
          <CardTitle className="font-[family-name:var(--font-display)] text-xl font-bold text-gray-800">
            💰 Chi phí ước tính
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="text-center py-5 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl">
            <p className="text-base text-gray-500 mb-2">Tổng chi phí</p>
            <p className="font-[family-name:var(--font-cost)] text-4xl font-bold text-teal-600">
              {formatCurrency(breakdown.total, currency)}
            </p>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="mt-3 inline-flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full cursor-help">
                  <span className="text-base text-gray-600 font-medium">
                    {formatCurrency(breakdown.perPerson, currency)}
                  </span>
                  <span className="text-sm text-gray-400">/ người</span>
                  <span className="text-sm bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">
                    {numberOfPeople} người
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Chia đều cho {numberOfPeople} người</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <Separator className="bg-gray-200" />

          <div>
            <h4 className="text-base font-bold text-gray-700 mb-4">📊 Theo danh mục</h4>
            <div className="space-y-4">
              {breakdown.byCategory.length === 0 ? (
                <p className="text-base text-gray-400 text-center py-4">
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
                          <div className="flex justify-between text-base mb-2">
                            <span className={cn('font-medium', colors.text)}>
                              {CATEGORY_LABELS[cat.category]}
                            </span>
                            <span className="font-[family-name:var(--font-cost)] font-semibold">
                              {formatCurrency(cat.total, currency)}
                            </span>
                          </div>
                          <Progress 
                            value={percentage} 
                            className="h-3 rounded-full"
                            style={{ 
                              '--progress-background': hexColor 
                            } as React.CSSProperties}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">{percentage}% tổng chi phí</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })
              )}
            </div>
          </div>

          {breakdown.byDay.length > 0 && (
            <>
              <Separator className="bg-gray-200" />
              <div>
                <h4 className="text-base font-bold text-gray-700 mb-4">📅 Theo ngày</h4>
                <ScrollArea className={breakdown.byDay.length > 5 ? 'h-40' : ''}>
                  <div className="space-y-2 pr-2">
                    {breakdown.byDay.map((day, index) => (
                      <div key={day.dayId} className="flex justify-between text-base items-center py-1.5 px-2 hover:bg-gray-50 rounded-lg">
                        <span className="text-gray-500">Ngày {index + 1}</span>
                        <span className="font-[family-name:var(--font-cost)] font-semibold text-gray-700">
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
