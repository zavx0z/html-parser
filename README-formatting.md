# Система форматирования HTML парсера

## 🎯 Назначение

Автоматическое форматирование выражений и текста в HTML шаблонах для улучшения читаемости и производительности.

## ✨ Возможности

### 🔧 Форматирование тернарных выражений

- Удаляет лишние пробелы и переносы строк
- Сохраняет строковые литералы нетронутыми
- Делает выражения более компактными

### 📝 Форматирование текста по стандартам HTML

- Схлопывает последовательные пробельные символы
- Удаляет пробелы в начале и конце
- Сохраняет важные пробелы между переменными

## 🚀 Быстрый старт

```typescript
import { extractMainHtmlBlock, extractHtmlElements } from "./splitter"
import { elementsHierarchy } from "./hierarchy"
import { enrichHierarchyWithData } from "./data"

const mainHtml = extractMainHtmlBlock<any, { flag: boolean }>(
  ({ html, context }) => html`
    <div>
      <span class="${context.flag ? "active" : "inactive"}"> Status: ${context.flag ? "Active" : "Inactive"} </span>
    </div>
  `
)

const elements = extractHtmlElements(mainHtml)
const hierarchy = elementsHierarchy(mainHtml, elements)
const data = enrichHierarchyWithData(hierarchy)

// Форматирование применено автоматически! 🎉
```

## 📊 Примеры

### До форматирования:

```html
<div>Hello World</div>
<span class="${context.flag ? "active" : "inactive"}">
```

### После форматирования:

```html
<div>Hello World</div>
<span class="${0} ? "active" : "inactive"">
```

## 🧪 Тестирование

```bash
# Запуск тестов форматирования
bun test tests/formatting.test.ts
bun test tests/text-formatting.test.ts

# Запуск всех тестов
bun test
```

## 📚 Документация

- [Подробная документация](data.md#форматирование-выражений-и-текста)
- [Полное описание системы](data.md)

## 🔧 Технические детали

### Основные функции:

- `createUnifiedExpression()` - форматирование тернарных выражений
- `formatTextByHtmlStandards()` - форматирование по стандартам HTML
- `formatStaticText()` - умное форматирование статического текста

### Интеграция:

- Автоматически применяется в процессе парсинга
- Не требует дополнительной настройки
- Обратная совместимость

## ✅ Преимущества

- **Читаемость** - чистые и компактные выражения
- **Производительность** - меньше символов для обработки
- **Стандартность** - соответствие стандартам HTML
- **Совместимость** - сохранение важных пробелов и строк

## 🔮 Будущие улучшения

- Настройка уровня форматирования
- Поддержка CSS-подобного форматирования
- Форматирование атрибутов
- Пользовательские правила форматирования
