-- Additional visual items: 40 new pattern recognition / reasoning items
-- Distribution: 12 K-2, 16 3-5, 12 6-8
-- Types: ~40% matrices, ~30% sequences, ~30% analogies
-- All use visual + visualOptions for SVG rendering

-- ═══════════════════════════════════════════════════════════════
-- K-2 ITEMS (12 items, difficulty -2.5 to 0, single-rule patterns)
-- ═══════════════════════════════════════════════════════════════

-- K2-1: 2x2 Matrix — shape changes across columns (circle→square), same color per row
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'matrix', ARRAY['K-2']::age_band_type[], -2.0, 1.2, 0.25,
 '{"stem":"What shape goes in the empty box?","type":"matrix","options":[{"text":"Green square"},{"text":"Green circle"},{"text":"Red square"},{"text":"Red circle"}],"correct_index":0,"visual":{"type":"matrix","rows":2,"cols":2,"cells":[[{"shape":"circle","color":"#22c55e","fill":"solid"},{"shape":"square","color":"#22c55e","fill":"solid"}],[{"shape":"circle","color":"#22c55e","fill":"solid"},null]],"missingIndex":[1,1]},"visualOptions":[{"shape":"square","color":"#22c55e","fill":"solid"},{"shape":"circle","color":"#22c55e","fill":"solid"},{"shape":"square","color":"#ef4444","fill":"solid"},{"shape":"circle","color":"#ef4444","fill":"solid"}]}'::jsonb,
 'active');

-- K2-2: 2x2 Matrix — color changes across rows (pink top, cyan bottom)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'matrix', ARRAY['K-2']::age_band_type[], -1.8, 1.1, 0.25,
 '{"stem":"What goes in the empty box?","type":"matrix","options":[{"text":"Pink star"},{"text":"Cyan star"},{"text":"Cyan diamond"},{"text":"Pink diamond"}],"correct_index":2,"visual":{"type":"matrix","rows":2,"cols":2,"cells":[[{"shape":"star","color":"#ec4899","fill":"solid"},{"shape":"diamond","color":"#ec4899","fill":"solid"}],[{"shape":"star","color":"#0ea5e9","fill":"solid"},null]],"missingIndex":[1,1]},"visualOptions":[{"shape":"star","color":"#ec4899","fill":"solid"},{"shape":"star","color":"#0ea5e9","fill":"solid"},{"shape":"diamond","color":"#0ea5e9","fill":"solid"},{"shape":"diamond","color":"#ec4899","fill":"solid"}]}'::jsonb,
 'active');

-- K2-3: 2x2 Matrix — size rule (small top row, large bottom row)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'matrix', ARRAY['K-2']::age_band_type[], -1.5, 1.3, 0.20,
 '{"stem":"What goes in the empty box?","type":"matrix","options":[{"text":"Small blue hexagon"},{"text":"Large blue hexagon"},{"text":"Large red hexagon"},{"text":"Small red hexagon"}],"correct_index":1,"visual":{"type":"matrix","rows":2,"cols":2,"cells":[[{"shape":"hexagon","color":"#3b82f6","size":"sm","fill":"solid"},{"shape":"hexagon","color":"#3b82f6","size":"sm","fill":"solid"}],[{"shape":"hexagon","color":"#3b82f6","size":"lg","fill":"solid"},null]],"missingIndex":[1,1]},"visualOptions":[{"shape":"hexagon","color":"#3b82f6","size":"sm","fill":"solid"},{"shape":"hexagon","color":"#3b82f6","size":"lg","fill":"solid"},{"shape":"hexagon","color":"#ef4444","size":"lg","fill":"solid"},{"shape":"hexagon","color":"#ef4444","size":"sm","fill":"solid"}]}'::jsonb,
 'active');

-- K2-4: 2x2 Matrix — fill rule (solid left, empty right)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'matrix', ARRAY['K-2']::age_band_type[], -1.0, 1.4, 0.25,
 '{"stem":"What goes in the empty box?","type":"matrix","options":[{"text":"Solid purple pentagon"},{"text":"Empty purple pentagon"},{"text":"Empty purple circle"},{"text":"Solid purple circle"}],"correct_index":1,"visual":{"type":"matrix","rows":2,"cols":2,"cells":[[{"shape":"circle","color":"#8b5cf6","fill":"solid"},{"shape":"circle","color":"#8b5cf6","fill":"empty"}],[{"shape":"pentagon","color":"#8b5cf6","fill":"solid"},null]],"missingIndex":[1,1]},"visualOptions":[{"shape":"pentagon","color":"#8b5cf6","fill":"solid"},{"shape":"pentagon","color":"#8b5cf6","fill":"empty"},{"shape":"circle","color":"#8b5cf6","fill":"empty"},{"shape":"circle","color":"#8b5cf6","fill":"solid"}]}'::jsonb,
 'active');

-- K2-5: 2x2 Matrix — color rule (amber left, orange right)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'matrix', ARRAY['K-2']::age_band_type[], -2.5, 0.9, 0.30,
 '{"stem":"What color goes in the empty box?","type":"matrix","options":[{"text":"Amber cross"},{"text":"Orange cross"},{"text":"Orange triangle"},{"text":"Amber triangle"}],"correct_index":1,"visual":{"type":"matrix","rows":2,"cols":2,"cells":[[{"shape":"triangle","color":"#f59e0b","fill":"solid"},{"shape":"triangle","color":"#f97316","fill":"solid"}],[{"shape":"cross","color":"#f59e0b","fill":"solid"},null]],"missingIndex":[1,1]},"visualOptions":[{"shape":"cross","color":"#f59e0b","fill":"solid"},{"shape":"cross","color":"#f97316","fill":"solid"},{"shape":"triangle","color":"#f97316","fill":"solid"},{"shape":"triangle","color":"#f59e0b","fill":"solid"}]}'::jsonb,
 'active');

-- K2-6: Sequence — shape alternation (diamond, star, diamond, star, ?)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'sequence', ARRAY['K-2']::age_band_type[], -2.3, 1.0, 0.25,
 '{"stem":"What comes next in the pattern?","type":"sequence","options":[{"text":"Red star"},{"text":"Red diamond"},{"text":"Blue diamond"},{"text":"Blue star"}],"correct_index":1,"visual":{"type":"sequence","items":[{"shape":"diamond","color":"#ef4444","fill":"solid"},{"shape":"star","color":"#ef4444","fill":"solid"},{"shape":"diamond","color":"#ef4444","fill":"solid"},{"shape":"star","color":"#ef4444","fill":"solid"},null],"missingIndex":4},"visualOptions":[{"shape":"star","color":"#ef4444","fill":"solid"},{"shape":"diamond","color":"#ef4444","fill":"solid"},{"shape":"diamond","color":"#3b82f6","fill":"solid"},{"shape":"star","color":"#3b82f6","fill":"solid"}]}'::jsonb,
 'active');

