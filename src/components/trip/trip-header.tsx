'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Share2, Users, Calendar, Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { formatDateRange } from '@/lib/utils';
import { generateShareUrl } from '@/lib/share';
import type { Trip } from '@/types';

interface TripHeaderProps {
  trip: Trip;
  onUpdateTitle: (title: string) => void;
}

export function TripHeader({ trip, onUpdateTitle }: TripHeaderProps) {
  const router = useRouter();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(trip.title);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTitleSave = () => {
    if (title.trim() && title !== trip.title) {
      onUpdateTitle(title.trim());
    }
    setIsEditingTitle(false);
  };

  const shareUrl = generateShareUrl(trip);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b px-4 py-3 md:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/')}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="min-w-0">
              {isEditingTitle ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
                  autoFocus
                  className="font-[family-name:var(--font-display)] text-lg font-semibold h-9"
                />
              ) : (
                <h1
                  onClick={() => setIsEditingTitle(true)}
                  className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-900 truncate cursor-pointer hover:text-teal-600"
                >
                  {trip.title}
                </h1>
              )}
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDateRange(trip.startDate, trip.endDate)}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {trip.numberOfPeople} người
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setShowShareDialog(true)}
            className="shrink-0 bg-teal-600 hover:bg-teal-700"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Chia sẻ
          </Button>
        </div>
      </header>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-[family-name:var(--font-display)]">
              Chia sẻ chuyến đi
            </DialogTitle>
            <DialogDescription>
              Sao chép link bên dưới để chia sẻ kế hoạch chuyến đi (chỉ xem)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1 font-mono text-sm"
              />
              <Button
                onClick={handleCopy}
                variant={copied ? 'default' : 'outline'}
                className={copied ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Đã sao chép
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Sao chép
                  </>
                )}
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Người nhận link sẽ xem được toàn bộ kế hoạch nhưng không thể chỉnh sửa.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
