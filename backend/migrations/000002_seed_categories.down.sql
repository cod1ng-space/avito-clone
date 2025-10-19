-- Удаление всех подкатегорий и категорий
DELETE FROM subcategories;
DELETE FROM categories;

-- Сброс последовательностей
ALTER SEQUENCE categories_id_seq RESTART WITH 1;
ALTER SEQUENCE subcategories_id_seq RESTART WITH 1;