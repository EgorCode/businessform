import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { users, userSessions } from '@shared/schema';
import { eq } from 'drizzle-orm';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Проверяем существование сессии
    const session = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.token, token))
      .limit(1);

    if (session.length === 0) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    // Проверяем срок действия сессии
    if (session[0].expires_at < Math.floor(Date.now() / 1000)) {
      await db.delete(userSessions).where(eq(userSessions.token, token));
      return res.status(401).json({ error: 'Session expired' });
    }

    // Получаем данные пользователя
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1);

    if (user.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = {
      id: user[0].id,
      username: user[0].username,
      role: user[0].role,
    };

    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

export const requireAdmin = requireRole(['admin']);
export const requireEditor = requireRole(['admin', 'editor']);

export const generateToken = (userId: string, username: string, role: string) => {
  return jwt.sign(
    { userId, username, role },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );
};