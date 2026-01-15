import { Router } from 'express';
import { z } from 'zod';
import { authService } from '../services/authService';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// Схемы валидации
const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const createUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
  role: z.enum(['admin', 'editor', 'user']).default('user'),
});

const updateUserSchema = z.object({
  username: z.string().min(1).optional(),
  role: z.enum(['admin', 'editor', 'user']).optional(),
});

// Аутентификация
router.post('/login', async (req, res) => {
  try {
    const { username, password } = loginSchema.parse(req.body);

    const result = await authService.authenticateUser(username, password);

    res.json({
      success: true,
      user: result.user,
      token: result.token,
      expiresAt: result.expiresAt,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error instanceof Error ? error.message : 'Authentication failed',
    });
  }
});

// Выход
router.post('/logout', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      await authService.logoutUser(token);
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Logout failed',
    });
  }
});

// Получение списка пользователей (только для админов)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await authService.getUsers();
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
    });
  }
});

// Создание пользователя (только для админов)
router.post('/users', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const userData = createUserSchema.parse(req.body);
    const user = await authService.createUser(userData.username, userData.password, userData.role);

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Invalid input data',
        details: error.errors,
      });
    } else {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create user',
      });
    }
  }
});

// Обновление пользователя (только для админов)
router.put('/users/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const userId = req.params.id;
    const userData = updateUserSchema.parse(req.body);

    const user = await authService.updateUser(userId, userData);

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Invalid input data',
        details: error.errors,
      });
    } else {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update user',
      });
    }
  }
});

// Удаление пользователя (только для админов)
router.delete('/users/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const userId = req.params.id;
    const user = await authService.deleteUser(userId);

    res.json({
      success: true,
      message: 'User deleted successfully',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete user',
    });
  }
});

// Получение текущего пользователя
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

export default router;