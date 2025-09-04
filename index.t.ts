// Входные данные
export type Context = Record<string, string | number | boolean | null | Array<string | number | boolean | null>>
export type Core = Record<string, any>
export type State = string

export type RenderParams<C extends Context, I extends Core = Core, S extends State = State> = {
  html: (strings: TemplateStringsArray, ...values: any[]) => string
  core: I
  context: C
  state: State
  update: (context: Partial<C>) => void
}

import type { ParseAttributeResult } from "./data.t"

// Выходные данные
/**
 * Узел HTML элемента.
 * Представляет HTML тег с атрибутами и дочерними элементами.
 */
export interface NodeElement extends AttributesNode {
  /** Имя HTML тега */
  tag: string
  /** Тип узла - всегда "el" для элементов */
  type: "el"
  /** Дочерние узлы элемента */
  child?: Node[]
}
/**
 * Текстовый узел.
 * Представляет текст с путями к данным или статическими значениями.
 */

export interface NodeText {
  /** Тип узла - всегда "text" для текстовых узлов */
  type: "text"
  /** Путь(и) к данным (если текст динамический) */
  data?: string | string[]
  /** Статическое значение (если текст статический) */
  value?: string
  /** Выражение с индексами (если текст смешанный) */
  expr?: string
}
/**
 * Узел map операции.
 * Представляет итерацию по массиву данных с дочерними элементами.
 */

export interface NodeMap {
  /** Тип узла - всегда "map" для map операций */
  type: "map"
  /** Путь к массиву данных для итерации */
  data: string
  /** Дочерние узлы, которые будут повторены для каждого элемента массива */
  child: Node[]
}
/**
 * Узел условного оператора.
 * Представляет тернарный оператор с ветками true и false.
 */

export interface NodeCondition {
  /** Тип узла - всегда "cond" для условных операторов */
  type: "cond"
  /** Путь(и) к данным для условия */
  data: string | string[]
  /** Выражение с индексами (если условие сложное) */
  expr?: string
  /** Узлы для случая когда условие истинно и ложно
   * - true: первый элемент массива
   * - false: второй элемент массива
   */
  child: Node[]
}

/**
 * Мета-узел.
 * Представляет мета-тег с динамическим именем тега.
 */
export interface NodeMeta extends AttributesNode {
  /** Имя мета-тега (может быть динамическим) */
  tag: string | ParseAttributeResult
  /** Тип узла - всегда "meta" для мета-узлов */
  type: "meta"

  /** Дочерние элементы (опционально) */
  child?: Node[]
}

interface AttributesNode {
  /** События */
  event?: AttributeEvent
  /** Булевые аттрибуты */
  boolean?: AttributeBoolean
  /** Массивы аттрибутов */
  array?: AttributeArray
  /** Строковые аттрибуты */
  string?: AttributeString
  /** Объектные аттрибуты (стили) */
  object?: StyleObject
  /** Стили */
  style?: StyleObject
  /** Core атрибуты для meta-компонентов */
  core?: string | ParseAttributeResult
  /** Context атрибуты для meta-компонентов */
  context?: string | ParseAttributeResult
}

export type AttrVariable = { data: string }
export type AttrDynamic = {
  data: string | string[]
  expr: string
}
type AttrUpdate = {
  data?: string | string[]
  expr?: string
  upd: string | string[]
}

export type AttributeEvent = Record<
  string,
  AttrVariable | AttrDynamic | AttrUpdate | { expr: string; upd?: string | string[] }
>

export type AttributeArray = Record<string, (AttrStaticArray | AttrVariable | AttrDynamic)[]>
type AttrStaticArray = { value: string }

export type AttributeString = Record<string, AttrStaticString | AttrVariable | AttrDynamic>
type AttrStaticString = string

export type AttributeBoolean = Record<string, boolean | AttrVariable | AttrDynamic>

export type StyleObject = Record<string, string | AttrVariable | AttrDynamic>

export type Node = NodeMap | NodeCondition | NodeText | NodeElement | NodeMeta
