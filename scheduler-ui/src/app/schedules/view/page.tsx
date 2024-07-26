"use client"

import {useEffect, useState} from 'react';
import LoadingComponent from '@/app/components/LoadingComponent';
import Schedule, {ScheduleType} from 'scheduler-common-sdk/src/entities/Schedule';
import Link from 'next/link';
import IconEdit from '@/app/components/icons/IconEdit';
import IconTrashFill from '@/app/components/icons/IconTrashFill';
import ScheduleCard from '@/app/components/ScheduleCard';
import {useSearchParams} from 'next/navigation';

/** The component for showing schedule data once it's been loaded. */
function ViewScheduleData(props: { schedule: Schedule }) {
  return (
      <div className="overflow-x-auto text-2xl">
        <ScheduleCard schedule={props.schedule} />
        <div className="overflow-x-auto text-2xl">
          <Link href={{
            pathname: `/schedules/update`,
            query: {
              scheduleId: props.schedule.scheduleId,
            }
          }}>
            <IconEdit/>
          </Link>
          <Link href={{
            pathname: `/schedules/delete`,
            query: {
              scheduleId: props.schedule.scheduleId,
            }
          }}>
            <IconTrashFill/>
          </Link>
        </div>
      </div>
  )
}

/**
 * The page showing a given schedule, indicated by a query parameter.
 */
export default function ViewSchedule() {
  const params = useSearchParams();
  const scheduleId = params.get('scheduleId');

  const [schedule, setSchedule] = useState<Schedule>({
    scheduleType: ScheduleType.RUNAT,
    scheduleDetail: '',
    actionUrl: '',
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(`${process.env.API_URL}/schedules/${scheduleId}`).
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