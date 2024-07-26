import express, {Express} from 'express';

const SEC_IN_MILLIS = 1000;

interface EchoRequest extends Express.Request {
  body: {
    wait?: number;
  }
}

/**
 * A service to bounce against, with optional response delays
 */
class Main {
  app: express.Application;
  port: number;

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 3000;

    this.setupRoutes();
  }

  setupRoutes() {
    this.app.get('/', this.defaultPage);
    this.app.post('/echo', this.handleEcho);
  }

  async handleEcho(request: EchoRequest, response: Express.Response) {
    const pauseSecs = request.body?.wait || 0;
    const pauseMillis = pauseSecs * SEC_IN_MILLIS;
    await new Promise(resolve => setTimeout(resolve, pauseMillis));
  }

  defaultPage(request: Express.Request, response: Express.Response) {
    return {message: "This is the schedules CRUD API"};
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
