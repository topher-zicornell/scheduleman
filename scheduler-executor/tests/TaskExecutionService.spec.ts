import 'mocha';
import sinon from 'sinon';

import NextExecutionDao from 'scheduler-common-sdk/src/services/NextExecutionDao';
import TaskExecutionService from '../src/services/TaskExecutionService';

const THRESH_MILLIS = 10 * 1000;

describe('Task Execution Service Tests', function() {
  it('Should look for jobs within 10 seconds of now', async function() {
    const now = Date.now();
    const threshLeft = now - THRESH_MILLIS;
    const threshRight = now + THRESH_MILLIS;

    const nextExecutionDao = new NextExecutionDao();
    const mocker = sinon.mock(nextExecutionDao);
    mocker.expects('findToExecute').once().withArgs(sinon.match.any, sinon.match(
        function (arg: Date) { return arg.getTime() > threshLeft && arg.getTime() < threshRight; }
    )).returns(undefined);

    const taskService = new TaskExecutionService({
      nextExecutionDao: nextExecutionDao,
    });
    await taskService.findNextTask();
    mocker.verify();
  });
});