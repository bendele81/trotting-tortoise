-- Run this ONCE in the D1 console (one line at a time if the console complains) BEFORE deploying the edit page.
--   link_version : bump it to cancel every older edit link for a runner
--   deleted_at   : "deleted" pages are hidden but the username stays reserved forever,
--                  so nobody can take a username that's printed on someone's shirt
ALTER TABLE runners ADD COLUMN link_version INTEGER NOT NULL DEFAULT 0;
ALTER TABLE runners ADD COLUMN deleted_at TEXT;
