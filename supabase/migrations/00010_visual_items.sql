-- Visual items with SVG-rendered content for pattern/matrix/analogy questions
-- These items include a "visual" field in content_json that the VisualItemRenderer
-- component uses to render SVG shapes instead of text-only descriptions.

-- K-2: 2x2 Matrix — color+shape pattern
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'matrix', ARRAY['K-2']::age_band_type[], -1.5, 1.3, 0.25,
 '{"stem":"What shape goes in the empty box?","type":"matrix","options":[{"text":"Red circle"},{"text":"Blue circle"},{"text":"Red square"},{"text":"Blue square"}],"correct_index":3,"visual":{"type":"matrix","rows":2,"cols":2,"cells":[[{"shape":"circle","color":"#ef4444","fill":"solid"},{"shape":"square","color":"#ef4444","fill":"solid"}],[{"shape":"circle","color":"#3b82f6","fill":"solid"},null]],"missingIndex":[1,1]},"visualOptions":[{"shape":"circle","color":"#ef4444","fill":"solid"},{"shape":"circle","color":"#3b82f6","fill":"solid"},{"shape":"square","color":"#ef4444","fill":"solid"},{"shape":"square","color":"#3b82f6","fill":"solid"}]}'::jsonb,
 'active');

-- K-2: Sequence — growing shapes (small/large alternation)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'sequence', ARRAY['K-2']::age_band_type[], -2.0, 1.1, 0.25,
 '{"stem":"What comes next in the pattern?","type":"sequence","options":[{"text":"Small green circle"},{"text":"Large green circle"},{"text":"Small red circle"},{"text":"Large red circle"}],"correct_index":1,"visual":{"type":"sequence","items":[{"shape":"circle","color":"#22c55e","size":"sm","fill":"solid"},{"shape":"circle","color":"#22c55e","size":"lg","fill":"solid"},{"shape":"circle","color":"#22c55e","size":"sm","fill":"solid"},{"shape":"circle","color":"#22c55e","size":"lg","fill":"solid"},{"shape":"circle","color":"#22c55e","size":"sm","fill":"solid"},null],"missingIndex":5},"visualOptions":[{"shape":"circle","color":"#22c55e","size":"sm","fill":"solid"},{"shape":"circle","color":"#22c55e","size":"lg","fill":"solid"},{"shape":"circle","color":"#ef4444","size":"sm","fill":"solid"},{"shape":"circle","color":"#ef4444","size":"lg","fill":"solid"}]}'::jsonb,
 'active');

-- K-2: Analogy — shape transformation (circle:square as triangle:?)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('reasoning', 'analogy', ARRAY['K-2']::age_band_type[], -1.0, 1.4, 0.25,
 '{"stem":"Circle is to square as triangle is to...?","type":"analogy","options":[{"text":"Diamond"},{"text":"Circle"},{"text":"Triangle"},{"text":"Star"}],"correct_index":0,"visual":{"type":"analogy","a":{"shape":"circle","color":"#8b5cf6","fill":"solid"},"b":{"shape":"square","color":"#8b5cf6","fill":"solid"},"c":{"shape":"triangle","color":"#f59e0b","fill":"solid"}},"visualOptions":[{"shape":"diamond","color":"#f59e0b","fill":"solid"},{"shape":"circle","color":"#f59e0b","fill":"solid"},{"shape":"triangle","color":"#f59e0b","fill":"solid"},{"shape":"star","color":"#f59e0b","fill":"solid"}]}'::jsonb,
 'active');

