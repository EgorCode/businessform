import { Router } from 'express';
import { telegramBotService } from '../services/telegramBotService';
import { authenticateToken, requireEditor, AuthRequest } from '../middleware/auth';

const router = Router();

// Вебхук для Telegram бота
router.post('/webhook', async (req, res) => {
  try {
    // Здесь будет обрабатываться вебхук от Telegram
    // Основная логика будет в telegramBotService
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error');
  }
});

// Получение списка каналов (только для редакторов и админов)
router.get('/channels', authenticateToken, requireEditor, async (req: AuthRequest, res) => {
  try {
    const channels = await telegramBotService.getChannels();
    res.json({ success: true, channels });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch channels' 
    });
  }
});

// Добавление нового канала (только для админов)
router.post('/channels', authenticateToken, requireEditor, async (req: AuthRequest, res) => {
  try {
    const { name, telegramId, title } = req.body;

    if (!name || !telegramId || !title) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const channel = await telegramBotService.addChannel(name, telegramId, title);
    res.status(201).json({
      success: true,
      channel
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add channel' 
    });
  }
});

// Переключение статуса канала (только для редакторов и админов)
router.put('/channels/:id/toggle', authenticateToken, requireEditor, async (req: AuthRequest, res) => {
  try {
    const channelId = parseInt(req.params.id);
    await telegramBotService.toggleChannel(channelId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to toggle channel' 
    });
  }
});

// Получение постов для модерации (только для редакторов и админов)
router.get('/posts/pending', authenticateToken, requireEditor, async (req: AuthRequest, res) => {
  try {
    const posts = await telegramBotService.getPendingPosts();
    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch pending posts' 
    });
  }
});

// Одобрение поста (только для редакторов и админов)
router.post('/posts/:id/approve', authenticateToken, requireEditor, async (req: AuthRequest, res) => {
  try {
    const postId = parseInt(req.params.id);
    await telegramBotService.approvePost(postId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to approve post' 
    });
  }
});

// Отклонение поста (только для редакторов и админов)
router.post('/posts/:id/reject', authenticateToken, requireEditor, async (req: AuthRequest, res) => {
  try {
    const postId = parseInt(req.params.id);
    await telegramBotService.rejectPost(postId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to reject post' 
    });
  }
});

// Запуск бота (только для админов)
router.post('/start', authenticateToken, async (req: AuthRequest, res) => {
  try {
    await telegramBotService.start();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to start bot' 
    });
  }
});

export default router;