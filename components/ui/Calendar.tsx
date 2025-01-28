import React from 'react';
import { fr } from 'date-fns/locale';
import { format } from 'date-fns';
import { DayPicker, DayPickerSingleProps } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface CalendarProps extends Omit<DayPickerSingleProps, 'mode'> {
  selectedDate: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  disabledDays?: Date[];
}

export function Calendar({ selectedDate, onSelect, disabledDays, ...props }: CalendarProps) {
  return (
    <DayPicker
      mode="single"
      selected={selectedDate}
      onSelect={onSelect}
      disabled={disabledDays}
      locale={fr}
      weekStartsOn={1}
      formatters={{
        formatCaption: (date, options) => {
          return format(date, 'MMMM yyyy', { locale: fr });
        },
      }}
      modifiersClassNames={{
        selected: 'bg-primary text-white hover:bg-primary-dark',
        today: 'font-bold',
        disabled: 'text-gray-400 line-through',
      }}
      className="p-3 bg-white rounded-lg shadow-md"
      {...props}
    />
  );
}
