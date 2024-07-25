"use client"

import {useEffect, useState} from 'react';
import LoadingComponent from '@/app/components/LoadingComponent';
import Schedule, {ScheduleType} from 'scheduler-common-sdk/src/entities/Schedule';
import ScheduleForm from '@/app/components/ScheduleForm';
import {useRouter} from 'next/router';

export default function UpdateSchedule() {
  const router = useRouter();
  const { scheduleId } = router.query;
  const [schedule, setSchedule] = useState<Schedule>({
    scheduleType: ScheduleType.RUNAT,
    scheduleDetail: '',
    actionUrl: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const updateUrl = `http://localhost:5000/schedules/${scheduleId}`;

  useEffect(() => {
    fetch(updateUrl).
    then(response => response.json()).
    then(data => {
      setSchedule(data);
      setLoading(false);
    });
  });

  if (loading) {
    return (<LoadingComponent/>);
  }
  return (
      <ScheduleForm action={updateUrl} method="PUT"
          submitLabel="Update Schedule"
          schedule={schedule}
      />
  );
}