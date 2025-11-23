-- Создание пользователей
INSERT INTO users (email, username, phone, social_network, social_contact, password_hash) VALUES
('ivanov.aleksey@mail.ru', 'Иванов Алексей', '+79161234567', 'Telegram', '@aleksey_ivanov', '$2a$10$.4zSBQ92PJKSc0zvH3hIGueVU5SzY7geMtmovJYY1IoYbsT.s5POK'),
('petrova_maria@yandex.ru', 'Мария Петрова', '+79257654321', 'WhatsApp', '+79257654321', '$2a$10$.4zSBQ92PJKSc0zvH3hIGueVU5SzY7geMtmovJYY1IoYbsT.s5POK'),
('sergeev_dmitry@gmail.com', 'Сергей Сергеев', '+79039876543', 'VK', 'id123456789', '$2a$10$.4zSBQ92PJKSc0zvH3hIGueVU5SzY7geMtmovJYY1IoYbsT.s5POK'),
('elena_kuzn@mail.ru', 'Елена Кузнецова', '+79171112233', NULL, NULL, '$2a$10$.4zSBQ92PJKSc0zvH3hIGueVU5SzY7geMtmovJYY1IoYbsT.s5POK'),
('romanov.artem@proton.me', 'Артём Романов', '+79264445566', 'Telegram', '@artem_rom', '$2a$10$.4zSBQ92PJKSc0zvH3hIGueVU5SzY7geMtmovJYY1IoYbsT.s5POK'),
('olga_sokolova@inbox.ru', 'Ольга Соколова', '+79109998877', 'WhatsApp', '+79109998877', '$2a$10$.4zSBQ92PJKSc0zvH3hIGueVU5SzY7geMtmovJYY1IoYbsT.s5POK'),
('mikhail_ivanov@bk.ru', 'Михаил Иванов', '+79052223344', 'VK', 'id987654321', '$2a$10$.4zSBQ92PJKSc0zvH3hIGueVU5SzY7geMtmovJYY1IoYbsT.s5POK'),
('natalia_smirnova@list.ru', 'Наталья Смирнова', '+79185556677', NULL, NULL, '$2a$10$.4zSBQ92PJKSc0zvH3hIGueVU5SzY7geMtmovJYY1IoYbsT.s5POK');

-- Получаем ID подкатегорий для корректной вставки
WITH subcat_ids AS (
  SELECT 
    s.id,
    c.name AS category_name,
    s.name AS subcategory_name
  FROM subcategories s
  JOIN categories c ON s.category_id = c.id
)

-- Объявления с изображениями (часть 1: Животные, Техника, Мода и стиль)
INSERT INTO ads (id, title, description, user_id, subcategory_id) VALUES
-- Животные → Собаки
(1, 'Продам щенка дворняжки', 'Здоровый, игривый щенок, 2 месяца. Привит, приучен к лотку. Идеально подойдёт для семьи с детьми.', 1,
 (SELECT id FROM subcategories WHERE name = 'Собаки' AND category_id = (SELECT id FROM categories WHERE name = 'Животные'))),
-- Животные → Собаки
(2, 'Породистый лабрадор', 'Мальчик, 4 месяца, документы, родители на фото. Дружелюбный, умный, отлично ладит с детьми.', 2,
 (SELECT id FROM subcategories WHERE name = 'Собаки' AND category_id = (SELECT id FROM categories WHERE name = 'Животные'))),
-- Животные → Собаки
(3, 'Щенок овчарки', 'Классный щенок немецкой овчарки, 3 месяца. Оба родителя чемпионы. Привит, чипирован.', 3,
 (SELECT id FROM subcategories WHERE name = 'Собаки' AND category_id = (SELECT id FROM categories WHERE name = 'Животные'))),
-- Животные → Собаки
(4, 'Доберман, отличный охранник', 'Взрослый кобель, 2 года, со всеми прививками. Очень преданный и обучаемый.', 4,
 (SELECT id FROM subcategories WHERE name = 'Собаки' AND category_id = (SELECT id FROM categories WHERE name = 'Животные'))),

-- Животные → Кошки
(5, 'Котёнок-леопард', 'Необычный окрас, 2 месяца, очень ласковый. Ищем дом с любовью!', 5,
 (SELECT id FROM subcategories WHERE name = 'Кошки' AND category_id = (SELECT id FROM categories WHERE name = 'Животные'))),
-- Животные → Кошки
(6, 'Рыжий котёнок ищет семью', 'Малыш 1.5 месяца, кушает сам, приучен к лотку. Очень игривый и нежный.', 6,
 (SELECT id FROM subcategories WHERE name = 'Кошки' AND category_id = (SELECT id FROM categories WHERE name = 'Животные'))),
-- Животные → Кошки
(7, 'Рэгдолл, девочка', 'Породистая кошка, 5 месяцев, родословная. Спокойная, любит обниматься.', 7,
 (SELECT id FROM subcategories WHERE name = 'Кошки' AND category_id = (SELECT id FROM categories WHERE name = 'Животные'))),

-- Животные → Птицы и грызуны
(8, 'Волнистый попугайчик', 'Мальчик, 4 месяца, уже говорит "привет". Очень общительный.', 1,
 (SELECT id FROM subcategories WHERE name = 'Птицы и грызуны' AND category_id = (SELECT id FROM categories WHERE name = 'Животные'))),
-- Животные → Птицы и грызуны
(9, 'Пара волнистых попугаев', 'Два попугайчика, мальчик и девочка. Продаются вместе — уже пара.', 2,
 (SELECT id FROM subcategories WHERE name = 'Птицы и грызуны' AND category_id = (SELECT id FROM categories WHERE name = 'Животные'))),
-- Животные → Птицы и грызуны
(10, 'Два волнистых попугая для компании', 'Очень дружные птички, легко обучаются. Идеальны для дома.', 3,
 (SELECT id FROM subcategories WHERE name = 'Птицы и грызуны' AND category_id = (SELECT id FROM categories WHERE name = 'Животные'))),

-- Животные → Аквариум и террариум
(11, 'Аквариум с рыбками', 'Готовый аквариум 60 литров с фильтром и освещением. В комплекте 5 рыбок.', 4,
 (SELECT id FROM subcategories WHERE name = 'Аквариум и террариум' AND category_id = (SELECT id FROM categories WHERE name = 'Животные'))),
