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
  app: express.Application;
  port: number;
  scheduleManagementService: ScheduleManagementService;

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 3000;
    this.scheduleManagementService = new ScheduleManagementService();

    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());

    this.setupRoutes();
  }

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

  defaultPage(request: Express.Request, response: TypedResponse<{ message: string }>) {
    response.json({message: "This is the schedules CRUD API"});
  }

  async execute(): Promise<void> {
    this.app.listen(this.port, () => {
      console.log(`Server is running at http://localhost:${this.port}`);
    });
  }
}

try {
  new Main().execute(); // node waits
} catch (err) {
  console.error(`CATASTROPHIC FAILURE: ${err}`);
}
