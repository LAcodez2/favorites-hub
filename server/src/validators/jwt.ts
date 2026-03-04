import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
}

export function signToken(userId: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");

  return jwt.sign({ userId }, secret, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");

  const decoded = jwt.verify(token, secret);

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    !("userId" in decoded) ||
    typeof decoded.userId !== "string"
  ) {
    throw new Error("Invalid token payload");
  }

  return { userId: decoded.userId };
}