-- K2-7: Sequence — color pattern (green, blue, green, blue, ?)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'sequence', ARRAY['K-2']::age_band_type[], -2.4, 0.8, 0.30,
 '{"stem":"What color comes next?","type":"sequence","options":[{"text":"Blue hexagon"},{"text":"Green hexagon"},{"text":"Red hexagon"},{"text":"Purple hexagon"}],"correct_index":1,"visual":{"type":"sequence","items":[{"shape":"hexagon","color":"#22c55e","fill":"solid"},{"shape":"hexagon","color":"#3b82f6","fill":"solid"},{"shape":"hexagon","color":"#22c55e","fill":"solid"},{"shape":"hexagon","color":"#3b82f6","fill":"solid"},null],"missingIndex":4},"visualOptions":[{"shape":"hexagon","color":"#3b82f6","fill":"solid"},{"shape":"hexagon","color":"#22c55e","fill":"solid"},{"shape":"hexagon","color":"#ef4444","fill":"solid"},{"shape":"hexagon","color":"#8b5cf6","fill":"solid"}]}'::jsonb,
 'active');

-- K2-8: Sequence — size growing (sm, md, lg, sm, md, ?)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'sequence', ARRAY['K-2']::age_band_type[], -1.2, 1.3, 0.25,
 '{"stem":"The shapes get bigger then start over. What comes next?","type":"sequence","options":[{"text":"Medium square"},{"text":"Large square"},{"text":"Small square"},{"text":"Large circle"}],"correct_index":1,"visual":{"type":"sequence","items":[{"shape":"square","color":"#f59e0b","size":"sm","fill":"solid"},{"shape":"square","color":"#f59e0b","size":"md","fill":"solid"},{"shape":"square","color":"#f59e0b","size":"lg","fill":"solid"},{"shape":"square","color":"#f59e0b","size":"sm","fill":"solid"},{"shape":"square","color":"#f59e0b","size":"md","fill":"solid"},null],"missingIndex":5},"visualOptions":[{"shape":"square","color":"#f59e0b","size":"md","fill":"solid"},{"shape":"square","color":"#f59e0b","size":"lg","fill":"solid"},{"shape":"square","color":"#f59e0b","size":"sm","fill":"solid"},{"shape":"circle","color":"#f59e0b","size":"lg","fill":"solid"}]}'::jsonb,
 'active');

-- K2-9: Analogy — color transformation (red:blue as green:?)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('reasoning', 'analogy', ARRAY['K-2']::age_band_type[], -1.8, 1.2, 0.25,
 '{"stem":"Red circle is to blue circle as green star is to...?","type":"analogy","options":[{"text":"Green star"},{"text":"Red star"},{"text":"Blue star"},{"text":"Blue circle"}],"correct_index":2,"visual":{"type":"analogy","a":{"shape":"circle","color":"#ef4444","fill":"solid"},"b":{"shape":"circle","color":"#3b82f6","fill":"solid"},"c":{"shape":"star","color":"#22c55e","fill":"solid"}},"visualOptions":[{"shape":"star","color":"#22c55e","fill":"solid"},{"shape":"star","color":"#ef4444","fill":"solid"},{"shape":"star","color":"#3b82f6","fill":"solid"},{"shape":"circle","color":"#3b82f6","fill":"solid"}]}'::jsonb,
 'active');

-- K2-10: Analogy — size transformation (small:large as small:?)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('reasoning', 'analogy', ARRAY['K-2']::age_band_type[], -1.5, 1.1, 0.25,
 '{"stem":"Small triangle is to big triangle as small cross is to...?","type":"analogy","options":[{"text":"Small cross"},{"text":"Big triangle"},{"text":"Small triangle"},{"text":"Big cross"}],"correct_index":3,"visual":{"type":"analogy","a":{"shape":"triangle","color":"#f97316","size":"sm","fill":"solid"},"b":{"shape":"triangle","color":"#f97316","size":"lg","fill":"solid"},"c":{"shape":"cross","color":"#6366f1","size":"sm","fill":"solid"}},"visualOptions":[{"shape":"cross","color":"#6366f1","size":"sm","fill":"solid"},{"shape":"triangle","color":"#f97316","size":"lg","fill":"solid"},{"shape":"triangle","color":"#f97316","size":"sm","fill":"solid"},{"shape":"cross","color":"#6366f1","size":"lg","fill":"solid"}]}'::jsonb,
 'active');

-- K2-11: Analogy — shape transformation (square:diamond as circle:?)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('reasoning', 'analogy', ARRAY['K-2']::age_band_type[], -0.5, 1.5, 0.20,
 '{"stem":"Square is to diamond as circle is to...?","type":"analogy","options":[{"text":"Star"},{"text":"Square"},{"text":"Hexagon"},{"text":"Triangle"}],"correct_index":0,"visual":{"type":"analogy","a":{"shape":"square","color":"#0ea5e9","fill":"solid"},"b":{"shape":"diamond","color":"#0ea5e9","fill":"solid"},"c":{"shape":"circle","color":"#ec4899","fill":"solid"}},"visualOptions":[{"shape":"star","color":"#ec4899","fill":"solid"},{"shape":"square","color":"#ec4899","fill":"solid"},{"shape":"hexagon","color":"#ec4899","fill":"solid"},{"shape":"triangle","color":"#ec4899","fill":"solid"}]}'::jsonb,
 'active');

-- K2-12: Sequence — fill alternation (solid, empty, solid, empty, ?)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'sequence', ARRAY['K-2']::age_band_type[], -2.0, 1.0, 0.25,
 '{"stem":"What comes next?","type":"sequence","options":[{"text":"Empty pentagon"},{"text":"Solid pentagon"},{"text":"Striped pentagon"},{"text":"Empty circle"}],"correct_index":0,"visual":{"type":"sequence","items":[{"shape":"pentagon","color":"#8b5cf6","fill":"solid"},{"shape":"pentagon","color":"#8b5cf6","fill":"empty"},{"shape":"pentagon","color":"#8b5cf6","fill":"solid"},{"shape":"pentagon","color":"#8b5cf6","fill":"empty"},null],"missingIndex":4},"visualOptions":[{"shape":"pentagon","color":"#8b5cf6","fill":"empty"},{"shape":"pentagon","color":"#8b5cf6","fill":"solid"},{"shape":"pentagon","color":"#8b5cf6","fill":"striped"},{"shape":"circle","color":"#8b5cf6","fill":"empty"}]}'::jsonb,
 'active');


