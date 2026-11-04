import type { Category } from "@/lib/ops/units";

// Free Unsplash photos (unsplash.com/license), loaded from Unsplash.
const photo = (id: string, w = 480) => `url(https://images.unsplash.com/photo-${id}?w=${w}&q=70&auto=format&fit=crop)`;

const INTERVIEW = "1565688534245-05d6b5be184a";
const MEETING = "1556761175-5973dc0f32e7";
const AI = "1677442136019-21780ecad995";
const EXAM = "1434030216411-0b793f4b4173";
const GRADUATION = "1541339907198-e08756dedf3f";
const FRIENDS = "1529156069898-49953e39b3ac";

/** One photo per category tab. */
export const CATEGORY_PHOTOS: Record<Category, string> = {
  job_interviews: photo(INTERVIEW),
  business: photo(MEETING),
  tech_ai: photo(AI),
  ielts_scholarships: photo(EXAM),
  university: photo(GRADUATION),
  everyday: photo(FRIENDS),
};

// Topic words → photo. The first match in a unit's title (then its can-do line) wins; order matters.
// ponytail: keyword guess. If owners want to pick the exact picture, store an image per unit in the database.
const TOPICS: [RegExp, string][] = ([
  ["greet|welcome|small talk|arriv|meet the|first day", "1521791136064-7986c2920216"],
  ["introduc|yourself|myself|about me", "1573497019940-1c28c88b4f3e"],
  ["educat|studies|study|school|graduat|degree", GRADUATION],
  ["strength|weakness|closing|interview", INTERVIEW],
  ["project|team|colleague", "1600880292203-757bb62b4baf"],
  ["salar|money|price|budget|pay|cost|bank|financ|invoice", "1554224155-6726b3ff858f"],
  ["e-?mail|mail|message|letter", "1596526131083-e8c633c948d2"],
  ["video|online meeting|zoom|remote", "1588196749597-9ff075ee6b5b"],
  ["phone|call", "1423666639041-f56000c27a9a"],
  ["present|pitch|speech|public speaking", "1475721027785-f74eccf877e2"],
  ["negotiat|contract|deal|agreement", "1450101499163-c8848c66ca85"],
  ["meeting|discuss|brainstorm|idea", "1552664730-d307ca884978"],
  ["data|chart|report|analy|result", "1551288049-bebda4e38f71"],
  ["cod|program|software|developer|bug", "1461749280684-dccba630e2f6"],
  ["ai\\b|robot|machine|chatgpt|prompt|automat", "1485827404703-89b55fcc595e"],
  ["computer|laptop|app|tech|website|internet", "1498050108023-c5249f4df085"],
  ["essay|writ", "1455390582262-044cdead277a"],
  ["exam|test|ielts|toefl|score|band", EXAM],
  ["scholarship|abroad|visa|countr|apply|application", "1524661135-423995f22d0b"],
  ["librar|research|source", "1481627834876-b7833e8f5570"],
  ["lectur|class|professor|seminar|campus|universit|teacher", "1524178232363-1fb2b075b655"],
  ["read|book|vocabular|word", "1497633762265-9d179a990aa6"],
  ["schedul|time|plan|deadline|calendar|appointment|routine", "1506784983877-45594efa4cbe"],
  ["hotel|room", "1566073771259-6a8506099945"],
  ["travel|airport|flight|trip|holiday|vacation", "1436491865332-7a61a109cc05"],
  ["cook|kitchen|recipe", "1556910103-1c02745aae4d"],
  ["restaurant|food|order|eat|menu|meal", "1517248135467-4c7edcad34c4"],
  ["coffee|caf", "1495474472287-4d71bcdd2085"],
  ["shop|buy|store|cloth|market", "1441986300917-64674bd600d8"],
  ["doctor|health|sick|hospital|pharmac|medicine", "1576091160399-112ba8d25d1d"],
  ["famil|parent|mother|father|home", "1511895426328-dc8714191300"],
  ["weather|rain|season", "1519692933481-e162a57d6721"],
  ["direction|city|street|bus|taxi|transport", "1449824913935-59a10b8d2000"],
  ["friend|hobb|free time|weekend|party|sport", FRIENDS],
  ["job|work|career|boss|office|business", "1454165804606-c3d57bc86b40"],
] as const).map(([words, id]) => [new RegExp(`\\b(${words})`, "i"), id]);

/** A small photo for a unit, guessed from its title and can-do line; the category photo when nothing matches. */
export function unitPhoto(category: Category, title: string, canDo = ""): string {
  for (const text of [title, canDo]) {
    const hit = TOPICS.find(([re]) => re.test(text));
    if (hit) return photo(hit[1], 200);
  }
  return CATEGORY_PHOTOS[category];
}
