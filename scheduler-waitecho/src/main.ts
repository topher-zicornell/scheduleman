import express, {Express} from 'express';

/**
 * A service to bounce against, with optional response delays
 */
const app: Express = express();
const port = process.env.PORT || 3000;

const SEC_IN_MILLIS = 1000;

interface EchoRequest extends Express.Request {
  body: {
    wait?: number;
  }
}

app.post('/echo', async (request: EchoRequest, response: Express.Response) => {
  const pauseSecs = request.body?.wait || 0;
  const pauseMillis = pauseSecs * SEC_IN_MILLIS;
  await new Promise(resolve => setTimeout(resolve, pauseMillis));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