-- K-2: Sequence — color alternation (red/blue stars)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'sequence', ARRAY['K-2']::age_band_type[], -2.5, 0.9, 0.25,
 '{"stem":"What color comes next?","type":"sequence","options":[{"text":"Red star"},{"text":"Blue star"},{"text":"Green star"},{"text":"Yellow star"}],"correct_index":0,"visual":{"type":"sequence","items":[{"shape":"star","color":"#ef4444","fill":"solid"},{"shape":"star","color":"#3b82f6","fill":"solid"},{"shape":"star","color":"#ef4444","fill":"solid"},{"shape":"star","color":"#3b82f6","fill":"solid"},null],"missingIndex":4},"visualOptions":[{"shape":"star","color":"#ef4444","fill":"solid"},{"shape":"star","color":"#3b82f6","fill":"solid"},{"shape":"star","color":"#22c55e","fill":"solid"},{"shape":"star","color":"#eab308","fill":"solid"}]}'::jsonb,
 'active');

-- K-2: Sequence — shape rotation
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'sequence', ARRAY['K-2']::age_band_type[], 1.0, 2.0, 0.25,
 '{"stem":"The shape rotates each step. What comes next?","type":"sequence","options":[{"text":"Pointing left"},{"text":"Pointing up"},{"text":"Pointing right"},{"text":"Pointing down"}],"correct_index":0,"visual":{"type":"sequence","items":[{"shape":"triangle","color":"#0ea5e9","fill":"solid","rotation":0},{"shape":"triangle","color":"#0ea5e9","fill":"solid","rotation":90},{"shape":"triangle","color":"#0ea5e9","fill":"solid","rotation":180},null],"missingIndex":3},"visualOptions":[{"shape":"triangle","color":"#0ea5e9","fill":"solid","rotation":270},{"shape":"triangle","color":"#0ea5e9","fill":"solid","rotation":0},{"shape":"triangle","color":"#0ea5e9","fill":"solid","rotation":90},{"shape":"triangle","color":"#0ea5e9","fill":"solid","rotation":180}]}'::jsonb,
 'active');

-- 3-5: 3x3 Matrix — shape+color pattern
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'matrix', ARRAY['3-5']::age_band_type[], 0.5, 1.7, 0.25,
 '{"stem":"What goes in the empty cell?","type":"matrix","options":[{"text":"Blue triangle"},{"text":"Red triangle"},{"text":"Blue circle"},{"text":"Red circle"}],"correct_index":0,"visual":{"type":"matrix","rows":3,"cols":3,"cells":[[{"shape":"circle","color":"#ef4444","fill":"solid"},{"shape":"square","color":"#ef4444","fill":"solid"},{"shape":"triangle","color":"#ef4444","fill":"solid"}],[{"shape":"circle","color":"#22c55e","fill":"solid"},{"shape":"square","color":"#22c55e","fill":"solid"},{"shape":"triangle","color":"#22c55e","fill":"solid"}],[{"shape":"circle","color":"#3b82f6","fill":"solid"},{"shape":"square","color":"#3b82f6","fill":"solid"},null]],"missingIndex":[2,2]},"visualOptions":[{"shape":"triangle","color":"#3b82f6","fill":"solid"},{"shape":"triangle","color":"#ef4444","fill":"solid"},{"shape":"circle","color":"#3b82f6","fill":"solid"},{"shape":"circle","color":"#ef4444","fill":"solid"}]}'::jsonb,
 'active');

-- 3-5: 3x3 Matrix — fill pattern (solid/striped/empty)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'matrix', ARRAY['3-5']::age_band_type[], 1.0, 1.8, 0.25,
 '{"stem":"Each row and column has one of each fill type. What goes in the empty cell?","type":"matrix","options":[{"text":"Striped diamond"},{"text":"Solid diamond"},{"text":"Empty diamond"},{"text":"Striped circle"}],"correct_index":0,"visual":{"type":"matrix","rows":3,"cols":3,"cells":[[{"shape":"diamond","color":"#8b5cf6","fill":"solid"},{"shape":"diamond","color":"#8b5cf6","fill":"striped"},{"shape":"diamond","color":"#8b5cf6","fill":"empty"}],[{"shape":"diamond","color":"#8b5cf6","fill":"empty"},{"shape":"diamond","color":"#8b5cf6","fill":"solid"},{"shape":"diamond","color":"#8b5cf6","fill":"striped"}],[{"shape":"diamond","color":"#8b5cf6","fill":"striped"},null,{"shape":"diamond","color":"#8b5cf6","fill":"solid"}]],"missingIndex":[2,1]}}'::jsonb,
 'active');

