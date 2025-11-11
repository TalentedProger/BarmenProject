# Настройка Google OAuth для Cocktailo Maker

## Пошаговая инструкция

### Шаг 1: Создание проекта в Google Cloud Console

1. **Перейти в Google Cloud Console**:
   - Открыть [console.cloud.google.com](https://console.cloud.google.com)
   - Войти в аккаунт Google

2. **Создать новый проект**:
   - Нажать на выпадающий список проектов (вверху слева)
   - Нажать "New Project"
   - Название проекта: `Cocktailo Maker`
   - Нажать "Create"

### Шаг 2: Включение Google+ API

1. **Перейти в API & Services**:
   - В боковом меню выбрать "APIs & Services" → "Library"

2. **Найти и включить Google+ API**:
   - В поиске ввести "Google+ API"
   - Выбрать "Google+ API"
   - Нажать "Enable"

### Шаг 3: Настройка OAuth consent screen

1. **Перейти в OAuth consent screen**:
   - В боковом меню "APIs & Services" → "OAuth consent screen"

2. **Выбрать User Type**:
   - Выбрать "External" (для публичного приложения)
   - Нажать "Create"

3. **Заполнить обязательные поля**:
   - **App name**: `Cocktailo Maker`
   - **User support email**: ваш email
   - **Developer contact information**: ваш email
   - Нажать "Save and Continue"

4. **Scopes** (оставить по умолчанию):
   - Нажать "Save and Continue"

5. **Test users** (можно пропустить):
   - Нажать "Save and Continue"

### Шаг 4: Создание OAuth 2.0 Client ID

1. **Перейти в Credentials**:
   - В боковом меню "APIs & Services" → "Credentials"

2. **Создать credentials**:
   - Нажать "+ Create Credentials"
   - Выбрать "OAuth 2.0 Client IDs"

3. **Настроить Application type**:
   - **Application type**: Web application
   - **Name**: `Cocktailo Maker Web Client`

4. **Настроить Authorized JavaScript origins**:
   ```
   http://localhost:3000
   http://127.0.0.1:3000
   ```

5. **Настроить Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/google/callback
   http://127.0.0.1:3000/api/auth/google/callback
   ```

6. **Создать**:
   - Нажать "Create"
   - Скопировать **Client ID** и **Client Secret**

### Шаг 5: Настройка в проекте

1. **Обновить .env файл**:
   ```bash
   # Добавить в .env
   GOOGLE_CLIENT_ID=ваш_client_id_здесь
   GOOGLE_CLIENT_SECRET=ваш_client_secret_здесь
   ```

2. **Пример .env**:
   ```bash
   # База данных
   DATABASE_URL=sqlite://./dev.db
   
   # Сервер
   PORT=3000
   NODE_ENV=development
   
   # Сессии
   SESSION_SECRET=cocktailo-maker-secret-key-2024
   
   # Google OAuth
   GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
   ```

### Шаг 6: Тестирование

1. **Перезапустить сервер**:
   ```bash
   npm run dev
   ```

2. **Проверить логи**:
   - Должно исчезнуть сообщение "Google OAuth credentials not provided"
   - Должно появиться сообщение о настройке Google OAuth

3. **Протестировать в браузере**:
   - Открыть `http://localhost:3000/api/auth/google`
   - Должен произойти редирект на Google для авторизации

### Шаг 7: Для production (Replit/Vercel/Netlify)

Когда будете деплоить на production, нужно обновить redirect URIs:

1. **Для Replit**:
   ```
   https://your-repl-name.your-username.repl.co/api/auth/google/callback
   ```

2. **Для Vercel**:
   ```
   https://your-app-name.vercel.app/api/auth/google/callback
   ```

3. **Для Netlify**:
   ```
   https://your-app-name.netlify.app/api/auth/google/callback
   ```

## Безопасность

### Важные моменты:

1. **Никогда не коммитить .env файл** в Git
2. **Использовать переменные окружения** на production
3. **Ограничить домены** в Google Console для production
4. **Регулярно ротировать** Client Secret

### Настройка переменных окружения на хостингах:

#### Replit:
- Secrets → Add new secret
- Добавить `GOOGLE_CLIENT_ID` и `GOOGLE_CLIENT_SECRET`

#### Vercel:
- Project Settings → Environment Variables
- Добавить переменные для Production, Preview, Development

#### Netlify:
- Site Settings → Environment Variables
- Добавить переменные

## Отладка проблем

### Проблема: "redirect_uri_mismatch"
**Решение**: Проверить, что redirect URI в Google Console точно совпадает с используемым в приложении

### Проблема: "invalid_client"
**Решение**: Проверить правильность Client ID и Client Secret

### Проблема: "access_denied"
**Решение**: Пользователь отклонил авторизацию или приложение не одобрено

### Проблема: Не работает на localhost
**Решение**: Убедиться, что в Authorized origins добавлен `http://localhost:3000`

## Альтернативы Google OAuth

Если Google OAuth сложно настроить, можно использовать:

1. **GitHub OAuth** - проще в настройке
2. **Discord OAuth** - популярно среди разработчиков
3. **Только email/password** - уже работает в проекте

### Настройка GitHub OAuth (альтернатива):

1. GitHub → Settings → Developer settings → OAuth Apps
2. New OAuth App:
   - Application name: `Cocktailo Maker`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/github/callback`
3. Получить Client ID и Client Secret
4. Добавить стратегию в `auth.ts`:

```typescript
import { Strategy as GitHubStrategy } from 'passport-github2';

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "/api/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
  // Аналогично Google OAuth
}));
```

## Заключение

После настройки Google OAuth пользователи смогут:
- Входить через Google аккаунт
- Автоматически создавать профиль
- Синхронизировать данные между устройствами
- Использовать аватар из Google аккаунта
