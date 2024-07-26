import express from 'express';
import cors from 'cors';
import ScheduleManagementService from './services/ScheduleManagementService';
import TypedResponse from './utils/TypedResponse';
import TypedRequestQuery from './utils/TypedRequestQuery';
import ScheduleQuery from './entities/ScheduleQuery';
import Schedule from 'scheduler-common-sdk/src/entities/Schedule';
import TypedRequestBody from './utils/TypedRequestBody';
import TypedRequestParams from './utils/TypedRequestParams';
import SchedulePathParams from './entities/SchedulePathParams';
import TypedRequestParamsBody from './utils/TypedRequestParamsBody';

/**
 * Standard express framework for handling the REST CRUD API calls.
 */
class Main {
  /** The express router. */
  app: express.Application;
  /** The configurable port to run on. */
  port: number;
  /** The number of millis to sleep between checks that the router is still listening. */
  monitorCheckMillis: number;
  /** The service for handling requests for schedule resources. */
  scheduleManagementService: ScheduleManagementService;

  /**
   * Create a new one of these.
   */
  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 3000;
    this.monitorCheckMillis = Number(process.env.MONITOR_CHECK_SECS || '10') * 1000;
    this.scheduleManagementService = new ScheduleManagementService();

    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());

    // Immediately set up all the route configurations
    this.setupRoutes();
  }

  /**
   * Sets up the route configurations this REST API handles.
   */
  setupRoutes() {
    this.app.get('/', this.defaultPage);
    this.app.post('/schedules', async (request: TypedRequestBody<Schedule>,
        response: TypedResponse<Schedule>) => (
            response.json(
                await this.scheduleManagementService.createSchedule(request, response)))
    );
    this.app.get('/schedules', async (request: TypedRequestQuery<ScheduleQuery>,
        response: TypedResponse<Schedule[]>) => (
            response.json(
                await this.scheduleManagementService.listSchedules(request, response)))
    );
    this.app.get('/schedules/:scheduleId', async (request: TypedRequestParams<SchedulePathParams>,
        response: TypedResponse<Schedule>) => (
            response.json(
                await this.scheduleManagementService.getSchedule(request, response)))
    );
    this.app.put('/schedules/:scheduleId', async (request: TypedRequestParamsBody<SchedulePathParams, Schedule>,
        response: TypedResponse<Schedule>) => (
            response.json(
                await this.scheduleManagementService.updateSchedule(request, response)))
    );
    this.app.delete('/schedules/:scheduleId', async (request: TypedRequestParams<SchedulePathParams>,
        response: TypedResponse<Schedule>) => (
            response.json(
                await this.scheduleManagementService.deleteSchedule(request, response)))
    );
  }

  /**
   * A simple handler for the default page.
   * @param request
   *    The request.
   * @param response
   *    The response.
   */
  defaultPage(request: Express.Request, response: TypedResponse<{ message: string }>) {
    response.json({message: "This is the schedules CRUD API"});
  }

  /**
   * The main execution handler for this nano-service.  This runs forever (until it's killed).
   *
   * It periodically checks whether the router is still listening for new connections.  If it finds
   * the router isn't listening, it tries to restart it gracefully.
   */
  async execute(): Promise<void> {
    while (true) {
      try {
        const server = this.app.listen(this.port, () => {
          console.log(`Server is running at http://localhost:${this.port}`);
        });
        while (server.listening) {
          await new Promise(resolve => setTimeout(resolve, this.monitorCheckMillis));
        }
      } catch (err) {
        console.log(`UNCAUGHT ERROR: ${err}`);
      }
    }
  }
}

/** This is the main entry point for this nano-service. */
try {
  new Main().execute(); // node waits
} catch (err) {
  console.log(`CATASTROPHIC FAILURE: ${err}`);
}