-- ═══════════════════════════════════════════════════════════════
-- 3-5 ITEMS (16 items, difficulty -1 to 1.5, two-rule patterns)
-- ═══════════════════════════════════════════════════════════════

-- 35-1: 3x3 Matrix — color+shape (each row same color, each col same shape)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'matrix', ARRAY['3-5']::age_band_type[], 0.0, 1.5, 0.25,
 '{"stem":"What goes in the empty cell?","type":"matrix","options":[{"text":"Purple star"},{"text":"Amber star"},{"text":"Purple diamond"},{"text":"Amber diamond"}],"correct_index":1,"visual":{"type":"matrix","rows":3,"cols":3,"cells":[[{"shape":"hexagon","color":"#ef4444","fill":"solid"},{"shape":"diamond","color":"#ef4444","fill":"solid"},{"shape":"star","color":"#ef4444","fill":"solid"}],[{"shape":"hexagon","color":"#3b82f6","fill":"solid"},{"shape":"diamond","color":"#3b82f6","fill":"solid"},{"shape":"star","color":"#3b82f6","fill":"solid"}],[{"shape":"hexagon","color":"#f59e0b","fill":"solid"},{"shape":"diamond","color":"#f59e0b","fill":"solid"},null]],"missingIndex":[2,2]},"visualOptions":[{"shape":"star","color":"#8b5cf6","fill":"solid"},{"shape":"star","color":"#f59e0b","fill":"solid"},{"shape":"diamond","color":"#8b5cf6","fill":"solid"},{"shape":"diamond","color":"#f59e0b","fill":"solid"}]}'::jsonb,
 'active');

-- 35-2: 3x3 Matrix — shape+fill (each row same shape, fill cycles solid/striped/empty)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'matrix', ARRAY['3-5']::age_band_type[], 0.5, 1.6, 0.25,
 '{"stem":"Each row has the same shape. Each column has a different fill. What goes in the empty cell?","type":"matrix","options":[{"text":"Empty cross"},{"text":"Solid cross"},{"text":"Striped cross"},{"text":"Empty square"}],"correct_index":0,"visual":{"type":"matrix","rows":3,"cols":3,"cells":[[{"shape":"circle","color":"#22c55e","fill":"solid"},{"shape":"circle","color":"#22c55e","fill":"striped"},{"shape":"circle","color":"#22c55e","fill":"empty"}],[{"shape":"star","color":"#22c55e","fill":"solid"},{"shape":"star","color":"#22c55e","fill":"striped"},{"shape":"star","color":"#22c55e","fill":"empty"}],[{"shape":"cross","color":"#22c55e","fill":"solid"},{"shape":"cross","color":"#22c55e","fill":"striped"},null]],"missingIndex":[2,2]},"visualOptions":[{"shape":"cross","color":"#22c55e","fill":"empty"},{"shape":"cross","color":"#22c55e","fill":"solid"},{"shape":"cross","color":"#22c55e","fill":"striped"},{"shape":"square","color":"#22c55e","fill":"empty"}]}'::jsonb,
 'active');

-- 35-3: 3x3 Matrix — color+size (cols change color, rows change size)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'matrix', ARRAY['3-5']::age_band_type[], 0.8, 1.7, 0.20,
 '{"stem":"Rows change size, columns change color. What goes in the empty cell?","type":"matrix","options":[{"text":"Small pink triangle"},{"text":"Large pink triangle"},{"text":"Large cyan triangle"},{"text":"Small cyan triangle"}],"correct_index":0,"visual":{"type":"matrix","rows":3,"cols":3,"cells":[[{"shape":"triangle","color":"#ef4444","size":"lg","fill":"solid"},{"shape":"triangle","color":"#0ea5e9","size":"lg","fill":"solid"},{"shape":"triangle","color":"#ec4899","size":"lg","fill":"solid"}],[{"shape":"triangle","color":"#ef4444","size":"md","fill":"solid"},{"shape":"triangle","color":"#0ea5e9","size":"md","fill":"solid"},{"shape":"triangle","color":"#ec4899","size":"md","fill":"solid"}],[{"shape":"triangle","color":"#ef4444","size":"sm","fill":"solid"},{"shape":"triangle","color":"#0ea5e9","size":"sm","fill":"solid"},null]],"missingIndex":[2,2]},"visualOptions":[{"shape":"triangle","color":"#ec4899","size":"sm","fill":"solid"},{"shape":"triangle","color":"#ec4899","size":"lg","fill":"solid"},{"shape":"triangle","color":"#0ea5e9","size":"lg","fill":"solid"},{"shape":"triangle","color":"#0ea5e9","size":"sm","fill":"solid"}]}'::jsonb,
 'active');

-- 35-4: 3x3 Matrix — fill+rotation (fill changes across rows, rotation across columns)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'matrix', ARRAY['3-5']::age_band_type[], 1.0, 1.8, 0.20,
 '{"stem":"Fill changes by row, rotation changes by column. What is missing?","type":"matrix","options":[{"text":"Empty triangle rotated 240"},{"text":"Solid triangle rotated 240"},{"text":"Empty triangle rotated 120"},{"text":"Striped triangle rotated 240"}],"correct_index":0,"visual":{"type":"matrix","rows":3,"cols":3,"cells":[[{"shape":"triangle","color":"#6366f1","fill":"solid","rotation":0},{"shape":"triangle","color":"#6366f1","fill":"solid","rotation":120},{"shape":"triangle","color":"#6366f1","fill":"solid","rotation":240}],[{"shape":"triangle","color":"#6366f1","fill":"striped","rotation":0},{"shape":"triangle","color":"#6366f1","fill":"striped","rotation":120},{"shape":"triangle","color":"#6366f1","fill":"striped","rotation":240}],[{"shape":"triangle","color":"#6366f1","fill":"empty","rotation":0},{"shape":"triangle","color":"#6366f1","fill":"empty","rotation":120},null]],"missingIndex":[2,2]},"visualOptions":[{"shape":"triangle","color":"#6366f1","fill":"empty","rotation":240},{"shape":"triangle","color":"#6366f1","fill":"solid","rotation":240},{"shape":"triangle","color":"#6366f1","fill":"empty","rotation":120},{"shape":"triangle","color":"#6366f1","fill":"striped","rotation":240}]}'::jsonb,
 'active');