-- Животные → Аквариум и террариум
(12, 'Оранжевая рыбка бетта', 'Красивая самка бетта, оранжевого окраса. Продаётся с аквариумом 10 л.', 5,
 (SELECT id FROM subcategories WHERE name = 'Аквариум и террариум' AND category_id = (SELECT id FROM categories WHERE name = 'Животные'))),
-- Животные → Аквариум и террариум
(13, 'Тернеция в аквариуме', 'Группа из 6 тернеций, здоровые и активные. Подходят для общего аквариума.', 6,
 (SELECT id FROM subcategories WHERE name = 'Аквариум и террариум' AND category_id = (SELECT id FROM categories WHERE name = 'Животные'))),

-- Техника и электроника → Аудио и видео
(14, 'AirPods 1 поколения', 'Оригинал, в отличном состоянии. Чехол не родной, но новый.', 7,
 (SELECT id FROM subcategories WHERE name = 'Аудио и видео' AND category_id = (SELECT id FROM categories WHERE name = 'Техника и электроника'))),
-- Техника и электроника → Аудио и видео
(15, 'EarPods Apple', 'Оригинальные проводные наушники от Apple. Без повреждений.', 1,
 (SELECT id FROM subcategories WHERE name = 'Аудио и видео' AND category_id = (SELECT id FROM categories WHERE name = 'Техника и электроника'))),

-- Техника и электроника → Телефоны и гаджеты
(16, 'iPhone 7 в идеале', '128 ГБ, чёрный, без царапин, батарея на 90%. В комплекте всё родное.', 2,
 (SELECT id FROM subcategories WHERE name = 'Телефоны и гаджеты' AND category_id = (SELECT id FROM categories WHERE name = 'Техника и электроника'))),
-- Техника и электроника → Телефоны и гаджеты
(17, 'Samsung Galaxy A52', 'Телефон в отличном состоянии, 128 ГБ, все обновления. Продаю из-за смены бренда.', 3,
 (SELECT id FROM subcategories WHERE name = 'Телефоны и гаджеты' AND category_id = (SELECT id FROM categories WHERE name = 'Техника и электроника'))),
-- Техника и электроника → Телефоны и гаджеты
(18, 'Panasonic — редкая модель', 'Старый, но рабочий телефон. Для коллекционера или дачи.', 4,
 (SELECT id FROM subcategories WHERE name = 'Телефоны и гаджеты' AND category_id = (SELECT id FROM categories WHERE name = 'Техника и электроника'))),

-- Техника и электроника → Компьютеры и ноутбуки
(19, 'Игровой ПК #1', 'Intel i7, RTX 3070, 32 ГБ ОЗУ, SSD 1 ТБ. Идеален для игр и монтажа.', 5,
 (SELECT id FROM subcategories WHERE name = 'Компьютеры и ноутбуки' AND category_id = (SELECT id FROM categories WHERE name = 'Техника и электроника'))),
-- Техника и электроника → Компьютеры и ноутбуки
(20, 'Игровой ПК #2', 'AMD Ryzen 7, RTX 3060, 16 ГБ ОЗУ. Всё в рабочем состоянии, без пыли.', 6,
 (SELECT id FROM subcategories WHERE name = 'Компьютеры и ноутбуки' AND category_id = (SELECT id FROM categories WHERE name = 'Техника и электроника'))),
-- Техника и электроника → Компьютеры и ноутбуки
(21, 'Игровой ПК #3', 'Новый корпус, водяное охлаждение, тихий. Продаю, так как перехожу на ноутбук.', 7,
 (SELECT id FROM subcategories WHERE name = 'Компьютеры и ноутбуки' AND category_id = (SELECT id FROM categories WHERE name = 'Техника и электроника'))),
-- Техника и электроника → Компьютеры и ноутбуки
(22, 'Игровой ПК #4', 'Полностью собранный системный блок. Все комплектующие новые 2024 года.', 1,
 (SELECT id FROM subcategories WHERE name = 'Компьютеры и ноутбуки' AND category_id = (SELECT id FROM categories WHERE name = 'Техника и электроника'))),

-- Техника и электроника → Бытовая техника
(123, 'Продам холодильник', 'Продам холодильник отличном состоянии. Использовался менее года. ', 3,
 (SELECT id FROM subcategories WHERE name = 'Бытовая техника' AND category_id = (SELECT id FROM categories WHERE name = 'Техника и электроника'))),
-- Техника и электроника → Бытовая техника
(124, 'Стиральная мащина', 'Продам стиральную машину. Цена 5000 рублей.', 4,
 (SELECT id FROM subcategories WHERE name = 'Бытовая техника' AND category_id = (SELECT id FROM categories WHERE name = 'Техника и электроника'))),

-- Мода и стиль → Аксессуары
(23, 'Золотые серьги', 'Классические золотые серьги 585 пробы. В идеальном состоянии.', 2,
 (SELECT id FROM subcategories WHERE name = 'Аксессуары' AND category_id = (SELECT id FROM categories WHERE name = 'Мода и стиль'))),

-- Мода и стиль → Обувь
(24, 'Старые коричневые ботинки', 'Натуральная кожа, размер 42. Носил мало, в хорошем состоянии.', 3,
 (SELECT id FROM subcategories WHERE name = 'Обувь' AND category_id = (SELECT id FROM categories WHERE name = 'Мода и стиль'))),
-- Мода и стиль → Обувь
(25, 'Кроссовки Nike', 'Размер 44, черные. Без дефектов, носил пару раз.', 4,
 (SELECT id FROM subcategories WHERE name = 'Обувь' AND category_id = (SELECT id FROM categories WHERE name = 'Мода и стиль'))),

-- Мода и стиль → Одежда
(26, 'Спортивный костюм', 'Размер L, черный с белыми полосами. Новый, с биркой.', 5,
 (SELECT id FROM subcategories WHERE name = 'Одежда' AND category_id = (SELECT id FROM categories WHERE name = 'Мода и стиль'))),
