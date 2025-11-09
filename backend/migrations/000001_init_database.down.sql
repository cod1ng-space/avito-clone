-- Удаление триггера
DROP TRIGGER IF EXISTS update_ads_updated_at ON ads;
DROP TRIGGER IF EXISTS update_users_updated_at ON ads;

-- Удаление функции
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Удаление представления
DROP VIEW IF EXISTS ad_search_view;

-- Удаление индексов
DROP INDEX IF EXISTS idx_ads_subcategory_id;
DROP INDEX IF EXISTS idx_ads_created_at;
DROP INDEX IF EXISTS idx_ads_title;

-- Удаление таблиц в обратном порядке (учитывая зависимости)
DROP TABLE IF EXISTS ad_images;
DROP TABLE IF EXISTS ads;
DROP TABLE IF EXISTS subcategories;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;