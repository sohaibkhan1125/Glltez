import { useEffect, useState } from 'react';
import UpgradeModal from './UpgradeModal';
import { onUsageLimitExceeded } from '../utils/usageLimitEvents';

function UsageLimitProvider() {
  const [open, setOpen] = useState(false);
  const [resetAt, setResetAt] = useState(null);

  useEffect(() => {
    return onUsageLimitExceeded((at) => {
      setResetAt(at);
      setOpen(true);
    });
  }, []);

  return (
    <UpgradeModal
      open={open}
      resetAt={resetAt}
      onClose={() => setOpen(false)}
    />
  );
}

export default UsageLimitProvider;