-- Мода и стиль → Одежда
(27, 'Спортивный костюм #2', 'Размер M, серый. Отличное состояние, стирал один раз.', 6,
 (SELECT id FROM subcategories WHERE name = 'Одежда' AND category_id = (SELECT id FROM categories WHERE name = 'Мода и стиль'))),

-- Мода и стиль → Свадебная мода
(28, 'Свадебный костюм', 'Мужской костюм, размер 50. Использовался один раз, идеально чистый.', 7,
 (SELECT id FROM subcategories WHERE name = 'Свадебная мода' AND category_id = (SELECT id FROM categories WHERE name = 'Мода и стиль')));

-- Связывание изображений с объявлениями (в строгом соответствии с файлами)
INSERT INTO ad_images (ad_id, file_path, order_index) VALUES
-- Собаки
(1, 'dog_1.webp', 1),
(2, 'dog_2.jpg', 1),
(3, 'dog_3.webp', 1),
(4, 'dog_4.webp', 1),

-- Кошки
(5, 'cat_leopard_kittens.webp', 1),
(6, 'cat_orange_kitten.webp', 1),
(7, 'cat_ragdoll.jpg', 1),

-- Птицы
(8, 'birds_budgie_1.jpg', 1),
(9, 'birds_budgie_2.webp', 1),
(10, 'birds_two_budgie.jpg', 1),

-- Аквариум
(11, 'aquarium_cumpara.webp', 1),
(12, 'aquarium_orange_fish.webp', 1),
(13, 'aquarium_ternetsia.jpeg', 1),

-- Гаджеты
(14, 'technology_and_electronics_airpods1.jpg', 1),
(15, 'technology_and_electronics_earpods.jpg', 1),
(16, 'technology_and_electronics_iphone7.jpg', 1),
(17, 'technology_and_electronics_samsung.jpg', 1),
(18, 'technology_and_electronics_panasonic.webp', 1),

-- Компьютеры
(19, 'technology_and_electronics_gaming_computer_1.webp', 1),
(20, 'technology_and_electronics_gaming_computer_2.jpg', 1),
(21, 'technology_and_electronics_gaming_computer_3.webp', 1),
(22, 'technology_and_electronics_gaming_computer_4.jpg', 1),

-- Бытовая техника
(123, 'household_appliances_refrigerator_atlant.webp', 1),
(124, 'household_appliances_washing_machine.jpg', 1),

-- Аксессуары и одежда
(23, 'accessories_earrings_gold.jpg', 1),
(24, 'shoes_old_brown.webp', 1),
(25, 'shoes_sneakers.jpg', 1),
(26, 'clothes_sport_suit.webp', 1),
(27, 'clothes_sport_suit_2.jpg', 1),
(28, 'wedding_costume.webp', 1);

-- Добавим ещё 2 пользователей для баланса (всего будет 10)
INSERT INTO users (email, username, phone, social_network, social_contact, password_hash) VALUES
('dmitriy_volkov@yandex.ru', 'Дмитрий Волков', '+79211239876', 'Telegram', '@dima_volkov', '$2a$10$.4zSBQ92PJKSc0zvH3hIGueVU5SzY7geMtmovJYY1IoYbsT.s5POK'),
('anna_morozova@mail.ru', 'Анна Морозова', '+79198765432', 'VK', 'id555666777', '$2a$10$.4zSBQ92PJKSc0zvH3hIGueVU5SzY7geMtmovJYY1IoYbsT.s5POK');

-- Вспомогательный CTE для ID подкатегорий (для удобства)
WITH cat AS (
  SELECT id, name FROM categories
), subcat AS (
  SELECT s.id, s.name, s.category_id, c.name AS cat_name
  FROM subcategories s
  JOIN cat c ON s.category_id = c.id
)

-- Объявления с изображениями (часть 2: Недвижимость, Транспорт, Дом и интерьер, Хобби, Бизнес и др.)
INSERT INTO ads (id, title, description, user_id, subcategory_id) VALUES

-- Недвижимость → Снять жильё
(29, 'Продам 1-комнатную квартиру', 'Уютная однушка в центре, метро рядом. Есть вся техника и мебель. Цена — 10 000 000 ₽/мес.', 8,
 (SELECT id FROM subcategories WHERE name = 'Купить жильё' AND category_id = (SELECT id FROM categories WHERE name = 'Недвижимость'))),
-- Недвижимость → Снять жильё
(30, 'Квартира у метро', 'Продаётся 2-комнатная квартира в новом доме. Ремонт, паркет, застеклённый балкон.', 9,
 (SELECT id FROM subcategories WHERE name = 'Купить жильё' AND category_id = (SELECT id FROM categories WHERE name = 'Недвижимость'))),
-- Недвижимость → Снять жильё
(31, 'Современная студия', 'Продам студию с евроремонтом. Цена договорная.', 10,
 (SELECT id FROM subcategories WHERE name = 'Купить жильё' AND category_id = (SELECT id FROM categories WHERE name = 'Недвижимость'))),

-- Недвижимость → Снять жильё
(32, 'Уютная квартира в спальном районе', 'Тихий двор, развитая инфраструктура. Есть Wi-Fi и стиральная машина.', 1,
 (SELECT id FROM subcategories WHERE name = 'Снять жильё' AND category_id = (SELECT id FROM categories WHERE name = 'Недвижимость'))),
-- Недвижимость → Снять жильё
(33, 'Квартира с панорамным видом', 'Высокий этаж, вид на город. Дом с консьержем и подземной парковкой.', 2,
 (SELECT id FROM subcategories WHERE name = 'Снять жильё' AND category_id = (SELECT id FROM categories WHERE name = 'Недвижимость'))),
-- Недвижимость → Снять жильё
(34, 'Сдам студию у парка', 'Идеально для одного. Вся мебель новая, кондиционер, бойлер. Без животных, только для некурящих. Цена — 60 000 ₽/мес.', 3,
 (SELECT id FROM subcategories WHERE name = 'Снять жильё' AND category_id = (SELECT id FROM categories WHERE name = 'Недвижимость'))),
-- Недвижимость → Снять жильё
(35, 'Квартира с евроремонтом', 'Сдается на длительный срок. Все документы в порядке.', 4,
 (SELECT id FROM subcategories WHERE name = 'Снять жильё' AND category_id = (SELECT id FROM categories WHERE name = 'Недвижимость'))),

