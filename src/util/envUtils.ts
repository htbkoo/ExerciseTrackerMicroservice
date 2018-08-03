export const ENVIRONMENT = process.env.NODE_ENV;
export const isProd: boolean = ENVIRONMENT === "production"; // Anything else is treated as 'dev'