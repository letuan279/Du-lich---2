'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Clock, MapPin, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CATEGORY_COLORS, CATEGORY_LABELS, type Activity } from '@/types';

interface ActivityCardProps {
  activity: Activity;
  currency: string;
  onUpdate: (data: Partial<Activity>) => void;
  onDelete: () => void;
  isDragging?: boolean;
}

export function ActivityCard({ activity, currency, onUpdate, onDelete, isDragging }: ActivityCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: activity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const colors = CATEGORY_COLORS[activity.category];

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative border-l-4 transition-all',
        colors.border,
        isDragging && 'opacity-50 shadow-lg scale-[1.02]'
      )}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <button
            {...attributes}
            {...listeners}
            className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1 -ml-1"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <Input
                    value={activity.title}
                    onChange={(e) => onUpdate({ title: e.target.value })}
                    onBlur={() => setIsEditing(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                    autoFocus
                    className="h-7 text-sm font-medium"
                  />
                ) : (
                  <h4 
                    className="font-medium text-sm truncate cursor-pointer hover:text-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    {activity.title}
                  </h4>
                )}
                
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="secondary" className={cn('text-xs', colors.bg, colors.text)}>
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
                    <span className="text-xs text-muted-foreground flex items-center gap-0.5 truncate max-w-[150px]">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {activity.locationText}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Input
                  type="number"
                  value={activity.costEstimate || ''}
                  onChange={(e) => onUpdate({ costEstimate: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  className="w-24 h-7 text-right font-[family-name:var(--font-cost)] text-sm"
                />
                <span className="text-xs text-muted-foreground">{currency === 'VND' ? '₫' : '$'}</span>
              </div>
            </div>

            {(activity.notes || isExpanded) && (
              <div className="mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-6 px-2 text-xs text-muted-foreground"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      Thu gọn
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      Ghi chú
                    </>
                  )}
                </Button>
                
                {isExpanded && (
                  <textarea
                    value={activity.notes || ''}
                    onChange={(e) => onUpdate({ notes: e.target.value })}
                    placeholder="Thêm ghi chú..."
                    className="w-full mt-2 p-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    rows={2}
                  />
                )}
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
