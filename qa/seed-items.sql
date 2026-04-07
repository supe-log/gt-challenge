-- GT Challenge: Approved Item Bank Seed
-- Generated: 2026-04-07T19:08:28.052Z
-- Items: 77

BEGIN;

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'math'::domain_type,
  'Division reasoning in equal groups context',
  ARRAY['3-5'::age_band_type],
  -2.10,
  1.20,
  0.25,
  '{"stem":"Maria bakes 24 muffins and puts them equally into 4 boxes. How many muffins are in each box?","type":"word_problem","options":[{"text":"6 muffins"},{"text":"8 muffins"},{"text":"20 muffins"},{"text":"28 muffins"}],"correct_index":0,"explanation":"To find how many muffins go in each box, divide the total (24) by the number of boxes (4): 24 ÷ 4 = 6 muffins per box."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'math'::domain_type,
  'Fraction magnitude comparison and proximity reasoning',
  ARRAY['3-5'::age_band_type],
  -1.30,
  1.40,
  0.25,
  '{"stem":"Which fraction is closest to 1 whole?","type":"comparison","options":[{"text":"7/8"},{"text":"3/8"},{"text":"1/2"},{"text":"2/8"}],"correct_index":0,"explanation":"7/8 means 7 out of 8 equal parts, which is only 1 part away from the whole (8/8). This makes it closer to 1 than the other fractions."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'math'::domain_type,
  'Multi-step reasoning with estimation and subtraction from products',
  ARRAY['3-5'::age_band_type],
  -0.70,
  1.60,
  0.25,
  '{"stem":"A theater has 8 rows with 12 seats in each row. If 75 people are seated, about how many seats are empty?","type":"estimation","options":[{"text":"About 21 seats"},{"text":"About 50 seats"},{"text":"About 75 seats"},{"text":"About 96 seats"}],"correct_index":0,"explanation":"Total seats = 8 × 12 = 96. With 75 people seated, empty seats = 96 - 75 = 21. This is exactly 21, making ''about 21'' the best estimate."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'relational reasoning',
  ARRAY['3-5'::age_band_type],
  -2.50,
  1.20,
  0.25,
  '{"stem":"Bird is to nest as bee is to ___","type":"analogy","options":[{"text":"hive"},{"text":"flower"},{"text":"honey"},{"text":"wings"}],"correct_index":0,"explanation":"A bird lives in a nest, and a bee lives in a hive. Both are homes for these animals."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'pattern recognition and inductive reasoning',
  ARRAY['3-5'::age_band_type],
  -1.00,
  1.50,
  0.25,
  '{"stem":"Which number comes next in this pattern: 3, 6, 9, 12, ___","type":"number_series","options":[{"text":"14"},{"text":"15"},{"text":"16"},{"text":"18"}],"correct_index":1,"explanation":"The pattern adds 3 each time: 3+3=6, 6+3=9, 9+3=12, so 12+3=15."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'categorical classification',
  ARRAY['3-5'::age_band_type],
  0.50,
  1.80,
  0.25,
  '{"stem":"Which one belongs to a different category: triangle, square, circle, red? Explain why your choice is different from the others.","type":"odd_one_out","options":[{"text":"triangle"},{"text":"square"},{"text":"circle"},{"text":"red"}],"correct_index":3,"explanation":"Triangle, square, and circle are all shapes, while red is a color. Red does not belong with the group of shapes."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'deductive reasoning',
  ARRAY['3-5'::age_band_type],
  1.50,
  1.60,
  0.25,
  '{"stem":"All cats have whiskers. All animals with whiskers are mammals. All mammals need air to breathe. Fluffy is a cat. What can we know about Fluffy?","type":"syllogism","options":[{"text":"Fluffy has whiskers, is a mammal, and needs air to breathe"},{"text":"Fluffy is furry"},{"text":"Fluffy likes fish"},{"text":"Fluffy has whiskers but might not be a mammal"}],"correct_index":0,"explanation":"Since all cats have whiskers and Fluffy is a cat, we can logically conclude that Fluffy must have whiskers. Additionally, since all animals with whiskers are mammals, and Fluffy has whiskers, Fluffy must also be a mammal. Finally, since all mammals need air to breathe, Fluffy must need air to breathe. Option 1 (''Fluffy is furry'') is incorrect because while cats are typically furry, this information is not provided in the logical premises - we can only conclude what follows from the given statements. Option 2 (''Fluffy likes fish'') is wrong because it''s based on stereotypes about cats rather than logical deduction. Option 3 (''Fluffy has whiskers but might not be a mammal'') contradicts the logical chain established by the premises."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'sequential pattern completion',
  ARRAY['3-5'::age_band_type],
  0.00,
  1.40,
  0.25,
  '{"stem":"What number should replace the ? in this pattern: 2, 4, 6, ?, 10","type":"number_series","options":[{"text":"7"},{"text":"8"},{"text":"9"},{"text":"12"}],"correct_index":1,"explanation":"The pattern counts by 2s: 2, 4, 6, 8, 10. The missing number is 8."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'functional relationship mapping',
  ARRAY['3-5'::age_band_type],
  1.50,
  1.90,
  0.25,
  '{"stem":"Needle is to thimble as finger is to ___","type":"analogy","options":[{"text":"bandage"},{"text":"hand"},{"text":"fingernail"},{"text":"point"}],"correct_index":0,"explanation":"A thimble protects a needle during sewing, just as a bandage protects a finger when injured. Both are protective coverings used in specific situations."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'categorical discrimination',
  ARRAY['3-5'::age_band_type],
  0.20,
  1.30,
  0.20,
  '{"stem":"Which one belongs to a different category: apple, banana, carrot, orange, grape?","type":"odd_one_out","options":[{"text":"apple"},{"text":"banana"},{"text":"carrot"},{"text":"orange"},{"text":"grape"}],"correct_index":2,"explanation":"Apple, banana, orange, and grape are all fruits, while carrot is a vegetable. Carrot belongs to a different category than the fruit group."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'logical reasoning vs real-world knowledge',
  ARRAY['3-5'::age_band_type],
  1.00,
  1.70,
  0.25,
  '{"stem":"Here''s a fun puzzle! All Zooks can dance and Flippers are a type of Zook. What must be true about Flippers?","type":"syllogism","options":[{"text":"Flippers can dance"},{"text":"Flippers cannot dance"},{"text":"Flippers are birds that swim"},{"text":"Flippers live in cold places"}],"correct_index":0,"explanation":"Following the logic given: if ALL Zooks can dance and Flippers ARE Zooks, then Flippers must be able to dance according to these premises."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'complex pattern recognition',
  ARRAY['3-5'::age_band_type],
  2.50,
  2.00,
  0.25,
  '{"stem":"What comes next: 1, 1, 2, 3, 5, 8, ___","type":"number_series","options":[{"text":"11"},{"text":"13"},{"text":"15"},{"text":"16"}],"correct_index":1,"explanation":"Each number is the sum of the two numbers before it: 1+1=2, 1+2=3, 2+3=5, 3+5=8, 5+8=13."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'functional analysis and categorization',
  ARRAY['3-5'::age_band_type],
  3.00,
  1.80,
  0.25,
  '{"stem":"Which one does NOT belong: microscope, telescope, binoculars, camera?","type":"odd_one_out","options":[{"text":"microscope"},{"text":"telescope"},{"text":"binoculars"},{"text":"camera"}],"correct_index":3,"explanation":"Microscope, telescope, and binoculars all magnify things to help you see them better. A camera captures images but doesn''t magnify for direct viewing."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'relational reasoning',
  ARRAY['3-5'::age_band_type],
  -2.50,
  1.20,
  0.25,
  '{"stem":"Pencil is to writing as hammer is to ___","type":"analogy","options":[{"text":"building"},{"text":"pounding"},{"text":"tool"},{"text":"wood"}],"correct_index":1,"explanation":"This analogy is based on function. A pencil is used for writing, and a hammer is used for pounding. Both show the tool-to-action relationship."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'pattern recognition and classification',
  ARRAY['3-5'::age_band_type],
  -1.80,
  1.50,
  0.25,
  '{"stem":"Which group of numbers does NOT follow the same increment pattern as the others?","type":"odd_one_out","options":[{"text":"2, 4, 6"},{"text":"5, 7, 9"},{"text":"3, 6, 9"},{"text":"1, 3, 5"}],"correct_index":2,"explanation":"Three groups increase by 2 each time (2+2=4+2=6, 5+2=7+2=9, 1+2=3+2=5). The group 3, 6, 9 increases by 3 each time (3+3=6+3=9)."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'inductive pattern recognition',
  ARRAY['3-5'::age_band_type],
  -1.20,
  1.80,
  0.25,
  '{"stem":"What number comes next in this sequence: 4, 8, 12, 16, ___?","type":"number_series","options":[{"text":"18"},{"text":"20"},{"text":"22"},{"text":"24"}],"correct_index":1,"explanation":"This sequence increases by 4 each time: 4+4=8, 8+4=12, 12+4=16, so 16+4=20."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'deductive logical reasoning',
  ARRAY['3-5'::age_band_type],
  0.50,
  1.60,
  0.25,
  '{"stem":"All squares have four sides. All rectangles have four sides. This shape has three sides. What is true about this shape?","type":"syllogism","options":[{"text":"The shape is a square"},{"text":"The shape is a rectangle"},{"text":"The shape is not a square or rectangle"},{"text":"The shape might be a square"}],"correct_index":2,"explanation":"Since squares and rectangles must have four sides, and this shape has only three sides, it cannot be either a square or a rectangle."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'multi-dimensional pattern analysis',
  ARRAY['3-5'::age_band_type],
  0.20,
  1.40,
  0.25,
  '{"stem":"Look at this pattern: circle becomes triangle, square becomes hexagon. There is a star. What comes next?","type":"matrix","options":[{"text":"Another star"},{"text":"A heart"},{"text":"A shape with more sides than a star"},{"text":"A pentagon"}],"correct_index":2,"explanation":"The pattern shows each shape transforming into one with more sides: circle (1 curved side) to triangle (3 sides), square (4 sides) to hexagon (6 sides). A star typically has 5 points, so it should become a shape with more sides than 5, like an octagon. A pentagon only has 5 sides, which is not more than a star''s 5 points."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'relational reasoning with abstract concepts',
  ARRAY['3-5'::age_band_type],
  0.80,
  1.70,
  0.25,
  '{"stem":"Library is to books as museum is to ___","type":"analogy","options":[{"text":"visitors"},{"text":"artifacts"},{"text":"learning"},{"text":"building"}],"correct_index":1,"explanation":"This analogy shows the relationship between a place and what it primarily contains or displays. Libraries contain books, and museums contain artifacts or exhibits."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'abstract classification and categorization',
  ARRAY['3-5'::age_band_type],
  1.30,
  1.90,
  0.25,
  '{"stem":"Which instrument does not fit with the others based on its ability to produce melodies?","type":"odd_one_out","options":[{"text":"violin"},{"text":"trumpet"},{"text":"drums"},{"text":"piano"}],"correct_index":2,"explanation":"Violin, trumpet, and piano are all melodic instruments that can play different pitches and melodies. While the piano is a keyboard instrument (different from the string violin and wind trumpet), it shares the key characteristic of being able to produce distinct melodies and pitches. Drums are primarily rhythmic instruments that don''t produce distinct pitches in the same melodic way, making them the odd one out based on this primary categorization of melodic versus rhythmic function."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'advanced pattern recognition with multiplicative relationships',
  ARRAY['3-5'::age_band_type],
  1.80,
  2.00,
  0.25,
  '{"stem":"Find the next number: 1, 4, 9, 16, ___","type":"number_series","options":[{"text":"20"},{"text":"23"},{"text":"25"},{"text":"32"}],"correct_index":2,"explanation":"These are perfect squares: 1×1=1, 2×2=4, 3×3=9, 4×4=16, so the next is 5×5=25."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'complex deductive reasoning with quantifiers',
  ARRAY['3-5'::age_band_type],
  1.50,
  1.80,
  0.25,
  '{"stem":"Some animals that live in water can breathe air. All whales live in water. All whales breathe air. What can we say about whales?","type":"syllogism","options":[{"text":"All animals that breathe air are whales"},{"text":"Whales are some of the animals that live in water and breathe air"},{"text":"All animals that live in water breathe air"},{"text":"Only whales can live in water and breathe air"}],"correct_index":1,"explanation":"We know whales live in water and breathe air, and we know some water animals can breathe air. Therefore, whales are examples of (some of) the animals that fit this description. Option A is incorrect because it reverses the logical relationship - just because all whales breathe air doesn''t mean all air-breathing animals are whales. Option C is wrong because it overgeneralizes - we only know some water animals breathe air, not all of them. Option D is incorrect because it assumes whales are the only animals with these properties, but we''re told some water animals can breathe air, which could include others besides whales."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'simultaneous dual-dimension matrix reasoning',
  ARRAY['3-5'::age_band_type],
  1.50,
  1.60,
  0.25,
  '{"stem":"In this 3×3 grid, the top row has small, medium, and large circles, and the middle row has small, medium, and large squares. What shape completes the pattern in the bottom row?","type":"matrix","options":[{"text":"large triangle"},{"text":"large circle"},{"text":"small triangle"},{"text":"medium triangle"}],"correct_index":0,"explanation":"Each row shows the same shape in three sizes (small, medium, large). Each column shows the same size in different shapes. The bottom row needs a large triangle to complete the pattern where columns show small, medium, and large versions going down, and rows show different shapes going across."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'relational reasoning',
  ARRAY['3-5'::age_band_type],
  -2.10,
  1.20,
  0.25,
  '{"stem":"Pencil is to paper as paintbrush is to ___","type":"analogy","options":[{"text":"canvas"},{"text":"artist"},{"text":"color"},{"text":"handle"}],"correct_index":0,"explanation":"A pencil is used to write or draw on paper. Similarly, a paintbrush is used to paint on canvas. Both show the relationship between a tool and the surface it works on."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'pattern recognition and classification',
  ARRAY['3-5'::age_band_type],
  -1.30,
  1.40,
  0.25,
  '{"stem":"Which number follows a different rule than the others: 6, 9, 12, 17","type":"odd_one_out","options":[{"text":"6"},{"text":"9"},{"text":"12"},{"text":"17"}],"correct_index":3,"explanation":"The numbers 6, 9, and 12 are all multiples of 3 (6=3×2, 9=3×3, 12=3×4). The number 17 is not a multiple of 3, so it doesn''t belong."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'inductive reasoning',
  ARRAY['3-5'::age_band_type],
  -0.50,
  1.60,
  0.25,
  '{"stem":"What number comes next in this pattern: 4, 7, 10, 13, ___","type":"number_series","options":[{"text":"15"},{"text":"16"},{"text":"17"},{"text":"14"}],"correct_index":1,"explanation":"Each number increases by 3: 4+3=7, 7+3=10, 10+3=13, so 13+3=16. The pattern is adding 3 each time."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'deductive reasoning',
  ARRAY['3-5'::age_band_type],
  0.20,
  1.80,
  0.25,
  '{"stem":"All planets orbit around stars. Jupiter is a planet. Saturn is also a planet. Which statement must be true?","type":"syllogism","options":[{"text":"Jupiter and Saturn orbit around the same star"},{"text":"Jupiter orbits around a star"},{"text":"Saturn is larger than Jupiter"},{"text":"Stars are bigger than all planets"}],"correct_index":1,"explanation":"Since all planets orbit around stars and Jupiter is a planet, Jupiter must orbit around a star. This follows logically from the given information."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'simultaneous relational reasoning',
  ARRAY['3-5'::age_band_type],
  0.80,
  1.90,
  0.25,
  '{"stem":"Look at this pattern grid. Row 1: circle, square, triangle. Row 2: square, triangle, circle. What should Row 3 be?","type":"matrix","options":[{"text":"triangle, circle, square"},{"text":"circle, square, triangle"},{"text":"square, triangle, circle"},{"text":"triangle, square, circle"}],"correct_index":0,"explanation":"Each row shifts the shapes one position to the left, with the first shape moving to the end. Row 1 starts with circle, Row 2 starts with square (second shape from Row 1), so Row 3 starts with triangle (third shape from Row 1)."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'abstract relational reasoning',
  ARRAY['3-5'::age_band_type],
  1.40,
  2.00,
  0.25,
  '{"stem":"Library is to books as museum is to ___","type":"analogy","options":[{"text":"artifacts"},{"text":"visitors"},{"text":"building"},{"text":"education"}],"correct_index":0,"explanation":"A library is a place that houses and displays books for people to use. Similarly, a museum is a place that houses and displays artifacts for people to view and learn from."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'abstract classification',
  ARRAY['3-5'::age_band_type],
  1.80,
  1.70,
  0.25,
  '{"stem":"Which item does NOT belong: thermometer, ruler, scale, calendar","type":"odd_one_out","options":[{"text":"thermometer"},{"text":"ruler"},{"text":"scale"},{"text":"calendar"}],"correct_index":3,"explanation":"Thermometer, ruler, and scale all measure physical properties (temperature, length, and weight). Calendar measures time, which is not a physical property but a temporal concept."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'complex pattern recognition',
  ARRAY['3-5'::age_band_type],
  2.20,
  1.80,
  0.25,
  '{"stem":"Find the next number: 2, 5, 11, 23, ___","type":"number_series","options":[{"text":"35"},{"text":"41"},{"text":"47"},{"text":"50"}],"correct_index":2,"explanation":"The differences between numbers next to each other are: 5-2=3, 11-5=6, 23-11=12. The differences (3, 6, 12) double each time. The next difference should be 24, so 23+24=47."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'complex deductive reasoning',
  ARRAY['3-5'::age_band_type],
  1.50,
  1.90,
  0.25,
  '{"stem":"Some musicians play instruments. All band members are musicians. Some band members wear glasses. Which conclusion is true?","type":"syllogism","options":[{"text":"All musicians play instruments"},{"text":"Some musicians play instruments"},{"text":"Some musicians wear glasses"},{"text":"All band members wear glasses"}],"correct_index":1,"explanation":"The first statement tells us that some musicians play instruments - this is given as true. Since all band members are musicians (second statement), and some musicians play instruments (first statement), we can conclude that some musicians play instruments. This conclusion follows directly from the given information. Option A is incorrect because ''some'' doesn''t mean ''all'' - we only know some musicians play instruments, not all of them. Option C is incorrect because even though some band members wear glasses and all band members are musicians, we cannot conclude that some musicians wear glasses since the band members might be the only musicians who wear glasses. Option D is incorrect because ''some band members'' means not all band members - if it were all, the statement would say ''all band members wear glasses.''"}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'multi-dimensional pattern analysis',
  ARRAY['3-5'::age_band_type],
  1.80,
  1.50,
  0.25,
  '{"stem":"Study this 3×3 grid pattern. Row 1: star increases in size from left to right. Row 2: circle increases in size from left to right. Row 3: triangle, larger triangle, ___. What completes the pattern?","type":"matrix","options":[{"text":"largest triangle"},{"text":"small star"},{"text":"largest circle"},{"text":"medium triangle"}],"correct_index":0,"explanation":"Each row shows the same shape getting bigger and bigger from left to right. Row 1 shows stars increasing in size, Row 2 shows circles increasing in size, so Row 3 should show triangles increasing in size, making the largest triangle correct."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'relational reasoning',
  ARRAY['3-5'::age_band_type],
  -2.00,
  1.20,
  0.25,
  '{"stem":"Stethoscope is to listen as telescope is to ___","type":"analogy","options":[{"text":"stars"},{"text":"see"},{"text":"instrument"},{"text":"space"}],"correct_index":1,"explanation":"A stethoscope is an instrument used to listen, just as a telescope is an instrument used to see. The analogy relates each object to its primary function or purpose. ''Stars'' is incorrect because it identifies what a telescope looks at rather than what it does. ''Instrument'' is incorrect because while both are instruments, it misses the specific function relationship being tested. ''Space'' is incorrect because it refers to where telescopes are often pointed rather than their purpose of magnifying vision."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'classification and categorization',
  ARRAY['3-5'::age_band_type],
  -1.00,
  1.50,
  0.25,
  '{"stem":"Which one does NOT belong with the others?","type":"odd_one_out","options":[{"text":"violin"},{"text":"trumpet"},{"text":"piano"},{"text":"guitar"}],"correct_index":1,"explanation":"Violin, piano, and guitar all have strings that vibrate to make sound. A trumpet is a brass instrument that makes sound through air vibration in a tube."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'pattern recognition and inductive reasoning',
  ARRAY['3-5'::age_band_type],
  0.00,
  1.80,
  0.25,
  '{"stem":"What number comes next in this pattern: 4, 7, 10, 13, ___","type":"number_series","options":[{"text":"15"},{"text":"16"},{"text":"17"},{"text":"14"}],"correct_index":1,"explanation":"The pattern adds 3 each time: 4+3=7, 7+3=10, 10+3=13, so 13+3=16."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'deductive reasoning',
  ARRAY['3-5'::age_band_type],
  1.00,
  1.60,
  0.20,
  '{"stem":"All rectangles have four sides. All squares are rectangles. What is true about squares?","type":"syllogism","options":[{"text":"All squares have four sides"},{"text":"Some squares have four sides"},{"text":"No squares have four sides"},{"text":"Only some rectangles are squares"},{"text":"All rectangles are squares"}],"correct_index":0,"explanation":"Since all rectangles have four sides, and all squares are rectangles, then all squares must have four sides. This follows the logical rule that properties of a larger category apply to all members of subcategories."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'simultaneous relational reasoning',
  ARRAY['3-5'::age_band_type],
  1.50,
  1.40,
  0.25,
  '{"stem":"Look at this pattern grid. Each row changes one way, each column changes another way. What shape goes in the empty bottom-right space? Row 1: circle, square, triangle. Row 2: filled circle, filled square, ___","type":"matrix","options":[{"text":"filled triangle"},{"text":"triangle"},{"text":"filled circle"},{"text":"empty triangle"}],"correct_index":0,"explanation":"Looking at the pattern: shapes change across columns (circle→square→triangle) and filling changes down rows (empty→filled). The bottom-right must be a filled triangle."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'relational reasoning',
  ARRAY['3-5'::age_band_type],
  -0.50,
  1.30,
  0.25,
  '{"stem":"Key is to lock as password is to ___","type":"analogy","options":[{"text":"computer"},{"text":"account"},{"text":"typing"},{"text":"letters"}],"correct_index":1,"explanation":"A key opens or secures a lock, just as a password opens or secures an account. Both represent tools that provide access to something protected."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'classification and categorization',
  ARRAY['3-5'::age_band_type],
  0.50,
  1.70,
  0.25,
  '{"stem":"Which one belongs to a different category: butterfly, eagle, penguin, bat","type":"odd_one_out","options":[{"text":"butterfly"},{"text":"eagle"},{"text":"penguin"},{"text":"bat"}],"correct_index":3,"explanation":"Butterfly, eagle, and penguin are all born from eggs, while bats are mammals that give birth to live young. This distinguishes mammals from other animal classes. While penguins do not fly, the classification is based on reproductive method, not flight ability."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'two-dimensional pattern completion',
  ARRAY['3-5'::age_band_type],
  1.80,
  1.50,
  0.25,
  '{"stem":"Look at this 3×3 grid. Row 1: star, heart, circle. Row 2: filled star, filled heart, filled circle. Row 3: striped star, striped heart, ___. What completes the pattern?","type":"matrix","options":[{"text":"striped circle"},{"text":"circle"},{"text":"filled circle"},{"text":"striped star"}],"correct_index":0,"explanation":"Each row shows the same three shapes with different patterns: Row 1 has outline shapes, Row 2 has filled shapes, Row 3 has striped shapes. The missing piece must be a striped circle."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'relational reasoning',
  ARRAY['3-5'::age_band_type],
  -2.10,
  1.20,
  0.25,
  '{"stem":"Pencil is to paper as hammer is to ___","type":"analogy","options":[{"text":"nail"},{"text":"build"},{"text":"tool"},{"text":"wood"}],"correct_index":0,"explanation":"A pencil is used on paper, and a hammer is used on nails. The relationship is tool-to-specific-object-it-acts-upon. While a hammer can ''build'' things, that describes a broader function rather than the direct object relationship that matches the pencil-to-paper pattern."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'classification and category abstraction',
  ARRAY['3-5'::age_band_type],
  -1.30,
  1.50,
  0.25,
  '{"stem":"Which one belongs the least: elephant, mouse, whale, rabbit?","type":"odd_one_out","options":[{"text":"mouse"},{"text":"whale"},{"text":"elephant"},{"text":"rabbit"}],"correct_index":1,"explanation":"All the others are land mammals, while a whale lives in the ocean. The classification rule is based on habitat rather than size."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'pattern recognition and inductive reasoning',
  ARRAY['3-5'::age_band_type],
  -0.50,
  1.80,
  0.25,
  '{"stem":"What number comes next: 4, 8, 12, 16, ___","type":"number_series","options":[{"text":"18"},{"text":"20"},{"text":"24"},{"text":"32"}],"correct_index":1,"explanation":"The pattern increases by 4 each time (4+4=8, 8+4=12, 12+4=16), so 16+4=20."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'deductive reasoning',
  ARRAY['3-5'::age_band_type],
  0.20,
  1.60,
  0.25,
  '{"stem":"All dogs have four legs. Max is a dog. Some dogs are brown. What must be true about Max?","type":"syllogism","options":[{"text":"Max has four legs"},{"text":"Max is brown"},{"text":"Max is a good pet"},{"text":"Max likes to run"}],"correct_index":0,"explanation":"Since all dogs have four legs and Max is a dog, Max must have four legs. This follows logically from the given statements."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'analogical reasoning across domains',
  ARRAY['3-5'::age_band_type],
  1.10,
  1.70,
  0.25,
  '{"stem":"Ocean is to fish as forest is to ___","type":"analogy","options":[{"text":"trees"},{"text":"deer"},{"text":"leaves"},{"text":"water"}],"correct_index":1,"explanation":"Ocean is the habitat where fish live, so forest is the habitat where deer (animals) live. The relationship is habitat-to-animal-inhabitant. ''Trees'' is incorrect because it focuses on what forests contain rather than what lives there - the analogy requires finding the animal that inhabits the forest, just as fish inhabit the ocean."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'complex pattern recognition',
  ARRAY['3-5'::age_band_type],
  2.00,
  1.40,
  0.25,
  '{"stem":"Find the next number: 2, 5, 11, 23, ___","type":"number_series","options":[{"text":"35"},{"text":"41"},{"text":"47"},{"text":"51"}],"correct_index":2,"explanation":"The pattern doubles the previous number and adds 1: 2×2+1=5, 5×2+1=11, 11×2+1=23, so 23×2+1=47."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'simultaneous dual-rule matrix reasoning',
  ARRAY['3-5'::age_band_type],
  2.70,
  1.80,
  0.25,
  '{"stem":"In this 3×3 grid, each row adds one dot and each column changes the shape. Row 1: circle-1, square-2, triangle-3. Row 2: circle-2, square-3, triangle-4. What goes in Row 3, Column 2?","type":"matrix","options":[{"text":"square with 4 dots"},{"text":"square with 5 dots"},{"text":"triangle with 4 dots"},{"text":"circle with 4 dots"}],"correct_index":0,"explanation":"Row 3 should have one more dot than Row 2, and Column 2 is always squares. Row 2 Col 2 was square-3, so Row 3 Col 2 is square-4."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'verbal'::domain_type,
  'vocabulary precision and semantic understanding',
  ARRAY['3-5'::age_band_type],
  -2.10,
  1.20,
  0.25,
  '{"stem":"The little girl was very happy when she got her new puppy. Which word could replace ''happy'' in this sentence without changing its meaning?","type":"synonym","options":[{"text":"joyful"},{"text":"excited"},{"text":"surprised"},{"text":"calm"}],"correct_index":0,"explanation":"Joyful means feeling great happiness or delight, which is the same as being happy. The other words describe different emotions or states."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'verbal'::domain_type,
  'causal reasoning and inference from contextual clues',
  ARRAY['3-5'::age_band_type],
  -1.30,
  1.40,
  0.25,
  '{"stem":"Emma saw dark clouds forming and felt the wind getting stronger. She decided to cancel her picnic. What can you infer about the weather?","type":"inference","options":[{"text":"A storm was likely approaching"},{"text":"It was getting cold outside"},{"text":"The sun was too bright"},{"text":"It was a perfect day for flying kites"}],"correct_index":0,"explanation":"Dark clouds and strong wind are signs that a storm is coming. This explains why Emma cancelled her outdoor picnic - she anticipated bad weather."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'verbal'::domain_type,
  'contextual vocabulary comprehension and word meaning',
  ARRAY['3-5'::age_band_type],
  -0.20,
  1.80,
  0.25,
  '{"stem":"Read this story: ''Long ago, there was an ancient castle on a hill. The king who built it lived hundreds of years before your grandparents were born.'' Based on the story, what does ancient mean?","type":"definition","options":[{"text":"very old"},{"text":"made of stone"},{"text":"very grand"},{"text":"on a hill"}],"correct_index":0,"explanation":"Ancient means very old, from a time long ago. An ancient castle would be one built many hundreds of years in the past."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'verbal'::domain_type,
  'causal reasoning and connecting evidence to conclusions',
  ARRAY['3-5'::age_band_type],
  0.40,
  1.50,
  0.25,
  '{"stem":"Marcus practiced violin every day for two weeks before his recital. During the performance, he played beautifully without making any mistakes. What can you conclude about Marcus?","type":"inference","options":[{"text":"His practice helped him perform well"},{"text":"He is naturally talented at music"},{"text":"He was nervous during the recital"},{"text":"He had performed this piece before"}],"correct_index":0,"explanation":"The passage shows a clear connection between Marcus practicing every day and then performing well. This demonstrates that his preparation led to his successful performance."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'verbal'::domain_type,
  'identifying main ideas and distinguishing purpose from supporting details',
  ARRAY['3-5'::age_band_type],
  0.90,
  1.70,
  0.25,
  '{"stem":"Read this story: ''Dr. Chen watched Arctic terns for three summers. She found out that these birds fly farther than any other animal. They fly from the cold Arctic to the cold Antarctic and back each year. Her work helped other scientists learn how weather changes affect where birds fly.'' What was the main reason Dr. Chen did her work?","type":"comprehension","options":[{"text":"To understand how climate affects bird migration"},{"text":"To prove that Arctic terns fly the farthest"},{"text":"To study birds during summer months"},{"text":"To compare Arctic terns with other animals"}],"correct_index":0,"explanation":"The passage explicitly states that Dr. Chen''s research ''helped scientists understand how climate changes affect bird migration,'' which identifies this as the main purpose of her work."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'verbal'::domain_type,
  'understanding multiple word meanings and semantic relationships',
  ARRAY['3-5'::age_band_type],
  1.30,
  1.90,
  0.25,
  '{"stem":"The word ''discharge'' can have different meanings. In which sentence does ''discharge'' mean the same thing as in ''The doctor will discharge the patient tomorrow''?","type":"vocabulary","options":[{"text":"The soldier received an honorable discharge from the army"},{"text":"The factory must not discharge chemicals into the river"},{"text":"The battery will discharge if left unused too long"},{"text":"Lightning can discharge thousands of volts of electricity"}],"correct_index":0,"explanation":"In both sentences, ''discharge'' means to officially release someone from a place or duty. The doctor releases the patient from the hospital, and the army releases the soldier from military service."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'math'::domain_type,
  'integer operations with practical context',
  ARRAY['6-8'::age_band_type],
  -0.50,
  1.20,
  0.25,
  '{"stem":"Alex has -8°C recorded on his thermometer. If the temperature rises by 12°C, what will the new temperature be?","type":"computation","options":[{"text":"4°C"},{"text":"-20°C"},{"text":"20°C"},{"text":"-4°C"}],"correct_index":0,"explanation":"Starting at -8°C and adding 12°C: -8 + 12 = 4°C. When adding a positive number to a negative number, move right on the number line."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'math'::domain_type,
  'proportional reasoning and rate calculation',
  ARRAY['6-8'::age_band_type],
  0.30,
  1.50,
  0.25,
  '{"stem":"A cyclist travels at a constant speed and covers 45 kilometers in 3 hours. At this same rate, how far will she travel in 7 hours?","type":"word_problem","options":[{"text":"105 kilometers"},{"text":"135 kilometers"},{"text":"315 kilometers"},{"text":"96 kilometers"}],"correct_index":0,"explanation":"First find the rate: 45 km ÷ 3 hours = 15 km/hour. Then multiply by 7 hours: 15 × 7 = 105 kilometers."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'math'::domain_type,
  'exponential comparison and magnitude estimation',
  ARRAY['6-8'::age_band_type],
  0.80,
  1.80,
  0.25,
  '{"stem":"Without calculating exact values, compare: P = 2⁴ × 3³, Q = 2³ × 3⁴, R = 6⁴. Which arrangement shows these from least to greatest?","type":"comparison","options":[{"text":"P < Q < R"},{"text":"Q < P < R"},{"text":"R < P < Q"},{"text":"P < R < Q"}],"correct_index":0,"explanation":"P = 16 × 27 = 432, Q = 8 × 81 = 648, R = 6⁴ = 1296. Since 6⁴ = (2×3)⁴ = 2⁴ × 3⁴, and 3⁴ > 3³ while 2⁴ > 2³, we get P < Q < R."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'math'::domain_type,
  'proportional reasoning with multiple ratios',
  ARRAY['6-8'::age_band_type],
  1.00,
  1.70,
  0.25,
  '{"stem":"Three friends split a restaurant bill proportionally based on what they ordered. Ana paid $18, Ben paid $12, and Chen paid $15. If they decide to split a $20 tip using the same proportion, how much should Ana contribute to the tip?","type":"comparison","options":[{"text":"$8.00"},{"text":"$6.00"},{"text":"$7.50"},{"text":"$5.00"}],"correct_index":0,"explanation":"Ana paid $18 out of a total bill of $18 + $12 + $15 = $45. Her proportion is 18/45 = 2/5. For the $20 tip, Ana should pay 2/5 × $20 = $8.00."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'math'::domain_type,
  'work rate problems and fraction addition',
  ARRAY['6-8'::age_band_type],
  1.80,
  1.20,
  0.25,
  '{"stem":"A swimming pool can be filled by Pipe A alone in 8 hours, or by Pipe B alone in 12 hours. If both pipes work together, approximately how long will it take to fill the pool?","type":"estimation","options":[{"text":"4.8 hours"},{"text":"6.0 hours"},{"text":"10.0 hours"},{"text":"3.2 hours"}],"correct_index":0,"explanation":"Pipe A fills 1/8 of the pool per hour, Pipe B fills 1/12 per hour. Together they fill 1/8 + 1/12 = 3/24 + 2/24 = 5/24 of the pool per hour. Time needed = 1 ÷ (5/24) = 24/5 = 4.8 hours."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'math'::domain_type,
  'Pattern recognition in number sequences',
  ARRAY['K-2'::age_band_type],
  -2.00,
  1.40,
  0.25,
  '{"stem":"Which number comes next: 3, 6, 9, 12, __?","type":"number_sense","options":[{"text":"15"},{"text":"13"},{"text":"18"},{"text":"9"}],"correct_index":0,"explanation":"This is counting by 3s. After 12 comes 15 because 12 + 3 = 15."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'math'::domain_type,
  'Multi-step problem solving using multiplication and subtraction',
  ARRAY['K-2'::age_band_type],
  -0.50,
  1.50,
  0.25,
  '{"stem":"Dad buys 3 packs of gum. Each pack has 5 pieces. He gives away 2 pieces. How many pieces does he have left?","type":"word_problem","options":[{"text":"13"},{"text":"8"},{"text":"2"},{"text":"53"}],"correct_index":0,"explanation":"First find total pieces: 3 groups of 5. Count: 5 + 5 + 5 = 15, or think 3 × 5 = 15 pieces total. Then subtract what he gave away: 15 - 2 = 13 pieces left."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'math'::domain_type,
  'Multi-step addition with contextual interpretation and regrouping',
  ARRAY['K-2'::age_band_type],
  -0.50,
  1.70,
  0.25,
  '{"stem":"Sarah has 6 stickers. Mom gives her 7 more. How many now?","type":"word_problem","options":[{"text":"13"},{"text":"12"},{"text":"14"},{"text":"1"}],"correct_index":0,"explanation":"Sarah starts with 6 stickers and gets 7 more, so 6 + 7 = 13 stickers total. You can think of 6 + 6 = 12, then add 1 more to get 13. This problem requires multi-step thinking: first understanding the real-world context of receiving additional items, then applying addition with regrouping, and finally interpreting the result in the original context to verify it makes sense."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'math'::domain_type,
  'Multi-step addition with three addends and estimation reasoning with rounding strategy',
  ARRAY['K-2'::age_band_type],
  0.50,
  1.60,
  0.25,
  '{"stem":"Max counts his toys: 7 cars, 6 blocks, and 5 books. About how many toys does he have?","type":"estimation","options":[{"text":"about 18"},{"text":"about 12"},{"text":"about 24"},{"text":"about 8"}],"correct_index":0,"explanation":"To estimate, we can round the numbers: 7 + 6 + 5 is close to 18. The exact sum is 18, so ''about 18'' is the best estimate. This requires adding three different amounts together rather than calculating precisely."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'math'::domain_type,
  'Division reasoning through repeated subtraction or grouping',
  ARRAY['K-2'::age_band_type],
  0.50,
  2.00,
  0.25,
  '{"stem":"Ann gets 2 coins each day. What day will she have 14 coins?","type":"word_problem","options":[{"text":"day 7"},{"text":"day 14"},{"text":"day 28"},{"text":"day 6"}],"correct_index":0,"explanation":"She needs 14 coins total, getting 2 each day. 14 ÷ 2 = 7, so on day 7 she will have 14 coins."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'pattern_recognition'::domain_type,
  'complex pattern recognition with grouping',
  ARRAY['K-2'::age_band_type],
  -2.50,
  0.80,
  0.25,
  '{"stem":"What comes next? Red, blue, blue, red, blue, blue, red, ___","type":"color_pattern","options":[{"text":"blue"},{"text":"red"},{"text":"green"},{"text":"purple"}],"correct_index":0,"explanation":"The pattern shows groups of colors: red, blue-blue, red, blue-blue, red. Each group has one red followed by two blues. Since the last color shown is red, blue comes next to start the two blues that complete the pattern."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'pattern_recognition'::domain_type,
  'three-element pattern recognition',
  ARRAY['K-2'::age_band_type],
  -2.00,
  1.00,
  0.25,
  '{"stem":"What shape comes next? Circle, square, triangle, circle, square, ___","type":"shape_pattern","options":[{"text":"triangle"},{"text":"circle"},{"text":"square"},{"text":"star"}],"correct_index":0,"explanation":"The pattern repeats every three shapes: circle, square, triangle. After circle and square, triangle comes next."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'pattern_recognition'::domain_type,
  'two-dimensional pattern analysis',
  ARRAY['K-2'::age_band_type],
  -1.50,
  1.20,
  0.25,
  '{"stem":"Look at the boxes. What goes in the empty spot?","type":"matrix","options":[{"text":"big red circle"},{"text":"small red circle"},{"text":"big blue circle"},{"text":"small blue circle"}],"correct_index":1,"explanation":"In each row, the first box has big shapes and the second box has small shapes. The row with red circles needs a small red circle in the second box."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'pattern_recognition'::domain_type,
  'alternating sequence pattern recognition',
  ARRAY['K-2'::age_band_type],
  -1.00,
  1.50,
  0.25,
  '{"stem":"What number comes next in this pattern: 1, 3, 2, 4, 3, 5, ___?","type":"number_pattern","options":[{"text":"4"},{"text":"6"},{"text":"7"},{"text":"5"}],"correct_index":0,"explanation":"This pattern has two rules working together: odd positions (1st, 3rd, 5th) count up by 1 (1, 2, 3), and even positions (2nd, 4th, 6th) count up by 1 starting from 3 (3, 4, 5). Since the 7th position is odd, it continues the first sequence: 4."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'pattern_recognition'::domain_type,
  'alternating pattern with multiple attributes',
  ARRAY['K-2'::age_band_type],
  -0.50,
  1.80,
  0.25,
  '{"stem":"Find the missing piece. Big dog, small cat, big bird, ___","type":"sequence_completion","options":[{"text":"small fish"},{"text":"big fish"},{"text":"small dog"},{"text":"big cat"}],"correct_index":0,"explanation":"The pattern alternates big animal, small animal. After big bird, a small animal comes next. The animals are all different."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'pattern_recognition'::domain_type,
  'progressive pattern recognition',
  ARRAY['K-2'::age_band_type],
  0.00,
  1.60,
  0.25,
  '{"stem":"Look at the growing pattern. Small box, medium box, large box. What comes next?","type":"size_pattern","options":[{"text":"extra large box"},{"text":"small box"},{"text":"medium box"},{"text":"large box"}],"correct_index":0,"explanation":"The boxes are growing bigger each time. After large, the next size up would be extra large to continue the growing pattern."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'pattern_recognition'::domain_type,
  'complex repeating pattern recognition',
  ARRAY['K-2'::age_band_type],
  0.50,
  1.40,
  0.25,
  '{"stem":"What color is missing? Red hat, blue hat, red hat, red hat, blue hat, red hat, ___","type":"color_pattern","options":[{"text":"blue hat"},{"text":"red hat"},{"text":"purple hat"},{"text":"yellow hat"}],"correct_index":0,"explanation":"The pattern is red, blue, red, red, blue, red, then repeats. After red comes blue hat to complete the pattern."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'pattern_recognition'::domain_type,
  'rotational transformation pattern',
  ARRAY['K-2'::age_band_type],
  1.00,
  2.00,
  0.25,
  '{"stem":"The shapes turn. Up arrow, right arrow, down arrow, ___. What comes next?","type":"shape_pattern","options":[{"text":"left arrow"},{"text":"up arrow"},{"text":"right arrow"},{"text":"down arrow"}],"correct_index":0,"explanation":"The arrows rotate clockwise: up, right, down. Continuing the rotation, left arrow comes next to complete the circle."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'relational reasoning',
  ARRAY['K-2'::age_band_type],
  -2.50,
  1.20,
  0.25,
  '{"stem":"Bird is to nest as bee is to what?","type":"analogy","options":[{"text":"hive"},{"text":"flower"},{"text":"yellow"},{"text":"buzz"}],"correct_index":0,"explanation":"A nest is where a bird lives, so a hive is where a bee lives. This shows the animal-to-home relationship."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'simultaneous relational reasoning',
  ARRAY['K-2'::age_band_type],
  -0.50,
  1.50,
  0.25,
  '{"stem":"Look at the pattern. What shape goes in the empty box?","type":"matrix","options":[{"text":"red circle"},{"text":"blue circle"},{"text":"red square"},{"text":"blue square"}],"correct_index":1,"explanation":"In each row, the color changes from red to blue. In each column, the shape stays the same. So a blue circle completes the pattern."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'functional classification',
  ARRAY['K-2'::age_band_type],
  0.50,
  1.70,
  0.25,
  '{"stem":"Which one is different: truck, car, bike, tree?","type":"odd_one_out","options":[{"text":"tree"},{"text":"truck"},{"text":"car"},{"text":"bike"}],"correct_index":0,"explanation":"Truck, car, and bike are all things you can ride to move around. A tree cannot move you from place to place."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'reasoning'::domain_type,
  'multi-attribute matrix reasoning',
  ARRAY['K-2'::age_band_type],
  2.00,
  2.00,
  0.25,
  '{"stem":"In this grid, what completes the pattern in the bottom right?","type":"matrix","options":[{"text":"small blue triangle"},{"text":"big red circle"},{"text":"small red triangle"},{"text":"big blue circle"}],"correct_index":2,"explanation":"Looking across rows: size goes big to small. Looking down columns: shape stays the same, color goes blue to red. So bottom right needs small red triangle."}'::jsonb,
  false,
  'active'::item_status
);

INSERT INTO items (id, domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, teach_item, status)
VALUES (
  gen_random_uuid(),
  'verbal'::domain_type,
  'sequential reasoning and routine pattern recognition',
  ARRAY['K-2'::age_band_type],
  1.50,
  1.60,
  0.25,
  '{"stem":"Lily ate breakfast, then brushed her teeth, then got her backpack. What is Lily doing?","type":"inference","options":[{"text":"going to bed"},{"text":"getting ready for school"},{"text":"going to play outside"},{"text":"helping mom cook"}],"correct_index":1,"explanation":"The sequence of eating breakfast, brushing teeth, and getting a backpack shows Lily is following her morning routine to get ready for school."}'::jsonb,
  false,
  'active'::item_status
);

COMMIT;
