DROP TABLE IF EXISTS character;

CREATE TABLE character (
  literal character(1) PRIMARY KEY,
  radical smallint NOT NULL,
  nelson_radical smallint NOT NULL,
  grade smallint,
  freq smallint,
  jlpt smallint,
  stroke_count smallint[] NOT NULL,
  radical_names text[] NOT NULL,
  "on" text[] NOT NULL,
  kun text[] NOT NULL,
  meaning text[] NOT NULL,
  nanori text[] NOT NULL
);
