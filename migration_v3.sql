-- Migration V3: Add Extended Profile Fields

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linkedin VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS occupation VARCHAR(255); -- Title/Cargo