-- 35-5: 3x3 Matrix — shape+count (shape changes by row, count 1/2/3 by column)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'matrix', ARRAY['3-5']::age_band_type[], 1.2, 1.9, 0.20,
 '{"stem":"Shapes change by row. Count increases by column. What is missing?","type":"matrix","options":[{"text":"3 diamonds"},{"text":"2 diamonds"},{"text":"3 stars"},{"text":"1 diamond"}],"correct_index":0,"visual":{"type":"matrix","rows":3,"cols":3,"cells":[[{"shape":"circle","color":"#f97316","count":1,"fill":"solid"},{"shape":"circle","color":"#f97316","count":2,"fill":"solid"},{"shape":"circle","color":"#f97316","count":3,"fill":"solid"}],[{"shape":"star","color":"#f97316","count":1,"fill":"solid"},{"shape":"star","color":"#f97316","count":2,"fill":"solid"},{"shape":"star","color":"#f97316","count":3,"fill":"solid"}],[{"shape":"diamond","color":"#f97316","count":1,"fill":"solid"},{"shape":"diamond","color":"#f97316","count":2,"fill":"solid"},null]],"missingIndex":[2,2]},"visualOptions":[{"shape":"diamond","color":"#f97316","count":3,"fill":"solid"},{"shape":"diamond","color":"#f97316","count":2,"fill":"solid"},{"shape":"star","color":"#f97316","count":3,"fill":"solid"},{"shape":"diamond","color":"#f97316","count":1,"fill":"solid"}]}'::jsonb,
 'active');

-- 35-6: 3x3 Matrix — color+fill (color by column, fill by row)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'matrix', ARRAY['3-5']::age_band_type[], 0.6, 1.5, 0.25,
 '{"stem":"Colors change by column, fills change by row. What goes in the empty cell?","type":"matrix","options":[{"text":"Striped green hexagon"},{"text":"Empty green hexagon"},{"text":"Striped blue hexagon"},{"text":"Solid green hexagon"}],"correct_index":1,"visual":{"type":"matrix","rows":3,"cols":3,"cells":[[{"shape":"hexagon","color":"#ef4444","fill":"solid"},{"shape":"hexagon","color":"#3b82f6","fill":"solid"},{"shape":"hexagon","color":"#22c55e","fill":"solid"}],[{"shape":"hexagon","color":"#ef4444","fill":"striped"},{"shape":"hexagon","color":"#3b82f6","fill":"striped"},{"shape":"hexagon","color":"#22c55e","fill":"striped"}],[{"shape":"hexagon","color":"#ef4444","fill":"empty"},{"shape":"hexagon","color":"#3b82f6","fill":"empty"},null]],"missingIndex":[2,2]},"visualOptions":[{"shape":"hexagon","color":"#22c55e","fill":"striped"},{"shape":"hexagon","color":"#22c55e","fill":"empty"},{"shape":"hexagon","color":"#3b82f6","fill":"striped"},{"shape":"hexagon","color":"#22c55e","fill":"solid"}]}'::jsonb,
 'active');

-- 35-7: 3x3 Matrix — shape+rotation (shape changes across rows, rotation 0/90/180 across cols)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'matrix', ARRAY['3-5']::age_band_type[], 1.3, 2.0, 0.20,
 '{"stem":"Shapes change by row, rotation changes by column. What is missing?","type":"matrix","options":[{"text":"Pentagon rotated 180"},{"text":"Pentagon rotated 90"},{"text":"Cross rotated 180"},{"text":"Pentagon rotated 0"}],"correct_index":0,"visual":{"type":"matrix","rows":3,"cols":3,"cells":[[{"shape":"diamond","color":"#8b5cf6","fill":"solid","rotation":0},{"shape":"diamond","color":"#8b5cf6","fill":"solid","rotation":90},{"shape":"diamond","color":"#8b5cf6","fill":"solid","rotation":180}],[{"shape":"cross","color":"#8b5cf6","fill":"solid","rotation":0},{"shape":"cross","color":"#8b5cf6","fill":"solid","rotation":90},{"shape":"cross","color":"#8b5cf6","fill":"solid","rotation":180}],[{"shape":"pentagon","color":"#8b5cf6","fill":"solid","rotation":0},{"shape":"pentagon","color":"#8b5cf6","fill":"solid","rotation":90},null]],"missingIndex":[2,2]},"visualOptions":[{"shape":"pentagon","color":"#8b5cf6","fill":"solid","rotation":180},{"shape":"pentagon","color":"#8b5cf6","fill":"solid","rotation":90},{"shape":"cross","color":"#8b5cf6","fill":"solid","rotation":180},{"shape":"pentagon","color":"#8b5cf6","fill":"solid","rotation":0}]}'::jsonb,
 'active');

-- 35-8: Sequence — color+shape alternation (red circle, blue square, red circle, blue square, ?)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'sequence', ARRAY['3-5']::age_band_type[], -0.5, 1.4, 0.25,
 '{"stem":"Two things change in this pattern. What comes next?","type":"sequence","options":[{"text":"Blue square"},{"text":"Red circle"},{"text":"Red square"},{"text":"Blue circle"}],"correct_index":1,"visual":{"type":"sequence","items":[{"shape":"circle","color":"#ef4444","fill":"solid"},{"shape":"square","color":"#3b82f6","fill":"solid"},{"shape":"circle","color":"#ef4444","fill":"solid"},{"shape":"square","color":"#3b82f6","fill":"solid"},null],"missingIndex":4},"visualOptions":[{"shape":"square","color":"#3b82f6","fill":"solid"},{"shape":"circle","color":"#ef4444","fill":"solid"},{"shape":"square","color":"#ef4444","fill":"solid"},{"shape":"circle","color":"#3b82f6","fill":"solid"}]}'::jsonb,
 'active');

