import { cache } from 'react';
import { getDb } from '@/lib/db';
import { categories, subcategories } from '@/lib/db/schema';
import { mainCategories } from '@/data/categories';

type StaticSubcategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  parentCategoryId: string;
  searchSynonyms: string[];
};

type StaticCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  publicVisible: boolean;
  selectedOnHomepage: boolean;
  accent: string;
  searchSynonyms: string[];
  subcategories: StaticSubcategory[];
};

const staticCategories = mainCategories as StaticCategory[];

function staticFallback() {
  return staticCategories.filter((category) => category.publicVisible);
}

export const getPublicCategories = cache(async () => {
  try {
    const db = getDb();
    const [categoryRows, subcategoryRows] = await Promise.all([
      db.select().from(categories).orderBy(categories.createdAt),
      db.select().from(subcategories).orderBy(subcategories.createdAt)
    ]);
    const staticById = new Map(staticCategories.map((category) => [category.id, category]));
    const order = new Map(staticCategories.map((category, index) => [category.id, index]));

    return categoryRows
      .filter((category) => category.publicVisible)
      .sort((a, b) => (order.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (order.get(b.id) ?? Number.MAX_SAFE_INTEGER))
      .map((category, index) => {
        const staticCategory = staticById.get(category.id);
        const staticSubcategories = new Map(staticCategory?.subcategories.map((subcategory) => [subcategory.id, subcategory]) || []);
        const visibleSubcategories = subcategoryRows
          .filter((subcategory) => subcategory.parentCategoryId === category.id && subcategory.publicVisible)
          .map((subcategory) => {
            const staticSubcategory = staticSubcategories.get(subcategory.id);
            return {
              id: subcategory.id,
              slug: subcategory.slug,
              name: subcategory.name,
              description: subcategory.description,
              parentCategoryId: category.id,
              searchSynonyms: staticSubcategory?.searchSynonyms || []
            };
          });

        return {
          id: category.id,
          slug: category.slug,
          name: category.name,
          description: category.description,
          publicVisible: true,
          selectedOnHomepage: category.selectedOnHomepage,
          accent: staticCategory?.accent || ['blue', 'violet', 'orange', 'green'][index % 4],
          searchSynonyms: staticCategory?.searchSynonyms || [],
          subcategories: visibleSubcategories
        };
      });
  } catch {
    return staticFallback();
  }
});

export async function resolvePublicCategorySlug(slug: string, aliases: Record<string, string>) {
  const canonicalSlug = aliases[slug] || slug;
  const publicCategories = await getPublicCategories();
  return {
    category: publicCategories.find((category) => category.id === canonicalSlug || category.slug === canonicalSlug),
    isLegacy: Boolean(aliases[slug]),
    canonicalSlug
  };
}
