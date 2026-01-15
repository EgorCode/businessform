import bcrypt from 'bcryptjs';
import { db } from '../db';
import { users, userSessions } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { generateToken } from '../middleware/auth';

export class AuthService {
  // Создание пользователя
  async createUser(username: string, password: string, role: string = 'user') {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [user] = await db
      .insert(users)
      .values({
        username,
        password: hashedPassword,
        role,
      })
      .returning();

    return user;
  }

  // Аутентификация пользователя
  async authenticateUser(username: string, password: string) {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (user.length === 0) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user[0].password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Генерируем токен
    const token = generateToken(user[0].id, user[0].username, user[0].role);

    // Создаем сессию
    const expiresAt = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // 24 часа
    await db
      .insert(userSessions)
      .values({
        id: crypto.randomUUID(),
        user_id: user[0].id,
        token,
        expires_at: expiresAt,
      });

    return {
      user: {
        id: user[0].id,
        username: user[0].username,
        role: user[0].role,
      },
      token,
      expiresAt,
    };
  }

  // Выход пользователя
  async logoutUser(token: string) {
    await db
      .delete(userSessions)
      .where(eq(userSessions.token, token));
  }

  // Получение списка пользователей
  async getUsers() {
    return await db
      .select({
        id: users.id,
        username: users.username,
        role: users.role,
        created_at: users.created_at,
      })
      .from(users)
      .orderBy(users.created_at);
  }

  // Обновление пользователя
  async updateUser(userId: string, updates: { username?: string; role?: string }) {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, userId))
      .returning();

    return user;
  }

  // Удаление пользователя
  async deleteUser(userId: string) {
    // Сначала удаляем сессии пользователя
    await db
      .delete(userSessions)
      .where(eq(userSessions.user_id, userId));

    // Затем удаляем пользователя
    const [user] = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning();

    return user;
  }

  // Инициализация администратора по умолчанию
  async initializeDefaultAdmin() {
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.username, adminUsername))
      .limit(1);

    if (existingAdmin.length === 0) {
      await this.createUser(adminUsername, adminPassword, 'admin');
      console.log('Default admin user created');
    }
  }
}

export const authService = new AuthService();