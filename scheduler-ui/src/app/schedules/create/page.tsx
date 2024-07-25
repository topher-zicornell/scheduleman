"use client"

import ScheduleForm from '@/app/components/ScheduleForm';
import {ScheduleType} from 'scheduler-common-sdk/src/entities/Schedule';

export default function CreateSchedule() {
  return (
      <ScheduleForm action="http://localhost:5000/schedules" method="POST"
          submitLabel="Create Schedule"
          schedule={{
            scheduleType: ScheduleType.RUNAT,
            scheduleDetail: '',
            actionUrl: '',
          }}
      />
  );
}