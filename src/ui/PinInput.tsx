import { useState, type FormEvent } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { isValidIndianPincode } from '../core/utils/pinResolver';
import { usePinRecord } from '../core/services/pinDirectory';

interface PinInputProps {
  initial?: string;
  onSubmit: (pin: string) => void;
  label?: string;
  submitLabel?: string;
  compact?: boolean;
  id?: string;
}

/** Six-digit PIN entry with inline validation and the resolved area underneath. */
export function PinInput({ initial = '', onSubmit, label = 'PIN code', submitLabel = 'Go', compact = false, id = 'pin-input' }: PinInputProps) {
  const [value, setValue] = useState(initial);
  const [touched, setTouched] = useState(false);
  const valid = isValidIndianPincode(value);
  const lookup = usePinRecord(valid ? value.trim() : '');
  const showError = touched && value.length > 0 && !valid;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (valid) onSubmit(value.trim());
  };

  return (
    <form onSubmit={submit} className="field" noValidate>
      {!compact && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <div style={{ display: 'flex', gap: 'var(--s-2)' }}>
        <div className="input-group" style={{ flex: 1, maxWidth: compact ? 200 : 260 }}>
          <MapPin size={16} aria-hidden="true" />
          <input
            id={id}
            className="input num"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={6}
            placeholder="e.g. 110001"
            aria-label={compact ? label : undefined}
            aria-invalid={showError || undefined}
            aria-describedby={`${id}-hint`}
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
            onBlur={() => setTouched(true)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {submitLabel}
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
      <div id={`${id}-hint`} className={showError ? 'error-text' : 'hint'}>
        {showError
          ? 'Enter a valid 6-digit Indian PIN code.'
          : lookup.status === 'found'
            ? `${lookup.record.district}, ${lookup.record.state}`
            : lookup.status === 'loading'
              ? 'Looking up…'
              : lookup.status === 'missing'
                ? 'Not in the India Post directory. Check the number.'
                : 'Six digits, first digit 1 to 9.'}
      </div>
    </form>
  );
}