-- 35-9: Sequence — fill+size pattern (solid-sm, striped-md, empty-lg, solid-sm, striped-md, ?)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'sequence', ARRAY['3-5']::age_band_type[], 0.7, 1.6, 0.20,
 '{"stem":"Two rules repeat. What comes next?","type":"sequence","options":[{"text":"Solid small star"},{"text":"Empty large star"},{"text":"Striped medium star"},{"text":"Empty small star"}],"correct_index":1,"visual":{"type":"sequence","items":[{"shape":"star","color":"#f59e0b","size":"sm","fill":"solid"},{"shape":"star","color":"#f59e0b","size":"md","fill":"striped"},{"shape":"star","color":"#f59e0b","size":"lg","fill":"empty"},{"shape":"star","color":"#f59e0b","size":"sm","fill":"solid"},{"shape":"star","color":"#f59e0b","size":"md","fill":"striped"},null],"missingIndex":5},"visualOptions":[{"shape":"star","color":"#f59e0b","size":"sm","fill":"solid"},{"shape":"star","color":"#f59e0b","size":"lg","fill":"empty"},{"shape":"star","color":"#f59e0b","size":"md","fill":"striped"},{"shape":"star","color":"#f59e0b","size":"sm","fill":"empty"}]}'::jsonb,
 'active');

-- 35-10: Sequence — color+rotation (indigo 0, orange 90, indigo 180, orange 270, ?)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'sequence', ARRAY['3-5']::age_band_type[], 1.0, 1.7, 0.20,
 '{"stem":"The color alternates and the shape rotates. What comes next?","type":"sequence","options":[{"text":"Orange diamond rotated 0"},{"text":"Indigo diamond rotated 0"},{"text":"Indigo diamond rotated 360"},{"text":"Orange diamond rotated 90"}],"correct_index":1,"visual":{"type":"sequence","items":[{"shape":"diamond","color":"#6366f1","fill":"solid","rotation":0},{"shape":"diamond","color":"#f97316","fill":"solid","rotation":90},{"shape":"diamond","color":"#6366f1","fill":"solid","rotation":180},{"shape":"diamond","color":"#f97316","fill":"solid","rotation":270},null],"missingIndex":4},"visualOptions":[{"shape":"diamond","color":"#f97316","fill":"solid","rotation":0},{"shape":"diamond","color":"#6366f1","fill":"solid","rotation":0},{"shape":"diamond","color":"#6366f1","fill":"solid","rotation":360},{"shape":"diamond","color":"#f97316","fill":"solid","rotation":90}]}'::jsonb,
 'active');

-- 35-11: Sequence — shape+fill pattern (solid circle, empty square, solid triangle, empty diamond, ?)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'sequence', ARRAY['3-5']::age_band_type[], 0.3, 1.5, 0.25,
 '{"stem":"Shapes change and fills alternate. What comes next?","type":"sequence","options":[{"text":"Empty pentagon"},{"text":"Solid pentagon"},{"text":"Solid diamond"},{"text":"Empty hexagon"}],"correct_index":1,"visual":{"type":"sequence","items":[{"shape":"circle","color":"#0ea5e9","fill":"solid"},{"shape":"square","color":"#0ea5e9","fill":"empty"},{"shape":"triangle","color":"#0ea5e9","fill":"solid"},{"shape":"diamond","color":"#0ea5e9","fill":"empty"},null],"missingIndex":4},"visualOptions":[{"shape":"pentagon","color":"#0ea5e9","fill":"empty"},{"shape":"pentagon","color":"#0ea5e9","fill":"solid"},{"shape":"diamond","color":"#0ea5e9","fill":"solid"},{"shape":"hexagon","color":"#0ea5e9","fill":"empty"}]}'::jsonb,
 'active');

-- 35-12: Sequence — color+count (1 red, 2 blue, 3 green, 1 red, 2 blue, ?)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'sequence', ARRAY['3-5']::age_band_type[], 1.5, 2.0, 0.20,
 '{"stem":"The color and count repeat in a cycle. What comes next?","type":"sequence","options":[{"text":"3 blue circles"},{"text":"1 red circle"},{"text":"3 green circles"},{"text":"2 green circles"}],"correct_index":2,"visual":{"type":"sequence","items":[{"shape":"circle","color":"#ef4444","count":1,"fill":"solid"},{"shape":"circle","color":"#3b82f6","count":2,"fill":"solid"},{"shape":"circle","color":"#22c55e","count":3,"fill":"solid"},{"shape":"circle","color":"#ef4444","count":1,"fill":"solid"},{"shape":"circle","color":"#3b82f6","count":2,"fill":"solid"},null],"missingIndex":5},"visualOptions":[{"shape":"circle","color":"#3b82f6","count":3,"fill":"solid"},{"shape":"circle","color":"#ef4444","count":1,"fill":"solid"},{"shape":"circle","color":"#22c55e","count":3,"fill":"solid"},{"shape":"circle","color":"#22c55e","count":2,"fill":"solid"}]}'::jsonb,
 'active');

-- 35-13: Analogy — color+shape transformation (red circle:blue square as green triangle:?)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('reasoning', 'analogy', ARRAY['3-5']::age_band_type[], 0.2, 1.5, 0.25,
 '{"stem":"Red circle is to blue square as green triangle is to...?","type":"analogy","options":[{"text":"Blue triangle"},{"text":"Green diamond"},{"text":"Purple diamond"},{"text":"Green square"}],"correct_index":2,"visual":{"type":"analogy","a":{"shape":"circle","color":"#ef4444","fill":"solid"},"b":{"shape":"square","color":"#3b82f6","fill":"solid"},"c":{"shape":"triangle","color":"#22c55e","fill":"solid"}},"visualOptions":[{"shape":"triangle","color":"#3b82f6","fill":"solid"},{"shape":"diamond","color":"#22c55e","fill":"solid"},{"shape":"diamond","color":"#8b5cf6","fill":"solid"},{"shape":"square","color":"#22c55e","fill":"solid"}]}'::jsonb,
 'active');

-- 35-14: Analogy — fill+size transformation (solid-sm:striped-lg as empty-sm:?)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('reasoning', 'analogy', ARRAY['3-5']::age_band_type[], 0.9, 1.7, 0.20,
 '{"stem":"Small solid pentagon is to large striped pentagon as small empty hexagon is to...?","type":"analogy","options":[{"text":"Small striped hexagon"},{"text":"Large solid hexagon"},{"text":"Large empty hexagon"},{"text":"Large striped hexagon"}],"correct_index":3,"visual":{"type":"analogy","a":{"shape":"pentagon","color":"#ec4899","size":"sm","fill":"solid"},"b":{"shape":"pentagon","color":"#ec4899","size":"lg","fill":"striped"},"c":{"shape":"hexagon","color":"#f59e0b","size":"sm","fill":"empty"}},"visualOptions":[{"shape":"hexagon","color":"#f59e0b","size":"sm","fill":"striped"},{"shape":"hexagon","color":"#f59e0b","size":"lg","fill":"solid"},{"shape":"hexagon","color":"#f59e0b","size":"lg","fill":"empty"},{"shape":"hexagon","color":"#f59e0b","size":"lg","fill":"striped"}]}'::jsonb,
 'active');

