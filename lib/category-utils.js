import { getCategory, mainCategories } from '../data/categories';
import { getCategoryToolCount, publishedTools } from '../data/tools';

export function getPopulatedPublicCategories() {
  return mainCategories.filter((category) => category.publicVisible && getCategoryToolCount(category.id) > 0);
}

export function getSubcategoryToolCount(subcategoryId) {
  return new Set(publishedTools.filter((tool) => tool.subcategoryIds.includes(subcategoryId)).map((tool) => tool.slug)).size;
}

export function validateToolClassification({ primaryCategoryId, secondaryCategoryIds = [], subcategoryIds = [] }) {
  const errors = [];
  const secondary = [...new Set(secondaryCategoryIds)];
  const selectedCategoryIds = [primaryCategoryId, ...secondary].filter(Boolean);

  if (!getCategory(primaryCategoryId)) errors.push('Choose one primary category.');
  if (secondary.length > 2) errors.push('Choose no more than two secondary categories.');
  if (secondary.includes(primaryCategoryId)) errors.push('The primary category cannot also be secondary.');

  for (const subcategoryId of subcategoryIds) {
    const parentCategoryId = subcategoryId.split('.')[0];
    if (!selectedCategoryIds.includes(parentCategoryId)) {
      errors.push('Every subcategory must belong to a selected category.');
      break;
    }
  }

  return { valid: errors.length === 0, errors };
}
