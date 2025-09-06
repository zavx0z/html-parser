import type { PartAttrMeta } from "./meta.t"
import { processBasicAttributes, processSemanticAttributes, processTemplateLiteralAttribute } from "../parser"
import { createNode } from "."
import type { ParseContext } from "../parser.t"
import type { NodeMeta } from "./meta.t"

/** Создает NodeMeta из PartMeta. */
export const createNodeDataMeta = (
  node: PartAttrMeta,
  context: ParseContext = { pathStack: [], level: 0 }
): NodeMeta => {
  const processed = processTemplateLiteralAttribute(node.tag, context)
  let result: NodeMeta = {
    tag: processed || node.tag,
    type: "meta",
    // Обрабатываем базовые атрибуты
    ...processBasicAttributes(node, context),
    // Добавляем дочерние элементы, если они есть
    ...(node.child && { child: node.child.map((child) => createNode(child, context)) }),
  }
  // Обрабатываем семантические атрибуты
  if ("core" in node && node.core) {
    result.core = processSemanticAttributes(node.core, context) || node.core
  }
  if ("context" in node && node.context) {
    result.context = processSemanticAttributes(node.context, context) || node.context
  }
  return result
}
