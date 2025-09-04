import { describe, it, expect } from "bun:test"
import { parseAttributes } from "../../attributes"

describe("boolean", () => {
  describe("простые булевые атрибуты", () => {
    it("атрибут без значения", () => {
      const attrs = parseAttributes("disabled")
      expect(attrs).toEqual({
        boolean: {
          disabled: {
            type: "static",
            value: true,
          },
        },
      })
    })

    it("атрибут со значением true", () => {
      const attrs = parseAttributes("disabled=true")
      expect(attrs).toEqual({
        boolean: {
          disabled: {
            type: "static",
            value: true,
          },
        },
      })
    })
    it("атрибуты через дефис", () => {
      const attrs = parseAttributes("data-required aria-hidden")
      expect(attrs).toEqual({
        boolean: {
          "data-required": {
            type: "static",
            value: true,
          },
          "aria-hidden": {
            type: "static",
            value: true,
          },
        },
      })
    })

    it("атрибут со значением false", () => {
      const attrs = parseAttributes("disabled=false")
      expect(attrs).toEqual({
        boolean: {
          disabled: {
            type: "static",
            value: false,
          },
        },
      })
    })
  })

  describe("динамические булевые атрибуты", () => {
    it("простое условие", () => {
      const attrs = parseAttributes("disabled=${context.disabled}")
      expect(attrs).toEqual({
        boolean: {
          disabled: { type: "dynamic", value: "context.disabled" },
        },
      })
    })

    it("условие с оператором И", () => {
      const attrs = parseAttributes("disabled=${context.disabled && context.loading}")
      expect(attrs).toEqual({
        boolean: {
          disabled: { type: "dynamic", value: "context.disabled && context.loading" },
        },
      })
    })

    it("условие с оператором ИЛИ", () => {
      const attrs = parseAttributes("disabled=${context.disabled || context.error}")
      expect(attrs).toEqual({
        boolean: {
          disabled: { type: "dynamic", value: "context.disabled || context.error" },
        },
      })
    })

    it("условие с оператором НЕ", () => {
      const attrs = parseAttributes("disabled=${!context.enabled}")
      expect(attrs).toEqual({
        boolean: {
          disabled: { type: "dynamic", value: "!context.enabled" },
        },
      })
    })
  })

  describe("операторы сравнения", () => {
    it("оператор равенства", () => {
      const attrs = parseAttributes('disabled=${context.status === "loading"}')
      expect(attrs).toEqual({
        boolean: {
          disabled: { type: "dynamic", value: 'context.status === "loading"' },
        },
      })
    })

    it("оператор неравенства", () => {
      const attrs = parseAttributes('disabled=${context.status !== "ready"}')
      expect(attrs).toEqual({
        boolean: {
          disabled: { type: "dynamic", value: 'context.status !== "ready"' },
        },
      })
    })

    it("оператор больше", () => {
      const attrs = parseAttributes("disabled=${context.count > 5}")
      expect(attrs).toEqual({
        boolean: {
          disabled: { type: "dynamic", value: "context.count > 5" },
        },
      })
    })

    it("оператор больше или равно", () => {
      const attrs = parseAttributes("disabled=${context.count >= 10}")
      expect(attrs).toEqual({
        boolean: {
          disabled: { type: "dynamic", value: "context.count >= 10" },
        },
      })
    })
  })

  describe("тернарные операторы", () => {
    it("простой тернарный оператор", () => {
      const attrs = parseAttributes("disabled=${context.disabled ? true : false}")
      expect(attrs).toEqual({
        boolean: {
          disabled: { type: "dynamic", value: "context.disabled ? true : false" },
        },
      })
    })

    it("тернарный оператор с условием", () => {
      const attrs = parseAttributes("disabled=${context.count > 5 ? true : false}")
      expect(attrs).toEqual({
        boolean: {
          disabled: { type: "dynamic", value: "context.count > 5 ? true : false" },
        },
      })
    })
  })

  describe("различные булевые атрибуты", () => {
    it("атрибут checked", () => {
      const attrs = parseAttributes("checked=${context.checked}")
      expect(attrs).toEqual({
        boolean: {
          checked: { type: "dynamic", value: "context.checked" },
        },
      })
    })

    it("атрибут readonly", () => {
      const attrs = parseAttributes("readonly=${context.readonly}")
      expect(attrs).toEqual({
        boolean: {
          readonly: { type: "dynamic", value: "context.readonly" },
        },
      })
    })

    it("атрибут required", () => {
      const attrs = parseAttributes("required=${context.required}")
      expect(attrs).toEqual({
        boolean: {
          required: { type: "dynamic", value: "context.required" },
        },
      })
    })
  })

  describe("сложные выражения", () => {
    it("выражение с методами", () => {
      const attrs = parseAttributes("disabled=${context.items.length > 0}")
      expect(attrs).toEqual({
        boolean: {
          disabled: { type: "dynamic", value: "context.items.length > 0" },
        },
      })
    })

    it("выражение с вложенными свойствами", () => {
      const attrs = parseAttributes("disabled=${context.user.permissions.canEdit}")
      expect(attrs).toEqual({
        boolean: {
          disabled: { type: "dynamic", value: "context.user.permissions.canEdit" },
        },
      })
    })
  })

  describe("множественные булевые атрибуты", () => {
    it("несколько булевых атрибутов", () => {
      const attrs = parseAttributes(
        "disabled=${context.disabled} readonly=${context.readonly} required=${context.required}"
      )
      expect(attrs).toEqual({
        boolean: {
          disabled: { type: "dynamic", value: "context.disabled" },
          readonly: { type: "dynamic", value: "context.readonly" },
          required: { type: "dynamic", value: "context.required" },
        },
      })
    })

    it("смешанные статические и динамические булевые атрибуты", () => {
      const attrs = parseAttributes("disabled=${context.disabled} readonly required")
      expect(attrs).toEqual({
        boolean: {
          readonly: { type: "static", value: true },
          required: { type: "static", value: true },
          disabled: { type: "dynamic", value: "context.disabled" },
        },
      })
    })
  })

  describe("кастомные булевые атрибуты (data-*)", () => {
    it("простой data-атрибут без значения", () => {
      const attrs = parseAttributes("data-test")
      expect(attrs).toEqual({
        boolean: {
          "data-test": { type: "static", value: true },
        },
      })
    })

    it("data-атрибут со значением true", () => {
      const attrs = parseAttributes("data-test=true")
      expect(attrs).toEqual({
        boolean: {
          "data-test": { type: "static", value: true },
        },
      })
    })

    it("data-атрибут со значением false", () => {
      const attrs = parseAttributes("data-test=false")
      expect(attrs).toEqual({
        boolean: {
          "data-test": { type: "static", value: false },
        },
      })
    })

    it("data-атрибут с динамическим значением", () => {
      const attrs = parseAttributes("data-test=${context.isTest}")
      expect(attrs).toEqual({
        boolean: {
          "data-test": { type: "dynamic", value: "context.isTest" },
        },
      })
    })

    it("data-атрибут с тернарным оператором", () => {
      const attrs = parseAttributes("data-test=${context.isTest ? true : false}")
      expect(attrs).toEqual({
        boolean: {
          "data-test": { type: "dynamic", value: "context.isTest ? true : false" },
        },
      })
    })

    it("data-атрибут с оператором сравнения", () => {
      const attrs = parseAttributes("data-test=${context.count > 5}")
      expect(attrs).toEqual({
        boolean: {
          "data-test": { type: "dynamic", value: "context.count > 5" },
        },
      })
    })

    it("несколько data-атрибутов", () => {
      const attrs = parseAttributes("data-test data-debug=${context.debug} data-verbose=false")
      expect(attrs).toEqual({
        boolean: {
          "data-test": { type: "static", value: true },
          "data-debug": { type: "dynamic", value: "context.debug" },
          "data-verbose": { type: "static", value: false },
        },
      })
    })

    it("смешанные стандартные и data-атрибуты", () => {
      const attrs = parseAttributes("disabled data-test=${context.isTest} readonly")
      expect(attrs).toEqual({
        boolean: {
          disabled: { type: "static", value: true },
          "data-test": { type: "dynamic", value: "context.isTest" },
          readonly: { type: "static", value: true },
        },
      })
    })
  })

  describe("кастомные булевые атрибуты (одно слово)", () => {
    it("простой кастомный атрибут без значения", () => {
      const attrs = parseAttributes("custom")
      expect(attrs).toEqual({
        boolean: {
          custom: { type: "static", value: true },
        },
      })
    })

    it("кастомный атрибут со значением true", () => {
      const attrs = parseAttributes("custom=true")
      expect(attrs).toEqual({
        boolean: {
          custom: { type: "static", value: true },
        },
      })
    })

    it("кастомный атрибут со значением false", () => {
      const attrs = parseAttributes("custom=false")
      expect(attrs).toEqual({
        boolean: {
          custom: { type: "static", value: false },
        },
      })
    })

    it("кастомный атрибут с динамическим значением", () => {
      const attrs = parseAttributes("custom=${context.isCustom}")
      expect(attrs).toEqual({
        boolean: {
          custom: { type: "dynamic", value: "context.isCustom" },
        },
      })
    })

    it("кастомный атрибут с тернарным оператором", () => {
      const attrs = parseAttributes("custom=${context.isCustom ? true : false}")
      expect(attrs).toEqual({
        boolean: {
          custom: { type: "dynamic", value: "context.isCustom ? true : false" },
        },
      })
    })

    it("кастомный атрибут с оператором сравнения", () => {
      const attrs = parseAttributes("custom=${context.count > 5}")
      expect(attrs).toEqual({
        boolean: {
          custom: { type: "dynamic", value: "context.count > 5" },
        },
      })
    })

    it("несколько кастомных атрибутов", () => {
      const attrs = parseAttributes("custom debug=${context.debug} verbose=false")
      expect(attrs).toEqual({
        boolean: {
          custom: { type: "static", value: true },
          debug: { type: "dynamic", value: "context.debug" },
          verbose: { type: "static", value: false },
        },
      })
    })

    it("смешанные стандартные, data- и кастомные атрибуты", () => {
      const attrs = parseAttributes("disabled data-test=${context.isTest} custom readonly")
      expect(attrs).toEqual({
        boolean: {
          disabled: { type: "static", value: true },
          "data-test": { type: "dynamic", value: "context.isTest" },
          custom: { type: "static", value: true },
          readonly: { type: "static", value: true },
        },
      })
    })
  })

  describe("булевые атрибуты в фигурных скобках", () => {
    it("простое условие", () => {
      const attrs = parseAttributes("${context.disabled && 'disabled'}")
      expect(attrs).toEqual({
        boolean: {
          disabled: { type: "dynamic", value: "context.disabled" },
        },
      })
    })

    it("условие с оператором И", () => {
      const attrs = parseAttributes("${context.disabled && context.loading && 'disabled'}")
      expect(attrs).toEqual({
        boolean: {
          disabled: { type: "dynamic", value: "context.disabled && context.loading" },
        },
      })
    })

    it("условие с оператором ИЛИ", () => {
      const attrs = parseAttributes("${context.disabled || context.error && 'disabled'}")
      expect(attrs).toEqual({
        boolean: {
          disabled: { type: "dynamic", value: "context.disabled || context.error" },
        },
      })
    })

    it("условие с оператором НЕ", () => {
      const attrs = parseAttributes("${!context.enabled && 'disabled'}")
      expect(attrs).toEqual({
        boolean: {
          disabled: { type: "dynamic", value: "!context.enabled" },
        },
      })
    })

    it("оператор равенства", () => {
      const attrs = parseAttributes('${context.status === "loading" && "disabled"}')
      expect(attrs).toEqual({
        boolean: {
          disabled: { type: "dynamic", value: 'context.status === "loading"' },
        },
      })
    })

    it("оператор неравенства", () => {
      const attrs = parseAttributes('${context.status !== "ready" && "disabled"}')
      expect(attrs).toEqual({
        boolean: {
          disabled: { type: "dynamic", value: 'context.status !== "ready"' },
        },
      })
    })

    it("оператор больше", () => {
      const attrs = parseAttributes('${context.count > 5 && "disabled"}')
      expect(attrs).toEqual({
        boolean: {
          disabled: { type: "dynamic", value: "context.count > 5" },
        },
      })
    })

    it("оператор больше или равно", () => {
      const attrs = parseAttributes('${context.count >= 10 && "disabled"}')
      expect(attrs).toEqual({
        boolean: {
          disabled: { type: "dynamic", value: "context.count >= 10" },
        },
      })
    })

    it("тернарный оператор", () => {
      const attrs = parseAttributes('${context.disabled ? true : false && "disabled"}')
      expect(attrs).toEqual({
        boolean: {
          disabled: { type: "dynamic", value: "context.disabled ? true : false" },
        },
      })
    })

    it("несколько атрибутов в фигурных скобках", () => {
      const attrs = parseAttributes("${context.disabled && 'disabled'} ${context.value > 10 && 'enabled'}")
      expect(attrs).toEqual({
        boolean: {
          disabled: { type: "dynamic", value: "context.disabled" },
          enabled: { type: "dynamic", value: "context.value > 10" },
        },
      })
    })

    it("кастомные атрибуты в фигурных скобках", () => {
      const attrs = parseAttributes("${context.isCustom && 'custom'} ${context.debug && 'debug'}")
      expect(attrs).toEqual({
        boolean: {
          custom: { type: "dynamic", value: "context.isCustom" },
          debug: { type: "dynamic", value: "context.debug" },
        },
      })
    })

    it("data-атрибуты в фигурных скобках", () => {
      const attrs = parseAttributes("${context.isTest && 'data-test'} ${context.debug && 'data-debug'}")
      expect(attrs).toEqual({
        boolean: {
          "data-test": { type: "dynamic", value: "context.isTest" },
          "data-debug": { type: "dynamic", value: "context.debug" },
        },
      })
    })

    it("смешанные синтаксисы", () => {
      const attrs = parseAttributes("disabled ${context.loading && 'loading'} readonly")
      expect(attrs).toEqual({
        boolean: {
          disabled: { type: "static", value: true },
          loading: { type: "dynamic", value: "context.loading" },
          readonly: { type: "static", value: true },
        },
      })
    })
  })
})
