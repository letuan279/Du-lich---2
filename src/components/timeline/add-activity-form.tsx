'use client';

import { useState } from 'react';
import { Plus, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ACTIVITY_CATEGORIES } from '@/lib/constants';
import { type ActivityCategory } from '@/types';

interface AddActivityFormProps {
  onAdd: (activity: {
    title: string;
    category: ActivityCategory;
    timeStart?: string;
    timeEnd?: string;
    locationText?: string;
    costEstimate?: number;
    notes?: string;
  }) => void;
}

export function AddActivityForm({ onAdd }: AddActivityFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('other');
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [location, setLocation] = useState('');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onAdd({
      title: title.trim(),
      category,
      timeStart: timeStart || undefined,
      timeEnd: timeEnd || undefined,
      locationText: location || undefined,
      costEstimate: cost ? parseInt(cost) : undefined,
      notes: notes || undefined,
    });
    
    setTitle('');
    setCategory('other');
    setTimeStart('');
    setTimeEnd('');
    setLocation('');
    setCost('');
    setNotes('');
    setShowNotes(false);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        onClick={() => setIsOpen(true)}
        className="w-full justify-start text-muted-foreground hover:text-foreground border-dashed border"
      >
        <Plus className="h-4 w-4 mr-2" />
        Thêm hoạt động
      </Button>
    );
  }

  return (
    <Card className="border-dashed">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tên hoạt động *"
                autoFocus
              />
            </div>
            <Select value={category} onValueChange={(v) => setCategory(v as ActivityCategory)}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACTIVITY_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Thời gian
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={timeStart}
                  onChange={(e) => setTimeStart(e.target.value)}
                  className="flex-1"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="time"
                  value={timeEnd}
                  onChange={(e) => setTimeEnd(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Địa điểm
              </Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Nhập địa điểm"
              />
            </div>
          </div>

          {showNotes && (
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Ghi chú</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Thêm ghi chú cho hoạt động này..."
                rows={2}
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="Chi phí"
                className="w-32"
              />
              <span className="text-sm text-muted-foreground">₫</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowNotes(!showNotes)}
              className="text-xs"
            >
              {showNotes ? 'Ẩn ghi chú' : '+ Ghi chú'}
            </Button>
            <div className="flex-1" />
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
            >
              Hủy
            </Button>
            <Button 
              type="submit" 
              disabled={!title.trim()}
              className="bg-teal-600 hover:bg-teal-700"
            >
              Thêm
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
