export function createFetchHandler({ accelerator, origin } = {}) {
  if (!accelerator?.handle) throw new TypeError("createFetchHandler requires an accelerator");
  if (typeof origin !== "function") throw new TypeError("createFetchHandler requires an origin");

  return async function acceleratedFetch(request, env, executionContext) {
    return accelerator.handle({ request, executionContext }, (cacheContext) =>
      origin(request, env, executionContext, cacheContext));
  };
}

export function createPagesHandler({ accelerator, origin } = {}) {
  if (!accelerator?.handle) throw new TypeError("createPagesHandler requires an accelerator");
  if (typeof origin !== "function") throw new TypeError("createPagesHandler requires an origin");

  return async function acceleratedPages(context) {
    if (!(context?.request instanceof Request)) {
      throw new TypeError("Pages context requires a Request");
    }
    return accelerator.handle({
      request: context.request,
      executionContext: context,
    }, (cacheContext) => origin(context, cacheContext));
  };
}

export function createRouteHandler({
  accelerator,
  route,
  getExecutionContext = () => undefined,
} = {}) {
  if (!accelerator?.handle) throw new TypeError("createRouteHandler requires an accelerator");
  if (typeof route !== "function") throw new TypeError("createRouteHandler requires a route");

  return async function acceleratedRoute(request, routeContext) {
    return accelerator.handle({
      request,
      executionContext: getExecutionContext(request, routeContext),
    }, (cacheContext) => route(request, routeContext, cacheContext));
  };
}
