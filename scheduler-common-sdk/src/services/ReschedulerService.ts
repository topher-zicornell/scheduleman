import {ScheduleType} from '../entities/Schedule';
import {default as parseDuration} from 'parse-duration';
import ScheduleException from '../utils/ScheduleException';
import {default as parseCron} from 'cron-parser';

/**
 * This class handles any work around scheduling executino times.
 */
export default class ReschedulerService {

  /**
   * Determines the exact date and time the given schedule type and details should next trigger.
   * @param scheduleType
   *    The schedule type.  This determines how the details are interpretted.
   * @param scheduleDetails
   *    The schedule details.
   *    - For RUNAT, this should be a date and time.
   *    - For RUNIN, this should be a period and measure (like "2 mins")
   *    - For RUNON, this should be a standard CRON schedule.
   */
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

    // Theoretically not possible...
    throw new ScheduleException(`The given schedule type ${scheduleType} is invalid`);
  }
}