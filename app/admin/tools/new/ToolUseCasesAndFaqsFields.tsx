'use client';

import { useRef, useState } from 'react';
import styles from '../../admin.module.css';

type PairRow = { id: number; first: string; second: string };

export function PairEditor({
  title,
  addLabel,
  firstName,
  firstLabel,
  firstPlaceholder,
  secondName,
  secondLabel,
  secondPlaceholder,
  initialItems = [],
}: {
  title: string;
  addLabel: string;
  firstName: string;
  firstLabel: string;
  firstPlaceholder: string;
  secondName: string;
  secondLabel: string;
  secondPlaceholder: string;
  initialItems?: Array<{ first: string; second: string }>;
}) {
  const initialRows = initialItems.length ? initialItems.map((item, index) => ({ id: index + 1, ...item })) : [{ id: 1, first: '', second: '' }];
  const nextId = useRef(initialRows.length + 1);
  const [rows, setRows] = useState<PairRow[]>(initialRows);
  const add = () => setRows((current) => [...current, { id: nextId.current++, first: '', second: '' }]);
  const remove = (id: number) => setRows((current) => current.length === 1 ? [{ ...current[0], first: '', second: '' }] : current.filter((row) => row.id !== id));

  return (
    <section className={`${styles.formCard} ${styles.structuredCard}`}>
      <div className={styles.structuredHeading}>
        <h2>{title}</h2>
        <button type="button" onClick={add}>+ {addLabel}</button>
      </div>
      <div className={styles.featureEditor}>
        <div className={styles.featureRows}>
          {rows.map((row, index) => (
            <div className={styles.featureRow} key={row.id}>
              <span className={styles.featureNumber}>{index + 1}</span>
              <label>{firstLabel}<input name={firstName} maxLength={160} value={row.first} onChange={(event) => setRows((current) => current.map((item) => item.id === row.id ? { ...item, first: event.target.value } : item))} placeholder={firstPlaceholder} /></label>
              <label>{secondLabel}<textarea name={secondName} rows={2} maxLength={700} value={row.second} onChange={(event) => setRows((current) => current.map((item) => item.id === row.id ? { ...item, second: event.target.value } : item))} placeholder={secondPlaceholder} /></label>
              <button type="button" onClick={() => remove(row.id)} aria-label={`Remove ${title.toLowerCase()} item ${index + 1}`}>×</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ToolUseCasesAndFaqsFields({
  useCases = [],
  faqs = []
}: {
  useCases?: Array<{ title: string; description: string }>;
  faqs?: Array<{ question: string; answer: string }>;
}) {
  return (
    <>
      <PairEditor
        title="Use Cases"
        addLabel="Add use case"
        firstName="useCaseTitles"
        firstLabel="Use case title"
        firstPlaceholder="e.g. Competitor research"
        secondName="useCaseDescriptions"
        secondLabel="Short description"
        secondPlaceholder="Explain how the tool helps in this situation."
        initialItems={useCases.map((item) => ({ first: item.title, second: item.description }))}
      />
      <PairEditor
        title="Frequently Asked Questions"
        addLabel="Add FAQ"
        firstName="faqQuestions"
        firstLabel="Question"
        firstPlaceholder="e.g. Is this tool free?"
        secondName="faqAnswers"
        secondLabel="Answer"
        secondPlaceholder="Write a direct and useful answer."
        initialItems={faqs.map((item) => ({ first: item.question, second: item.answer }))}
      />
    </>
  );
}
