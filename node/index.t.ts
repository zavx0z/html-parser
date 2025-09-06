import type { NodeMap } from "./map.t"
import type { NodeText } from "./text.t"
import type { NodeElement } from "./element.t"
import type { NodeCondition } from "./condition.t"
import type { NodeLogical } from "./logical.t"
import type { NodeMeta } from "./meta.t"
import type { ValueType } from "../attribute/index.t"
import type { PartAttrMap } from "./map.t"
import type { PartAttrLogical } from "./logical.t"
import type { PartAttrCondition } from "./condition.t"
import type { PartAttrMeta } from "./meta.t"
import type { PartText } from "./text.t"
import type { PartAttrElement } from "./element.t"

/**
 * Объединенный тип всех возможных узлов парсера.
 * Представляет любую структуру, которая может быть получена в результате парсинга HTML-шаблона.
 *
 * @group Nodes
 * @example Структура с различными типами узлов
 * ```html
 * <div class="container">
 *   <h1>${context.title}</h1>
 *   ${context.isLoggedIn ?
 *     html`<span>Добро пожаловать!</span>` :
 *     html`<a href="/login">Войти</a>`
 *   }
 *   ${core.notifications.length > 0 && html`
 *     <ul>
 *       ${core.notifications.map(n => html`<li>${n.message}</li>`)}
 *     </ul>
 *   `}
 *   <meta-component core="config" context="userData">
 *     <p>Содержимое компонента</p>
 *   </meta-component>
 * </div>
 * ```
 *
 * Результат парсинга будет содержать:
 * - NodeElement для div, h1, span, a, ul, li, p
 * - NodeText для статического текста и динамических значений
 * - NodeCondition для тернарного оператора
 * - NodeLogical для логического оператора &&
 * - NodeMap для итерации по массиву
 * - NodeMeta для meta-component
 */

export type Node = NodeMap | NodeCondition | NodeLogical | NodeText | NodeElement | NodeMeta

export interface AttrNodeElement {
  /** Имя HTML тега */
  tag: string
  /** Тип узла */
  type: "meta" | "el"
  /** События (onclick, onchange, onsubmit и т.д.) */
  event?: Record<string, string>
  /** Булевые атрибуты (hidden, disabled, checked, readonly и т.д.) */
  boolean?: Record<string, { type: "dynamic" | "static"; value: boolean | string }>
  /** Массивы атрибутов (class, rel, ping и т.д.) */
  array?: Record<string, { value: string; type: ValueType }[]>
  /** Строковые атрибуты (id, title, alt, href и т.д.) */
  string?: Record<string, { type: ValueType; value: string }>
  /** Стили (CSS в виде строки или объекта) */
  style?: string
  /** Дочерние элементы (опционально) */
  child?: (PartAttrElement | PartAttrMeta | PartAttrCondition | PartAttrMap | PartAttrLogical | PartText)[]
}

export type PartAttr = PartAttrElement | PartAttrMeta | PartAttrCondition | PartAttrMap | PartAttrLogical | PartText
export type PartsAttr = PartAttr[]
