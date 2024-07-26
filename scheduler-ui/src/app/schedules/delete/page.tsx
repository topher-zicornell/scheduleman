"use client"

import {useEffect, useState} from 'react';
import LoadingComponent from '@/app/components/LoadingComponent';
import Schedule, {ScheduleType} from 'scheduler-common-sdk/src/entities/Schedule';
import ScheduleCard from '@/app/components/ScheduleCard';
import {useRouter, useSearchParams} from 'next/navigation';

function ViewScheduleData(props: { schedule: Schedule }) {
  const router = useRouter();
  const submitter = async () => {
    await fetch(`${process.env.API_URL}/schedules/${props.schedule.scheduleId}`, {
      method: 'DELETE',
    });
    router.push('/schedules');
  }
  const canceller = () => {
    router.push('/schedules');
  }

  return (
      <div className="space-y-6">
        <ScheduleCard schedule={props.schedule}/>
        <p>Are you sure you want to DELETE this schedule?</p>
        <div className="overflow-x-auto">
          <button className="btn" onClick={submitter}>Confirm Delete</button>
          <button className="btn btn-primary" onClick={canceller}>Cancel</button>
        </div>

      </div>
  )
}

export default function DeleteSchedule() {
  const params = useSearchParams();
  const scheduleId = params.get('scheduleId');

  const [schedule, setSchedule] = useState<Schedule>({
    scheduleType: ScheduleType.RUNAT,
    scheduleDetail: '',
    actionUrl: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const deleteUrl = `${process.env.API_URL}/schedules/${scheduleId}`;

  useEffect(() => {
    fetch(deleteUrl).
    then(response => response.json()).
    then(data => {
      setSchedule(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (<LoadingComponent/>);
  }
  return (<ViewScheduleData schedule={schedule}/>)
}