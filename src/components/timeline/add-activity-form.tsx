'use client';

import { useState } from 'react';
import { Plus, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
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
    });
    
    setTitle('');
    setCategory('other');
    setTimeStart('');
    setTimeEnd('');
    setLocation('');
    setCost('');
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
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tên hoạt động *"
              autoFocus
              className="flex-1"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ActivityCategory)}
              className="w-32 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {ACTIVITY_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input
                type="time"
                value={timeStart}
                onChange={(e) => setTimeStart(e.target.value)}
                placeholder="Bắt đầu"
                className="flex-1"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="time"
                value={timeEnd}
                onChange={(e) => setTimeEnd(e.target.value)}
                placeholder="Kết thúc"
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Địa điểm"
                className="flex-1"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="Chi phí ước tính"
              className="w-40"
            />
            <span className="text-sm text-muted-foreground">₫</span>
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
