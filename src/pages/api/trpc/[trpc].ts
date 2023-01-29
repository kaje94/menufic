import { createNextApiHandler } from "@trpc/server/adapters/next";

import { env } from "src/env/server.mjs";
import { appRouter } from "src/server/api/root";
import { createTRPCContext } from "src/server/api/trpc";

// export API handler
export default createNextApiHandler({
    createContext: createTRPCContext,
    onError:
        env.NODE_ENV === "development"
            ? ({ path, error }) => {
                  // eslint-disable-next-line no-console
                  console.error(`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`);
              }
            : undefined,
    router: appRouter,
});
