-- Создание таблицы пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    social_network VARCHAR(50),
    social_contact VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы категорий
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Создание таблицы подкатегорий
CREATE TABLE subcategories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE (name, category_id)
);

-- Создание таблицы объявлений
CREATE TABLE ads (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL CHECK (LENGTH(title) BETWEEN 3 AND 100),
    description TEXT NOT NULL CHECK (LENGTH(description) BETWEEN 20 AND 5000),
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subcategory_id INTEGER NOT NULL REFERENCES subcategories(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы изображений
CREATE TABLE ad_images (
    id SERIAL PRIMARY KEY,
    ad_id INTEGER NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
    file_path VARCHAR(500) UNIQUE NOT NULL,
    order_index SMALLINT NOT NULL CHECK (order_index BETWEEN 1 AND 7),
    UNIQUE (ad_id, order_index)
);

-- Создание индексов для ускорения поиска
CREATE INDEX idx_ads_title ON ads (title); -- USING gin (title gin_trgm_ops); -- Для LIKE '%query%'
CREATE INDEX idx_ads_created_at ON ads (created_at); -- Для пагинации и сортировки по новизне
CREATE INDEX idx_ads_subcategory_id ON ads (subcategory_id); -- Для фильтрации по подкатегории

-- Создание представления для поиска
CREATE OR REPLACE VIEW ad_search_view AS
SELECT
    a.id AS ad_id,
    a.title,
    a.description,
    c.name AS category_name,
    s.name AS subcategory_name
FROM
    ads a
    JOIN subcategories s ON a.subcategory_id = s.id
    JOIN categories c ON s.category_id = c.id;

-- Триггер для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ads_updated_at
    BEFORE UPDATE ON ads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();