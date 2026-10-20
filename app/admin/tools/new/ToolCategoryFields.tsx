'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from '../../admin.module.css';

type CategoryOption = { id: string; name: string };
type SubcategoryOption = CategoryOption & { parentCategoryId: string };

type ToolCategoryFieldsProps = {
  categories: CategoryOption[];
  subcategories: SubcategoryOption[];
  initialPrimaryCategoryId?: string;
  initialSubcategoryIds?: string[];
};

export default function ToolCategoryFields({ categories, subcategories, initialPrimaryCategoryId = '', initialSubcategoryIds = [] }: ToolCategoryFieldsProps) {
  const [primaryCategoryId, setPrimaryCategoryId] = useState(initialPrimaryCategoryId);
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSubcategoryIds);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const availableSubcategories = useMemo(
    () => subcategories.filter((subcategory) => subcategory.parentCategoryId === primaryCategoryId),
    [primaryCategoryId, subcategories]
  );
  const filteredSubcategories = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    return term
      ? availableSubcategories.filter((subcategory) => subcategory.name.toLocaleLowerCase().includes(term))
      : availableSubcategories;
  }, [availableSubcategories, search]);
  const selectedSubcategories = useMemo(
    () => availableSubcategories.filter((subcategory) => selectedIds.includes(subcategory.id)),
    [availableSubcategories, selectedIds]
  );

  useEffect(() => {
    const closePicker = (event: PointerEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', closePicker);
    return () => document.removeEventListener('pointerdown', closePicker);
  }, []);

  const changePrimaryCategory = (value: string) => {
    setPrimaryCategoryId(value);
    setSelectedIds([]);
    setSearch('');
    setOpen(false);
  };

  const toggleSubcategory = (id: string) => {
    setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  return (
    <div className={styles.categoryFields}>
      <label>
        Primary category *
        <select name="primaryCategoryId" value={primaryCategoryId} onChange={(event) => changePrimaryCategory(event.target.value)} required>
          <option value="">Select one primary category</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
      </label>

      <div ref={pickerRef} className={styles.categoryPicker}>
        <span className={styles.categoryPickerLabel}>Sub categories</span>
        <div
          className={`${styles.multiControl} ${open ? styles.multiControlOpen : ''} ${!primaryCategoryId ? styles.multiControlDisabled : ''}`}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-disabled={!primaryCategoryId}
          tabIndex={primaryCategoryId ? 0 : -1}
          onClick={() => {
            if (primaryCategoryId) setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget || !primaryCategoryId) return;
            if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
              event.preventDefault();
              setOpen(true);
            }
            if (event.key === 'Escape') setOpen(false);
          }}
        >
          <div className={styles.multiChips}>
            {selectedSubcategories.length === 0 ? (
              <span className={styles.multiPlaceholder}>{primaryCategoryId ? 'Select one or more sub categories' : 'Select primary category first'}</span>
            ) : selectedSubcategories.map((subcategory) => (
              <span key={subcategory.id} className={styles.multiChip}>
                {subcategory.name}
                <button type="button" aria-label={`Remove ${subcategory.name}`} onClick={(event) => { event.stopPropagation(); toggleSubcategory(subcategory.id); }}>×</button>
              </span>
            ))}
          </div>
          <button type="button" className={styles.multiToggle} aria-label="Choose sub categories" aria-expanded={open} disabled={!primaryCategoryId} onClick={(event) => { event.stopPropagation(); setOpen((current) => !current); }}>
            <span aria-hidden>⌄</span>
          </button>
        </div>

        {selectedIds.map((id) => <input key={id} type="hidden" name="subcategoryIds" value={id} />)}

        {open && (
          <div className={styles.multiMenu}>
            <div className={styles.multiSearch}>
              <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search sub categories..." aria-label="Search sub categories" autoFocus />
            </div>
            <div className={styles.multiOptions}>
              {filteredSubcategories.length === 0 ? <p>No matching sub categories found.</p> : filteredSubcategories.map((subcategory) => {
                const selected = selectedIds.includes(subcategory.id);
                return (
                  <button key={subcategory.id} type="button" className={selected ? styles.multiOptionSelected : ''} aria-pressed={selected} onClick={() => toggleSubcategory(subcategory.id)}>
                    <span>{subcategory.name}</span><i aria-hidden>{selected ? '✓' : ''}</i>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        <small className={styles.fieldHelp}>Choose one primary category, then select any number of its sub categories.</small>
      </div>
    </div>
  );
}
