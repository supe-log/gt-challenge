// Seed items for demo mode — no database needed
export interface DemoItem {
  id: string;
  domain: string;
  difficulty: number;
  discrimination: number;
  guessing: number;
  content: {
    stem: string;
    type: string;
    options: { text: string }[];
    correct_index: number;
  };
}

export const DEMO_ITEMS: DemoItem[] = [
  // ─── Reasoning ────────────────────────────────────────────
  {
    id: "r1", domain: "reasoning", difficulty: -2.0, discrimination: 0.8, guessing: 0.25,
    content: { stem: "Hot is to cold as up is to ___", type: "analogy", options: [{ text: "Down" }, { text: "Left" }, { text: "Over" }, { text: "Under" }], correct_index: 0 },
  },
  {
    id: "r2", domain: "reasoning", difficulty: -1.5, discrimination: 1.0, guessing: 0.25,
    content: { stem: "Apple is to tree as egg is to ___", type: "analogy", options: [{ text: "Nest" }, { text: "Plate" }, { text: "Chicken" }, { text: "Egg carton" }], correct_index: 2 },
  },
  {
    id: "r3", domain: "reasoning", difficulty: -1.0, discrimination: 1.2, guessing: 0.25,
    content: { stem: "Glove is to hand as sock is to ___", type: "analogy", options: [{ text: "Shoe" }, { text: "Foot" }, { text: "Leg" }, { text: "Drawer" }], correct_index: 1 },
  },
  {
    id: "r4", domain: "reasoning", difficulty: -0.5, discrimination: 1.1, guessing: 0.25,
    content: { stem: "Puppy is to dog as kitten is to ___", type: "analogy", options: [{ text: "Mouse" }, { text: "Cat" }, { text: "Bird" }, { text: "Rabbit" }], correct_index: 1 },
  },
  {
    id: "r5", domain: "reasoning", difficulty: 0.0, discrimination: 1.3, guessing: 0.25,
    content: { stem: "Which one does NOT belong? Carrot, Banana, Broccoli, Spinach", type: "odd_one_out", options: [{ text: "Carrot" }, { text: "Banana" }, { text: "Broccoli" }, { text: "Spinach" }], correct_index: 1 },
  },
  {
    id: "r6", domain: "reasoning", difficulty: 0.0, discrimination: 1.2, guessing: 0.25,
    content: { stem: "What comes next? 2, 4, 6, 8, ___", type: "number_series", options: [{ text: "9" }, { text: "10" }, { text: "12" }, { text: "11" }], correct_index: 1 },
  },
  {
    id: "r7", domain: "reasoning", difficulty: 0.5, discrimination: 1.4, guessing: 0.20,
    content: { stem: "Which one does NOT belong? Triangle, Square, Circle, Cube", type: "odd_one_out", options: [{ text: "Triangle" }, { text: "Square" }, { text: "Circle" }, { text: "Cube" }], correct_index: 3 },
  },
  {
    id: "r8", domain: "reasoning", difficulty: 0.5, discrimination: 1.3, guessing: 0.20,
    content: { stem: "What comes next? 1, 3, 5, 7, ___", type: "number_series", options: [{ text: "8" }, { text: "9" }, { text: "10" }, { text: "11" }], correct_index: 1 },
  },
  {
    id: "r9", domain: "reasoning", difficulty: 1.0, discrimination: 1.5, guessing: 0.20,
    content: { stem: "What comes next? 2, 6, 18, 54, ___", type: "number_series", options: [{ text: "108" }, { text: "162" }, { text: "72" }, { text: "216" }], correct_index: 1 },
  },
  {
    id: "r10", domain: "reasoning", difficulty: 1.0, discrimination: 1.6, guessing: 0.20,
    content: { stem: "All Bloops are Zips. Some Zips are Wops. Can some Bloops be Wops?", type: "syllogism", options: [{ text: "Yes, always" }, { text: "Yes, sometimes" }, { text: "No, never" }, { text: "Not enough info" }], correct_index: 1 },
  },
  {
    id: "r11", domain: "reasoning", difficulty: 1.5, discrimination: 1.7, guessing: 0.15,
    content: { stem: "If it is raining, the ground is wet. The ground is wet. Is it raining?", type: "syllogism", options: [{ text: "Yes, definitely" }, { text: "Maybe" }, { text: "No" }, { text: "Not enough info" }], correct_index: 1 },
  },
  {
    id: "r12", domain: "reasoning", difficulty: 1.5, discrimination: 1.8, guessing: 0.15,
    content: { stem: "Book is to library as painting is to ___", type: "analogy", options: [{ text: "Canvas" }, { text: "Museum" }, { text: "Artist" }, { text: "Frame" }], correct_index: 1 },
  },
  {
    id: "r13", domain: "reasoning", difficulty: 2.0, discrimination: 2.0, guessing: 0.15,
    content: { stem: "Which one does NOT belong? Mercury, Venus, Moon, Mars", type: "odd_one_out", options: [{ text: "Mercury" }, { text: "Venus" }, { text: "Moon" }, { text: "Mars" }], correct_index: 2 },
  },

  // ─── Math ─────────────────────────────────────────────────
  {
    id: "m1", domain: "math", difficulty: -2.0, discrimination: 0.9, guessing: 0.25,
    content: { stem: "Which number is bigger?", type: "comparison", options: [{ text: "15" }, { text: "51" }], correct_index: 1 },
  },
  {
    id: "m2", domain: "math", difficulty: -1.5, discrimination: 1.0, guessing: 0.25,
    content: { stem: "What is 7 + 8?", type: "computation", options: [{ text: "13" }, { text: "14" }, { text: "15" }, { text: "16" }], correct_index: 2 },
  },
  {
    id: "m3", domain: "math", difficulty: -1.5, discrimination: 1.0, guessing: 0.25,
    content: { stem: "What is 50 - 23?", type: "computation", options: [{ text: "23" }, { text: "27" }, { text: "33" }, { text: "37" }], correct_index: 1 },
  },
  {
    id: "m4", domain: "math", difficulty: -1.0, discrimination: 1.1, guessing: 0.25,
    content: { stem: "What is 23 + 19?", type: "computation", options: [{ text: "41" }, { text: "42" }, { text: "43" }, { text: "32" }], correct_index: 1 },
  },
  {
    id: "m5", domain: "math", difficulty: -0.5, discrimination: 1.2, guessing: 0.25,
    content: { stem: "What is 6 × 7?", type: "computation", options: [{ text: "36" }, { text: "42" }, { text: "48" }, { text: "35" }], correct_index: 1 },
  },
  {
    id: "m6", domain: "math", difficulty: 0.0, discrimination: 1.3, guessing: 0.25,
    content: { stem: "A baker made 48 cookies in bags of 6. How many bags?", type: "word_problem", options: [{ text: "6" }, { text: "7" }, { text: "8" }, { text: "9" }], correct_index: 2 },
  },
  {
    id: "m7", domain: "math", difficulty: 0.5, discrimination: 1.4, guessing: 0.20,
    content: { stem: "48 cookies in bags of 6. She gives 2 bags per friend. How many friends get cookies?", type: "word_problem", options: [{ text: "3" }, { text: "4" }, { text: "6" }, { text: "8" }], correct_index: 1 },
  },
  {
    id: "m8", domain: "math", difficulty: 0.5, discrimination: 1.3, guessing: 0.25,
    content: { stem: "Which is bigger: 1/3 or 1/4?", type: "comparison", options: [{ text: "1/3" }, { text: "1/4" }, { text: "They are equal" }], correct_index: 0 },
  },
  {
    id: "m9", domain: "math", difficulty: 1.0, discrimination: 1.5, guessing: 0.20,
    content: { stem: "What is 1/2 + 1/4?", type: "computation", options: [{ text: "2/6" }, { text: "3/4" }, { text: "1/2" }, { text: "2/4" }], correct_index: 1 },
  },
  {
    id: "m10", domain: "math", difficulty: 1.0, discrimination: 1.4, guessing: 0.20,
    content: { stem: "A train travels 60 mph. How far in 2.5 hours?", type: "word_problem", options: [{ text: "120 miles" }, { text: "130 miles" }, { text: "150 miles" }, { text: "180 miles" }], correct_index: 2 },
  },
  {
    id: "m11", domain: "math", difficulty: 1.5, discrimination: 1.6, guessing: 0.15,
    content: { stem: "What is the next prime number after 13?", type: "number_sense", options: [{ text: "14" }, { text: "15" }, { text: "17" }, { text: "19" }], correct_index: 2 },
  },
  {
    id: "m12", domain: "math", difficulty: 1.5, discrimination: 1.7, guessing: 0.15,
    content: { stem: "What is 144 ÷ 12?", type: "computation", options: [{ text: "11" }, { text: "12" }, { text: "13" }, { text: "14" }], correct_index: 1 },
  },
  {
    id: "m13", domain: "math", difficulty: 2.0, discrimination: 2.0, guessing: 0.15,
    content: { stem: "A rectangle has perimeter 24cm and width 4cm. What is its area?", type: "word_problem", options: [{ text: "32 sq cm" }, { text: "20 sq cm" }, { text: "48 sq cm" }, { text: "24 sq cm" }], correct_index: 0 },
  },

  // ─── Verbal ───────────────────────────────────────────────
  {
    id: "v1", domain: "verbal", difficulty: -1.5, discrimination: 1.0, guessing: 0.25,
    content: { stem: 'What does "enormous" mean?', type: "definition", options: [{ text: "Very small" }, { text: "Very fast" }, { text: "Very big" }, { text: "Very old" }], correct_index: 2 },
  },
  {
    id: "v2", domain: "verbal", difficulty: -1.0, discrimination: 1.1, guessing: 0.25,
    content: { stem: 'What is a synonym for "happy"?', type: "synonym", options: [{ text: "Sad" }, { text: "Joyful" }, { text: "Angry" }, { text: "Tired" }], correct_index: 1 },
  },
  {
    id: "v3", domain: "verbal", difficulty: -0.5, discrimination: 1.2, guessing: 0.25,
    content: { stem: 'What is the opposite of "ancient"?', type: "antonym", options: [{ text: "Old" }, { text: "Modern" }, { text: "Classic" }, { text: "Historic" }], correct_index: 1 },
  },
  {
    id: "v4", domain: "verbal", difficulty: 0.0, discrimination: 1.3, guessing: 0.25,
    content: { stem: "Sam ran to the store because he needed milk. Why did Sam go to the store?", type: "comprehension", options: [{ text: "To buy bread" }, { text: "To get milk" }, { text: "To see a friend" }, { text: "To exercise" }], correct_index: 1 },
  },
  {
    id: "v5", domain: "verbal", difficulty: 0.5, discrimination: 1.4, guessing: 0.20,
    content: { stem: "Maria put on her raincoat and grabbed her umbrella. What can you infer about the weather?", type: "inference", options: [{ text: "It is sunny" }, { text: "It is raining or about to rain" }, { text: "It is snowing" }, { text: "It is windy" }], correct_index: 1 },
  },
  {
    id: "v6", domain: "verbal", difficulty: 0.5, discrimination: 1.3, guessing: 0.20,
    content: { stem: 'What does "reluctant" mean?', type: "definition", options: [{ text: "Eager" }, { text: "Unwilling" }, { text: "Confused" }, { text: "Excited" }], correct_index: 1 },
  },
  {
    id: "v7", domain: "verbal", difficulty: 1.0, discrimination: 1.5, guessing: 0.20,
    content: { stem: "The dog wagged its tail and brought its leash to the door. What does the dog want?", type: "inference", options: [{ text: "Food" }, { text: "A walk" }, { text: "Sleep" }, { text: "A bath" }], correct_index: 1 },
  },
  {
    id: "v8", domain: "verbal", difficulty: 1.0, discrimination: 1.5, guessing: 0.20,
    content: { stem: "The library was quiet. Everyone whispered. Books lined every wall. Where is this?", type: "comprehension", options: [{ text: "A school gym" }, { text: "A library" }, { text: "A park" }, { text: "A store" }], correct_index: 1 },
  },
  {
    id: "v9", domain: "verbal", difficulty: 1.5, discrimination: 1.7, guessing: 0.15,
    content: { stem: 'What does "ubiquitous" mean?', type: "definition", options: [{ text: "Very rare" }, { text: "Found everywhere" }, { text: "Very beautiful" }, { text: "Hard to understand" }], correct_index: 1 },
  },
  {
    id: "v10", domain: "verbal", difficulty: 1.5, discrimination: 1.6, guessing: 0.15,
    content: { stem: "After the earthquake, the family slept outside in a tent. Why?", type: "inference", options: [{ text: "They like camping" }, { text: "Their house may be unsafe" }, { text: "It was summer" }, { text: "The tent was new" }], correct_index: 1 },
  },
  {
    id: "v11", domain: "verbal", difficulty: 2.0, discrimination: 1.8, guessing: 0.15,
    content: { stem: "The scientist carefully recorded each measurement twice. What does this tell you about the scientist?", type: "comprehension", options: [{ text: "She is bored" }, { text: "She is thorough and careful" }, { text: "She is slow" }, { text: "She forgot the first time" }], correct_index: 1 },
  },

  // ─── Pattern Recognition ──────────────────────────────────
  {
    id: "p1", domain: "pattern", difficulty: -2.0, discrimination: 0.8, guessing: 0.25,
    content: { stem: "What color comes next? Red, Blue, Red, Blue, ___", type: "color_pattern", options: [{ text: "Red" }, { text: "Blue" }, { text: "Green" }, { text: "Yellow" }], correct_index: 0 },
  },
  {
    id: "p2", domain: "pattern", difficulty: -1.5, discrimination: 1.0, guessing: 0.25,
    content: { stem: "What shape comes next? Circle, Square, Circle, Square, ___", type: "shape_pattern", options: [{ text: "Triangle" }, { text: "Circle" }, { text: "Square" }, { text: "Star" }], correct_index: 1 },
  },
  {
    id: "p3", domain: "pattern", difficulty: -1.0, discrimination: 1.1, guessing: 0.25,
    content: { stem: "What comes next? AB, CD, EF, ___", type: "letter_pattern", options: [{ text: "FG" }, { text: "GH" }, { text: "HI" }, { text: "EF" }], correct_index: 1 },
  },
  {
    id: "p4", domain: "pattern", difficulty: 0.0, discrimination: 1.2, guessing: 0.25,
    content: { stem: "What comes next? 1, 1, 2, 3, 5, ___", type: "number_pattern", options: [{ text: "6" }, { text: "7" }, { text: "8" }, { text: "10" }], correct_index: 2 },
  },
  {
    id: "p5", domain: "pattern", difficulty: 0.5, discrimination: 1.3, guessing: 0.20,
    content: { stem: "Which shape is the mirror image?", type: "reflection", options: [{ text: "Shape A (same)" }, { text: "Shape B (rotated)" }, { text: "Shape C (mirrored)" }, { text: "Shape D (different)" }], correct_index: 2 },
  },
  {
    id: "p6", domain: "pattern", difficulty: 1.0, discrimination: 1.5, guessing: 0.20,
    content: { stem: "What comes next? 3, 6, 12, 24, ___", type: "number_pattern", options: [{ text: "30" }, { text: "36" }, { text: "48" }, { text: "32" }], correct_index: 2 },
  },
  {
    id: "p7", domain: "pattern", difficulty: 1.5, discrimination: 1.6, guessing: 0.15,
    content: { stem: "What comes next? 2, 3, 5, 7, 11, ___", type: "number_pattern", options: [{ text: "12" }, { text: "13" }, { text: "14" }, { text: "15" }], correct_index: 1 },
  },
  {
    id: "p8", domain: "pattern", difficulty: 1.5, discrimination: 1.7, guessing: 0.15,
    content: { stem: "Which 3D shape can be made from this flat pattern (net)?", type: "nets", options: [{ text: "Cube" }, { text: "Cylinder" }, { text: "Pyramid" }, { text: "Cone" }], correct_index: 2 },
  },
];
