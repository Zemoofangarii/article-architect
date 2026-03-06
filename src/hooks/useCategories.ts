import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type CategoryWithTranslations = Tables<'categories'> & {
  category_translations: Tables<'category_translations'>[];
};

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*, category_translations(*)')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data ?? []) as CategoryWithTranslations[];
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      slug: string;
      translations: { locale: string; name: string; description?: string }[];
    }) => {
      const { data: category, error } = await supabase
        .from('categories')
        .insert({ slug: input.slug })
        .select()
        .single();

      if (error) throw error;

      for (const t of input.translations) {
        const { error: tError } = await supabase
          .from('category_translations')
          .insert({
            category_id: category.id,
            locale: t.locale,
            name: t.name,
            description: t.description || null,
          });
        if (tError) throw tError;
      }

      return category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
