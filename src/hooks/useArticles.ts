import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type ArticleWithTranslations = Tables<'articles'> & {
  article_translations: Tables<'article_translations'>[];
  categories: Tables<'categories'> | null;
  profiles: Tables<'profiles'> | null;
};

export function usePublishedArticles() {
  return useQuery({
    queryKey: ['articles', 'published'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          article_translations(*),
          categories(*),
          profiles!articles_author_id_fkey(*)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;
      return (data ?? []) as unknown as ArticleWithTranslations[];
    },
  });
}

export function useArticleBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['articles', slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          article_translations(*),
          categories(*),
          profiles!articles_author_id_fkey(*)
        `)
        .eq('slug', slug!)
        .single();

      if (error) throw error;
      return data as unknown as ArticleWithTranslations;
    },
  });
}

export function useAllArticles() {
  return useQuery({
    queryKey: ['articles', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          article_translations(*),
          categories(*),
          profiles!articles_author_id_fkey(*)
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return (data ?? []) as unknown as ArticleWithTranslations[];
    },
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      slug: string;
      category_id?: string;
      featured_image?: string;
      status?: string;
      translations: { locale: string; title: string; excerpt?: string; content: string; meta_title?: string; meta_description?: string; reading_time?: number }[];
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: article, error } = await supabase
        .from('articles')
        .insert({
          slug: input.slug,
          category_id: input.category_id || null,
          featured_image: input.featured_image || null,
          status: input.status || 'draft',
          author_id: user.id,
          published_at: input.status === 'published' ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (error) throw error;

      // Insert translations
      for (const t of input.translations) {
        const { error: tError } = await supabase
          .from('article_translations')
          .insert({
            article_id: article.id,
            locale: t.locale,
            title: t.title,
            excerpt: t.excerpt || null,
            content: t.content,
            meta_title: t.meta_title || null,
            meta_description: t.meta_description || null,
            reading_time: t.reading_time || null,
          });
        if (tError) throw tError;
      }

      return article;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      id: string;
      slug?: string;
      category_id?: string;
      featured_image?: string;
      status?: string;
      translations?: { locale: string; title: string; excerpt?: string; content: string; meta_title?: string; meta_description?: string; reading_time?: number }[];
    }) => {
      const updateData: Record<string, unknown> = {};
      if (input.slug) updateData.slug = input.slug;
      if (input.category_id !== undefined) updateData.category_id = input.category_id || null;
      if (input.featured_image !== undefined) updateData.featured_image = input.featured_image || null;
      if (input.status) {
        updateData.status = input.status;
        if (input.status === 'published') updateData.published_at = new Date().toISOString();
      }

      if (Object.keys(updateData).length > 0) {
        const { error } = await supabase
          .from('articles')
          .update(updateData)
          .eq('id', input.id);
        if (error) throw error;
      }

      if (input.translations) {
        for (const t of input.translations) {
          const { error: tError } = await supabase
            .from('article_translations')
            .upsert({
              article_id: input.id,
              locale: t.locale,
              title: t.title,
              excerpt: t.excerpt || null,
              content: t.content,
              meta_title: t.meta_title || null,
              meta_description: t.meta_description || null,
              reading_time: t.reading_time || null,
            }, { onConflict: 'article_id,locale' });
          if (tError) throw tError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
}
