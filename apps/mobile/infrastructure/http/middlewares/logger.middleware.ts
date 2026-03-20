export const loggerMiddleware = async (config: RequestInit) => {
  console.log('➡️ Request:', config);
  return config;
};

export const responseLoggerMiddleware = async (res: Response) => {
  console.log('⬅️ Response:', res.status);
  return res;
};