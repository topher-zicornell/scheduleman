"use client"

import IconCardText from '@/app/components/icons/IconCardText';
import Link from 'next/link';
import IconEdit from '@/app/components/icons/IconEdit';
import IconTrashFill from '@/app/components/icons/IconTrashFill';
import Schedule, {ScheduleType} from 'scheduler-common-sdk/src/entities/Schedule';
import {useEffect, useState} from 'react';
import LoadingComponent from '@/app/components/LoadingComponent';

function ViewScheduleId(props: { scheduleId: string }) {
  return (
      <div className="overflow-x-auto">
        {props.scheduleId}
      </div>
  );
}

function ViewScheduleType(props: { scheduleType: string }) {
  return (
      <div className="overflow-x-auto">
        {props.scheduleType}
      </div>
  );
}

function ViewScheduleDetails(props: { scheduleDetails: string }) {
  return (
      <div className="overflow-x-auto">
        {props.scheduleDetails}
      </div>

  );
}

function ViewActionUrl(props: { actionUrl: string }) {
  return (
      <div className="overflow-x-auto">
        {props.actionUrl}
      </div>
  );
}

function ViewActionBody(props: { actionBody: string }) {
  return (
      <div className="overflow-x-auto">
        {props.actionBody}
      </div>
  );
}

function ActionButtons(props: { scheduleId: string }) {
  return (
      <div className="overflow-x-auto">
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
                  <td><ViewScheduleId scheduleId={schedule.scheduleId || ''} /></td>
                  <td><ViewScheduleType scheduleType={ScheduleType[schedule.scheduleType]} /></td>
                  <td><ViewScheduleDetails scheduleDetails={schedule.scheduleDetail} /></td>
                  <td><ViewActionUrl actionUrl={schedule.actionUrl} /></td>
                  <td><ViewActionBody actionBody={schedule.actionBody || ''} /></td>
                  <td><ActionButtons scheduleId={schedule.scheduleId || ''} /></td>
                </tr>
            ))
          }
          </tbody>
        </table>
      </div>
  )
}

export default function SchedulesList() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('http://localhost:5000/schedules').
        then(response => response.json()).
        then(data => {
          setSchedules(data);
          setLoading(false);
        });
  });

  if (loading) {
    return (<LoadingComponent />);
  }
  return (<ScheduleListData scheduleList={schedules} />)
}