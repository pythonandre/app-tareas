// json-server.ts
import * as jsonServer from 'json-server';
import * as db from './db.json';

const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const port = 3001; // Choose a port for your server

server.use(middlewares);
server.use(jsonServer.router(db));

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});