"use client";
import type { Drill, Teach, Topic, Variant } from "@/lib/ops/units";

// Form for one variant (easy / medium / hard) of a unit. Every change returns a new Variant through onChange.
// Lists are edited as typed; empty entries are dropped when the unit is saved (see cleanVariant).

const DRILL_TYPE = { choice: "Choose the answer", build: "Build the sentence", say: "Say it" } as const;

function Text({ label, value, onChange, long, hint }: { label: string; value: string; onChange: (v: string) => void; long?: boolean; hint?: string }) {
  return (
    <label>
      {label}
      {long ? <textarea rows={2} value={value} onChange={(e) => onChange(e.target.value)} /> : <input value={value} onChange={(e) => onChange(e.target.value)} />}
      {hint && <small>{hint}</small>}
    </label>
  );
}

/** A list of short texts (options, chips) with add and remove. */
function TextList({ label, items, onChange, min, max, add }: { label: string; items: string[]; onChange: (v: string[]) => void; min: number; max: number; add: string }) {
  return (
    <fieldset className="ops-list">
      <legend>{label}</legend>
      {items.map((it, i) => (
        <div key={i} className="ops-row">
          <input aria-label={`${label} ${i + 1}`} value={it} onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} />
          {items.length > min && <button type="button" className="text-button" onClick={() => onChange(items.filter((_, j) => j !== i))}>Remove</button>}
        </div>
      ))}
      {items.length < max && <button type="button" className="oa-button ghost" onClick={() => onChange([...items, ""])}>{add}</button>}
    </fieldset>
  );
}

function DrillFields({ d, onChange }: { d: Drill; onChange: (d: Drill) => void }) {
  const explain = (
    <>
      <Text label="Why (English)" value={d.explain_en} onChange={(v) => onChange({ ...d, explain_en: v })} long />
      <Text label="Why (Somali)" value={d.explain_so ?? ""} onChange={(v) => onChange({ ...d, explain_so: v || null })} long />
    </>
  );
  if (d.type === "choice") {
    return (
      <>
        <Text label="Question" value={d.prompt} onChange={(v) => onChange({ ...d, prompt: v })} long />
        <fieldset className="ops-list">
          <legend>Options (tick the correct one)</legend>
          {d.options.map((o, i) => (
            <div key={i} className="ops-row">
              <input type="radio" name={`answer-${d.id}`} aria-label={`Option ${i + 1} is correct`} checked={d.answer === i} onChange={() => onChange({ ...d, answer: i })} />
              <input aria-label={`Option ${i + 1}`} value={o} onChange={(e) => onChange({ ...d, options: d.options.map((x, j) => (j === i ? e.target.value : x)) })} />
              {d.options.length > 2 && (
                <button type="button" className="text-button" onClick={() => onChange({ ...d, options: d.options.filter((_, j) => j !== i), answer: d.answer === i ? 0 : d.answer > i ? d.answer - 1 : d.answer })}>Remove</button>
              )}
            </div>
          ))}
          {d.options.length < 4 && <button type="button" className="oa-button ghost" onClick={() => onChange({ ...d, options: [...d.options, ""] })}>+ Option</button>}
        </fieldset>
        {explain}
      </>
    );
  }
  if (d.type === "build") {
    return (
      <>
        <Text label="Instruction" value={d.prompt} onChange={(v) => onChange({ ...d, prompt: v })} long />
        <Text label="Correct sentence (words in order, separated by spaces)" value={d.target.join(" ")} onChange={(v) => onChange({ ...d, target: v.split(" ") })} />
        <Text
          label="Word bank (separated by spaces)"
          value={d.bank.join(" ")}
          onChange={(v) => onChange({ ...d, bank: v.split(" ") })}
          hint="Every word of the sentence, once each, plus 1–3 wrong words. The order here is the order learners see."
        />
        {explain}
      </>
    );
  }
  return (
    <>
      <Text label="Sentence to say" value={d.text} onChange={(v) => onChange({ ...d, text: v })} />
      <Text label="Tip (pronunciation or delivery)" value={d.hint ?? ""} onChange={(v) => onChange({ ...d, hint: v || undefined })} />
      {explain}
    </>
  );
}

function TopicList({ label, items, onChange }: { label: string; items: Topic[]; onChange: (v: Topic[]) => void }) {
  return (
    <fieldset className="ops-list">
      <legend>{label}</legend>
      {items.map((t, i) => (
        <div key={i} className="ops-row topic">
          <input aria-label={`${label} ${i + 1}: card`} placeholder="Card" value={t.q} onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))} />
          <input aria-label={`${label} ${i + 1}: help`} placeholder="Help line (optional)" value={t.help ?? ""} onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, help: e.target.value || undefined } : x)))} />
          {items.length > 1 && <button type="button" className="text-button" onClick={() => onChange(items.filter((_, j) => j !== i))}>Remove</button>}
        </div>
      ))}
      <button type="button" className="oa-button ghost" onClick={() => onChange([...items, { q: "" }])}>+ Card</button>
    </fieldset>
  );
}

