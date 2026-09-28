
export const TOPICS = [
  "Tell your partner about a job you'd like. Why that one?",
  "What is your biggest strength at work?",
  "Describe a time you solved a problem in a team.",
  "Where do you want to be in five years?"
] as const;
export const STEPS = [
  { t: 'Learn', so: 'Baro', l: 'Learn the phrases.', sl: 'Baro odhaahyada.' },
  { t: 'Practice with AI', so: 'Kula celceli AI', l: 'Rehearse with the AI.', sl: 'Kula celceli AI-ga.' },
  { t: 'Live Talk', so: 'Wada hadal toos ah', l: 'Talk with a real partner.', sl: 'La hadal lammaane dhab ah.' },
  { t: 'Review', so: 'Dib u eeg', l: 'Get your feedback.', sl: 'Hel jawaab celintaada.' }
] as const;
export const MISTAKES = [
  { cat: 'Past tense', said: 'Yesterday I go', better: 'Yesterday I went', full: 'Yesterday I went to an interview for a bank job.', bubble: 'Past tense trips everyone up. Say it with me!',
    en: "You're talking about yesterday, so the verb moves to the past: go becomes went.",
    so: "Waxaad ka hadlaysaa shalay, sidaas darteed falku wuxuu u beddelmayaa wakhti tagay: go wuxuu noqonayaa went." },
  { cat: 'Present perfect', said: 'I am working in this company since 2022', better: 'I have been working at this company since 2022', full: 'I have been working at this company since 2022.', bubble: 'Since means it started before and is still true.',
    en: 'With since, use have been + -ing for something that started in the past and is still true. Also: at a company, not in.',
    so: "Marka aad isticmaasho since, isticmaal have been + -ing, maxaa yeelay wax hore u bilaabmay oo weli socda ayaad sheegaysaa. Sidoo kale: at a company, ma aha in." },
  { cat: 'Verb form', said: 'I am agree', better: 'I agree', full: 'I agree.', bubble: 'Short and strong: I agree.',
    en: "Agree is already a verb, so you don't need am in front of it.",
    so: "Agree horey ayuu fal u yahay, markaa uma baahnid am hortiisa." },
  { cat: 'Comparatives', said: 'more better', better: 'better', full: 'My English is better than last year.', bubble: 'Better already means more good!',
    en: 'Better already means more good, so drop more.',
    so: "Better macnaheedu waa more good, sidaas darteed ka saar more." },
  { cat: 'Word choice', said: 'discuss about', better: 'discuss', full: 'Next week we will discuss the salary.', bubble: 'Last one. You fixed all five!',
    en: 'Discuss takes its object directly: discuss the salary, with no about.',
    so: "Discuss si toos ah ayuu u qaataa waxa laga hadlayo: discuss the salary, about la'aan." }
] as const;
export const SEGS: {m?: number; t?: string}[] = [
  { m: 0 }, { t: ' to an interview for a bank job. They asked about my experience: ' }, { m: 1 },
  { t: '. When they said teamwork matters, I said ' }, { m: 2 }, { t: '. My English is ' }, { m: 3 },
  { t: ' than last year, and next week we will ' }, { m: 4 }, { t: ' the salary.' }
] as const;
export const SUBS = [['Fluency', 74], ['Grammar', 61], ['Vocabulary', 70], ['Pronunciation', 78], ['Interaction', 80]];
export const PATHS = [
  ['💼', 'Job interviews', 'Answer common questions with confidence', '/paths/job-interviews'],
  ['🎓', 'IELTS and scholarships', 'Practice the speaking test, part by part', '/paths/ielts-scholarships'],
  ['🏛️', 'University', 'Seminars, presentations and office hours', '/paths/university'],
  ['📈', 'Business', 'Meetings, calls and pitching an idea', '/paths/business'],
  ['💻', 'Tech and AI', 'Stand-ups, demos and explaining your work', '/paths/tech-ai'],
  ['☕', 'Everyday conversation', 'Small talk, directions and making plans', '/paths/everyday-conversation']
] as const;
export const SAFETY = [
  ['🤝', 'Same-gender partners if you want', 'Lammaane isku jinsi ah haddii aad rabto'],
  ['🎧', 'Audio-only allowed', 'Cod keliya waa la oggol yahay'],
  ['🚩', 'Report and block anytime', 'Soo sheeg oo xannib mar kasta'],
  ['🛡️', 'Calls checked for safety', 'Wicitaannada waa la hubiyaa']
] as const;
export const METHOD = [
  ['Task-based units', 'Each unit is built around a real task, like answering an interview question.'],
  ['Prompt-first correction', 'The coach asks you to fix a mistake yourself before it shows the answer.'],
  ['Task repetition', 'You repeat the same task with a new partner, which builds fluency.'],
  ['Anxiety-aware design', 'You rehearse with the AI before you speak with a person.'],
  ['85% drill tuning', 'Drills aim for about 85% correct: hard enough to learn from, easy enough to keep going.'],
  ['Intelligibility over accent', 'The goal is being understood, not sounding like a native speaker.']
] as const;
export const ORBIT = [['🎥', 'Live Talk'], ['✨', 'AI coach'], ['🗣️', 'Somali on tap'], ['🛡️', 'Safe partners']];

