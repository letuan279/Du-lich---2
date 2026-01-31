'use client';

import { useState } from 'react';
import { Plus, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TimeRangePicker } from '@/components/ui/time-picker';
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
        className="w-full justify-start text-gray-400 hover:text-teal-600 border-2 border-dashed border-gray-200 hover:border-teal-300 h-12 text-base rounded-xl transition-all hover:bg-teal-50"
      >
        <Plus className="h-5 w-5 mr-2" />
        Thêm hoạt động
      </Button>
    );
  }

  return (
    <Card className="border-2 border-dashed border-teal-200 rounded-xl bg-white/80">
      <CardContent className="p-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tên hoạt động *"
                autoFocus
                className="h-11 text-base rounded-xl"
              />
            </div>
            <Select value={category} onValueChange={(v) => setCategory(v as ActivityCategory)}>
              <SelectTrigger className="w-40 h-11 text-base rounded-xl">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-500 font-medium">⏰ Thời gian</Label>
              <TimeRangePicker
                startTime={timeStart}
                endTime={timeEnd}
                onStartChange={setTimeStart}
                onEndChange={setTimeEnd}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-red-400" />
                Địa điểm
              </Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Nhập địa điểm"
                className="h-11 text-base rounded-xl"
              />
            </div>
          </div>

          {showNotes && (
            <div className="space-y-2">
              <Label className="text-sm text-gray-500 font-medium">📝 Ghi chú</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Thêm ghi chú cho hoạt động này..."
                rows={2}
                className="text-base rounded-xl"
              />
            </div>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="Chi phí"
                className="w-36 h-11 text-base rounded-xl"
              />
              <span className="text-base text-gray-400 font-medium">₫</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowNotes(!showNotes)}
              className="text-sm h-9 px-3 rounded-lg hover:bg-gray-100"
            >
              {showNotes ? 'Ẩn ghi chú' : '+ Ghi chú'}
            </Button>
            <div className="flex-1" />
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="h-11 px-5 text-base rounded-xl"
            >
              Hủy
            </Button>
            <Button 
              type="submit" 
              disabled={!title.trim()}
              className="bg-teal-500 hover:bg-teal-600 h-11 px-6 text-base rounded-xl shadow-md"
            >
              Thêm
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
