-- Безопасное откатывание seed-данных:
-- Скрипт проверяет существование таблиц и таблицы зависимостей (ads).
-- Если таблица ads всё ещё существует, удаление subcategories пропускается
-- чтобы не нарушить ограничение внешнего ключа.
DO $$
BEGIN
	-- Удаляем подкатегории только если таблица subcategories существует
	-- и если таблица ads уже удалена (чтобы не нарушить FK RESTRICT).
	IF to_regclass('public.subcategories') IS NOT NULL THEN
		IF to_regclass('public.ads') IS NULL THEN
			DELETE FROM subcategories;
		ELSE
			RAISE NOTICE 'Skipping DELETE FROM subcategories because table ''ads'' still exists.';
		END IF;
	ELSE
		RAISE NOTICE 'Table ''subcategories'' does not exist, skipping.';
	END IF;

	-- Удаляем категории только если таблица categories существует
	-- и если нет подкатегорий (чтобы не нарушить целостность).
	IF to_regclass('public.categories') IS NOT NULL THEN
		IF to_regclass('public.subcategories') IS NULL THEN
			DELETE FROM categories;
		ELSE
			RAISE NOTICE 'Skipping DELETE FROM categories because table ''subcategories'' still exists.';
		END IF;
	ELSE
		RAISE NOTICE 'Table ''categories'' does not exist, skipping.';
	END IF;

	-- Сброс последовательностей, если они существуют
	IF to_regclass('public.categories_id_seq') IS NOT NULL THEN
		ALTER SEQUENCE categories_id_seq RESTART WITH 1;
	END IF;
	IF to_regclass('public.subcategories_id_seq') IS NOT NULL THEN
		ALTER SEQUENCE subcategories_id_seq RESTART WITH 1;
	END IF;
END
$$;