-- 3-5: Sequence — rotation pattern
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'sequence', ARRAY['3-5']::age_band_type[], 0.8, 1.6, 0.25,
 '{"stem":"The arrow rotates 90 degrees each step. What comes next?","type":"sequence","options":[{"text":"Arrow pointing left"},{"text":"Arrow pointing up"},{"text":"Arrow pointing right"},{"text":"Arrow pointing down"}],"correct_index":0,"visual":{"type":"sequence","items":[{"shape":"triangle","color":"#6366f1","fill":"solid","rotation":0},{"shape":"triangle","color":"#6366f1","fill":"solid","rotation":90},{"shape":"triangle","color":"#6366f1","fill":"solid","rotation":180},{"shape":"triangle","color":"#6366f1","fill":"solid","rotation":270},{"shape":"triangle","color":"#6366f1","fill":"solid","rotation":0},null],"missingIndex":5},"visualOptions":[{"shape":"triangle","color":"#6366f1","fill":"solid","rotation":90},{"shape":"triangle","color":"#6366f1","fill":"solid","rotation":0},{"shape":"triangle","color":"#6366f1","fill":"solid","rotation":270},{"shape":"triangle","color":"#6366f1","fill":"solid","rotation":180}]}'::jsonb,
 'active');

-- 3-5: Analogy — size transformation
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('reasoning', 'analogy', ARRAY['3-5']::age_band_type[], 0.3, 1.5, 0.25,
 '{"stem":"Small solid hexagon is to large solid hexagon, as small empty star is to...?","type":"analogy","options":[{"text":"Large empty star"},{"text":"Small solid star"},{"text":"Large solid star"},{"text":"Small empty hexagon"}],"correct_index":0,"visual":{"type":"analogy","a":{"shape":"hexagon","color":"#0ea5e9","size":"sm","fill":"solid"},"b":{"shape":"hexagon","color":"#0ea5e9","size":"lg","fill":"solid"},"c":{"shape":"star","color":"#f97316","size":"sm","fill":"empty"}},"visualOptions":[{"shape":"star","color":"#f97316","size":"lg","fill":"empty"},{"shape":"star","color":"#f97316","size":"sm","fill":"solid"},{"shape":"star","color":"#f97316","size":"lg","fill":"solid"},{"shape":"hexagon","color":"#0ea5e9","size":"sm","fill":"empty"}]}'::jsonb,
 'active');

-- 3-5: 3x3 Matrix — count pattern (1,2,3)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'matrix', ARRAY['3-5']::age_band_type[], 1.2, 1.9, 0.25,
 '{"stem":"Each row increases by one shape. What fills the empty cell?","type":"matrix","options":[{"text":"3 circles"},{"text":"2 circles"},{"text":"1 circle"},{"text":"3 squares"}],"correct_index":0,"visual":{"type":"matrix","rows":3,"cols":3,"cells":[[{"shape":"square","color":"#ef4444","count":1,"fill":"solid"},{"shape":"square","color":"#ef4444","count":2,"fill":"solid"},{"shape":"square","color":"#ef4444","count":3,"fill":"solid"}],[{"shape":"triangle","color":"#22c55e","count":1,"fill":"solid"},{"shape":"triangle","color":"#22c55e","count":2,"fill":"solid"},{"shape":"triangle","color":"#22c55e","count":3,"fill":"solid"}],[{"shape":"circle","color":"#3b82f6","count":1,"fill":"solid"},{"shape":"circle","color":"#3b82f6","count":2,"fill":"solid"},null]],"missingIndex":[2,2]},"visualOptions":[{"shape":"circle","color":"#3b82f6","count":3,"fill":"solid"},{"shape":"circle","color":"#3b82f6","count":2,"fill":"solid"},{"shape":"circle","color":"#3b82f6","count":1,"fill":"solid"},{"shape":"square","color":"#ef4444","count":3,"fill":"solid"}]}'::jsonb,
 'active');

