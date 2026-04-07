-- Seed: 52 items for age band K-2 (younger learners, grades K-2)
-- Simpler content, lower difficulty range [-2.5, 1.0]
-- 13 items each for reasoning, math, pattern_recognition; 13 for verbal

-- ─── Reasoning Items (13) ───────────────────────────────────────

INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json) VALUES
('reasoning', 'analogies', '{K-2}', -2.5, 0.8, 0.25, '{"stem": "A bird can fly. A fish can ___", "type": "analogy", "options": [{"text": "Swim"}, {"text": "Run"}, {"text": "Fly"}, {"text": "Jump"}], "correct_index": 0}'),
('reasoning', 'analogies', '{K-2}', -2.0, 0.9, 0.25, '{"stem": "A hat goes on your head. A shoe goes on your ___", "type": "analogy", "options": [{"text": "Hand"}, {"text": "Foot"}, {"text": "Head"}, {"text": "Arm"}], "correct_index": 1}'),
('reasoning', 'analogies', '{K-2}', -1.5, 1.0, 0.25, '{"stem": "Night is dark. Day is ___", "type": "analogy", "options": [{"text": "Dark"}, {"text": "Cold"}, {"text": "Light"}, {"text": "Warm"}], "correct_index": 2}'),
('reasoning', 'classification', '{K-2}', -2.0, 0.8, 0.25, '{"stem": "Which one is NOT an animal?", "type": "odd_one_out", "options": [{"text": "Dog"}, {"text": "Cat"}, {"text": "Chair"}, {"text": "Bird"}], "correct_index": 2}'),
('reasoning', 'classification', '{K-2}', -1.5, 0.9, 0.25, '{"stem": "Which one is NOT a fruit?", "type": "odd_one_out", "options": [{"text": "Apple"}, {"text": "Banana"}, {"text": "Carrot"}, {"text": "Grape"}], "correct_index": 2}'),
('reasoning', 'classification', '{K-2}', -1.0, 1.0, 0.25, '{"stem": "Which one does NOT have wheels?", "type": "odd_one_out", "options": [{"text": "Car"}, {"text": "Bicycle"}, {"text": "Boat"}, {"text": "Truck"}], "correct_index": 2}'),
('reasoning', 'series', '{K-2}', -2.0, 0.8, 0.25, '{"stem": "What comes next? 1, 2, 3, 4, ___", "type": "number_series", "options": [{"text": "4"}, {"text": "5"}, {"text": "6"}, {"text": "7"}], "correct_index": 1}'),
('reasoning', 'series', '{K-2}', -1.5, 0.9, 0.25, '{"stem": "What comes next? A, B, C, D, ___", "type": "letter_series", "options": [{"text": "F"}, {"text": "E"}, {"text": "D"}, {"text": "G"}], "correct_index": 1}'),
('reasoning', 'series', '{K-2}', -0.5, 1.1, 0.25, '{"stem": "What comes next? 2, 4, 6, ___", "type": "number_series", "options": [{"text": "7"}, {"text": "8"}, {"text": "9"}, {"text": "10"}], "correct_index": 1}'),
('reasoning', 'logical', '{K-2}', -0.5, 1.0, 0.25, '{"stem": "All dogs have tails. Buddy is a dog. Does Buddy have a tail?", "type": "syllogism", "options": [{"text": "Yes"}, {"text": "No"}, {"text": "Maybe"}, {"text": "We don''t know"}], "correct_index": 0}'),
('reasoning', 'logical', '{K-2}', 0.0, 1.2, 0.25, '{"stem": "If you are wet, you were in the rain. Tom is wet. Was Tom in the rain?", "type": "syllogism", "options": [{"text": "Yes, for sure"}, {"text": "Maybe"}, {"text": "No"}, {"text": "We can''t tell"}], "correct_index": 1}'),
('reasoning', 'analogies', '{K-2}', 0.5, 1.3, 0.20, '{"stem": "Pen is to write as scissors is to ___", "type": "analogy", "options": [{"text": "Draw"}, {"text": "Cut"}, {"text": "Glue"}, {"text": "Tape"}], "correct_index": 1}'),
('reasoning', 'classification', '{K-2}', 1.0, 1.4, 0.20, '{"stem": "Which one does NOT belong? Ice cream, popsicle, snowflake, soup", "type": "odd_one_out", "options": [{"text": "Ice cream"}, {"text": "Popsicle"}, {"text": "Snowflake"}, {"text": "Soup"}], "correct_index": 3}');

