-- Add rewards column to user_levels if not exists
USE edukiz;

-- Check and add rewards column
SET @dbname = 'edukiz';
SET @tablename = 'user_levels';
SET @columnname = 'rewards';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' INT DEFAULT 0 COMMENT ''Current star/reward count displayed in header'';')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Initialize rewards from total_stars_earned for existing users
UPDATE user_levels SET rewards = total_stars_earned WHERE rewards = 0 OR rewards IS NULL;

SELECT 'Migration complete! Rewards column added and initialized.' AS status;
