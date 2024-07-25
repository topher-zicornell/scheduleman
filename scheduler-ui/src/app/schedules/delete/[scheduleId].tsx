"use client"

import {useEffect, useState} from 'react';
import LoadingComponent from '@/app/components/LoadingComponent';
import Schedule, {ScheduleType} from 'scheduler-common-sdk/src/entities/Schedule';
import ScheduleCard from '@/app/components/ScheduleCard';
import YesNoComponent from '@/app/components/YesNoComponent';
import {useRouter} from 'next/router';

function ViewScheduleData(props: { schedule: Schedule }) {
  const [confirmDelete, setConfirmDelete] = useState<string>('false');
  const submitter = async () => {
    if (confirmDelete === 'true') {
      await fetch(`http://localhost:5000/schedules/${props.schedule.scheduleId}`, {
        method: 'DELETE',
      });
    }
  }

  return (
      <div className="space-y-6">
        <ScheduleCard schedule={props.schedule}/>
        <p>Are you sure you want to DELETE this schedule?</p>
        <div className="overflow-x-auto">
          <YesNoComponent name="confirmDelete" onChange={setConfirmDelete}/>
        </div>

        <button className="btn btn-primary" onClick={submitter}>Confirm Delete</button>
      </div>
  )
}

export default function DeleteSchedule() {
  const router = useRouter();
  const { scheduleId } = router.query;
  const [schedule, setSchedule] = useState<Schedule>({
    scheduleType: ScheduleType.RUNAT,
    scheduleDetail: '',
    actionUrl: '',
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(`http://localhost:5000/schedules/${scheduleId}`).
    then(response => response.json()).
    then(data => {
      setSchedule(data);
      setLoading(false);
    });
  });

  if (loading) {
    return (<LoadingComponent/>);
  }
  return (<ViewScheduleData schedule={schedule}/>)
}