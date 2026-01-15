import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Eye,
  EyeOff,
  Calendar,
  Tag,
  Building
} from "lucide-react";
import { News, NewsCategory, InsertNews } from "@shared/schema";

export default function NewsAdmin() {
  const [news, setNews] = useState<News[]>([]);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<InsertNews>>({
    title: "",
    content: "",
    summary: "",
    imageUrl: "",
    isActive: true,
    categoryId: 1,
    tags: "[]",
    businessForms: "[]",
    priority: 0,
    publishedAt: Math.floor(Date.now() / 1000)
  });

  const businessForms = [
    { value: "НПД", label: "НПД (Самозанятые)" },
    { value: "ИП", label: "ИП (Индивидуальный предприниматель)" },
    { value: "ООО", label: "ООО (Общество с ограниченной ответственностью)" }
  ];

  const fetchNews = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/news?limit=50");
      const data = await response.json();
      setNews(data.news || []);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/news/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchNews();
    fetchCategories();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      summary: "",
      imageUrl: "",
      isActive: true,
      categoryId: 1,
      tags: "[]",
      businessForms: "[]",
      priority: 0,
      publishedAt: Math.floor(Date.now() / 1000)
    });
  };

  const handleCreateNews = async () => {
    try {
      const response = await fetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsCreateDialogOpen(false);
        resetForm();
        fetchNews();
      } else {
        console.error("Error creating news");
      }
    } catch (error) {
      console.error("Error creating news:", error);
    }
  };

  const handleUpdateNews = async () => {
    if (!editingNews) return;

    try {
      const response = await fetch(`/api/news/${editingNews.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsEditDialogOpen(false);
        setEditingNews(null);
        resetForm();
        fetchNews();
      } else {
        console.error("Error updating news");
      }
    } catch (error) {
      console.error("Error updating news:", error);
    }
  };

  const handleDeleteNews = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить эту новость?")) return;

    try {
      const response = await fetch(`/api/news/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchNews();
      } else {
        console.error("Error deleting news");
      }
    } catch (error) {
      console.error("Error deleting news:", error);
    }
  };

  const openEditDialog = (newsItem: News) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      summary: newsItem.summary || "",
      imageUrl: newsItem.imageUrl || "",
      isActive: newsItem.isActive === 1,
      categoryId: newsItem.categoryId || 1,
      tags: newsItem.tags || "[]",
      businessForms: newsItem.businessForms || "[]",
      priority: newsItem.priority || 0,
      publishedAt: newsItem.publishedAt
    });
    setIsEditDialogOpen(true);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getBusinessFormColor = (form: string) => {
    switch (form) {
      case 'НПД':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ИП':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ООО':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleTagsChange = (value: string) => {
    try {
      const parsed = JSON.parse(value);
      setFormData({ ...formData, tags: value });
    } catch (error) {
      console.error("Invalid JSON for tags:", error);
    }
  };

  const handleBusinessFormsChange = (value: string) => {
    try {
      const parsed = JSON.parse(value);
      setFormData({ ...formData, businessForms: value });
    } catch (error) {
      console.error("Invalid JSON for business forms:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Управление новостями</h1>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Создать новость
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Создать новость</DialogTitle>
              <DialogDescription>
                Заполните форму для создания новой новости
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Заголовок</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Введите заголовок новости"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Категория</Label>
                  <Select
                    value={formData.categoryId?.toString()}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id || 'unknown'} value={(category.id || '0').toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Краткое описание</Label>
                <Textarea
                  id="summary"
                  value={formData.summary || ""}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Введите краткое описание новости"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Полный текст</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Введите полный текст новости"
                  rows={10}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">URL изображения</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl || ""}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="Введите URL изображения"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Приоритет</Label>
                  <Input
                    id="priority"
                    type="number"
                    value={formData.priority || 0}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                    placeholder="0 (обычный), 10 (важный)"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tags">Теги (JSON массив)</Label>
                  <Textarea
                    id="tags"
                    value={formData.tags || "[]"}
                    onChange={(e) => handleTagsChange(e.target.value)}
                    placeholder='["налоги", "изменения", "2026"]'
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessForms">Формы бизнеса (JSON массив)</Label>
                  <Textarea
                    id="businessForms"
                    value={formData.businessForms || "[]"}
                    onChange={(e) => handleBusinessFormsChange(e.target.value)}
                    placeholder='["НПД", "ИП", "ООО"]'
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Активна</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Отмена
                </Button>
                <Button onClick={handleCreateNews}>
                  <Save className="w-4 h-4 mr-2" />
                  Создать
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-4 w-full mb-2 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {news.map((newsItem) => (
            <Card key={newsItem.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{newsItem.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={newsItem.isActive ? "default" : "secondary"}>
                        {newsItem.isActive ? "Активна" : "Неактивна"}
                      </Badge>
                      <Badge variant="outline">
                        Приоритет: {newsItem.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(newsItem.publishedAt)}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(newsItem)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteNews(newsItem.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {newsItem.summary && (
                  <CardDescription className="mb-4">
                    {newsItem.summary}
                  </CardDescription>
                )}

                {newsItem.businessForms && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {JSON.parse(newsItem.businessForms || "[]").map((form: string, index: number) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className={`text-xs ${getBusinessFormColor(form)}`}
                      >
                        <Building className="w-3 h-3 mr-1" />
                        {form}
                      </Badge>
                    ))}
                  </div>
                )}

                {newsItem.tags && (
                  <div className="flex flex-wrap gap-1">
                    {JSON.parse(newsItem.tags || "[]").map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактировать новость</DialogTitle>
            <DialogDescription>
              Внесите изменения в новость
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Заголовок</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Введите заголовок новости"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category">Категория</Label>
                <Select
                  value={formData.categoryId?.toString()}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id || 'unknown'} value={(category.id || '0').toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-summary">Краткое описание</Label>
              <Textarea
                id="edit-summary"
                value={formData.summary || ""}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Введите краткое описание новости"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-content">Полный текст</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Введите полный текст новости"
                rows={10}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-imageUrl">URL изображения</Label>
                <Input
                  id="edit-imageUrl"
                  value={formData.imageUrl || ""}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="Введите URL изображения"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-priority">Приоритет</Label>
                <Input
                  id="edit-priority"
                  type="number"
                  value={formData.priority || 0}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                  placeholder="0 (обычный), 10 (важный)"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-tags">Теги (JSON массив)</Label>
                <Textarea
                  id="edit-tags"
                  value={formData.tags || "[]"}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder='["налоги", "изменения", "2026"]'
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-businessForms">Формы бизнеса (JSON массив)</Label>
                <Textarea
                  id="edit-businessForms"
                  value={formData.businessForms || "[]"}
                  onChange={(e) => handleBusinessFormsChange(e.target.value)}
                  placeholder='["НПД", "ИП", "ООО"]'
                  rows={3}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive || false}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="edit-isActive">Активна</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleUpdateNews}>
                <Save className="w-4 h-4 mr-2" />
                Сохранить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}