-- 35-15: Analogy — color+fill transformation (red solid:red empty as blue striped:?)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('reasoning', 'analogy', ARRAY['3-5']::age_band_type[], -0.2, 1.3, 0.25,
 '{"stem":"Red solid star is to red empty star as blue striped diamond is to...?","type":"analogy","options":[{"text":"Blue solid diamond"},{"text":"Red empty diamond"},{"text":"Blue empty diamond"},{"text":"Blue striped star"}],"correct_index":2,"visual":{"type":"analogy","a":{"shape":"star","color":"#ef4444","fill":"solid"},"b":{"shape":"star","color":"#ef4444","fill":"empty"},"c":{"shape":"diamond","color":"#3b82f6","fill":"striped"}},"visualOptions":[{"shape":"diamond","color":"#3b82f6","fill":"solid"},{"shape":"diamond","color":"#ef4444","fill":"empty"},{"shape":"diamond","color":"#3b82f6","fill":"empty"},{"shape":"star","color":"#3b82f6","fill":"striped"}]}'::jsonb,
 'active');

-- 35-16: Analogy — shape+rotation (triangle-0:triangle-90 as square-0:?)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('reasoning', 'analogy', ARRAY['3-5']::age_band_type[], 1.1, 1.8, 0.20,
 '{"stem":"This triangle rotated 90 degrees. What happens to the square?","type":"analogy","options":[{"text":"Square rotated 90"},{"text":"Diamond rotated 90"},{"text":"Square rotated 180"},{"text":"Square rotated 0"}],"correct_index":0,"visual":{"type":"analogy","a":{"shape":"triangle","color":"#f97316","fill":"solid","rotation":0},"b":{"shape":"triangle","color":"#f97316","fill":"solid","rotation":90},"c":{"shape":"square","color":"#6366f1","fill":"solid","rotation":0}},"visualOptions":[{"shape":"square","color":"#6366f1","fill":"solid","rotation":90},{"shape":"diamond","color":"#6366f1","fill":"solid","rotation":90},{"shape":"square","color":"#6366f1","fill":"solid","rotation":180},{"shape":"square","color":"#6366f1","fill":"solid","rotation":0}]}'::jsonb,
 'active');


-- ═══════════════════════════════════════════════════════════════
-- 6-8 ITEMS (12 items, difficulty 0.5 to 2.5, three-rule patterns)
-- ═══════════════════════════════════════════════════════════════

-- 68-1: 3x3 Matrix — color+shape+fill (3 rules: color by row, shape by col, fill cycles)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'matrix', ARRAY['6-8']::age_band_type[], 1.5, 2.0, 0.20,
 '{"stem":"Three rules: color changes by row, shape by column, fill cycles. What is missing?","type":"matrix","options":[{"text":"Striped cyan cross"},{"text":"Empty cyan cross"},{"text":"Solid cyan cross"},{"text":"Striped cyan star"}],"correct_index":0,"visual":{"type":"matrix","rows":3,"cols":3,"cells":[[{"shape":"circle","color":"#ef4444","fill":"solid"},{"shape":"diamond","color":"#ef4444","fill":"striped"},{"shape":"cross","color":"#ef4444","fill":"empty"}],[{"shape":"circle","color":"#22c55e","fill":"striped"},{"shape":"diamond","color":"#22c55e","fill":"empty"},{"shape":"cross","color":"#22c55e","fill":"solid"}],[{"shape":"circle","color":"#0ea5e9","fill":"empty"},{"shape":"diamond","color":"#0ea5e9","fill":"solid"},null]],"missingIndex":[2,2]},"visualOptions":[{"shape":"cross","color":"#0ea5e9","fill":"striped"},{"shape":"cross","color":"#0ea5e9","fill":"empty"},{"shape":"cross","color":"#0ea5e9","fill":"solid"},{"shape":"star","color":"#0ea5e9","fill":"striped"}]}'::jsonb,
 'active');

-- 68-2: 3x3 Matrix — size+rotation+shape (size by row, rotation by col, shape by diagonal)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'matrix', ARRAY['6-8']::age_band_type[], 2.0, 2.2, 0.15,
 '{"stem":"Size changes by row, rotation by column. What completes the pattern?","type":"matrix","options":[{"text":"Small hexagon rotated 180"},{"text":"Small hexagon rotated 90"},{"text":"Large hexagon rotated 180"},{"text":"Small star rotated 180"}],"correct_index":0,"visual":{"type":"matrix","rows":3,"cols":3,"cells":[[{"shape":"hexagon","color":"#8b5cf6","size":"lg","fill":"solid","rotation":0},{"shape":"hexagon","color":"#8b5cf6","size":"lg","fill":"solid","rotation":90},{"shape":"hexagon","color":"#8b5cf6","size":"lg","fill":"solid","rotation":180}],[{"shape":"hexagon","color":"#8b5cf6","size":"md","fill":"solid","rotation":0},{"shape":"hexagon","color":"#8b5cf6","size":"md","fill":"solid","rotation":90},{"shape":"hexagon","color":"#8b5cf6","size":"md","fill":"solid","rotation":180}],[{"shape":"hexagon","color":"#8b5cf6","size":"sm","fill":"solid","rotation":0},{"shape":"hexagon","color":"#8b5cf6","size":"sm","fill":"solid","rotation":90},null]],"missingIndex":[2,2]},"visualOptions":[{"shape":"hexagon","color":"#8b5cf6","size":"sm","fill":"solid","rotation":180},{"shape":"hexagon","color":"#8b5cf6","size":"sm","fill":"solid","rotation":90},{"shape":"hexagon","color":"#8b5cf6","size":"lg","fill":"solid","rotation":180},{"shape":"star","color":"#8b5cf6","size":"sm","fill":"solid","rotation":180}]}'::jsonb,
 'active');

