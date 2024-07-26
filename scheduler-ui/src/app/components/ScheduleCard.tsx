import Schedule, {ScheduleType} from 'scheduler-common-sdk/src/entities/Schedule';

function translateScheduleType(scheduleType: ScheduleType) {
  switch (scheduleType) {
    case ScheduleType.RUNAT:
      return 'Run At a Specific Time';
    case ScheduleType.RUNIN:
      return 'Run In Some Time From Now';
    case ScheduleType.RUNON:
      return 'Run On A cron-style Schedule';
    default:
      return 'Unknown';
  }
}

export default function ScheduleCard(props: { schedule: Schedule }) {
  return (
      <div className="card bg-base-100 w-96 shadow-xl">
        <div className="card-body items-center text-center">
          <p className="card-title">{translateScheduleType(props.schedule.scheduleType)}</p>
          <p className="card-normal">{props.schedule.scheduleDetail}</p>
          <p className="card-normal">{props.schedule.actionUrl}</p>
          <p className="card-normal">{props.schedule.actionBody}</p>
          <p className="card-normal">{props.schedule.scheduleId}</p>
        </div>
      </div>
  )
}