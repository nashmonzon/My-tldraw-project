import { appRouter } from "./server";

export const createCaller = () => {
  return appRouter.createCaller({});
};