-- Недвижимость → Коммерческая недвижимость
(36, 'Офис в бизнес-центре', 'Аренда офиса 50 м² в центре. Отдельный вход, парковка, охрана.', 5,
 (SELECT id FROM subcategories WHERE name = 'Коммерческая недвижимость' AND category_id = (SELECT id FROM categories WHERE name = 'Недвижимость'))),
-- Недвижимость → Коммерческая недвижимость
(37, 'Помещение под бизнес', 'Помещение 80 м² на первом этаже. Отличная проходимость.', 6,
 (SELECT id FROM subcategories WHERE name = 'Коммерческая недвижимость' AND category_id = (SELECT id FROM categories WHERE name = 'Недвижимость'))),
-- Недвижимость → Коммерческая недвижимость
(38, 'Офис в Москва Сити', 'Офис в Москва Сити в башне Евразия на 43 этаже.', 7,
 (SELECT id FROM subcategories WHERE name = 'Коммерческая недвижимость' AND category_id = (SELECT id FROM categories WHERE name = 'Недвижимость'))),

-- Недвижимость → Земельные участки
(39, 'Участок 10 соток', 'ИЖС, газ и свет по границе. Ровный, прямоугольный, лес рядом.', 8,
 (SELECT id FROM subcategories WHERE name = 'Земельные участки' AND category_id = (SELECT id FROM categories WHERE name = 'Недвижимость'))),
-- Недвижимость → Земельные участки
(40, 'Дачный участок с домом', '6 соток, дом 40 м², летняя веранда. Вода и электричество есть.', 9,
 (SELECT id FROM subcategories WHERE name = 'Земельные участки' AND category_id = (SELECT id FROM categories WHERE name = 'Недвижимость'))),
-- Недвижимость → Земельные участки
(41, 'Участок под строительство', '15 соток в коттеджном посёлке. Все коммуникации подведены.', 10,
 (SELECT id FROM subcategories WHERE name = 'Земельные участки' AND category_id = (SELECT id FROM categories WHERE name = 'Недвижимость'))),

-- Транспорт → Мотоциклы и скутеры
(42, 'Honda CBR 600', 'Спортивный мотоцикл 2020 г., 12 тыс. км, обслужен, без ДТП.', 1,
 (SELECT id FROM subcategories WHERE name = 'Мотоциклы и скутеры' AND category_id = (SELECT id FROM categories WHERE name = 'Транспорт'))),
-- Транспорт → Легковые авто
(43, 'Mazda CX-5, чёрная', 'В отличном состоянии, 2021 г., 40 тыс. км, полный комплект, один хозяин.', 2,
 (SELECT id FROM subcategories WHERE name = 'Легковые авто' AND category_id = (SELECT id FROM categories WHERE name = 'Транспорт'))),
-- Транспорт → Грузовики и спецтехника
(44, 'Синий фургон, в рабочем состоянии', 'Volkswagen Transporter, 2018 г., объем 9 м³, климат-контроль.', 3,
 (SELECT id FROM subcategories WHERE name = 'Легковые авто' AND category_id = (SELECT id FROM categories WHERE name = 'Транспорт'))),

-- Транспорт → Мотоциклы и скутеры
(45, 'Красный скутер', 'Продаю скутер, 50 кубов, 2022 года. Отличное состояние, мало ездил.', 4,
 (SELECT id FROM subcategories WHERE name = 'Мотоциклы и скутеры' AND category_id = (SELECT id FROM categories WHERE name = 'Транспорт'))),

-- Транспорт → Грузовики и спецтехника
(46, 'Mercedes-Benz Actros', 'Тягач в идеале, 2020 г., Евро-6, все сервисы пройдены.', 5,
 (SELECT id FROM subcategories WHERE name = 'Грузовики и спецтехника' AND category_id = (SELECT id FROM categories WHERE name = 'Транспорт'))),
-- Транспорт → Грузовики и спецтехника
(47, 'Scania R500', 'Грузовик для дальних перевозок. Кондиционер, спальное место, круиз.', 6,
 (SELECT id FROM subcategories WHERE name = 'Грузовики и спецтехника' AND category_id = (SELECT id FROM categories WHERE name = 'Транспорт'))),
-- Транспорт → Грузовики и спецтехника
(48, 'Sitrak — в аренду или продажу', 'Китайский аналог HOWO, мощный, надёжный. Рассмотрю оба варианта.', 7,
 (SELECT id FROM subcategories WHERE name = 'Грузовики и спецтехника' AND category_id = (SELECT id FROM categories WHERE name = 'Транспорт'))),

-- Транспорт → Водный транспорт
(49, 'Гидроцикл Yamaha', '2019 года, 100 моточасов, обслужен, без повреждений.', 8,
 (SELECT id FROM subcategories WHERE name = 'Водный транспорт' AND category_id = (SELECT id FROM categories WHERE name = 'Транспорт'))),
-- Транспорт → Водный транспорт
(50, 'Катамаран для рыбалки', 'Надувной, 4-местный, с мотором. Отличное состояние.', 9,
 (SELECT id FROM subcategories WHERE name = 'Водный транспорт' AND category_id = (SELECT id FROM categories WHERE name = 'Транспорт'))),

-- Дом и интерьер → Мебель
(51, 'Старый диван', 'Кожаный диван, 3-местный. Немного потёрт, но крепкий и удобный.', 10,
 (SELECT id FROM subcategories WHERE name = 'Мебель' AND category_id = (SELECT id FROM categories WHERE name = 'Дом и интерьер'))),
-- Дом и интерьер → Мебель
(52, 'Шкаф-купе', 'Белый шкаф 2.4 м, раздвижные двери, зеркала. Без запаха и повреждений.', 1,
 (SELECT id FROM subcategories WHERE name = 'Мебель' AND category_id = (SELECT id FROM categories WHERE name = 'Дом и интерьер'))),
-- Дом и интерьер → Мебель
(53, 'Шкаф для одежды', 'Ореховый цвет, классика. Вместительный, с ящиками и полками.', 2,
 (SELECT id FROM subcategories WHERE name = 'Мебель' AND category_id = (SELECT id FROM categories WHERE name = 'Дом и интерьер'))),

