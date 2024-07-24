import {ScheduleType} from '../entities/Schedule';
import {default as parseDuration} from 'parse-duration';
import ScheduleException from '../utils/ScheduleException';
import {default as parseCron} from 'cron-parser';

export default class ReschedulerService {
  determineNextDate(scheduleType: ScheduleType, scheduleDetails: string): Date | undefined {
    switch (scheduleType) {
      case ScheduleType.RUNAT:
        return new Date(scheduleDetails);
      case ScheduleType.RUNIN:
        const duration = parseDuration(scheduleDetails, 'ms');
        if (typeof duration === 'undefined') {
          throw new ScheduleException(`Duration could not be determined from details: ` +
              `${scheduleDetails}`);
        }
        return new Date(Date.now() + duration);
      case ScheduleType.RUNON:
        const cronExpression = parseCron.parseExpression(scheduleDetails);
        return cronExpression.next().toDate();
    }
    throw new ScheduleException(`The given schedule type ${scheduleType} is invalid`);
  }
}