import 'mocha';
import { expect } from 'earl';

import {ScheduleType} from '../src/entities/Schedule';
import ReschedulerService from '../src/services/ReschedulerService';

const SEC_IN_MILLIS = 1000;
const MIN_IN_MILLIS = 60 * SEC_IN_MILLIS;

describe('Rescheduler Service Tests', function() {
  const now = new Date();
  const testData = [
    {
      name: 'schedule RUNAT for the given date',
      scheduleType: ScheduleType.RUNAT,
      scheduleDetails: now.toISOString(),
      scheduleDateMin: now,
      scheduleDateMax: now,
    },
    {
      name: 'schedule RUNIN for the given time from now',
      scheduleType: ScheduleType.RUNIN,
      scheduleDetails: '10mins',
      scheduleDateMin: new Date(now.getTime() + (10 * MIN_IN_MILLIS) - (10 * SEC_IN_MILLIS)),
      scheduleDateMax: new Date(now.getTime() + (10 * MIN_IN_MILLIS) + (10 * SEC_IN_MILLIS)),
    },
    {
      name: 'schedule RUNON for the given schedule',
      scheduleType: ScheduleType.RUNON,
      scheduleDetails: '0 15 10 1 1 *', // 01 JAN, 10:15:00
      scheduleDateMin: new Date(`Jan 01 ${now.getFullYear() + 1} 10:14:50`),
      scheduleDateMax: new Date(`Jan 01 ${now.getFullYear() + 1} 10:15:10`),
    },
  ];

  for (const test of testData) {
    it(`Should ${test.name}`, async function() {
      const scheduleDate = new ReschedulerService().determineNextDate(test.scheduleType,
          test.scheduleDetails);
      expect(scheduleDate).not.toBeNullish();
      // @ts-ignore We just verified scheduleDate is set
      expect(scheduleDate.getTime()).toBeGreaterThanOrEqual(test.scheduleDateMin.getTime());
      // @ts-ignore We just verified scheduleDate is set
      expect(scheduleDate.getTime()).toBeLessThanOrEqual(test.scheduleDateMax.getTime());
    });
  }
});