-- Дом и интерьер → Декор и текстиль
(54, 'Подушка с Рождеством', 'Праздничная декоративная подушка с оленями и надписью "Merry Christmas".', 3,
 (SELECT id FROM subcategories WHERE name = 'Декор и текстиль' AND category_id = (SELECT id FROM categories WHERE name = 'Дом и интерьер'))),
-- Дом и интерьер → Декор и текстиль
(55, 'Набор декоративных подушек', '3 подушки в современном стиле, синие и серые оттенки.', 4,
 (SELECT id FROM subcategories WHERE name = 'Декор и текстиль' AND category_id = (SELECT id FROM categories WHERE name = 'Дом и интерьер'))),

-- Дом и интерьер → Посуда и кухонные принадлежности
(56, 'Набор посуды', 'Фарфоровый сервиз на 6 персон. В подарочной упаковке, без сколов.', 5,
 (SELECT id FROM subcategories WHERE name = 'Посуда и кухонные принадлежности' AND category_id = (SELECT id FROM categories WHERE name = 'Дом и интерьер'))),
-- Дом и интерьер → Посуда и кухонные принадлежности
(57, 'Коллекционная посуда', 'Винтажный фарфор СССР, редкий узор. Идеален для коллекционеров.', 6,
 (SELECT id FROM subcategories WHERE name = 'Посуда и кухонные принадлежности' AND category_id = (SELECT id FROM categories WHERE name = 'Дом и интерьер'))),
-- Дом и интерьер → Посуда и кухонные принадлежности
(58, 'Чайный сервиз', 'Фарфор, золочёные края, 12 предметов. В отличном состоянии.', 7,
 (SELECT id FROM subcategories WHERE name = 'Посуда и кухонные принадлежности' AND category_id = (SELECT id FROM categories WHERE name = 'Дом и интерьер'))),

-- Дом и интерьер → Сад и дача
(59, 'Копка колодца на участке', 'Профессиональная услуга по рытью колодца. Гарантия 5 лет.', 8,
 (SELECT id FROM subcategories WHERE name = 'Сад и дача' AND category_id = (SELECT id FROM categories WHERE name = 'Дом и интерьер'))),

-- Хобби и досуг → Книги и музыка
(60, 'Книга: Операционные системы', 'Таненбаум — классика. Издание 2020 года, в отличном состоянии.', 9,
 (SELECT id FROM subcategories WHERE name = 'Книги и музыка' AND category_id = (SELECT id FROM categories WHERE name = 'Хобби и досуг'))),
-- Хобби и досуг → Книги и музыка
(61, 'Виниловая коллекция', '10 пластинок рок-классики: Pink Floyd, The Beatles, Queen и др.', 10,
 (SELECT id FROM subcategories WHERE name = 'Книги и музыка' AND category_id = (SELECT id FROM categories WHERE name = 'Хобби и досуг'))),

-- Хобби и досуг → Игры и игрушки
(62, 'LEGO Гарри Поттер', 'Набор Хогвартс, почти собран. Все детали на месте.', 1,
 (SELECT id FROM subcategories WHERE name = 'Игры и игрушки' AND category_id = (SELECT id FROM categories WHERE name = 'Хобби и досуг'))),
-- Хобби и досуг → Игры и игрушки
(63, 'LEGO Вулкан', 'Экспедиция на вулкан. Новый, в запечатанной коробке.', 2,
 (SELECT id FROM subcategories WHERE name = 'Игры и игрушки' AND category_id = (SELECT id FROM categories WHERE name = 'Хобби и досуг'))),
-- Хобби и досуг → Игры и игрушки
(64, 'Монополия — классика', 'Настольная игра, полная версия. Правила внутри, всё целое.', 3,
 (SELECT id FROM subcategories WHERE name = 'Игры и игрушки' AND category_id = (SELECT id FROM categories WHERE name = 'Хобби и досуг'))),

-- Хобби и досуг → Коллекционирование
(65, 'Монеты 1730–1754 гг.', 'Подлинные серебряные монеты времён Анны Иоанновны. С описанием и сертификатом.', 4,
 (SELECT id FROM subcategories WHERE name = 'Коллекционирование' AND category_id = (SELECT id FROM categories WHERE name = 'Хобби и досуг'))),
-- Хобби и досуг → Коллекционирование
(66, 'Монеты СССР 1991–1993', 'Редкие монеты последних лет СССР и начала РФ. В кейсе.', 5,
 (SELECT id FROM subcategories WHERE name = 'Коллекционирование' AND category_id = (SELECT id FROM categories WHERE name = 'Хобби и досуг'))),

-- Хобби и досуг → Спорт и активный отдых
(125, 'Отдам детский велосипед', 'Отдам бесплатно детский велосипед, потому что для ребенка стал маленьким.', 4,
 (SELECT id FROM subcategories WHERE name = 'Спорт и активный отдых' AND category_id = (SELECT id FROM categories WHERE name = 'Хобби и досуг'))),
-- Хобби и досуг → Спорт и активный отдых
(126, 'Обменяю на шоколадку теннисные ракетки', 'Обменяю на шоколадку теннисные ракетки. Например, на Aplen Gold.', 5,
 (SELECT id FROM subcategories WHERE name = 'Спорт и активный отдых' AND category_id = (SELECT id FROM categories WHERE name = 'Хобби и досуг'))),

-- Бизнес → Продажа бизнеса
(67, 'Автомойка — готовый бизнес', 'Работающая автомойка в спальном районе. Оборудование новое, клиентская база есть.', 6,
 (SELECT id FROM subcategories WHERE name = 'Продажа бизнеса' AND category_id = (SELECT id FROM categories WHERE name = 'Бизнес'))),
-- Бизнес → Продажа бизнеса
(68, 'Кофейня с постоянными клиентами', 'Уютная кофейня в центре. Готова к работе, всё оборудование включено.', 7,
 (SELECT id FROM subcategories WHERE name = 'Продажа бизнеса' AND category_id = (SELECT id FROM categories WHERE name = 'Бизнес'))),

-- Бизнес → Оборудование
(69, 'Станок токарный #1', 'Производственный станок, 2018 г., в рабочем состоянии.', 8,
 (SELECT id FROM subcategories WHERE name = 'Оборудование' AND category_id = (SELECT id FROM categories WHERE name = 'Бизнес'))),