-- 68-3: 3x3 Matrix — color+fill+count (color by row, fill by col, count by diagonal)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'matrix', ARRAY['6-8']::age_band_type[], 2.3, 2.3, 0.15,
 '{"stem":"Color changes by row, fill by column, count increases diagonally. What is missing?","type":"matrix","options":[{"text":"3 empty indigo squares"},{"text":"2 empty indigo squares"},{"text":"3 striped indigo squares"},{"text":"3 empty blue squares"}],"correct_index":0,"visual":{"type":"matrix","rows":3,"cols":3,"cells":[[{"shape":"square","color":"#ef4444","fill":"solid","count":1},{"shape":"square","color":"#ef4444","fill":"striped","count":2},{"shape":"square","color":"#ef4444","fill":"empty","count":3}],[{"shape":"square","color":"#22c55e","fill":"solid","count":1},{"shape":"square","color":"#22c55e","fill":"striped","count":2},{"shape":"square","color":"#22c55e","fill":"empty","count":3}],[{"shape":"square","color":"#6366f1","fill":"solid","count":1},{"shape":"square","color":"#6366f1","fill":"striped","count":2},null]],"missingIndex":[2,2]},"visualOptions":[{"shape":"square","color":"#6366f1","fill":"empty","count":3},{"shape":"square","color":"#6366f1","fill":"empty","count":2},{"shape":"square","color":"#6366f1","fill":"striped","count":3},{"shape":"square","color":"#3b82f6","fill":"empty","count":3}]}'::jsonb,
 'active');

-- 68-4: 3x3 Matrix — shape+color+rotation (Latin square: each shape/color/rotation once per row and col)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'matrix', ARRAY['6-8']::age_band_type[], 2.5, 2.4, 0.10,
 '{"stem":"Each row and column has each shape, color, and rotation exactly once. What is missing?","type":"matrix","options":[{"text":"Pink circle rotated 0"},{"text":"Amber triangle rotated 240"},{"text":"Pink triangle rotated 120"},{"text":"Amber circle rotated 240"}],"correct_index":3,"visual":{"type":"matrix","rows":3,"cols":3,"cells":[[{"shape":"circle","color":"#ec4899","fill":"solid","rotation":0},{"shape":"triangle","color":"#f59e0b","fill":"solid","rotation":120},{"shape":"star","color":"#22c55e","fill":"solid","rotation":240}],[{"shape":"star","color":"#f59e0b","fill":"solid","rotation":0},{"shape":"circle","color":"#22c55e","fill":"solid","rotation":120},{"shape":"triangle","color":"#ec4899","fill":"solid","rotation":240}],[{"shape":"triangle","color":"#22c55e","fill":"solid","rotation":0},{"shape":"star","color":"#ec4899","fill":"solid","rotation":120},null]],"missingIndex":[2,2]},"visualOptions":[{"shape":"circle","color":"#ec4899","fill":"solid","rotation":0},{"shape":"triangle","color":"#f59e0b","fill":"solid","rotation":240},{"shape":"triangle","color":"#ec4899","fill":"solid","rotation":120},{"shape":"circle","color":"#f59e0b","fill":"solid","rotation":240}]}'::jsonb,
 'active');

-- 68-5: 3x3 Matrix — shape+fill+size (all three vary independently)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'matrix', ARRAY['6-8']::age_band_type[], 1.8, 2.1, 0.15,
 '{"stem":"Shape, fill, and size each follow their own rule. What completes the grid?","type":"matrix","options":[{"text":"Large empty pentagon"},{"text":"Large striped pentagon"},{"text":"Small striped pentagon"},{"text":"Large striped cross"}],"correct_index":1,"visual":{"type":"matrix","rows":3,"cols":3,"cells":[[{"shape":"circle","color":"#f97316","size":"sm","fill":"solid"},{"shape":"square","color":"#f97316","size":"sm","fill":"striped"},{"shape":"pentagon","color":"#f97316","size":"sm","fill":"empty"}],[{"shape":"circle","color":"#f97316","size":"md","fill":"striped"},{"shape":"square","color":"#f97316","size":"md","fill":"empty"},{"shape":"pentagon","color":"#f97316","size":"md","fill":"solid"}],[{"shape":"circle","color":"#f97316","size":"lg","fill":"empty"},{"shape":"square","color":"#f97316","size":"lg","fill":"solid"},null]],"missingIndex":[2,2]},"visualOptions":[{"shape":"pentagon","color":"#f97316","size":"lg","fill":"empty"},{"shape":"pentagon","color":"#f97316","size":"lg","fill":"striped"},{"shape":"pentagon","color":"#f97316","size":"sm","fill":"striped"},{"shape":"cross","color":"#f97316","size":"lg","fill":"striped"}]}'::jsonb,
 'active');

-- 68-6: Sequence — color+shape+fill triple cycle
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'sequence', ARRAY['6-8']::age_band_type[], 1.8, 1.9, 0.15,
 '{"stem":"Three things change together. What comes next?","type":"sequence","options":[{"text":"Solid red circle"},{"text":"Striped blue triangle"},{"text":"Empty green square"},{"text":"Solid blue square"}],"correct_index":0,"visual":{"type":"sequence","items":[{"shape":"circle","color":"#ef4444","fill":"solid"},{"shape":"square","color":"#22c55e","fill":"striped"},{"shape":"triangle","color":"#3b82f6","fill":"empty"},{"shape":"circle","color":"#ef4444","fill":"solid"},{"shape":"square","color":"#22c55e","fill":"striped"},{"shape":"triangle","color":"#3b82f6","fill":"empty"},null],"missingIndex":6},"visualOptions":[{"shape":"circle","color":"#ef4444","fill":"solid"},{"shape":"triangle","color":"#3b82f6","fill":"striped"},{"shape":"square","color":"#22c55e","fill":"empty"},{"shape":"square","color":"#3b82f6","fill":"solid"}]}'::jsonb,
 'active');

-- 68-7: Sequence — size+rotation+color (size grows, rotation increments, color alternates)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'sequence', ARRAY['6-8']::age_band_type[], 2.2, 2.1, 0.15,
 '{"stem":"Size grows in pairs, rotation increases by 90, and color alternates. What comes next?","type":"sequence","options":[{"text":"Large amber pentagon rotated 90"},{"text":"Medium purple pentagon rotated 90"},{"text":"Large purple pentagon rotated 90"},{"text":"Large purple pentagon rotated 180"}],"correct_index":2,"visual":{"type":"sequence","items":[{"shape":"pentagon","color":"#f59e0b","size":"sm","fill":"solid","rotation":0},{"shape":"pentagon","color":"#8b5cf6","size":"sm","fill":"solid","rotation":90},{"shape":"pentagon","color":"#f59e0b","size":"md","fill":"solid","rotation":180},{"shape":"pentagon","color":"#8b5cf6","size":"md","fill":"solid","rotation":270},{"shape":"pentagon","color":"#f59e0b","size":"lg","fill":"solid","rotation":0},null],"missingIndex":5},"visualOptions":[{"shape":"pentagon","color":"#f59e0b","size":"lg","fill":"solid","rotation":90},{"shape":"pentagon","color":"#8b5cf6","size":"md","fill":"solid","rotation":90},{"shape":"pentagon","color":"#8b5cf6","size":"lg","fill":"solid","rotation":90},{"shape":"pentagon","color":"#8b5cf6","size":"lg","fill":"solid","rotation":180}]}'::jsonb,
 'active');

