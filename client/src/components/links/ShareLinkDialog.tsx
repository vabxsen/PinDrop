import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';

interface ShareLinkDialogProps {
  open: boolean;
  onClose: () => void;
  shortId: string;
}

export function ShareLinkDialog({ open, onClose, shortId }: ShareLinkDialogProps) {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/l/${shortId}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Share link"
      description="Anyone with this link or QR code can open it."
    >
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800">
          <QRCodeSVG value={url} size={180} />
        </div>
        <div className="flex w-full items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <span className="min-w-0 flex-1 truncate">{url}</span>
        </div>
        <Button onClick={handleCopy} className="w-full">
          {copied ? 'Copied!' : 'Copy link'}
        </Button>
      </div>
    </Dialog>
  );
}
