import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MessageSquare, 
  Plus, 
  Check, 
  X, 
  Bot,
  Settings,
  RefreshCw
} from "lucide-react";

interface TelegramChannel {
  id: number;
  name: string;
  telegram_id: string;
  title: string;
  is_active: boolean;
  created_at: number;
}

interface TelegramPost {
  id: number;
  post_id: string;
  content: string;
  media_urls: string | null;
  published_at: number;
  status: 'pending' | 'approved' | 'rejected';
  channel_name: string;
  channel_title: string;
}

export default function TelegramIntegration() {
  const [channels, setChannels] = useState<TelegramChannel[]>([]);
  const [pendingPosts, setPendingPosts] = useState<TelegramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("channels");
  const [newChannel, setNewChannel] = useState({
    name: "",
    telegramId: "",
    title: ""
  });

  useEffect(() => {
    fetchChannels();
    fetchPendingPosts();
  }, []);

  const fetchChannels = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/telegram/channels', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setChannels(data.channels);
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

  const fetchPendingPosts = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/telegram/posts/pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPendingPosts(data.posts);
      }
    } catch (error) {
      console.error('Error fetching pending posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChannel = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/telegram/channels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newChannel)
      });

      if (response.ok) {
        setNewChannel({ name: "", telegramId: "", title: "" });
        fetchChannels();
      }
    } catch (error) {
      console.error('Error adding channel:', error);
    }
  };

  const handleToggleChannel = async (channelId: number) => {
    try {
      const token = localStorage.getItem('admin_token');
      await fetch(`/api/telegram/channels/${channelId}/toggle`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchChannels();
    } catch (error) {
      console.error('Error toggling channel:', error);
    }
  };

  const handleApprovePost = async (postId: number) => {
    try {
      const token = localStorage.getItem('admin_token');
      await fetch(`/api/telegram/posts/${postId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchPendingPosts();
    } catch (error) {
      console.error('Error approving post:', error);
    }
  };

  const handleRejectPost = async (postId: number) => {
    try {
      const token = localStorage.getItem('admin_token');
      await fetch(`/api/telegram/posts/${postId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchPendingPosts();
    } catch (error) {
      console.error('Error rejecting post:', error);
    }
  };

  const handleStartBot = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/telegram/start', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Бот успешно запущен!');
      }
    } catch (error) {
      console.error('Error starting bot:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('ru-RU');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Ожидает';
      case 'approved': return 'Одобрено';
      case 'rejected': return 'Отклонено';
      default: return 'Неизвестно';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bot className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Telegram Интеграция</h2>
            <p className="text-sm text-gray-600">Управление автоматической публикацией новостей</p>
          </div>
        </div>
        
        <Button onClick={handleStartBot} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Запустить бота
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="channels" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Каналы
          </TabsTrigger>
          <TabsTrigger value="moderation" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Модерация
          </TabsTrigger>
        </TabsList>

        {/* Channels Tab */}
        <TabsContent value="channels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Добавить канал
              </CardTitle>
              <CardDescription>
                Подключите новый Telegram канал для автоматической публикации
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="channelName">Название канала</Label>
                  <Input
                    id="channelName"
                    value={newChannel.name}
                    onChange={(e) => setNewChannel({...newChannel, name: e.target.value})}
                    placeholder="Например: Новости компании"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="telegramId">ID канала</Label>
                  <Input
                    id="telegramId"
                    value={newChannel.telegramId}
                    onChange={(e) => setNewChannel({...newChannel, telegramId: e.target.value})}
                    placeholder="@channel_username"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="channelTitle">Заголовок</Label>
                  <Input
                    id="channelTitle"
                    value={newChannel.title}
                    onChange={(e) => setNewChannel({...newChannel, title: e.target.value})}
                    placeholder="Официальный канал компании"
                  />
                </div>
              </div>
              
              <Button onClick={handleAddChannel} disabled={!newChannel.name || !newChannel.telegramId}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить канал
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Подключенные каналы ({channels.length})</CardTitle>
              <CardDescription>
                Управление активными каналами
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-4 w-[150px]" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {channels.map((channel) => (
                    <div key={channel.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                          <Bot className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{channel.name}</span>
                            <Badge variant={channel.is_active ? "default" : "secondary"}>
                              {channel.is_active ? 'Активен' : 'Неактивен'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">{channel.title}</p>
                          <p className="text-xs text-gray-400">
                            ID: {channel.telegram_id} • Создан: {formatDate(channel.created_at)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={channel.is_active}
                          onCheckedChange={() => handleToggleChannel(channel.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Moderation Tab */}
        <TabsContent value="moderation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ожидающие модерации ({pendingPosts.length})</CardTitle>
              <CardDescription>
                Посты из Telegram каналов, ожидающие публикации
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : pendingPosts.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Нет постов, ожидающих модерации</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingPosts.map((post) => (
                    <div key={post.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(post.status)}>
                            {getStatusText(post.status)}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {post.channel_name} • {formatDate(post.published_at)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">
                          {post.content.length > 200 
                            ? post.content.substring(0, 200) + '...' 
                            : post.content
                          }
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprovePost(post.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Одобрить
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectPost(post.id)}
                          className="border-red-600 text-red-600 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Отклонить
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}