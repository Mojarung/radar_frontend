# Быстрый старт

## 1. Установка

```bash
npm install
```

## 2. Настройка API

Создайте `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 3. Запуск

```bash
npm run dev
```

Откройте: http://localhost:3000

## 4. Запуск бэкенда (отдельное окно терминала)

```bash
cd ../mojarung_radar
uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload
```

---

**Готово!** Теперь можно использовать MOJARUNG RADAR.

