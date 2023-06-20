import * as React from 'react';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

function Label({ componentName, valueType, isProOnly }) {
  const content = (
    <span>
      <strong>{componentName}</strong>
    </span>
  );

  if (isProOnly) {
    return (
      <Stack direction="row" spacing={0.5} component="span">
        <Tooltip title="Included on Pro package">
          <a href="/x/introduction/licensing/#pro-plan">
            <span className="plan-pro" />
          </a>
        </Tooltip>
        {content}
      </Stack>
    );
  }

  return content;
}

export default function RangeDatePic() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DateRangePicker',
        ]}
      >
        <DemoItem
          label={
            <Label
              componentName="Date Range Picker"
              valueType="date range"
              isProOnly
            />
          }
          component="Date Range Picker"
        >
          <DateRangePicker
            localeText={{
              start: '',
              end: '',
            }}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}