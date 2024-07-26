import Schedule, {ScheduleType} from 'scheduler-common-sdk/src/entities/Schedule';
import {useState} from 'react';
import {useRouter} from 'next/navigation';

export default function ScheduleForm(props: { schedule: Schedule, action: string, method: string,
    submitLabel: string }) {
  const router = useRouter();
  const [scheduleType, setScheduleType] = useState<ScheduleType>(props.schedule.scheduleType);
  const [scheduleDetail, setScheduleDetail] = useState<string>(props.schedule.scheduleDetail);
  const [actionUrl, setActionUrl] = useState<string>(props.schedule.actionUrl);
  const [actionBody, setActionBody] = useState<string>(props.schedule.actionBody || '');

  const actionCall = async () => {
    await fetch(props.action, {
      method: props.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scheduleType: scheduleType,
        scheduleDetail: scheduleDetail,
        actionUrl: actionUrl,
        actionBody: actionBody,
      }),
    });
    router.push('/schedules');
  }

  const determineScheduleTypeTip = (scheduleType: ScheduleType): string => {
    switch (scheduleType) {
      case ScheduleType.RUNAT:
        return 'Use the format: "Jan 01 2024 10:14:50".  TZ is UTC.';
      case ScheduleType.RUNIN:
        return 'Use the format: "15 mins", "2 hours"';
      case ScheduleType.RUNON:
        return 'Use standard cron format: secs mins hour dom mon dow'
    }
    return '';
  }

  return (
      <div className="space-y-6">
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">What kind of schedule is this?</span>
          </div>
          <select className="select select-bordered"
              name="scheduleType"
              value={scheduleType}
              onChange={event => { // @ts-ignore
                setScheduleType(event.target.value)
              }}
          >
            <option value={ScheduleType.RUNAT}>Run At a Specific Time</option>
            <option value={ScheduleType.RUNIN}>Run In Some Time From Now</option>
            <option value={ScheduleType.RUNAT}>Run On A cron-style Schedule</option>
          </select>
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">When To Run</span>
          </div>
          <input name="scheduleDetail" type="text"
              value={scheduleDetail}
              onChange={event => {
                setScheduleDetail(event.target.value);
                const element = document.getElementById('scheduleDetailTip');
                if (element) {
                  element.textContent = determineScheduleTypeTip(scheduleType);
                }
              }}
              className="input input-bordered w-full max-w-xs"/>
          <div className="label">
            <span id="scheduleDetailTip" className={`label-text-alt`}>
            </span>
          </div>
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Trigger URL</span>
          </div>
          <input name="actionUrl" type="text"
              value={actionUrl}
              onChange={event => {
                setActionUrl(event.target.value)
              }}
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
          <input name="actionBody" type="text"
              value={actionBody}
              onChange={event => {
                setActionBody(event.target.value)
              }}
              className="input input-bordered w-full max-w-xs"/>
          <div className="label">
            <span className="label-text-alt">
              Any webhook body needed for this action. JSON is ok.
            </span>
          </div>
        </label>

        <button
            onClick={actionCall}
            className="btn btn-primary">
          {props.submitLabel}
        </button>

      </div>
  );
}