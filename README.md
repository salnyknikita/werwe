# Film Rating Service — React + Node.js + PostgreSQL (Prisma) + JWT + SCSS

Повноцінний MVP сервісу оцінювання фільмів: список фільмів із TMDb/OMDb, реєстрація/логін, лайки/дизлайки, коментарі, мінімальна аналітика та логування.

## Швидкий старт (локально)

### Передумови
- Node.js v18+
- PostgreSQL (локально або у Docker)
- TMDb або OMDb API ключ (рекомендовано TMDb).

### 1) Клон/розпакуй проєкт і встанови залежності
```bash
cd server
npm install
cd ../client
npm install
```

### 2) Налаштуй змінні середовища
Створи файл `server/.env`, використовуючи `server/.env.example` як шаблон. Приклад:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/films?schema=public"
JWT_SECRET="dev_secret_change_me"
TMDB_API_KEY="YOUR_TMDB_KEY"
PORT=4000
CORS_ORIGIN="http://localhost:5173"
```

### 3) Ініціалізація БД
```bash
cd server
npx prisma migrate dev --name init
npx prisma db seed
```

### 4) Запуск сервера
```bash
npm run dev
```
Сервер стартує на `http://localhost:4000` і виведе повідомлення про доступність API.

### 5) Запуск клієнта
```bash
cd ../client
npm run dev
```
Відкрий `http://localhost:5173` у браузері.

---

## Як працює логіка

- **Імпорт фільмів**: бекенд вміє підтягувати популярні фільми з TMDb (`/api/movies/refresh`). У локальній БД зберігаються: `externalId`, `title`, `poster`, `description`.
- **Аутентифікація**: `/api/auth/register`, `/api/auth/login` (bcrypt + JWT). Токен зберігається на клієнті у `localStorage`.
- **Взаємодія**: `/api/movies/:id/reactions` (лайк/дизлайк, заборона множинних реакцій), `/api/movies/:id/comments` (CRUD коментарів). 
- **Аналітика**: бекенд повертає підрахунки лайків/дизлайків/коментарів для кожного фільму; на клієнті вони відображаються на сторінці фільму.
- **Логування**: запити/події логуються через `morgan` (HTTP) та `winston` (події рівнів INFO/ERROR).
- **Захист маршрутів**: приватні ендпоінти потребують `Authorization: Bearer <token>`.

## Перелік основних функцій
- Реєстрація/логін (JWT)
- Відображення фільмів (список, деталі)
- Лайк/дизлайк із урахуванням одного голосу на користувача
- Додавання/редагування/видалення власних коментарів
- Підрахунок лайків/дизлайків/коментарів
- SCSS і адаптивний UI (React + Vite)

---

## Структура репозиторію
```
film-rating-app/
├─ server/            # Node.js + Express + Prisma
│  ├─ prisma/         # Prisma schema та міграції
│  ├─ src/
│  │  ├─ config/      # logger, prisma
│  │  ├─ middlewares/ # auth, error
│  │  ├─ routes/      # auth, movies, comments, reactions
│  │  ├─ controllers/ # логіка маршрутів
│  │  ├─ services/    # бізнес-логіка
│  │  └─ utils/       # допоміжні ф-ції
│  └─ ...
└─ client/            # React + Vite + SCSS
   ├─ src/
   │  ├─ components/
   │  ├─ pages/
   │  ├─ context/
   │  ├─ api/
   │  └─ styles/
   └─ ...
```

## Ліцензія
MIT