-- 68-8: Sequence — shape+count+fill (shape progresses, count increases, fill cycles)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'sequence', ARRAY['6-8']::age_band_type[], 1.5, 1.8, 0.20,
 '{"stem":"Shape sides increase, count increases, fill cycles. What comes next?","type":"sequence","options":[{"text":"1 solid square"},{"text":"2 striped pentagon"},{"text":"3 empty hexagon"},{"text":"2 empty pentagon"}],"correct_index":2,"visual":{"type":"sequence","items":[{"shape":"triangle","color":"#0ea5e9","count":1,"fill":"solid"},{"shape":"square","color":"#0ea5e9","count":2,"fill":"striped"},{"shape":"pentagon","color":"#0ea5e9","count":3,"fill":"empty"},{"shape":"triangle","color":"#0ea5e9","count":1,"fill":"solid"},{"shape":"square","color":"#0ea5e9","count":2,"fill":"striped"},null],"missingIndex":5},"visualOptions":[{"shape":"square","color":"#0ea5e9","count":1,"fill":"solid"},{"shape":"pentagon","color":"#0ea5e9","count":2,"fill":"striped"},{"shape":"hexagon","color":"#0ea5e9","count":3,"fill":"empty"},{"shape":"pentagon","color":"#0ea5e9","count":2,"fill":"empty"}]}'::jsonb,
 'active');

-- 68-9: Analogy — color+shape+fill (triple transformation)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('reasoning', 'analogy', ARRAY['6-8']::age_band_type[], 1.2, 1.8, 0.20,
 '{"stem":"Red solid circle becomes blue striped square. What does green empty triangle become?","type":"analogy","options":[{"text":"Purple solid diamond"},{"text":"Green solid diamond"},{"text":"Purple empty diamond"},{"text":"Purple solid triangle"}],"correct_index":0,"visual":{"type":"analogy","a":{"shape":"circle","color":"#ef4444","fill":"solid"},"b":{"shape":"square","color":"#3b82f6","fill":"striped"},"c":{"shape":"triangle","color":"#22c55e","fill":"empty"}},"visualOptions":[{"shape":"diamond","color":"#8b5cf6","fill":"solid"},{"shape":"diamond","color":"#22c55e","fill":"solid"},{"shape":"diamond","color":"#8b5cf6","fill":"empty"},{"shape":"triangle","color":"#8b5cf6","fill":"solid"}]}'::jsonb,
 'active');

-- 68-10: Analogy — size+rotation+fill transformation
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('reasoning', 'analogy', ARRAY['6-8']::age_band_type[], 2.0, 2.0, 0.15,
 '{"stem":"Small solid star at 0 degrees becomes large empty star at 180 degrees. Apply the same rule.","type":"analogy","options":[{"text":"Small empty hexagon at 180"},{"text":"Large empty hexagon at 180"},{"text":"Large solid hexagon at 0"},{"text":"Large empty hexagon at 0"}],"correct_index":1,"visual":{"type":"analogy","a":{"shape":"star","color":"#f97316","size":"sm","fill":"solid","rotation":0},"b":{"shape":"star","color":"#f97316","size":"lg","fill":"empty","rotation":180},"c":{"shape":"hexagon","color":"#6366f1","size":"sm","fill":"solid","rotation":0}},"visualOptions":[{"shape":"hexagon","color":"#6366f1","size":"sm","fill":"empty","rotation":180},{"shape":"hexagon","color":"#6366f1","size":"lg","fill":"empty","rotation":180},{"shape":"hexagon","color":"#6366f1","size":"lg","fill":"solid","rotation":0},{"shape":"hexagon","color":"#6366f1","size":"lg","fill":"empty","rotation":0}]}'::jsonb,
 'active');

-- 68-11: Analogy — shape+color+count transformation
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('reasoning', 'analogy', ARRAY['6-8']::age_band_type[], 1.6, 1.9, 0.15,
 '{"stem":"1 red circle becomes 3 blue squares. What does 1 green diamond become?","type":"analogy","options":[{"text":"3 green pentagon"},{"text":"1 purple pentagon"},{"text":"3 purple pentagon"},{"text":"3 purple diamond"}],"correct_index":2,"visual":{"type":"analogy","a":{"shape":"circle","color":"#ef4444","count":1,"fill":"solid"},"b":{"shape":"square","color":"#3b82f6","count":3,"fill":"solid"},"c":{"shape":"diamond","color":"#22c55e","count":1,"fill":"solid"}},"visualOptions":[{"shape":"pentagon","color":"#22c55e","count":3,"fill":"solid"},{"shape":"pentagon","color":"#8b5cf6","count":1,"fill":"solid"},{"shape":"pentagon","color":"#8b5cf6","count":3,"fill":"solid"},{"shape":"diamond","color":"#8b5cf6","count":3,"fill":"solid"}]}'::jsonb,
 'active');

-- 68-12: Analogy — rotation+fill+color (triple change)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('reasoning', 'analogy', ARRAY['6-8']::age_band_type[], 0.8, 1.7, 0.20,
 '{"stem":"Pink solid cross at 0 becomes cyan striped cross at 90. Apply the same changes.","type":"analogy","options":[{"text":"Indigo striped diamond at 90"},{"text":"Amber striped diamond at 90"},{"text":"Amber solid diamond at 90"},{"text":"Amber striped diamond at 0"}],"correct_index":1,"visual":{"type":"analogy","a":{"shape":"cross","color":"#ec4899","fill":"solid","rotation":0},"b":{"shape":"cross","color":"#0ea5e9","fill":"striped","rotation":90},"c":{"shape":"diamond","color":"#f59e0b","fill":"solid","rotation":0}},"visualOptions":[{"shape":"diamond","color":"#6366f1","fill":"striped","rotation":90},{"shape":"diamond","color":"#f59e0b","fill":"striped","rotation":90},{"shape":"diamond","color":"#f59e0b","fill":"solid","rotation":90},{"shape":"diamond","color":"#f59e0b","fill":"striped","rotation":0}]}'::jsonb,
 'active');
