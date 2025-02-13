import { NextApiRequest } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("Please define the JWT_SECRET environment variable");
}

export interface JwtPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export function authenticate(req: NextApiRequest): JwtPayload {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new Error("No authorization header provided");

  const token = authHeader.split(" ")[1]; // Expecting "Bearer <token>"
  if (!token) throw new Error("No token provided");

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
}