-- Бизнес → Оборудование
(70, 'Токарный станок #2', 'С ЧПУ, обслужен, документы есть.', 9,
 (SELECT id FROM subcategories WHERE name = 'Оборудование' AND category_id = (SELECT id FROM categories WHERE name = 'Бизнес'))),
-- Бизнес → Оборудование
(71, 'Промышленное оборудование #3', 'Линия для расфасовки. Идеальна для малого бизнеса.', 10,
 (SELECT id FROM subcategories WHERE name = 'Оборудование' AND category_id = (SELECT id FROM categories WHERE name = 'Бизнес'))),
-- Бизнес → Оборудование
(72, 'Промышленный станок #4', 'Тяжелый станок, для металлообработки. Без поломок.', 1,
 (SELECT id FROM subcategories WHERE name = 'Оборудование' AND category_id = (SELECT id FROM categories WHERE name = 'Бизнес'))),

-- Путешествия → Туры и экскурсии
(73, 'Экскурсия на Байкал', '7-дневный тур: Листвянка, Ольхон, Хужир. Всё включено.', 2,
 (SELECT id FROM subcategories WHERE name = 'Туры и экскурсии' AND category_id = (SELECT id FROM categories WHERE name = 'Путешествия'))),
-- Путешествия → Туры и экскурсии
(74, 'Байкал — зимнее приключение', 'Ледовые пещеры, собачьи упряжки, баня на берегу. Незабываемо!', 3,
 (SELECT id FROM subcategories WHERE name = 'Туры и экскурсии' AND category_id = (SELECT id FROM categories WHERE name = 'Путешествия'))),
-- Путешествия → Туры и экскурсии
(75, 'Тур на Сахалин', '10 дней на острове: Курилы, водопады, термальные источники.', 4,
 (SELECT id FROM subcategories WHERE name = 'Туры и экскурсии' AND category_id = (SELECT id FROM categories WHERE name = 'Путешествия'))),
-- Путешествия → Туры и экскурсии
(76, 'Дальний Восток — полный тур', 'От Владивостока до Камчатки. Включая посещение вулканов и заповедников.', 5,
 (SELECT id FROM subcategories WHERE name = 'Туры и экскурсии' AND category_id = (SELECT id FROM categories WHERE name = 'Путешествия'))),

-- Путешествия → Аренда жилья в поездках
(77, 'Дом с террасой у моря', 'Уютный домик на Черноморском побережье. Есть мангал и Wi-Fi.', 6,
 (SELECT id FROM subcategories WHERE name = 'Аренда жилья в поездках' AND category_id = (SELECT id FROM categories WHERE name = 'Путешествия'))),

-- Путешествия → Билеты
(78, 'Билеты на матч ЦСКА', '2 билета на центральные места. Дата — 25 ноября 2025.', 7,
 (SELECT id FROM subcategories WHERE name = 'Билеты' AND category_id = (SELECT id FROM categories WHERE name = 'Путешествия'))),
-- Путешествия → Билеты
(79, 'Билеты ЦСКА — Вход 1', '1 билет, сектор В, ряд 10. Оригинал, электронный.', 8,
 (SELECT id FROM subcategories WHERE name = 'Билеты' AND category_id = (SELECT id FROM categories WHERE name = 'Путешествия'))),
-- Путешествия → Билеты
(80, 'Пара билетов на ЦСКА', 'Сектор А, отличный обзор. Продаю дешевле, чем на сайте.', 9,
 (SELECT id FROM subcategories WHERE name = 'Билеты' AND category_id = (SELECT id FROM categories WHERE name = 'Путешествия')));

-- Связывание оставшихся изображений
INSERT INTO ad_images (ad_id, file_path, order_index) VALUES
-- Недвижимость (аренда)
(29, 'flat_1.webp', 1),
(30, 'flat_2.webp', 1),
(31, 'flat_3.webp', 1),
(32, 'flat_4.jpg', 1),
(33, 'flat_5.webp', 1),
(34, 'flat_6.jpg', 1),
(35, 'flat_7.webp', 1),

-- Коммерческая недвижимость
(36, 'realty_commercial_1.png', 1),
(37, 'realty_commercial_2.jpg', 1),
(38, 'realty_commercial_3.webp', 1),

-- Земельные участки
(39, 'land_plots_1.jpg', 1),
(40, 'land_plots_2.webp', 1),
(41, 'land_plots_3.webp', 1),

-- Транспорт
(42, 'bike_honda_cbr.webp', 1),
(43, 'light_auto_black_mazda.jpg', 1),
(44, 'light_auto_blue_van.webp', 1),
(45, 'skuter_red.webp', 1),
(46, 'truck_mercedes-benz-actros.webp', 1),
(47, 'truck_scania.jpeg', 1),
(48, 'truck_sitrak_arenda.webp', 1),
(49, 'water_transport_hydrocycle.jpg', 1),
(50, 'water_transport_katamaran.jpg', 1),

-- Дом и интерьер
(51, 'furniture_old_sofa.jpg', 1),
(52, 'furniture_wardrobe_1.jpg', 1),
(53, 'furniture_wardrobe_2.jpg', 1),
(54, 'decor_and_textiles_pillow_christmas.png', 1),
(55, 'decor_and_textiles_pillows_1.jpg', 1),
(56, 'tableware_and_kitchen_utensils_a_set_of_dishes.avif', 1),
(57, 'tableware_and_kitchen_utensils_collection_tableware.jpeg', 1),
(58, 'tableware_and_kitchen_utensils_tea_sets.jpg', 1),
(59, 'garden_and_cottage_digging_a_well.jpg', 1),

-- Хобби
(60, 'Books_and_music_Tannenbaum_operating_systems.jpg', 1),
(61, 'Books_and_music_vinil_records_10_pieces.jpg', 1),
(62, 'games_lego_harry_potter.webp', 1),
(63, 'games_lego_volcano_exploration.webp', 1),
(64, 'games_monopoly.jpg', 1),
(65, 'collectible_coins_1730-1754.jpg', 1),
(66, 'collectible_coins_Russia_1991_1992_1993.jpg', 1),
(125, 'sport_bicycle.jpeg', 1),
(126, 'sports_tennis_rackets.webp', 1),

