import { Request } from 'express';

const extractTokenFromHeader = (request: Request): string | undefined => {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
};

const extractTokenFromHandshake = (authtoken: string) => {
  const [type, token] = authtoken.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
};
export { extractTokenFromHeader, extractTokenFromHandshake };
