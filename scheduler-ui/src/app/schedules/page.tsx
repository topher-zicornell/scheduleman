"use client"

import IconCardText from '@/app/components/icons/IconCardText';
import Link from 'next/link';
import IconEdit from '@/app/components/icons/IconEdit';
import IconTrashFill from '@/app/components/icons/IconTrashFill';
import Schedule, {ScheduleType} from 'scheduler-common-sdk/src/entities/Schedule';
import {useEffect, useState} from 'react';
import IconCalendarPlus from '@/app/components/icons/IconCalendarPlus';

/** A component wrap for schedule ids. */
function ViewScheduleId(props: { scheduleId: string }) {
  return (
      <div className="overflow-x-auto">
        {props.scheduleId}
      </div>
  );
}

/** A component wrap for schedule types. */
function ViewScheduleType(props: { scheduleType: string }) {
  return (
      <div className="overflow-x-auto">
        {props.scheduleType}
      </div>
  );
}

/** A component wrap for schedule details. */
function ViewScheduleDetails(props: { scheduleDetails: string }) {
  return (
      <div className="overflow-x-auto">
        {props.scheduleDetails}
      </div>

  );
}

/** A component wrap for action urls. */
function ViewActionUrl(props: { actionUrl: string }) {
  return (
      <div className="overflow-x-auto">
        {props.actionUrl}
      </div>
  );
}

/** A component wrap for action bodies. */
function ViewActionBody(props: { actionBody: string }) {
  return (
      <div className="overflow-x-auto">
        {props.actionBody}
      </div>
  );
}

/** A component wrap for schedule-specific actions. */
function ActionButtons(props: { scheduleId: string }) {
  return (
      <div className="overflow-x-auto text-2xl">
        <Link href={{
          pathname: `/schedules/view`,
          query: {
            scheduleId: props.scheduleId,
          }
        }}>
          <IconCardText />
        </Link>
        <Link href={{
          pathname: `/schedules/update`,
          query: {
            scheduleId: props.scheduleId,
          }
        }}>
          <IconEdit />
        </Link>
        <Link href={{
          pathname: `/schedules/delete`,
          query: {
            scheduleId: props.scheduleId,
          }
        }}>
          <IconTrashFill />
        </Link>
      </div>
  );
}

/** A handy component for showing a list of schedules. */
function ScheduleListData(props: { scheduleList: Schedule[] }) {
  return (
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
          <tr>
            <th>Schedule Id</th>
            <th>Schedule Type</th>
            <th>Schedule Details</th>
            <th>Action URL</th>
            <th>Action Body</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          {
            props.scheduleList.map((schedule) => (
                <tr key={schedule.scheduleId}>
                  <td><ViewScheduleId scheduleId={schedule.scheduleId || ''}/></td>
                  <td><ViewScheduleType scheduleType={ScheduleType[schedule.scheduleType]}/></td>
                  <td><ViewScheduleDetails scheduleDetails={schedule.scheduleDetail}/></td>
                  <td><ViewActionUrl actionUrl={schedule.actionUrl}/></td>
                  <td><ViewActionBody actionBody={schedule.actionBody || ''}/></td>
                  <td><ActionButtons scheduleId={schedule.scheduleId || ''}/></td>
                </tr>
            ))
          }
          </tbody>
        </table>
        <div className="overflow-x-auto w-10 h-10 flex justify-center text-2xl">
          <Link href="/schedules/create">
            <IconCalendarPlus/>
          </Link>
        </div>
    </div>
  )
}

/**
 * The page showing all the currently defined schedules.
 */
export default function SchedulesList() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    fetch(`${process.env.API_URL}/schedules`)
      .then((dataResponse) => {
          if (dataResponse.body) {
            return dataResponse.json();
          }
          return [];
        })
      .then((dataBody) => {
          setSchedules(dataBody);
        })
  }, []);

  return (<ScheduleListData scheduleList={schedules} />)
}