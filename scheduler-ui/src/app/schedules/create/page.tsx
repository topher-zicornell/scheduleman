"use client"

import ScheduleForm from '@/app/components/ScheduleForm';
import {ScheduleType} from 'scheduler-common-sdk/src/entities/Schedule';

/**
 * The page for creating a new schedule.
 */
export default function CreateSchedule() {
  return (
      <ScheduleForm action={`${process.env.API_URL}/schedules`} method="POST"
          submitLabel="Create Schedule"
          schedule={{
            scheduleType: ScheduleType.RUNAT,
            scheduleDetail: '',
            actionUrl: '',
          }}
      />
  );
}