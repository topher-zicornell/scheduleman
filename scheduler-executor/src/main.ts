
import ReschedulerService from 'scheduler-common-sdk/src/services/ReschedulerService';
import ScheduleDao from 'scheduler-common-sdk/src/services/ScheduleDao';
import NextExecutionDao from 'scheduler-common-sdk/src/services/NextExecutionDao';
import TaskExecutionService, {TaskExecutionServiceIoC} from './services/TaskExecutionService';
import {Pool} from 'pg';

/** The number of milliseconds in a second. */
const SECOND_IN_MILLIS = 1000; // ...just in case it changes...

/**
 * This class handles control for triggering tasks.
 */
class Main {

  /** The service for working with schedules, tasks and triggers. */
  taskExecutionService: TaskExecutionService;
  /** The number of milliseconds to sleep when there's nothing to do (roughly). */
  sleepMillis: number;

  /**
   * Create a new one of these.
   */
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

  /**
   * Sleeps for some amount of time between the minimum and maximum times given.
   * @param min
   *    The minimum number of milliseconds to sleep.
   * @param max
   *    The maximum number of milliseconds to sleep.
   */
  async nap(min: number, max: number) {
    const timeToSleep = Math.floor(Math.random() * (max - min)) + min;
    console.log(`Sleeping for ${timeToSleep} millis`);
    // O.o what year is it???
    await new Promise(resolve => setTimeout(resolve, timeToSleep));
  }

  /**
   * The main execution handler for this service.  This runs forever (until it's killed).
   *
   * It periodicalyl looks for new tasks to trigger.  If any are found, it triggers them and
   * immediately looks for more.  If none are found, it goes to sleep for a few seconds.
   */
  async execute() {
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

/** This is the main entry point for this nano-service. */
try {
  new Main().execute();
} catch (err) {
  console.error(`CATASTROPHIC FAILURE: ${err}`);
}
