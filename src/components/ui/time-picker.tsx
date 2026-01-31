'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface TimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

export function TimePicker({ value, onChange, placeholder = 'Chọn giờ', disabled, className }: TimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value || '');

  React.useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  const handleSelect = (hour: string, minute: string) => {
    const newValue = `${hour}:${minute}`;
    setInputValue(newValue);
    onChange(newValue);
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    // Validate and propagate if valid time format
    if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val)) {
      onChange(val);
    }
  };

  const handleInputBlur = () => {
    // Format on blur if partially valid
    if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(inputValue)) {
      const [h, m] = inputValue.split(':');
      const formatted = `${h.padStart(2, '0')}:${m}`;
      setInputValue(formatted);
      onChange(formatted);
    } else if (inputValue && !value) {
      setInputValue('');
    }
  };

  const currentHour = value?.split(':')[0] || '';
  const currentMinute = value?.split(':')[1] || '';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 border-b">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="HH:MM"
            className="font-mono text-center"
          />
        </div>
        <div className="flex">
          <div className="border-r">
            <div className="px-3 py-2 text-xs font-medium text-muted-foreground">Giờ</div>
            <ScrollArea className="h-48">
              <div className="p-1">
                {HOURS.map((hour) => (
                  <Button
                    key={hour}
                    variant={currentHour === hour ? 'default' : 'ghost'}
                    size="sm"
                    className={cn(
                      'w-full justify-center font-mono',
                      currentHour === hour && 'bg-teal-600 hover:bg-teal-700'
                    )}
                    onClick={() => handleSelect(hour, currentMinute || '00')}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
          <div>
            <div className="px-3 py-2 text-xs font-medium text-muted-foreground">Phút</div>
            <ScrollArea className="h-48">
              <div className="p-1">
                {MINUTES.map((minute) => (
                  <Button
                    key={minute}
                    variant={currentMinute === minute ? 'default' : 'ghost'}
                    size="sm"
                    className={cn(
                      'w-full justify-center font-mono',
                      currentMinute === minute && 'bg-teal-600 hover:bg-teal-700'
                    )}
                    onClick={() => handleSelect(currentHour || '08', minute)}
                  >
                    {minute}
                  </Button>
                ))}
                {/* Additional minutes for flexibility */}
                {['05', '10', '20', '25', '35', '40', '50', '55'].map((minute) => (
                  <Button
                    key={minute}
                    variant={currentMinute === minute ? 'default' : 'ghost'}
                    size="sm"
                    className={cn(
                      'w-full justify-center font-mono text-muted-foreground',
                      currentMinute === minute && 'bg-teal-600 hover:bg-teal-700 text-white'
                    )}
                    onClick={() => handleSelect(currentHour || '08', minute)}
                  >
                    {minute}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        <div className="p-2 border-t flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={() => {
              setInputValue('');
              onChange('');
              setOpen(false);
            }}
          >
            Xóa
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-teal-600 hover:bg-teal-700"
            onClick={() => setOpen(false)}
          >
            Xong
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface TimeRangePickerProps {
  startTime?: string;
  endTime?: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  disabled?: boolean;
}

export function TimeRangePicker({ startTime, endTime, onStartChange, onEndChange, disabled }: TimeRangePickerProps) {
  return (
    <div className="flex items-center gap-2">
      <TimePicker
        value={startTime}
        onChange={onStartChange}
        placeholder="Bắt đầu"
        disabled={disabled}
        className="flex-1"
      />
      <span className="text-muted-foreground">-</span>
      <TimePicker
        value={endTime}
        onChange={onEndChange}
        placeholder="Kết thúc"
        disabled={disabled}
        className="flex-1"
      />
    </div>
  );
}