-- ─── Math Items (13) ────────────────────────────────────────────

INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json) VALUES
('math', 'number_sense', '{K-2}', -2.5, 0.8, 0.25, '{"stem": "How many apples are there? 🍎🍎🍎", "type": "counting", "options": [{"text": "2"}, {"text": "3"}, {"text": "4"}, {"text": "5"}], "correct_index": 1}'),
('math', 'number_sense', '{K-2}', -2.0, 0.8, 0.25, '{"stem": "Which number is bigger: 3 or 7?", "type": "comparison", "options": [{"text": "3"}, {"text": "7"}], "correct_index": 1}'),
('math', 'number_sense', '{K-2}', -2.0, 0.9, 0.25, '{"stem": "What number comes after 9?", "type": "number_sense", "options": [{"text": "8"}, {"text": "10"}, {"text": "11"}, {"text": "20"}], "correct_index": 1}'),
('math', 'computation', '{K-2}', -1.5, 0.9, 0.25, '{"stem": "What is 3 + 2?", "type": "computation", "options": [{"text": "4"}, {"text": "5"}, {"text": "6"}, {"text": "7"}], "correct_index": 1}'),
('math', 'computation', '{K-2}', -1.5, 1.0, 0.25, '{"stem": "What is 8 - 3?", "type": "computation", "options": [{"text": "4"}, {"text": "5"}, {"text": "6"}, {"text": "3"}], "correct_index": 1}'),
('math', 'computation', '{K-2}', -1.0, 1.0, 0.25, '{"stem": "What is 6 + 7?", "type": "computation", "options": [{"text": "12"}, {"text": "13"}, {"text": "14"}, {"text": "11"}], "correct_index": 1}'),
('math', 'computation', '{K-2}', -0.5, 1.1, 0.25, '{"stem": "What is 15 - 8?", "type": "computation", "options": [{"text": "6"}, {"text": "7"}, {"text": "8"}, {"text": "9"}], "correct_index": 1}'),
('math', 'problem_solving', '{K-2}', -1.0, 1.0, 0.25, '{"stem": "You have 4 cookies and get 3 more. How many cookies do you have?", "type": "word_problem", "options": [{"text": "5"}, {"text": "6"}, {"text": "7"}, {"text": "8"}], "correct_index": 2}'),
('math', 'problem_solving', '{K-2}', -0.5, 1.1, 0.25, '{"stem": "There are 10 birds on a fence. 4 fly away. How many are left?", "type": "word_problem", "options": [{"text": "4"}, {"text": "5"}, {"text": "6"}, {"text": "7"}], "correct_index": 2}'),
('math', 'problem_solving', '{K-2}', 0.0, 1.2, 0.25, '{"stem": "Emma has 3 bags with 4 stickers in each bag. How many stickers total?", "type": "word_problem", "options": [{"text": "7"}, {"text": "10"}, {"text": "12"}, {"text": "14"}], "correct_index": 2}'),
('math', 'number_sense', '{K-2}', 0.0, 1.1, 0.25, '{"stem": "What is half of 10?", "type": "number_sense", "options": [{"text": "3"}, {"text": "4"}, {"text": "5"}, {"text": "6"}], "correct_index": 2}'),
('math', 'computation', '{K-2}', 0.5, 1.2, 0.20, '{"stem": "What is 2 + 2 + 2 + 2?", "type": "computation", "options": [{"text": "6"}, {"text": "8"}, {"text": "10"}, {"text": "4"}], "correct_index": 1}'),
('math', 'problem_solving', '{K-2}', 1.0, 1.3, 0.20, '{"stem": "A toy costs 25 cents. You have 3 dimes. Do you have enough money?", "type": "word_problem", "options": [{"text": "Yes, with 5 cents left"}, {"text": "Yes, exact change"}, {"text": "No, need 5 more cents"}, {"text": "No, need 10 more cents"}], "correct_index": 0}');

-- ─── Verbal Items (13) ──────────────────────────────────────────

INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json) VALUES
('verbal', 'vocabulary', '{K-2}', -2.5, 0.8, 0.25, '{"stem": "What is the baby of a cat called?", "type": "definition", "options": [{"text": "Puppy"}, {"text": "Kitten"}, {"text": "Cub"}, {"text": "Chick"}], "correct_index": 1}'),
('verbal', 'vocabulary', '{K-2}', -2.0, 0.8, 0.25, '{"stem": "What color do you get when you mix red and white?", "type": "knowledge", "options": [{"text": "Orange"}, {"text": "Purple"}, {"text": "Pink"}, {"text": "Brown"}], "correct_index": 2}'),
('verbal', 'vocabulary', '{K-2}', -1.5, 0.9, 0.25, '{"stem": "Which word means the same as \"little\"?", "type": "synonym", "options": [{"text": "Big"}, {"text": "Small"}, {"text": "Tall"}, {"text": "Fast"}], "correct_index": 1}'),
('verbal', 'vocabulary', '{K-2}', -1.0, 1.0, 0.25, '{"stem": "What is the opposite of \"hot\"?", "type": "antonym", "options": [{"text": "Warm"}, {"text": "Cold"}, {"text": "Wet"}, {"text": "Dry"}], "correct_index": 1}'),
('verbal', 'reading_comprehension', '{K-2}', -1.5, 0.9, 0.25, '{"stem": "The cat sat on the mat. Where is the cat?", "type": "comprehension", "options": [{"text": "On the bed"}, {"text": "On the mat"}, {"text": "Under the table"}, {"text": "On the chair"}], "correct_index": 1}'),
('verbal', 'reading_comprehension', '{K-2}', -0.5, 1.1, 0.25, '{"stem": "Tom was sad because his balloon flew away. How did Tom feel?", "type": "comprehension", "options": [{"text": "Happy"}, {"text": "Sad"}, {"text": "Angry"}, {"text": "Scared"}], "correct_index": 1}'),
('verbal', 'inference', '{K-2}', -0.5, 1.0, 0.25, '{"stem": "The dog is barking at the door. What might the dog want?", "type": "inference", "options": [{"text": "To sleep"}, {"text": "To eat"}, {"text": "To go outside"}, {"text": "To play with a ball"}], "correct_index": 2}'),
('verbal', 'inference', '{K-2}', 0.0, 1.2, 0.25, '{"stem": "Lucy put on her boots and grabbed her umbrella. What is the weather probably like?", "type": "inference", "options": [{"text": "Sunny"}, {"text": "Rainy"}, {"text": "Snowy"}, {"text": "Windy"}], "correct_index": 1}'),
('verbal', 'vocabulary', '{K-2}', 0.0, 1.1, 0.25, '{"stem": "What does \"tiny\" mean?", "type": "definition", "options": [{"text": "Very big"}, {"text": "Very small"}, {"text": "Very loud"}, {"text": "Very fast"}], "correct_index": 1}'),
('verbal', 'reading_comprehension', '{K-2}', 0.5, 1.2, 0.20, '{"stem": "The boy ate pizza, then ice cream, then cookies. What did he eat first?", "type": "comprehension", "options": [{"text": "Ice cream"}, {"text": "Cookies"}, {"text": "Pizza"}, {"text": "Cake"}], "correct_index": 2}'),
('verbal', 'inference', '{K-2}', 0.5, 1.3, 0.20, '{"stem": "The flowers in the garden are drooping and the soil is dry. What do the flowers need?", "type": "inference", "options": [{"text": "Sunshine"}, {"text": "Water"}, {"text": "Music"}, {"text": "Wind"}], "correct_index": 1}'),
('verbal', 'vocabulary', '{K-2}', 1.0, 1.4, 0.20, '{"stem": "What does \"curious\" mean?", "type": "definition", "options": [{"text": "Scared"}, {"text": "Wanting to learn or know"}, {"text": "Very tired"}, {"text": "Feeling sick"}], "correct_index": 1}'),
('verbal', 'reading_comprehension', '{K-2}', 1.0, 1.3, 0.20, '{"stem": "First, Maya brushed her teeth. Then she put on pajamas. Last, she read a book. What is Maya getting ready for?", "type": "comprehension", "options": [{"text": "School"}, {"text": "A party"}, {"text": "Bed"}, {"text": "Dinner"}], "correct_index": 2}');

-- ─── Pattern Recognition Items (13) ─────────────────────────────

INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json) VALUES
('pattern_recognition', 'sequences', '{K-2}', -2.5, 0.8, 0.25, '{"stem": "What color comes next? Red, Red, Blue, Red, Red, ___", "type": "color_pattern", "options": [{"text": "Red"}, {"text": "Blue"}, {"text": "Green"}, {"text": "Yellow"}], "correct_index": 1}'),
('pattern_recognition', 'sequences', '{K-2}', -2.0, 0.8, 0.25, '{"stem": "What comes next? Big, Small, Big, Small, ___", "type": "size_pattern", "options": [{"text": "Small"}, {"text": "Big"}, {"text": "Medium"}, {"text": "Tiny"}], "correct_index": 1}'),
('pattern_recognition', 'sequences', '{K-2}', -2.0, 0.9, 0.25, '{"stem": "What shape comes next? ⭐ 🔵 ⭐ 🔵 ___", "type": "shape_pattern", "options": [{"text": "🔵"}, {"text": "⭐"}, {"text": "🔺"}, {"text": "🟩"}], "correct_index": 1}'),
('pattern_recognition', 'sequences', '{K-2}', -1.5, 0.9, 0.25, '{"stem": "What comes next? 1, 2, 1, 2, 1, ___", "type": "number_pattern", "options": [{"text": "1"}, {"text": "2"}, {"text": "3"}, {"text": "4"}], "correct_index": 1}'),
('pattern_recognition', 'spatial', '{K-2}', -1.5, 0.9, 0.25, '{"stem": "Which shape is the same as the one shown but turned around?", "type": "rotation", "options": [{"text": "Option A"}, {"text": "Option B"}, {"text": "Option C"}, {"text": "Option D"}], "correct_index": 1, "media": ["rotate_k2_1.svg"]}'),
('pattern_recognition', 'sequences', '{K-2}', -1.0, 1.0, 0.25, '{"stem": "What comes next? 🍎 🍊 🍎 🍊 🍎 ___", "type": "object_pattern", "options": [{"text": "🍎"}, {"text": "🍊"}, {"text": "🍋"}, {"text": "🍇"}], "correct_index": 1}'),
('pattern_recognition', 'matrices', '{K-2}', -1.0, 1.0, 0.25, '{"stem": "Look at the grid. Which picture goes in the empty box?", "type": "matrix", "options": [{"text": "Option A"}, {"text": "Option B"}, {"text": "Option C"}, {"text": "Option D"}], "correct_index": 0, "media": ["matrix_k2_1.svg"]}'),
('pattern_recognition', 'sequences', '{K-2}', -0.5, 1.1, 0.25, '{"stem": "What comes next? 🔴 🔵 🟢 🔴 🔵 ___", "type": "color_pattern", "options": [{"text": "🔴"}, {"text": "🔵"}, {"text": "🟢"}, {"text": "🟡"}], "correct_index": 2}'),
('pattern_recognition', 'spatial', '{K-2}', -0.5, 1.0, 0.25, '{"stem": "Which picture shows the shape flipped like a mirror?", "type": "reflection", "options": [{"text": "Option A"}, {"text": "Option B"}, {"text": "Option C"}, {"text": "Option D"}], "correct_index": 2, "media": ["mirror_k2_1.svg"]}'),
('pattern_recognition', 'sequences', '{K-2}', 0.0, 1.2, 0.25, '{"stem": "What comes next? 1, 2, 3, 1, 2, 3, 1, 2, ___", "type": "number_pattern", "options": [{"text": "1"}, {"text": "2"}, {"text": "3"}, {"text": "4"}], "correct_index": 2}'),
('pattern_recognition', 'matrices', '{K-2}', 0.0, 1.1, 0.25, '{"stem": "Each row follows a rule. Which picture completes the last row?", "type": "matrix", "options": [{"text": "Option A"}, {"text": "Option B"}, {"text": "Option C"}, {"text": "Option D"}], "correct_index": 1, "media": ["matrix_k2_2.svg"]}'),
('pattern_recognition', 'spatial', '{K-2}', 0.5, 1.2, 0.20, '{"stem": "If you cut this folded paper and unfold it, what will it look like?", "type": "paper_fold", "options": [{"text": "Option A"}, {"text": "Option B"}, {"text": "Option C"}, {"text": "Option D"}], "correct_index": 0, "media": ["fold_k2_1.svg"]}'),
('pattern_recognition', 'sequences', '{K-2}', 1.0, 1.4, 0.20, '{"stem": "What comes next? 2, 4, 6, 8, ___", "type": "number_pattern", "options": [{"text": "9"}, {"text": "10"}, {"text": "11"}, {"text": "12"}], "correct_index": 1}');
