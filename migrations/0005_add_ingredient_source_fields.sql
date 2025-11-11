-- Добавление полей для источника ингредиентов
ALTER TABLE ingredients 
ADD COLUMN source_url VARCHAR(500),
ADD COLUMN source_name VARCHAR(100),
ADD COLUMN source_icon VARCHAR(500),
ADD COLUMN volume INTEGER;

-- Комментарии к полям
COMMENT ON COLUMN ingredients.source_url IS 'URL товара на сайте источника';
COMMENT ON COLUMN ingredients.source_name IS 'Название магазина/источника';
COMMENT ON COLUMN ingredients.source_icon IS 'URL иконки магазина';
COMMENT ON COLUMN ingredients.volume IS 'Объем упаковки в мл';