export function VariantFields({ v, onChange }: { v: Variant; onChange: (v: Variant) => void }) {
  const s = v.ai_script;
  const script = (patch: Partial<Variant["ai_script"]>) => onChange({ ...v, ai_script: { ...s, ...patch } });
  return (
    <>
      <TeachView t={v.teach} />
      {v.say_your_way?.length ? (
        <section className="oa-panel ops-section">
          <h2>Say it your way</h2>
          <p className="ops-hint">Learners answer each question out loud; the app shows what they said, which words they used, and the example. Read-only here: generate again to change it.</p>
          {v.say_your_way.map((q, i) => (
            <article key={i} className="ops-drill">
              <p><b>{i + 1}. {q.prompt}</b> <small lang="so">{q.prompt_so}</small></p>
              <p className="ops-hint">Use: {q.use_words.join(", ")}</p>
              <p>{q.example} <small lang="so">{q.example_so}</small></p>
            </article>
          ))}
        </section>
      ) : null}
      {v.drills.length > 0 && (
        <section className="oa-panel ops-section">
          <h2>Learn: drills (older units)</h2>
          {v.drills.map((d, i) => (
            <article key={d.id} className="ops-drill">
              <h3>{i + 1}. {DRILL_TYPE[d.type]} <small>{d.id}</small></h3>
              <DrillFields d={d} onChange={(nd) => onChange({ ...v, drills: v.drills.map((x, j) => (j === i ? nd : x)) })} />
            </article>
          ))}
        </section>
      )}

      <section className="oa-panel ops-section">
        <h2>Practice with AI: role-play</h2>
        <div className="ops-grid">
          <Text label="AI role (persona)" value={s.persona} onChange={(x) => script({ persona: x })} />
          <Text label="Setting" value={s.setting} onChange={(x) => script({ setting: x })} />
          <Text label="Goal for the learner" value={s.goal} onChange={(x) => script({ goal: x })} long />
          <Text label="Opening line" value={s.opening} onChange={(x) => script({ opening: x })} long />
        </div>
        {s.points.map((p, i) => (
          <article key={i} className="ops-drill">
            <h3>Talking point {i + 1} <small>{p.id}</small></h3>
            <Text label="What the learner should say" value={p.target} onChange={(x) => script({ points: s.points.map((q, j) => (j === i ? { ...q, target: x } : q)) })} long />
            <TextList label="Hint chips" items={p.chips} min={0} max={3} add="+ Chip" onChange={(c) => script({ points: s.points.map((q, j) => (j === i ? { ...q, chips: c } : q)) })} />
          </article>
        ))}
      </section>

      <section className="oa-panel ops-section">
        <h2>Plan: questions before the call</h2>
        {v.plan_prompts.map((q, i) => (
          <Text key={i} label={`Question ${i + 1}`} value={q} onChange={(x) => onChange({ ...v, plan_prompts: v.plan_prompts.map((y, j) => (j === i ? x : y)) })} />
        ))}
      </section>

      <section className="oa-panel ops-section">
        <h2>Live Talk: topic cards</h2>
        <p className="ops-hint">Never put a name on a card: the partner is a different person every time.</p>
        <div className="ops-grid">
          <TopicList label="Asking side (interviewer)" items={v.talk_topics.interviewer} onChange={(t) => onChange({ ...v, talk_topics: { ...v.talk_topics, interviewer: t } })} />
          <TopicList label="Answering side (candidate)" items={v.talk_topics.candidate} onChange={(t) => onChange({ ...v, talk_topics: { ...v.talk_topics, candidate: t } })} />
        </div>
      </section>
    </>
  );
}

/** Drops what an editor leaves behind: empty list entries, stray spaces in word lists. */
/**
 * The "learn first" part learners see before the drills: the same in easy, medium and hard. Read-only here: to change
 * it, edit the words, grammar or notes in the plan and generate again.
 */
function TeachView({ t }: { t?: Teach }) {
  if (!t) {
    return (
      <section className="oa-panel ops-section">
        <h2>Learn first: scene, words, grammar</h2>
        <p className="ops-hint">This unit was written before the teaching part existed, so learners go straight to the drills. Generate it again to add the scene, words, grammar and listening pairs.</p>
      </section>
    );
  }
  return (
    <section className="oa-panel ops-section">
      <h2>Learn first: scene, words, grammar</h2>
      <p className="ops-hint">What learners see before any question; the same for easy, medium and hard. Check the Somali. To change it, edit the plan (words, grammar, notes) and generate again.</p>
      <h3>Scene</h3>
      <p lang="so">{t.scene_so}</p>
      <p className="ops-hint">{t.scene_en}</p>
      <h3>Conversation</h3>
      <ul className="ops-teach-list">
        {t.dialogue.map((l, i) => <li key={i}><b>{l.speaker}:</b> {l.en} <small lang="so">{l.so}</small></li>)}
      </ul>
      <h3>Words ({t.words.length})</h3>
      <ul className="ops-teach-list">
        {t.words.map((w, i) => <li key={i}><b>{w.en}</b> · <span lang="so">{w.so}</span> — {w.example_en} <small lang="so">{w.example_so}</small></li>)}
      </ul>
      <h3>Grammar</h3>
      {t.grammar.map((g, i) => (
        <article key={i} className="ops-drill">
          <p><b>{g.title}</b></p>
          <p>{g.explain_en}</p>
          <p lang="so">{g.explain_so}</p>
          <p className="ops-hint">{g.examples.join(" · ")}</p>
        </article>
      ))}
      <h3>Hear the difference</h3>
      <ul className="ops-teach-list">
        {t.sound_pairs.map((p, i) => <li key={i}><b>{p.sound}</b>: {p.a} / {p.b} — {p.tip_en} <small lang="so">{p.tip_so}</small></li>)}
      </ul>
    </section>
  );
}

export function cleanVariant(v: Variant): Variant {
  const words = (xs: string[]) => xs.map((x) => x.trim()).filter(Boolean);
  return {
    ...v,
    drills: v.drills.map((d) => (d.type === "build" ? { ...d, bank: words(d.bank), target: words(d.target) } : d)),
    ai_script: { ...v.ai_script, points: v.ai_script.points.map((p) => ({ ...p, chips: words(p.chips) })) },
    talk_topics: {
      interviewer: v.talk_topics.interviewer.filter((t) => t.q.trim()),
      candidate: v.talk_topics.candidate.filter((t) => t.q.trim()),
    },
  };
}
