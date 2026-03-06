import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Quote, Heading2, Heading3, Link as LinkIcon, Image, Code, Undo, Redo, Save, Eye, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateArticle, useUpdateArticle, type ArticleWithTranslations } from '@/hooks/useArticles';
import { useCategories } from '@/hooks/useCategories';
import { useLocale } from '@/contexts/LocaleContext';
import { slugify, calculateReadingTime } from '@/lib/helpers';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ArticleEditorProps {
  article?: ArticleWithTranslations;
}

interface TranslationData {
  title: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
}

const emptyTranslation: TranslationData = { title: '', excerpt: '', content: '', metaTitle: '', metaDescription: '' };

export function ArticleEditor({ article }: ArticleEditorProps) {
  const navigate = useNavigate();
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();
  const { data: categories = [] } = useCategories();
  const { locale } = useLocale();

  const [slug, setSlug] = useState(article?.slug || '');
  const [categoryId, setCategoryId] = useState(article?.category_id || '');
  const [featuredImage, setFeaturedImage] = useState(article?.featured_image || '');
  const [activeLocale, setActiveLocale] = useState<'en' | 'ar'>('en');
  const [showPreview, setShowPreview] = useState(false);

  const [translations, setTranslations] = useState<Record<string, TranslationData>>(() => {
    if (article?.article_translations) {
      const result: Record<string, TranslationData> = {};
      for (const t of article.article_translations) {
        result[t.locale] = {
          title: t.title,
          excerpt: t.excerpt || '',
          content: t.content,
          metaTitle: t.meta_title || '',
          metaDescription: t.meta_description || '',
        };
      }
      return { en: result.en || { ...emptyTranslation }, ar: result.ar || { ...emptyTranslation } };
    }
    return { en: { ...emptyTranslation }, ar: { ...emptyTranslation } };
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: activeLocale === 'ar' ? 'ابدأ الكتابة...' : 'Start writing your article...' }),
    ],
    content: translations[activeLocale]?.content || '',
    onUpdate: ({ editor }) => {
      setTranslations(prev => ({
        ...prev,
        [activeLocale]: { ...prev[activeLocale], content: editor.getHTML() },
      }));
    },
  });

  // Sync editor content when switching locales
  useEffect(() => {
    if (editor) {
      const currentContent = translations[activeLocale]?.content || '';
      if (editor.getHTML() !== currentContent) {
        editor.commands.setContent(currentContent);
      }
    }
  }, [activeLocale]);

  // Auto-generate slug from English title
  useEffect(() => {
    if (!article && translations.en.title && !slug) {
      setSlug(slugify(translations.en.title));
    }
  }, [translations.en.title]);

  const updateTranslation = (field: keyof TranslationData, value: string) => {
    setTranslations(prev => ({
      ...prev,
      [activeLocale]: { ...prev[activeLocale], [field]: value },
    }));
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!translations.en.title) {
      toast.error('English title is required');
      return;
    }
    if (!slug) {
      toast.error('Slug is required');
      return;
    }

    const translationsArray = Object.entries(translations)
      .filter(([, data]) => data.title)
      .map(([loc, data]) => ({
        locale: loc,
        title: data.title,
        excerpt: data.excerpt || undefined,
        content: data.content,
        meta_title: data.metaTitle || undefined,
        meta_description: data.metaDescription || undefined,
        reading_time: calculateReadingTime(data.content),
      }));

    try {
      if (article) {
        await updateArticle.mutateAsync({
          id: article.id,
          slug,
          category_id: categoryId || undefined,
          featured_image: featuredImage || undefined,
          status,
          translations: translationsArray,
        });
        toast.success('Article updated');
      } else {
        await createArticle.mutateAsync({
          slug,
          category_id: categoryId || undefined,
          featured_image: featuredImage || undefined,
          status,
          translations: translationsArray,
        });
        toast.success('Article created');
        navigate('/dashboard/articles');
      }
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (!editor) return null;

  return (
    <div className="space-y-6">
      {/* Actions bar */}
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold">
          {article ? 'Edit Article' : 'New Article'}
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? 'Editor' : 'Preview'}
          </Button>
          <Button variant="outline" onClick={() => handleSave('draft')} disabled={createArticle.isPending || updateArticle.isPending}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={() => handleSave('published')} disabled={createArticle.isPending || updateArticle.isPending}>
            <Send className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main editor area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Language tabs */}
          <Tabs value={activeLocale} onValueChange={(v) => setActiveLocale(v as 'en' | 'ar')}>
            <TabsList>
              <TabsTrigger value="en">🇺🇸 English</TabsTrigger>
              <TabsTrigger value="ar">🇸🇦 العربية</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Title */}
          <Input
            placeholder={activeLocale === 'ar' ? 'عنوان المقالة' : 'Article title'}
            value={translations[activeLocale]?.title || ''}
            onChange={(e) => updateTranslation('title', e.target.value)}
            className="text-2xl font-serif font-bold h-auto py-3"
            dir={activeLocale === 'ar' ? 'rtl' : 'ltr'}
          />

          {/* Excerpt */}
          <Textarea
            placeholder={activeLocale === 'ar' ? 'مقتطف قصير' : 'Short excerpt'}
            value={translations[activeLocale]?.excerpt || ''}
            onChange={(e) => updateTranslation('excerpt', e.target.value)}
            rows={2}
            dir={activeLocale === 'ar' ? 'rtl' : 'ltr'}
          />

          {showPreview ? (
            <Card>
              <CardContent className="p-6">
                <div
                  className="prose-editorial"
                  dir={activeLocale === 'ar' ? 'rtl' : 'ltr'}
                  dangerouslySetInnerHTML={{ __html: translations[activeLocale]?.content || '<p>No content</p>' }}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border">
                <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} icon={<Bold className="h-4 w-4" />} />
                <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} icon={<Italic className="h-4 w-4" />} />
                <div className="w-px h-6 bg-border mx-1" />
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} icon={<Heading2 className="h-4 w-4" />} />
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} icon={<Heading3 className="h-4 w-4" />} />
                <div className="w-px h-6 bg-border mx-1" />
                <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} icon={<List className="h-4 w-4" />} />
                <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} icon={<ListOrdered className="h-4 w-4" />} />
                <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} icon={<Quote className="h-4 w-4" />} />
                <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} icon={<Code className="h-4 w-4" />} />
                <div className="w-px h-6 bg-border mx-1" />
                <ToolbarButton onClick={() => {
                  const url = window.prompt('Enter URL');
                  if (url) editor.chain().focus().setLink({ href: url }).run();
                }} active={editor.isActive('link')} icon={<LinkIcon className="h-4 w-4" />} />
                <ToolbarButton onClick={() => {
                  const url = window.prompt('Enter image URL');
                  if (url) editor.chain().focus().setImage({ src: url }).run();
                }} active={false} icon={<Image className="h-4 w-4" />} />
                <div className="w-px h-6 bg-border mx-1" />
                <ToolbarButton onClick={() => editor.chain().focus().undo().run()} active={false} icon={<Undo className="h-4 w-4" />} />
                <ToolbarButton onClick={() => editor.chain().focus().redo().run()} active={false} icon={<Redo className="h-4 w-4" />} />
              </div>
              <CardContent className="p-4" dir={activeLocale === 'ar' ? 'rtl' : 'ltr'}>
                <EditorContent editor={editor} />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Article Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="article-slug" />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => {
                      const catName = cat.category_translations?.find(t => t.locale === 'en')?.name || cat.slug;
                      return <SelectItem key={cat.id} value={cat.id}>{catName}</SelectItem>;
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Featured Image URL</Label>
                <Input value={featuredImage} onChange={(e) => setFeaturedImage(e.target.value)} placeholder="https://..." />
                {featuredImage && (
                  <img src={featuredImage} alt="Featured" className="w-full h-32 object-cover rounded-lg mt-2" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">SEO ({activeLocale.toUpperCase()})</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input
                  value={translations[activeLocale]?.metaTitle || ''}
                  onChange={(e) => updateTranslation('metaTitle', e.target.value)}
                  placeholder="SEO title"
                  dir={activeLocale === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea
                  value={translations[activeLocale]?.metaDescription || ''}
                  onChange={(e) => updateTranslation('metaDescription', e.target.value)}
                  placeholder="SEO description"
                  rows={3}
                  dir={activeLocale === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({ onClick, active, icon }: { onClick: () => void; active: boolean; icon: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'p-2 rounded-md transition-colors hover:bg-muted',
        active && 'bg-muted text-primary'
      )}
    >
      {icon}
    </button>
  );
}
