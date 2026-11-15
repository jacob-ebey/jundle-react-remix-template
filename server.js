import { env } from "node:process";
import { createServer } from "node:http";
import { createRequestListener } from "remix/node-fetch-server";
import { createRouter } from "remix/router";
import { staticFiles } from "remix/middleware/static";

import build from "./dist/server/server.js";

const router = createRouter({
  middleware: [staticFiles("./dist/client")],
});

router.route("ANY", "*", (c) => build.fetch(c.request));

const port = Number(env.PORT || 3000);
const server = createServer(createRequestListener(router.fetch.bind(router)));

server.listen(port, () => {
  const info = server.address();
  console.log(`Server running at http://localhost:${info.port}/`);
});
