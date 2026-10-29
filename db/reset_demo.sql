-- Puts the four demo runners back to their original times (and un-deletes them).
-- Run in the D1 console any time visitors have changed them.
UPDATE runners SET t_5k=1452, t_10k=3063, t_half=6940, t_full=NULL,  deleted_at=NULL, updated_at=datetime('now') WHERE username='test';
UPDATE runners SET t_5k=1361, t_10k=2838, t_half=6365, t_full=NULL,  deleted_at=NULL, updated_at=datetime('now') WHERE username='slowandsteady';
UPDATE runners SET t_5k=1188, t_10k=2490, t_half=5482, t_full=11529, deleted_at=NULL, updated_at=datetime('now') WHERE username='fastfrank';
UPDATE runners SET t_5k=1865, t_10k=NULL, t_half=NULL, t_full=NULL,  deleted_at=NULL, updated_at=datetime('now') WHERE username='turbo_turtle';
