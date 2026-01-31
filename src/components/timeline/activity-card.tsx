'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Clock, MapPin, Trash2, ChevronDown, ChevronUp, MoreHorizontal, Pencil, Copy, Check, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TimeRangePicker } from '@/components/ui/time-picker';
import { cn } from '@/lib/utils';
import { CATEGORY_COLORS, CATEGORY_LABELS, type Activity, type ActivityCategory } from '@/types';
import { ACTIVITY_CATEGORIES } from '@/lib/constants';

interface ActivityCardProps {
  activity: Activity;
  currency: string;
  onUpdate: (data: Partial<Activity>) => void;
  onDelete: () => void;
  onDuplicate?: () => void;
  isDragging?: boolean;
}

export function ActivityCard({ activity, currency, onUpdate, onDelete, onDuplicate, isDragging }: ActivityCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit form state
  const [editTitle, setEditTitle] = useState(activity.title);
  const [editCategory, setEditCategory] = useState<ActivityCategory>(activity.category);
  const [editTimeStart, setEditTimeStart] = useState(activity.timeStart || '');
  const [editTimeEnd, setEditTimeEnd] = useState(activity.timeEnd || '');
  const [editLocation, setEditLocation] = useState(activity.locationText || '');
  const [editCost, setEditCost] = useState(activity.costEstimate?.toString() || '');
  const [editNotes, setEditNotes] = useState(activity.notes || '');
  
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
  const editColors = CATEGORY_COLORS[editCategory];

  const startEditing = () => {
    setEditTitle(activity.title);
    setEditCategory(activity.category);
    setEditTimeStart(activity.timeStart || '');
    setEditTimeEnd(activity.timeEnd || '');
    setEditLocation(activity.locationText || '');
    setEditCost(activity.costEstimate?.toString() || '');
    setEditNotes(activity.notes || '');
    setIsEditing(true);
  };

  const saveEdits = () => {
    onUpdate({
      title: editTitle.trim() || activity.title,
      category: editCategory,
      timeStart: editTimeStart || undefined,
      timeEnd: editTimeEnd || undefined,
      locationText: editLocation || undefined,
      costEstimate: editCost ? parseInt(editCost) : undefined,
      notes: editNotes || undefined,
    });
    setIsEditing(false);
  };

  const cancelEdits = () => {
    setIsEditing(false);
  };

  // Edit mode - full form
  if (isEditing) {
    return (
      <Card
        ref={setNodeRef}
        style={style}
        className={cn(
          'relative border-l-4 border-2 border-teal-300 rounded-xl shadow-lg',
          editColors.border
        )}
      >
        <CardContent className="p-5">
          <div className="space-y-4">
            {/* Title & Category */}
            <div className="flex gap-3">
              <div className="flex-1">
                <Label className="text-sm text-gray-500 mb-1.5 block">Tên hoạt động</Label>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Tên hoạt động"
                  autoFocus
                  className="h-11 text-base rounded-xl"
                />
              </div>
              <div className="w-40">
                <Label className="text-sm text-gray-500 mb-1.5 block">Danh mục</Label>
                <Select value={editCategory} onValueChange={(v) => setEditCategory(v as ActivityCategory)}>
                  <SelectTrigger className="h-11 text-base rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {ACTIVITY_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id} className="text-base py-2.5">
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Time & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-500 mb-1.5 block">⏰ Thời gian</Label>
                <TimeRangePicker
                  startTime={editTimeStart}
                  endTime={editTimeEnd}
                  onStartChange={setEditTimeStart}
                  onEndChange={setEditTimeEnd}
                />
              </div>
              <div>
                <Label className="text-sm text-gray-500 mb-1.5 block flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-red-400" />
                  Địa điểm
                </Label>
                <Input
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  placeholder="Nhập địa điểm"
                  className="h-11 text-base rounded-xl"
                />
              </div>
            </div>

            {/* Cost & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-500 mb-1.5 block">💰 Chi phí</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={editCost}
                    onChange={(e) => setEditCost(e.target.value)}
                    placeholder="0"
                    className="h-11 text-base rounded-xl font-[family-name:var(--font-cost)]"
                  />
                  <span className="text-base text-gray-400 font-medium">{currency === 'VND' ? '₫' : '$'}</span>
                </div>
              </div>
              <div>
                <Label className="text-sm text-gray-500 mb-1.5 block">📝 Ghi chú</Label>
                <Textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Thêm ghi chú..."
                  className="text-base rounded-xl min-h-[44px]"
                  rows={1}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                onClick={cancelEdits}
                className="h-10 px-4 text-base rounded-xl"
              >
                <X className="h-4 w-4 mr-1.5" />
                Hủy
              </Button>
              <Button
                onClick={saveEdits}
                className="h-10 px-5 text-base rounded-xl bg-teal-500 hover:bg-teal-600"
              >
                <Check className="h-4 w-4 mr-1.5" />
                Lưu
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // View mode
  return (
    <TooltipProvider>
      <Card
        ref={setNodeRef}
        style={style}
        className={cn(
          'group relative border-l-4 transition-all rounded-xl hover:shadow-md cursor-pointer',
          colors.border,
          isDragging && 'opacity-50 shadow-lg scale-[1.02]'
        )}
        onClick={() => startEditing()}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  {...attributes}
                  {...listeners}
                  className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1.5 -ml-1 hover:bg-gray-100 rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <GripVertical className="h-5 w-5 text-gray-400" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Kéo để sắp xếp</p>
              </TooltipContent>
            </Tooltip>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-base text-gray-800 truncate">
                    {activity.title}
                  </h4>
                  
                  <div className="flex items-center gap-2.5 mt-2 flex-wrap">
                    <Badge variant="secondary" className={cn('text-sm px-2.5 py-0.5 rounded-full font-medium', colors.bg, colors.text)}>
                      {CATEGORY_LABELS[activity.category]}
                    </Badge>
                    
                    {activity.timeStart && (
                      <span className="text-sm text-gray-500 flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-full">
                        <Clock className="h-3.5 w-3.5" />
                        {activity.timeStart}
                        {activity.timeEnd && ` - ${activity.timeEnd}`}
                      </span>
                    )}
                    
                    {activity.locationText && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-sm text-gray-500 flex items-center gap-1 truncate max-w-[180px]">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-red-400" />
                            {activity.locationText}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{activity.locationText}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  
                  {activity.notes && (
                    <p className="text-sm text-gray-400 mt-2 truncate">
                      📝 {activity.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                  {activity.costEstimate ? (
                    <span className="font-[family-name:var(--font-cost)] text-base font-semibold text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                      {new Intl.NumberFormat('vi-VN').format(activity.costEstimate)} {currency === 'VND' ? '₫' : '$'}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-300">--</span>
                  )}
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-9 w-9 rounded-full hover:bg-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-5 w-5 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem onClick={() => startEditing()} className="text-base py-2.5">
                  <Pencil className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </DropdownMenuItem>
                {onDuplicate && (
                  <DropdownMenuItem onClick={onDuplicate} className="text-base py-2.5">
                    <Copy className="h-4 w-4 mr-2" />
                    Nhân bản
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDelete} className="text-destructive text-base py-2.5">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
