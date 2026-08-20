export function observeDatabaseClient(client, {
  analyze,
  currentContext,
} = {}) {
  if (!client || typeof client.query !== "function") {
    throw new TypeError("observeDatabaseClient requires a query-compatible client");
  }
  if (typeof analyze !== "function" || typeof currentContext !== "function") {
    throw new TypeError("observer requires analyze and currentContext callbacks");
  }
  return new Proxy(client, {
    get(target, property, receiver) {
      if (property !== "query") return Reflect.get(target, property, receiver);
      return async (...args) => {
        const sql = typeof args[0] === "string" ? args[0] : args[0]?.text;
        if (typeof sql === "string") {
          const result = await analyze(sql);
          const context = currentContext();
          if (result?.complete && context?.track) context.track(result.dependencies || []);
        }
        return Reflect.apply(target.query, target, args);
      };
    },
  });
}
