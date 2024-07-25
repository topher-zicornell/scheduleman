
import ReschedulerService from 'scheduler-common-sdk/src/services/ReschedulerService';
import ScheduleDao from 'scheduler-common-sdk/src/services/ScheduleDao';
import NextExecutionDao from 'scheduler-common-sdk/src/services/NextExecutionDao';
import TaskExecutionService, {TaskExecutionServiceIoC} from './services/TaskExecutionService';
import {Pool} from 'pg';

const SECOND_IN_MILLIS = 1000; // Just in case it changes

class Main {

  taskExecutionService: TaskExecutionService;
  sleepMillis: number;

  constructor() {
    const ioc: TaskExecutionServiceIoC = {
      db: new Pool(),
      rescheduler: new ReschedulerService(),
    };
    ioc.scheduleDao = new ScheduleDao(ioc);
    ioc.nextExecutionDao = new NextExecutionDao(ioc);

    this.taskExecutionService = new TaskExecutionService(ioc);

    this.sleepMillis = this.taskExecutionService.toleranceMillis;
  }

  async nap(min: number, max: number) {
    const timeToSleep = Math.floor(Math.random() * (max - min)) + min;
    // O.o what year is it???
    await new Promise(resolve => setTimeout(resolve, timeToSleep));
  }

  async main() {
    // Run Fow-eh-vaaaw
    while (true) {
      try {
        // Look for a task to execute with bated breath
        const task = await this.taskExecutionService.findNextTask();
        if (task) {
          // Found something! Yesss! Do it and look again (maybe there's more?!)
          await this.taskExecutionService.executeTask(task);
        } else {
          // If we didn't find anything, go to sleep for a few seconds
          await this.nap(SECOND_IN_MILLIS, this.sleepMillis);
        }
      } catch (err) {
        // Safety net, spew and go
        console.log(`UNCAUGHT ERROR: ${err}`);
      }
    }
  }
}

new Main().main();