-- Бизнес
(67, 'buisness_car_wash_sold.webp', 1),
(68, 'buisness_coffe_sold.webp', 1),
(69, 'equipment_machine_tool_1.jpg', 1),
(70, 'equipment_machine_tool_2.webp', 1),
(71, 'equipment_machine_tool_3.webp', 1),
(72, 'equipment_machine_tool_4.jpg', 1),

-- Путешествия
(73, 'excursions_and_tours_Baikal.jpg', 1),
(74, 'excursions_and_tours_Baikal_2.jpeg', 1),
(75, 'excursions_and_tours_Sakhalin.webp', 1),
(76, 'excursions_and_tours_The_Far_East.jpg', 1),
(77, 'travel_rental_house_with_outdoor_terrace.jpg', 1),
(78, 'Tickets_for_the_CSKA_match.jpg', 1),
(79, 'Tickets_for_the_CSKA_match_1.webp', 1),
(80, 'Tickets_for_the_CSKA_match.webp', 1);

-- Вспомогательные подзапросы для ID подкатегорий
WITH subcat AS (
  SELECT s.id, s.name, c.name AS category_name
  FROM subcategories s
  JOIN categories c ON s.category_id = c.id
)

-- Объявления в категориях без изображений
INSERT INTO ads (id, title, description, user_id, subcategory_id) VALUES

-- Работа → Ищу работу
(81, 'Опытный водитель ищу подработку', 'Категории B, C, D. Стаж 12 лет. Готов к командировкам и сменному графику.', 1,
 (SELECT id FROM subcat WHERE name = 'Ищу работу' AND category_name = 'Работа')),
(82, 'Менеджер по продажам', 'Опыт 5 лет в B2B. Ищу стабильную компанию с перспективой роста.', 2,
 (SELECT id FROM subcat WHERE name = 'Ищу работу' AND category_name = 'Работа')),
(83, 'Студент ищу удалёнку', 'Готов работать сутками, быстро обучаюсь. Опыт в поддержке клиентов.', 3,
 (SELECT id FROM subcat WHERE name = 'Ищу работу' AND category_name = 'Работа')),

-- Работа → Ищу сотрудника
(84, 'Требуется программист Python', 'Офис в центре, зарплата от 150 000 ₽. Опыт от 2 лет.', 4,
 (SELECT id FROM subcat WHERE name = 'Ищу сотрудника' AND category_name = 'Работа')),
(85, 'Ищу бариста с опытом', 'Кофейня в ТЦ. З/п 70 000 ₽ + чаевые. График 2/2.', 5,
 (SELECT id FROM subcat WHERE name = 'Ищу сотрудника' AND category_name = 'Работа')),
(86, 'Нужен грузчик на склад', 'Погрузка/разгрузка. Оплата ежедневно. Без опыта — обучим.', 6,
 (SELECT id FROM subcat WHERE name = 'Ищу сотрудника' AND category_name = 'Работа')),

-- Работа → Фриланс и подработка
(87, 'Напишу текст для сайта', 'Копирайтер с 7-летним стажем. Информационные, продающие, SEO-тексты.', 7,
 (SELECT id FROM subcat WHERE name = 'Фриланс и подработка' AND category_name = 'Работа')),
(88, 'Сделаю 3D-модель', 'Blender, Maya — любой формат. Быстро и недорого.', 8,
 (SELECT id FROM subcat WHERE name = 'Фриланс и подработка' AND category_name = 'Работа')),
(89, 'Перевод с английского', 'Носитель языка, диплом лингвиста. Технические и художественные тексты.', 9,
 (SELECT id FROM subcat WHERE name = 'Фриланс и подработка' AND category_name = 'Работа')),

-- Работа → Волонтёрство
(90, 'Ищу волонтёров в приют', 'Помощь в кормлении и уборке. Можно по выходным.', 10,
 (SELECT id FROM subcat WHERE name = 'Волонтёрство' AND category_name = 'Работа')),
(91, 'Организация фестиваля — нужны помощники', '25–27 ноября. Питание и сувениры обеспечены.', 1,
 (SELECT id FROM subcat WHERE name = 'Волонтёрство' AND category_name = 'Работа')),

-- Работа → Другое
(92, 'Репетитор по математике', 'Подготовка к ЕГЭ. Стоимость 800 ₽/час. Онлайн или у вас.', 2,
 (SELECT id FROM subcat WHERE name = 'Другое' AND category_name = 'Работа')),
(93, 'Помогу с резюме', 'HR с 10-летним стажем. Гарантирую прохождение в 90% компаний.', 3,
 (SELECT id FROM subcat WHERE name = 'Другое' AND category_name = 'Работа')),

-- Услуги → Ремонт и строительство
(94, 'Ремонт под ключ', 'От черновой отделки до мебели. Гарантия 2 года.', 4,
 (SELECT id FROM subcat WHERE name = 'Ремонт и строительство' AND category_name = 'Услуги')),
(95, 'Поклею обои качественно', 'Без пузырей и стыков. Цена — от 300 ₽/м².', 5,
 (SELECT id FROM subcat WHERE name = 'Ремонт и строительство' AND category_name = 'Услуги')),
(96, 'Установка сантехники', 'Смесители, душ, унитаз — всё сделаю за один визит.', 6,
 (SELECT id FROM subcat WHERE name = 'Ремонт и строительство' AND category_name = 'Услуги')),

-- Услуги → Красота и здоровье
(97, 'Парикмахер на выезд', 'Стрижка, укладка, окрашивание. Приезжаю с оборудованием.', 7,
 (SELECT id FROM subcat WHERE name = 'Красота и здоровье' AND category_name = 'Услуги')),
(98, 'Массаж спины и шеи', 'Снятие напряжения, расслабление. 1 час — 1500 ₽.', 8,
 (SELECT id FROM subcat WHERE name = 'Красота и здоровье' AND category_name = 'Услуги')),
(99, 'Наращивание ресниц', '2D–6D, натуральный вид. Длительность — до 4 недель.', 9,
 (SELECT id FROM subcat WHERE name = 'Красота и здоровье' AND category_name = 'Услуги')),

