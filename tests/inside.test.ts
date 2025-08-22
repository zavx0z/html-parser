import { describe, it, expect } from "bun:test"
import { extractHtmlElements, extractMainHtmlBlock } from "../splitter"
import { elementsHierarchy } from "../hierarchy"
import { enrichHierarchyWithData } from "../data"

describe("внутри ${...}", () => {
  it("теги внутри тернарника", () => {
    const mainHtml = extractMainHtmlBlock(
      ({ html, context }) => html` <div>${context.cond ? html`<p>a</p>` : html`<span>b</span>`}</div> `
    )
    const elements = extractHtmlElements(mainHtml)
    expect(elements).toEqual([
      { text: "<div>", index: 1, name: "div", kind: "open" },
      { text: "<p>", index: 28, name: "p", kind: "open" },
      { text: "a", index: 31, name: "", kind: "text" },
      { text: "</p>", index: 32, name: "p", kind: "close" },
      { text: "<span>", index: 45, name: "span", kind: "open" },
      { text: "b", index: 51, name: "", kind: "text" },
      { text: "</span>", index: 52, name: "span", kind: "close" },
      { text: "</div>", index: 61, name: "div", kind: "close" },
    ])
    const hierarchy = elementsHierarchy(mainHtml, elements)
    expect(hierarchy).toEqual([
      {
        tag: "div",
        type: "el",
        text: "<div>",
        child: [
          {
            type: "cond",
            text: "context.cond",
            true: {
              tag: "p",
              type: "el",
              text: "<p>",
              child: [
                {
                  type: "text",
                  text: "a",
                },
              ],
            },
            false: {
              tag: "span",
              type: "el",
              text: "<span>",
              child: [
                {
                  type: "text",
                  text: "b",
                },
              ],
            },
          },
        ],
      },
    ])
    const enrichedHierarchy = enrichHierarchyWithData(hierarchy)
    expect(enrichedHierarchy).toEqual([
      {
        tag: "div",
        type: "el",
        child: [
          {
            type: "cond",
            data: "/context/cond",
            true: {
              tag: "p",
              type: "el",
              child: [
                {
                  type: "text",
                  value: "a",
                },
              ],
            },
            false: {
              tag: "span",
              type: "el",
              child: [
                {
                  type: "text",
                  value: "b",
                },
              ],
            },
          },
        ],
      },
    ])
  })
})
