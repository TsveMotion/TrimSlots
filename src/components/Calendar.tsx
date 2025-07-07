import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';

interface CalendarProps {
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
}

export const Calendar: React.FC<CalendarProps> = ({ value, onChange, className }) => {
  const footer = (
    <p className="text-sm text-center mt-2">
      {format(value, 'PPP')}
    </p>
  );

  return (
    <div className={className}>
      <DayPicker
        mode="single"
        selected={value}
        onSelect={(date) => date && onChange(date)}
        footer={footer}
        className="mx-auto"
        modifiersClassNames={{
          selected: 'bg-indigo-600 text-white rounded-full',
          today: 'font-bold border border-indigo-500 rounded-full',
        }}
      />
    </div>
  );
};