-- Услуги → Бытовые услуги
(100, 'Выгул собак', '3 раза в день, фотоотчёт. От 500 ₽/день.', 10,
 (SELECT id FROM subcat WHERE name = 'Бытовые услуги' AND category_name = 'Услуги')),
(101, 'Уборка квартир', 'Генеральная/после ремонта. Моющие средства мои.', 1,
 (SELECT id FROM subcat WHERE name = 'Бытовые услуги' AND category_name = 'Услуги')),
(102, 'Помощь по дому', 'Закупка продуктов, стирка, приготовление еды. Для пожилых.', 2,
 (SELECT id FROM subcat WHERE name = 'Бытовые услуги' AND category_name = 'Услуги')),

-- Услуги → Перевозки и логистика
(103, 'Грузоперевозки по РФ', 'Газель, 1.5 т. От 1500 ₽/100 км.', 3,
 (SELECT id FROM subcat WHERE name = 'Перевозки и логистика' AND category_name = 'Услуги')),
(104, 'Перевезу мебель', 'Сборка/разборка включены. Аккуратно и быстро.', 4,
 (SELECT id FROM subcat WHERE name = 'Перевозки и логистика' AND category_name = 'Услуги')),

-- Услуги → Другое
(105, 'Организация праздников', 'День рождения, корпоратив — всё под ключ.', 5,
 (SELECT id FROM subcat WHERE name = 'Другое' AND category_name = 'Услуги')),
(106, 'Фотосъёмка событий', 'Опыт 6 лет. Обработка в подарок.', 6,
 (SELECT id FROM subcat WHERE name = 'Другое' AND category_name = 'Услуги')),

-- Бизнес → Бухгалтерия и юриспруденция
(107, 'Ведение бухгалтерии ИП', 'От 3000 ₽/месяц. Все отчёты вовремя.', 7,
 (SELECT id FROM subcat WHERE name = 'Бухгалтерия и юриспруденция' AND category_name = 'Бизнес')),
(108, 'Регистрация ООО под ключ', 'От 5000 ₽. Всё онлайн, без вашего участия.', 8,
 (SELECT id FROM subcat WHERE name = 'Бухгалтерия и юриспруденция' AND category_name = 'Бизнес')),
(109, 'Юридические консультации', 'По договорам, трудовым спорам, банкротству.', 9,
 (SELECT id FROM subcat WHERE name = 'Бухгалтерия и юриспруденция' AND category_name = 'Бизнес')),

-- Бизнес → Реклама и маркетинг
(110, 'Продвижение в Instagram', 'От 8000 ₽/месяц. Рост подписчиков и продаж.', 10,
 (SELECT id FROM subcat WHERE name = 'Реклама и маркетинг' AND category_name = 'Бизнес')),
(111, 'Таргетированная реклама', 'Настройка под ваш бюджет. Пробный запуск — бесплатно.', 1,
 (SELECT id FROM subcat WHERE name = 'Реклама и маркетинг' AND category_name = 'Бизнес')),
(112, 'Дизайн логотипа', 'Создам узнаваемый логотип за 3 дня. От 2000 ₽.', 2,
 (SELECT id FROM subcat WHERE name = 'Реклама и маркетинг' AND category_name = 'Бизнес')),

-- Бизнес → Другое
(113, 'Поставка кофе для офиса', 'Зерно/молотый, разная крепость. Доставка каждую неделю.', 3,
 (SELECT id FROM subcat WHERE name = 'Другое' AND category_name = 'Бизнес')),

-- Путешествия → Трансфер и транспорт
(114, 'Трансфер из аэропорта', 'Volkswagen Multivan, до 7 пассажиров. От 1500 ₽.', 4,
 (SELECT id FROM subcat WHERE name = 'Трансфер и транспорт' AND category_name = 'Путешествия')),
(115, 'Аренда авто с водителем', 'Мерседес E-Class. Идеален для деловых встреч.', 5,
 (SELECT id FROM subcat WHERE name = 'Трансфер и транспорт' AND category_name = 'Путешествия')),

-- Путешествия → Другое
(116, 'Экскурсия по Москве', 'Индивидуальный маршрут. История, архитектура, легенды.', 6,
 (SELECT id FROM subcat WHERE name = 'Другое' AND category_name = 'Путешествия')),

-- Прочее → Без категории
(117, 'Найдена собака', 'Немецкая овчарка, без ошейника. Ищем хозяев!', 7,
 (SELECT id FROM subcat WHERE name = 'Без категории' AND category_name = 'Прочее')),
(118, 'Отдам в хорошие руки книги', 'Классика русской литературы. Всё в отличном состоянии.', 8,
 (SELECT id FROM subcat WHERE name = 'Без категории' AND category_name = 'Прочее')),

-- Прочее → Подарки и сувениры
(119, 'Новогодние подарки оптом', 'Корпоративные наборы от 500 ₽. Доставка по РФ.', 9,
 (SELECT id FROM subcat WHERE name = 'Подарки и сувениры' AND category_name = 'Прочее')),

-- Прочее → Антиквариат и раритеты
(120, 'Старинные часы XIX века', 'Механические, в рабочем состоянии. С сертификатом.', 10,
 (SELECT id FROM subcat WHERE name = 'Антиквариат и раритеты' AND category_name = 'Прочее')),

-- Прочее → Благотворительность
(121, 'Собираем вещи для приюта', 'Одежда, обувь, игрушки. Заберу сам.', 1,
 (SELECT id FROM subcat WHERE name = 'Благотворительность' AND category_name = 'Прочее')),

-- Прочее → Другое
(122, 'Помогу с переездом', 'Упаковка, перевозка, расстановка. Недорого.', 2,
 (SELECT id FROM subcat WHERE name = 'Другое' AND category_name = 'Прочее'));

 -- обновляет sequence для ads: следующий nextval будет MAX(id)+1
SELECT setval(pg_get_serial_sequence('ads', 'id'), (SELECT COALESCE(MAX(id), 0) FROM ads), true);

-- при желании проделать для других таблиц тоже:
SELECT setval(pg_get_serial_sequence('ad_images', 'id'), (SELECT COALESCE(MAX(id), 0) FROM ad_images), true);
SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT COALESCE(MAX(id), 0) FROM users), true);