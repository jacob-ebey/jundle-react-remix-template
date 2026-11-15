import {
  renderHTML,
  renderRSC,
  renderRequest,
  type PageComponent,
} from "@jundle/rsc";
import type { RoutePattern } from "remix/route-pattern";
import type { MatchParams } from "remix/route-pattern/match";
import type {
  Action,
  ContextEntries,
  ContextEntry,
  ContextWithParams,
  Middleware,
  RequestContext,
  RouterTypes,
} from "remix/router";
import type { Route } from "remix/routes";

type ActionRoute = string | RoutePattern | Route;

type DefaultContext = RouterTypes extends {
  context: infer context extends RequestContext<any, any>;
}
  ? context
  : RequestContext;

type AnyMiddleware = Middleware<ContextTransform>;

type ContextTransform =
  | ContextEntry
  | ContextEntries
  | (<context extends RequestContext<any, any>>(
      context: context,
    ) => RequestContext<any, any>);

type ActionPattern<route extends ActionRoute> = route extends string
  ? route
  : route extends RoutePattern<infer pattern extends string>
    ? pattern
    : route extends Route<any, infer pattern extends string>
      ? pattern
      : never;

export function lazyRenderHTML<
  route extends ActionRoute,
  context extends RequestContext<any, any> = DefaultContext,
  middleware extends readonly AnyMiddleware[] = readonly AnyMiddleware[],
>(
  lazy: () => Promise<{
    default: React.ComponentType<{
      c: ContextWithParams<context, MatchParams<ActionPattern<route>>>;
    }>;
  }>,
): Action<route, context, middleware> {
  return async (c) => {
    const { default: Component } = await lazy();
    return new Response(
      await renderHTML(<Component c={c} />, {
        page: Component as PageComponent,
      }),
      {
        headers: {
          "Content-Type": "text/html;charset=utf8",
        },
      },
    );
  };
}

export function lazyRenderRSC<
  route extends ActionRoute,
  context extends RequestContext<any, any> = DefaultContext,
  middleware extends readonly AnyMiddleware[] = readonly AnyMiddleware[],
>(
  lazy: () => Promise<{
    default: React.ComponentType<{
      c: ContextWithParams<context, MatchParams<ActionPattern<route>>>;
    }>;
  }>,
): Action<route, context, middleware> {
  return async (c) => {
    const { default: Component } = await lazy();
    return new Response(renderRSC(<Component c={c} />), {
      headers: {
        "Content-Type": "text/x-component;charset=utf8",
      },
    });
  };
}

export function lazyRenderRequest<
  route extends ActionRoute,
  context extends RequestContext<any, any> = DefaultContext,
  middleware extends readonly AnyMiddleware[] = readonly AnyMiddleware[],
>(
  lazy: () => Promise<{
    default: React.ComponentType<{
      c: ContextWithParams<context, MatchParams<ActionPattern<route>>>;
    }>;
  }>,
): Action<route, context, middleware> {
  return async (c) => {
    const { default: Component } = await lazy();
    return await renderRequest(c.request, <Component c={c} />, {
      page: Component as PageComponent,
    });
  };
}
