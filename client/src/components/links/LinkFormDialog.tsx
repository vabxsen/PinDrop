import type { LinkDTO } from '@pindrop/shared';
import { Dialog } from '@/components/ui/Dialog';
import { LinkForm } from './LinkForm';

interface LinkFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSaved: (link: LinkDTO) => void;
  link?: LinkDTO | null;
}

export function LinkFormDialog({ open, onClose, onSaved, link }: LinkFormDialogProps) {
  const isEdit = Boolean(link);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit link' : 'Create a new link'}
      description="Anyone with this link can be asked to share their location."
    >
      <LinkForm open={open} onClose={onClose} onSaved={onSaved} link={link} />
    </Dialog>
  );
}
