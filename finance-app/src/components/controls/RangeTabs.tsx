import type { Range } from '../../../shared/types';

const RANGES: Range[] = ['1d', '7d', '3m'];

const LABELS: Record<Range, string> = {
  '1d': '1 dia',
  '7d': '7 dias',
  '3m': 'Trimestre',
};

interface RangeTabsProps {
  value: Range;
  onChange: (range: Range) => void;
}

export function RangeTabs({ value, onChange }: RangeTabsProps) {
  return (
    <div className="range-tabs" role="radiogroup" aria-label="Janela de tempo">
      {RANGES.map((range) => (
        <button
          key={range}
          type="button"
          role="radio"
          aria-checked={value === range}
          className={value === range ? 'range-tab active' : 'range-tab'}
          onClick={() => onChange(range)}
        >
          {LABELS[range]}
        </button>
      ))}
    </div>
  );
}
