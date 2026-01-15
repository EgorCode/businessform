import TelegramBot from 'node-telegram-bot-api';
import { db } from '../db';
import { telegramChannels, telegramPosts, news, newsCategories } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';

export interface TelegramPostData {
  id: string;
  text: string;
  media?: Array<{
    type: 'photo' | 'video' | 'document';
    url: string;
    fileId: string;
  }>;
  date: number;
  channel: {
    id: number;
    title: string;
  };
}

export class TelegramBotService {
  private bot: TelegramBot | null = null;
  private channelId: string | null = null;

  constructor() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (token) {
      this.bot = new TelegramBot(token);
      this.setupWebhook();
    }
  }

  private setupWebhook() {
    if (!this.bot) return;

    this.bot.on('channel_post', async (msg) => {
      await this.handleChannelPost(msg);
    });

    this.bot.on('error', (error) => {
      console.error('Telegram Bot Error:', error);
    });
  }

  private async handleChannelPost(msg: any) {
    try {
      const channelId = msg.chat.id.toString();
      
      // Проверяем, что это нужный канал
      const channel = await db
        .select()
        .from(telegramChannels)
        .where(eq(telegramChannels.telegram_id, channelId))
        .limit(1);

      if (channel.length === 0 || !channel[0].is_active) {
        return;
      }

      // Сохраняем пост в базу данных
      const postData: TelegramPostData = {
        id: msg.message_id.toString(),
        text: msg.text || msg.caption || '',
        media: this.extractMedia(msg),
        date: msg.date,
        channel: {
          id: msg.chat.id,
          title: msg.chat.title || 'Unknown Channel'
        }
      };

      await this.saveTelegramPost(channel[0].id, postData);

      // Автоматически публикуем на сайте
      await this.publishPostToNews(postData);

    } catch (error) {
      console.error('Error handling channel post:', error);
    }
  }

  private extractMedia(msg: any): TelegramPostData['media'] {
    const media: TelegramPostData['media'] = [];

    if (msg.photo) {
      const photo = msg.photo[msg.photo.length - 1]; // Больше разрешение
      media.push({
        type: 'photo',
        url: photo.file_id,
        fileId: photo.file_id
      });
    }

    if (msg.video) {
      media.push({
        type: 'video',
        url: msg.video.file_id,
        fileId: msg.video.file_id
      });
    }

    if (msg.document) {
      media.push({
        type: 'document',
        url: msg.document.file_id,
        fileId: msg.document.file_id
      });
    }

    return media.length > 0 ? media : undefined;
  }

  private async saveTelegramPost(channelId: number, postData: TelegramPostData) {
    try {
      await db.insert(telegramPosts).values({
        channel_id: channelId,
        post_id: postData.id,
        content: postData.text,
        media_urls: postData.media ? JSON.stringify(postData.media) : null,
        published_at: postData.date,
        status: 'processed'
      });
    } catch (error) {
      console.error('Error saving telegram post:', error);
    }
  }

  private async publishPostToNews(postData: TelegramPostData) {
    try {
      // Получаем или создаем категорию для новостей из Telegram
      let category = await db
        .select()
        .from(newsCategories)
        .where(eq(newsCategories.slug, 'telegram'))
        .limit(1);

      if (category.length === 0) {
        const [newCategory] = await db.insert(newsCategories).values({
          name: 'Telegram Канал',
          slug: 'telegram'
        }).returning();
        category = [newCategory];
      }

      // Создаем новость на основе поста
      const title = this.extractTitle(postData.text);
      const summary = this.extractSummary(postData.text);
      const imageUrl = postData.media && postData.media.length > 0 
        ? await this.getMediaUrl(postData.media[0].fileId)
        : null;

      await db.insert(news).values({
        title: title || 'Новость из Telegram',
        content: postData.text,
        summary: summary,
        imageUrl: imageUrl,
        publishedAt: postData.date,
        isActive: true,
        categoryId: category[0].id,
        tags: JSON.stringify(['telegram', 'авто-публикация']),
        businessForms: JSON.stringify(['НПД', 'ИП', 'ООО']),
        priority: 5
      });

      console.log('Post published to news:', title);
    } catch (error) {
      console.error('Error publishing post to news:', error);
    }
  }

  private extractTitle(text: string): string | null {
    // Извлекаем первую строку как заголовок
    const lines = text.split('\n');
    const firstLine = lines[0]?.trim();
    
    if (firstLine && firstLine.length < 100) {
      return firstLine;
    }
    
    return null;
  }

  private extractSummary(text: string): string | null {
    // Извлекаем первые 200 символов как краткое описание
    const cleanText = text.replace(/\n/g, ' ').trim();
    return cleanText.length > 200 ? cleanText.substring(0, 197) + '...' : cleanText;
  }

  private async getMediaUrl(fileId: string): Promise<string | null> {
    if (!this.bot) return null;

    try {
      const file = await this.bot.getFile(fileId);
      return `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
    } catch (error) {
      console.error('Error getting media URL:', error);
      return null;
    }
  }

  // Управление каналами
  async addChannel(name: string, telegramId: string, title: string) {
    const [channel] = await db.insert(telegramChannels).values({
      name,
      telegram_id: telegramId,
      title,
      is_active: true,
      webhook_url: `${process.env.BASE_URL}/api/telegram/webhook`
    }).returning();

    return channel;
  }

  async getChannels() {
    return await db
      .select()
      .from(telegramChannels)
      .orderBy(desc(telegramChannels.created_at));
  }

  async toggleChannel(channelId: number) {
    const [channel] = await db
      .select()
      .from(telegramChannels)
      .where(eq(telegramChannels.id, channelId))
      .limit(1);

    if (channel.length > 0) {
      await db
        .update(telegramChannels)
        .set({ is_active: !channel[0].is_active })
        .where(eq(telegramChannels.id, channelId));
    }
  }

  // Получение постов для модерации
  async getPendingPosts() {
    return await db
      .select({
        id: telegramPosts.id,
        post_id: telegramPosts.post_id,
        content: telegramPosts.content,
        media_urls: telegramPosts.media_urls,
        published_at: telegramPosts.published_at,
        status: telegramPosts.status,
        channel_name: telegramChannels.name,
        channel_title: telegramChannels.title
      })
      .from(telegramPosts)
      .leftJoin(telegramChannels, eq(telegramPosts.channel_id, telegramChannels.id))
      .where(eq(telegramPosts.status, 'pending'))
      .orderBy(desc(telegramPosts.published_at));
  }

  // Одобрение поста
  async approvePost(postId: number) {
    const post = await db
      .select()
      .from(telegramPosts)
      .where(eq(telegramPosts.id, postId))
      .limit(1);

    if (post.length > 0) {
      const postData: TelegramPostData = {
        id: post[0].post_id,
        text: post[0].content,
        media: post[0].media_urls ? JSON.parse(post[0].media_urls) : undefined,
        date: post[0].published_at,
        channel: {
          id: 0,
          title: 'Unknown Channel'
        }
      };

      await this.publishPostToNews(postData);

      await db
        .update(telegramPosts)
        .set({ 
          status: 'approved',
          processed_at: Math.floor(Date.now() / 1000)
        })
        .where(eq(telegramPosts.id, postId));
    }
  }

  // Отклонение поста
  async rejectPost(postId: number) {
    await db
      .update(telegramPosts)
      .set({ 
        status: 'rejected',
        processed_at: Math.floor(Date.now() / 1000)
      })
      .where(eq(telegramPosts.id, postId));
  }

  // Запуск бота
  async start() {
    if (!this.bot) {
      console.error('Telegram bot token not provided');
      return;
    }

    try {
      await this.bot.launch();
      console.log('Telegram bot started successfully');
    } catch (error) {
      console.error('Error starting Telegram bot:', error);
    }
  }
}

export const telegramBotService = new TelegramBotService();