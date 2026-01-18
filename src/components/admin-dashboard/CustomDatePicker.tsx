"use client";
import * as React from 'react';
import dayjs from 'dayjs';
import { useForkRef } from '@mui/material/utils';
import Button from '@mui/material/Button';
import { Calendar } from 'lucide-react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker, DatePickerFieldProps } from '@mui/x-date-pickers/DatePicker';
import type { Dayjs } from "dayjs";
import {
  useParsedFormat,
  usePickerContext,
  useSplitFieldProps,
} from '@mui/x-date-pickers';
import type { DatePickerConfig } from './types';

const CALENDAR_ICON_SIZE = 16;
const DATE_FORMAT = 'MMM DD, YYYY';
const DEFAULT_VIEWS: ('day' | 'month' | 'year')[] = ['day', 'month', 'year'];

type ButtonFieldProps = DatePickerFieldProps;

const getButtonStyles = () => ({
  minWidth: 'fit-content',
});

const formatDateValue = (value: Dayjs | null, format: string) => {
  return value == null ? null : value.format(format);
};

const ButtonField = (props: ButtonFieldProps) => {
  const { forwardedProps } = useSplitFieldProps(props, 'date');
  const pickerContext = usePickerContext();
  const handleRef = useForkRef(pickerContext.triggerRef, pickerContext.rootRef);
  const parsedFormat = useParsedFormat();
  const valueStr =
    pickerContext.value == null
      ? parsedFormat
      : pickerContext.value.format(pickerContext.fieldFormat);

  const togglePicker = () => {
    pickerContext.setOpen((previousState) => !previousState);
  };

  return (
    <Button
      {...forwardedProps}
      variant="outlined"
      ref={handleRef}
      size="small"
      startIcon={<Calendar size={CALENDAR_ICON_SIZE} />}
      sx={getButtonStyles()}
      onClick={togglePicker}
    >
      {pickerContext.label ?? valueStr}
    </Button>
  );
};

const CustomDatePicker = ({
  defaultValue = dayjs(),
  value: controlledValue,
  onChange,
  label,
  views = DEFAULT_VIEWS,
}: DatePickerConfig) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = (newValue: Dayjs | null) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const getLabel = () => {
    return label ?? formatDateValue(value, DATE_FORMAT);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={value}
        label={getLabel()}
        onChange={handleChange}
        slots={{ field: ButtonField }}
        slotProps={{
          nextIconButton: { size: 'small' },
          previousIconButton: { size: 'small' },
        }}
        views={views}
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;