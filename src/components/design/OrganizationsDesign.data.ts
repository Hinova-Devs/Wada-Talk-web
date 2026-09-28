
export const TABS = [
  ['Class skills', 'The five sub-scores, this month against last'],
  ['Top mistakes', 'What to teach next'],
  ['Inactive students', 'Who needs a nudge'],
  ['Export', 'PDF and CSV for donors']
] as const;
export const SKILLS = [['Fluency', 58, 66], ['Grammar', 52, 57], ['Vocabulary', 60, 64], ['Pronunciation', 63, 70], ['Interaction', 61, 72]];
export const MIST = [
  ['Past tense', 'I go yesterday → I went yesterday', '64%'],
  ['Articles', 'I am student → I am a student', '51%'],
  ['Prepositions', 'good in numbers → good with numbers', '47%'],
  ['Present perfect', 'I work here since 2022 → I have worked here since 2022', '38%'],
  ['Word order', 'Always I study → I always study', '22%']
] as const;
export const STUDENTS = [
  ['Student A', '▲ 6', 84, 'Today', 0], ['Student B', '▲ 4', 61, 'Yesterday', 0], ['Student C', '▲ 1', 39, '3 days ago', 0],
  ['Student D', '—', 12, '9 days', 1], ['Student E', '▼ 2', 8, '14 days', 1]
] as const;
export const TYPES = ['University', 'School', 'Business', 'NGO'];

