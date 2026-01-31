'use client';

/**
 * Time Picker component based on shadcn-date-time-picker pattern
 * @see https://time.rdsx.dev/
 * Uses Select components for hour/minute selection with 24h format
 */

import * as React from 'react';
import { Clock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface TimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

export function TimePicker({ value, onChange, disabled, className }: TimePickerProps) {
  const [hour, minute] = React.useMemo(() => {
    if (!value) return ['', ''];
    const [h, m] = value.split(':');
    return [h || '', m || ''];
  }, [value]);

  const handleHourChange = (newHour: string) => {
    const newMinute = minute || '00';
    onChange(`${newHour}:${newMinute}`);
  };

  const handleMinuteChange = (newMinute: string) => {
    const newHour = hour || '08';
    onChange(`${newHour}:${newMinute}`);
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Select value={hour} onValueChange={handleHourChange} disabled={disabled}>
        <SelectTrigger className="w-[70px]">
          <SelectValue placeholder="--" />
        </SelectTrigger>
        <SelectContent className="max-h-[200px]">
          {HOURS.map((h) => (
            <SelectItem key={h} value={h}>
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-muted-foreground">:</span>
      <Select value={minute} onValueChange={handleMinuteChange} disabled={disabled}>
        <SelectTrigger className="w-[70px]">
          <SelectValue placeholder="--" />
        </SelectTrigger>
        <SelectContent>
          {MINUTES.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface TimeRangePickerProps {
  startTime?: string;
  endTime?: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  disabled?: boolean;
  showLabels?: boolean;
}

export function TimeRangePicker({ 
  startTime, 
  endTime, 
  onStartChange, 
  onEndChange, 
  disabled,
  showLabels = false 
}: TimeRangePickerProps) {
  return (
    <div className="flex items-end gap-3">
      <div className="space-y-1">
        {showLabels && <Label className="text-xs text-muted-foreground">Bắt đầu</Label>}
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <TimePicker
            value={startTime}
            onChange={onStartChange}
            disabled={disabled}
          />
        </div>
      </div>
      <span className="text-muted-foreground pb-2">→</span>
      <div className="space-y-1">
        {showLabels && <Label className="text-xs text-muted-foreground">Kết thúc</Label>}
        <TimePicker
          value={endTime}
          onChange={onEndChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
