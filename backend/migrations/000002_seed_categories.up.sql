-- Добавление основных категорий (только если они ещё не существуют)
INSERT INTO categories (name) 
SELECT * FROM (VALUES 
  ('Транспорт'),
  ('Недвижимость'),
  ('Работа'),
  ('Услуги'),
  ('Техника и электроника'),
  ('Мода и стиль'),
  ('Дом и интерьер'),
  ('Хобби и досуг'),
  ('Бизнес'),
  ('Животные'),
  ('Путешествия'),
  ('Прочее')
) AS t(name) 
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE categories.name = t.name);

-- Получаем ID категорий для последующих вставок (предполагается, что они вставляются в порядке выше;
-- если в вашей СУБД автоинкремент не гарантирует порядок, лучше использовать явные SELECT к ID по имени)

-- 1. Транспорт
INSERT INTO subcategories (name, category_id)
SELECT v.name, c.id
FROM (VALUES
  ('Легковые авто'),
  ('Мотоциклы и скутеры'),
  ('Грузовики и спецтехника'),
  ('Водный транспорт'),
  ('Другое')
) AS v(name)
JOIN categories c ON c.name = 'Транспорт'
WHERE NOT EXISTS (
  SELECT 1 FROM subcategories s WHERE s.name = v.name AND s.category_id = c.id
);

-- 2. Недвижимость
INSERT INTO subcategories (name, category_id)
SELECT v.name, c.id
FROM (VALUES
  ('Купить жильё'),
  ('Снять жильё'),
  ('Коммерческая недвижимость'),
  ('Земельные участки'),
  ('Другое')
) AS v(name)
JOIN categories c ON c.name = 'Недвижимость'
WHERE NOT EXISTS (
  SELECT 1 FROM subcategories s WHERE s.name = v.name AND s.category_id = c.id
);

-- 3. Работа
INSERT INTO subcategories (name, category_id)
SELECT v.name, c.id
FROM (VALUES
  ('Ищу работу'),
  ('Ищу сотрудника'),
  ('Фриланс и подработка'),
  ('Волонтёрство'),
  ('Другое')
) AS v(name)
JOIN categories c ON c.name = 'Работа'
WHERE NOT EXISTS (
  SELECT 1 FROM subcategories s WHERE s.name = v.name AND s.category_id = c.id
);

-- 4. Услуги
INSERT INTO subcategories (name, category_id)
SELECT v.name, c.id
FROM (VALUES
  ('Ремонт и строительство'),
  ('Красота и здоровье'),
  ('Бытовые услуги'),
  ('Перевозки и логистика'),
  ('Другое')
) AS v(name)
JOIN categories c ON c.name = 'Услуги'
WHERE NOT EXISTS (
  SELECT 1 FROM subcategories s WHERE s.name = v.name AND s.category_id = c.id
);

-- 5. Техника и электроника
INSERT INTO subcategories (name, category_id)
SELECT v.name, c.id
FROM (VALUES
  ('Бытовая техника'),
  ('Компьютеры и ноутбуки'),
  ('Телефоны и гаджеты'),
  ('Аудио и видео'),
  ('Другое')
) AS v(name)
JOIN categories c ON c.name = 'Техника и электроника'
WHERE NOT EXISTS (
  SELECT 1 FROM subcategories s WHERE s.name = v.name AND s.category_id = c.id
);

-- 6. Мода и стиль
INSERT INTO subcategories (name, category_id)
SELECT v.name, c.id
FROM (VALUES
  ('Одежда'),
  ('Обувь'),
  ('Аксессуары'),
  ('Свадебная мода'),
  ('Другое')
) AS v(name)
JOIN categories c ON c.name = 'Мода и стиль'
WHERE NOT EXISTS (
  SELECT 1 FROM subcategories s WHERE s.name = v.name AND s.category_id = c.id
);

-- 7. Дом и интерьер
INSERT INTO subcategories (name, category_id)
SELECT v.name, c.id
FROM (VALUES
  ('Мебель'),
  ('Декор и текстиль'),
  ('Посуда и кухонные принадлежности'),
  ('Сад и дача'),
  ('Другое')
) AS v(name)
JOIN categories c ON c.name = 'Дом и интерьер'
WHERE NOT EXISTS (
  SELECT 1 FROM subcategories s WHERE s.name = v.name AND s.category_id = c.id
);

-- 8. Хобби и досуг
INSERT INTO subcategories (name, category_id)
SELECT v.name, c.id
FROM (VALUES
  ('Книги и музыка'),
  ('Спорт и активный отдых'),
  ('Игры и игрушки'),
  ('Коллекционирование'),
  ('Другое')
) AS v(name)
JOIN categories c ON c.name = 'Хобби и досуг'
WHERE NOT EXISTS (
  SELECT 1 FROM subcategories s WHERE s.name = v.name AND s.category_id = c.id
);

-- 9. Бизнес
INSERT INTO subcategories (name, category_id)
SELECT v.name, c.id
FROM (VALUES
  ('Продажа бизнеса'),
  ('Оборудование'),
  ('Бухгалтерия и юриспруденция'),
  ('Реклама и маркетинг'),
  ('Другое')
) AS v(name)
JOIN categories c ON c.name = 'Бизнес'
WHERE NOT EXISTS (
  SELECT 1 FROM subcategories s WHERE s.name = v.name AND s.category_id = c.id
);

-- 10. Животные
INSERT INTO subcategories (name, category_id)
SELECT v.name, c.id
FROM (VALUES
  ('Собаки'),
  ('Кошки'),
  ('Птицы и грызуны'),
  ('Аквариум и террариум'),
  ('Другое')
) AS v(name)
JOIN categories c ON c.name = 'Животные'
WHERE NOT EXISTS (
  SELECT 1 FROM subcategories s WHERE s.name = v.name AND s.category_id = c.id
);

-- 11. Путешествия
INSERT INTO subcategories (name, category_id)
SELECT v.name, c.id
FROM (VALUES
  ('Билеты'),
  ('Туры и экскурсии'),
  ('Аренда жилья в поездках'),
  ('Трансфер и транспорт'),
  ('Другое')
) AS v(name)
JOIN categories c ON c.name = 'Путешествия'
WHERE NOT EXISTS (
  SELECT 1 FROM subcategories s WHERE s.name = v.name AND s.category_id = c.id
);

-- 12. Прочее
INSERT INTO subcategories (name, category_id)
SELECT v.name, c.id
FROM (VALUES
  ('Без категории'),
  ('Подарки и сувениры'),
  ('Антиквариат и раритеты'),
  ('Благотворительность'),
  ('Другое')
) AS v(name)
JOIN categories c ON c.name = 'Прочее'
WHERE NOT EXISTS (
  SELECT 1 FROM subcategories s WHERE s.name = v.name AND s.category_id = c.id
);