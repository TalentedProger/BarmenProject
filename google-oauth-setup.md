# Настройка Google OAuth для Cocktailo

## Проблема
Получаем ошибку 403 при попытке входа через Google, потому что redirect URI не настроен правильно.

## Решение

### 1. Откройте Google Cloud Console
Перейдите на https://console.cloud.google.com

### 2. Найдите ваш OAuth проект
- В левом меню выберите "APIs & Services" > "Credentials"
- Найдите ваш OAuth 2.0 Client ID

### 3. Обновите Authorized redirect URIs
Добавьте следующий URL в список разрешенных redirect URIs:

```
https://0b89bf4b-cd9f-4d8f-9a58-4c413bfbca91-00-295zsrj7l0xlp.janeway.replit.dev/api/auth/google/callback
```

### 4. Сохраните изменения
После добавления URL-а нажмите "Save"

### 5. Подождите несколько минут
Google может потребоваться до 5-10 минут для применения изменений.

## Текущий статус
- ✅ Google OAuth ключи настроены
- ✅ Сервер работает на порту 5000  
- ✅ Callback URL обновлен в коде
- ⏳ Нужно обновить redirect URI в Google Console

После выполнения этих шагов аутентификация должна работать корректно.