-- 6-8: 3x3 Matrix — shape+color+fill
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'matrix', ARRAY['6-8']::age_band_type[], 1.5, 2.0, 0.25,
 '{"stem":"Three rules govern this matrix: shape changes across columns, color changes across rows, and fill alternates. What completes it?","type":"matrix","options":[{"text":"Empty blue pentagon"},{"text":"Solid blue pentagon"},{"text":"Striped blue hexagon"},{"text":"Empty green pentagon"}],"correct_index":0,"visual":{"type":"matrix","rows":3,"cols":3,"cells":[[{"shape":"circle","color":"#ef4444","fill":"solid"},{"shape":"hexagon","color":"#ef4444","fill":"empty"},{"shape":"pentagon","color":"#ef4444","fill":"solid"}],[{"shape":"circle","color":"#22c55e","fill":"empty"},{"shape":"hexagon","color":"#22c55e","fill":"solid"},{"shape":"pentagon","color":"#22c55e","fill":"empty"}],[{"shape":"circle","color":"#3b82f6","fill":"solid"},{"shape":"hexagon","color":"#3b82f6","fill":"empty"},null]],"missingIndex":[2,2]},"visualOptions":[{"shape":"pentagon","color":"#3b82f6","fill":"empty"},{"shape":"pentagon","color":"#3b82f6","fill":"solid"},{"shape":"hexagon","color":"#3b82f6","fill":"striped"},{"shape":"pentagon","color":"#22c55e","fill":"empty"}]}'::jsonb,
 'active');

-- 6-8: Sequence — double transformation (sides increase + color alternates)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('pattern_recognition', 'sequence', ARRAY['6-8']::age_band_type[], 2.0, 1.9, 0.25,
 '{"stem":"Two rules: the number of sides increases by 1, and the color alternates. What comes next?","type":"sequence","options":[{"text":"Purple hexagon"},{"text":"Orange hexagon"},{"text":"Orange pentagon"},{"text":"Purple pentagon"}],"correct_index":0,"visual":{"type":"sequence","items":[{"shape":"triangle","color":"#f97316","fill":"solid"},{"shape":"square","color":"#8b5cf6","fill":"solid"},{"shape":"pentagon","color":"#f97316","fill":"solid"},null],"missingIndex":3},"visualOptions":[{"shape":"hexagon","color":"#8b5cf6","fill":"solid"},{"shape":"hexagon","color":"#f97316","fill":"solid"},{"shape":"pentagon","color":"#f97316","fill":"solid"},{"shape":"pentagon","color":"#8b5cf6","fill":"solid"}]}'::jsonb,
 'active');

-- 6-8: Analogy — fill transformation (solid:empty as solid:?)
INSERT INTO items (domain, subdomain, age_bands, difficulty, discrimination, guessing, content_json, status) VALUES
('reasoning', 'analogy', ARRAY['6-8']::age_band_type[], 1.0, 1.7, 0.25,
 '{"stem":"Solid circle is to empty circle, as solid diamond is to...?","type":"analogy","options":[{"text":"Empty diamond"},{"text":"Striped diamond"},{"text":"Solid square"},{"text":"Empty circle"}],"correct_index":0,"visual":{"type":"analogy","a":{"shape":"circle","color":"#6366f1","fill":"solid"},"b":{"shape":"circle","color":"#6366f1","fill":"empty"},"c":{"shape":"diamond","color":"#ec4899","fill":"solid"}},"visualOptions":[{"shape":"diamond","color":"#ec4899","fill":"empty"},{"shape":"diamond","color":"#ec4899","fill":"striped"},{"shape":"square","color":"#ec4899","fill":"solid"},{"shape":"circle","color":"#6366f1","fill":"empty"}]}'::jsonb,
 'active');
