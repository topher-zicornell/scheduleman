import express, {Express} from 'express';
import ScheduleManagementService from './services/ScheduleManagementService';

/**
 * Standard express framework for handling the REST CRUD API calls.
 */
const app: Express = express();
const port = process.env.PORT || 3000;
const scheduleManagementService = new ScheduleManagementService();

app.post('/schedules', scheduleManagementService.createSchedule);
app.get('/schedules', scheduleManagementService.listSchedules);
app.get('/schedules/:scheduleId', scheduleManagementService.getSchedule);
app.put('/schedules/:scheduleId', scheduleManagementService.updateSchedule);
app.delete('/schedules/:scheduleId', scheduleManagementService.deleteSchedule);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
