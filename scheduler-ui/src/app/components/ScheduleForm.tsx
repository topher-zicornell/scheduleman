import Schedule, {ScheduleType} from 'scheduler-common-sdk/src/entities/Schedule';

export default function ScheduleForm(props: { schedule: Schedule, action: string, method: string,
    submitLabel: string }) {
  return (
      <form className="space-y-6" action={props.action} method={props.method}>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">What kind of schedule is this?</span>
          </div>
          <select className="select select-bordered"
              name="scheduleType" value={props.schedule.scheduleType}>
            <option disabled selected>Pick one</option>
            <option value="RUNAT">Run At a Specific Time</option>
            <option value="RUNIN">Run In Some Time From Now</option>
            <option value="RUNON">Run On A cron-style Schedule</option>
          </select>
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">When To Run</span>
          </div>
          <input name="scheduleDetail" type="text" value={props.schedule.scheduleDetail}
              className="input input-bordered w-full max-w-xs"/>
          <div className="label">
            <span
                className={`label-text-alt ${props.schedule.scheduleType == ScheduleType.RUNAT ? '' : 'hidden'}`}>
              Use the format: "Jan 01 2024 10:14:50"
            </span>
            <span
                className={`label-text-alt ${props.schedule.scheduleType == ScheduleType.RUNIN ? '' : 'hidden'}`}>
              Use the format: "15 mins", "2 hours"
            </span>
            <span
                className={`label-text-alt ${props.schedule.scheduleType == ScheduleType.RUNON ? '' : 'hidden'}`}>
              Use standard cron format: secs mins hour dom mon dow
            </span>
          </div>
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Trigger URL</span>
          </div>
          <input name="actionUrl" type="text" value={props.schedule.actionUrl}
                 className="input input-bordered w-full max-w-xs"/>
          <div className="label">
                <span className="label-text-alt">
                  The full URL of the webhook to trigger this action.
                </span>
          </div>
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Trigger Body</span>
          </div>
          <input name="actionBody" type="text" value={props.schedule.actionBody}
                 className="input input-bordered w-full max-w-xs"/>
          <div className="label">
                <span className="label-text-alt">
                  Any webhook body needed for this action. JSON is ok.
                </span>
          </div>
        </label>

        <button type="submit" className="btn btn-primary">{props.submitLabel}</button>

      </form>
  );
}