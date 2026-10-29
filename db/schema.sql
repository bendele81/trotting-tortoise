-- Trotting Tortoise: one row per runner. Public data only: a username and four times in seconds.
-- NULL means "not run yet".
--
-- The last two columns are for the Shopify hookup later and are never shown publicly:
--   email_hash        one-way hash of the buyer's email, so "lost my link" can work without storing the email
--   shopify_order_id  lets the order webhook safely ignore a repeat delivery of the same order
--   link_version      bump to cancel all older edit links
--   deleted_at        set when a runner deletes their page; the username stays reserved
CREATE TABLE IF NOT EXISTS runners (
  username          TEXT PRIMARY KEY
                    CHECK (length(username) BETWEEN 3 AND 20 AND username NOT GLOB '*[^a-z0-9_]*'),
  t_5k              INTEGER CHECK (t_5k   IS NULL OR t_5k   > 0),
  t_10k             INTEGER CHECK (t_10k  IS NULL OR t_10k  > 0),
  t_half            INTEGER CHECK (t_half IS NULL OR t_half > 0),
  t_full            INTEGER CHECK (t_full IS NULL OR t_full > 0),
  email_hash        TEXT,
  shopify_order_id  TEXT UNIQUE,
  link_version      INTEGER NOT NULL DEFAULT 0,
  deleted_at        TEXT,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
) WITHOUT ROWID;
