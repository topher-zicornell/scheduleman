import express, {Express} from 'express';
import { Send } from 'express-serve-static-core';

const SEC_IN_MILLIS = 1000;

interface EchoRequest extends Express.Request {
  body: {
    wait?: number;
    [key: string]: any;
  }
}

interface EchoResponse extends Express.Response {
  json: Send<any, this>;
}

/**
 * An API to bounce against, with optional response delays
 */
class Main {
  /** The express router. */
  app: express.Application;
  /** The configurable port to run on. */
  port: number;
  /** The number of millis to sleep between checks that the router is still listening. */
  monitorCheckMillis: number;

  /**
   * Create a new one of these.
   */
  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 3000;
    this.monitorCheckMillis = Number(process.env.MONITOR_CHECK_SECS || '10') * 1000;

    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());

    this.setupRoutes();
  }

  /**
   * Sets up the route configurations this API handles.
   */
  setupRoutes() {
    this.app.get('/', this.defaultPage);
    this.app.post('/echo', async (request: EchoRequest, response: EchoResponse) => {
      response.json(await this.handleEcho(request, response));
    });
  }

  /**
   * A simple handler for the echo functionality.  It will respond with the body of the request
   * given.  If the body includes the property `wait`, it will pause for the number of seconds
   * indicated before responding.  This allows simulation of a longer running trigger.
   * @param request
   *    The request.
   * @param response
   *    The response.
   */
  async handleEcho(request: EchoRequest, response: Express.Response) {
    const body = request.body;
    console.log(`Handling request: ${JSON.stringify(body)}`);
    const pauseSecs = body?.wait || 0;
    const pauseMillis = pauseSecs * SEC_IN_MILLIS;
    await new Promise(resolve => setTimeout(resolve, pauseMillis));
    return body;
  }

  /**
   * A simple handler for the default page.
   * @param request
   *    The request.
   * @param response
   *    The response.
   */
  defaultPage(request: Express.Request, response: Express.Response) {
    return {message: "This is the schedules CRUD API"};
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
  console.error(`CATASTROPHIC FAILURE: ${err}`);
}
