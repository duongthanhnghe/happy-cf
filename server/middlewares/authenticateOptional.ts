import jwt from 'jsonwebtoken'

export const optionalAuthenticate = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "");
  } catch {
    req.user = null;
  }

  next();
};
