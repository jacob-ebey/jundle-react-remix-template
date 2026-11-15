import { createRouter } from "remix/router";
import { lazyRenderHTML } from "#lib/remix.tsx";

import { routes } from "#routes.ts";

import "./browser.ts";

const router = createRouter();

router.get(
  routes.home,
  lazyRenderHTML(() => import("#routes/home/route.tsx")),
);

export default router;
