import Schedule from 'scheduler-common-sdk/src/entities/Schedule';

export default function ScheduleCard(props: { schedule: Schedule }) {
  return (
      <div className="card bg-base-100 w-96 shadow-xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title">{props.schedule.scheduleType}</h2>
          <p>{props.schedule.scheduleDetail}</p>
          <p>{props.schedule.actionUrl}</p>
          <p>{props.schedule.actionBody}</p>
        </div>
      </div>
  )
}