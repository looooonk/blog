import { createElement, type ReactNode } from "react";
import Image from "next/image";

interface MarkdownProps {
  content: string;
}

export default function Markdown({ content }: MarkdownProps) {
  return <div className="markdown-body">{render_blocks(content)}</div>;
}

function render_blocks(content: string) {
  const lines = content.trim().split(/\r?\n/);
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    const fence = trimmed.match(/^(```|~~~)(\w+)?/);
    if (fence) {
      const marker = fence[1];
      const language = fence[2] ?? "text";
      const code: string[] = [];
      index += 1;

      while (index < lines.length && !lines[index].trim().startsWith(marker)) {
        code.push(lines[index]);
        index += 1;
      }

      blocks.push(
        <figure className="code-block" key={blocks.length}>
          <figcaption>{language}</figcaption>
          <pre>
            <code>{code.join("\n")}</code>
          </pre>
        </figure>,
      );
      index += 1;
      continue;
    }

    if (trimmed === "$$") {
      const equation: string[] = [];
      index += 1;

      while (index < lines.length && lines[index].trim() !== "$$") {
        equation.push(lines[index]);
        index += 1;
      }

      blocks.push(
        <LatexMath block key={blocks.length} value={equation.join(" ")} />,
      );
      index += 1;
      continue;
    }

    if (is_table_start(lines, index)) {
      const rows: string[][] = [];
      rows.push(split_table_row(lines[index]));
      index += 2;

      while (index < lines.length && is_table_row(lines[index])) {
        rows.push(split_table_row(lines[index]));
        index += 1;
      }

      const [head, ...body] = rows;
      blocks.push(
        <div className="table-wrap" key={blocks.length}>
          <table>
            <thead>
              <tr>
                {head.map((cell, cell_index) => (
                  <th key={cell_index}>{render_inline(cell)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, row_index) => (
                <tr key={row_index}>
                  {row.map((cell, cell_index) => (
                    <td key={cell_index}>{render_inline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const depth = heading[1].length;
      const tag = `h${depth}`;
      blocks.push(createElement(tag, { key: blocks.length }, render_inline(heading[2])));
      index += 1;
      continue;
    }

    const image = parse_image(trimmed);
    if (image) {
      blocks.push(
        <figure className="image-block" key={blocks.length}>
          <Image
            alt={image.alt}
            height={900}
            loading="eager"
            src={image.src}
            width={1600}
          />
          {image.title ? <figcaption>{image.title}</figcaption> : null}
        </figure>,
      );
      index += 1;
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ""));
        index += 1;
      }

      blocks.push(
        <ul key={blocks.length}>
          {items.map((item, item_index) => (
            <li key={item_index}>{render_inline(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ""));
        index += 1;
      }

      blocks.push(
        <ol key={blocks.length}>
          {items.map((item, item_index) => (
            <li key={item_index}>{render_inline(item)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      const quote: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
        quote.push(lines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }

      blocks.push(
        <blockquote key={blocks.length}>
          {quote.map((part, quote_index) => (
            <p key={quote_index}>{render_inline(part)}</p>
          ))}
        </blockquote>,
      );
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      blocks.push(<hr key={blocks.length} />);
      index += 1;
      continue;
    }

    const paragraph = [trimmed];
    index += 1;

    while (
      index < lines.length &&
      lines[index].trim() &&
      !starts_block(lines, index)
    ) {
      paragraph.push(lines[index].trim());
      index += 1;
    }

    blocks.push(<p key={blocks.length}>{render_inline(paragraph.join(" "))}</p>);
  }

  return blocks;
}

function render_inline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let index = 0;

  const push_text = (value: string) => {
    if (value) nodes.push(value);
  };

  while (index < text.length) {
    const rest = text.slice(index);

    if (rest.startsWith("`")) {
      const end = text.indexOf("`", index + 1);
      if (end > index) {
        nodes.push(<code key={nodes.length}>{text.slice(index + 1, end)}</code>);
        index = end + 1;
        continue;
      }
    }

    if (rest.startsWith("**")) {
      const end = text.indexOf("**", index + 2);
      if (end > index) {
        nodes.push(
          <strong key={nodes.length}>
            {render_inline(text.slice(index + 2, end))}
          </strong>,
        );
        index = end + 2;
        continue;
      }
    }

    if (rest.startsWith("~~")) {
      const end = text.indexOf("~~", index + 2);
      if (end > index) {
        nodes.push(
          <del key={nodes.length}>{render_inline(text.slice(index + 2, end))}</del>,
        );
        index = end + 2;
        continue;
      }
    }

    if (rest.startsWith("*")) {
      const end = text.indexOf("*", index + 1);
      if (end > index) {
        nodes.push(
          <em key={nodes.length}>{render_inline(text.slice(index + 1, end))}</em>,
        );
        index = end + 1;
        continue;
      }
    }

    if (rest.startsWith("\\(")) {
      const end = text.indexOf("\\)", index + 2);
      if (end > index) {
        nodes.push(
          <LatexMath key={nodes.length} value={text.slice(index + 2, end)} />,
        );
        index = end + 2;
        continue;
      }
    }

    if (rest.startsWith("$") && !rest.startsWith("$$")) {
      const end = text.indexOf("$", index + 1);
      if (end > index) {
        nodes.push(
          <LatexMath key={nodes.length} value={text.slice(index + 1, end)} />,
        );
        index = end + 1;
        continue;
      }
    }

    if (rest.startsWith("![")) {
      const parsed = parse_link_target(text, index + 1);
      if (parsed) {
        nodes.push(
          <Image
            alt={parsed.label}
            className="inline-image"
            height={24}
            key={nodes.length}
            src={parsed.href}
            width={24}
          />,
        );
        index = parsed.end;
        continue;
      }
    }

    if (rest.startsWith("[")) {
      const parsed = parse_link_target(text, index);
      if (parsed) {
        const external = /^https?:\/\//.test(parsed.href);
        nodes.push(
          <a
            href={parsed.href}
            key={nodes.length}
            rel={external ? "noopener noreferrer" : undefined}
            target={external ? "_blank" : undefined}
          >
            {render_inline(parsed.label)}
          </a>,
        );
        index = parsed.end;
        continue;
      }
    }

    const next = find_next_special(text, index + 1);
    push_text(text.slice(index, next));
    index = next;
  }

  return nodes;
}

function starts_block(lines: string[], index: number) {
  const trimmed = lines[index].trim();

  return (
    /^(```|~~~)/.test(trimmed) ||
    trimmed === "$$" ||
    is_table_start(lines, index) ||
    /^(#{1,6})\s+/.test(trimmed) ||
    /^[-*]\s+/.test(trimmed) ||
    /^\d+\.\s+/.test(trimmed) ||
    /^>\s?/.test(trimmed) ||
    /^---+$/.test(trimmed) ||
    Boolean(parse_image(trimmed))
  );
}

function is_table_start(lines: string[], index: number) {
  return (
    index + 1 < lines.length &&
    is_table_row(lines[index]) &&
    /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(lines[index + 1].trim())
  );
}

function is_table_row(line: string) {
  return /^\|.*\|$/.test(line.trim());
}

function split_table_row(line: string) {
  return line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((cell) => cell.trim());
}

function parse_image(line: string) {
  const match = line.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)$/);
  if (!match) return undefined;

  return {
    alt: match[1],
    src: match[2],
    title: match[3],
  };
}

function parse_link_target(text: string, start: number) {
  const close_label = text.indexOf("]", start + 1);
  if (close_label < 0 || text[close_label + 1] !== "(") return undefined;

  const close_target = text.indexOf(")", close_label + 2);
  if (close_target < 0) return undefined;

  return {
    label: text.slice(start + 1, close_label),
    href: text.slice(close_label + 2, close_target),
    end: close_target + 1,
  };
}

function find_next_special(text: string, start: number) {
  const candidates = ["`", "**", "~~", "*", "\\(", "$", "![", "["]
    .map((token) => text.indexOf(token, start))
    .filter((position) => position >= 0);

  return candidates.length ? Math.min(...candidates) : text.length;
}

function LatexMath({ value, block = false }: { value: string; block?: boolean }) {
  const parser = new MathParser(value);

  return createElement(
    "math",
    {
      className: block ? "math-block" : "math-inline",
      display: block ? "block" : "inline",
    },
    parser.parse(),
  );
}

class MathParser {
  private index = 0;
  private key = 0;

  constructor(private readonly value: string) {}

  parse() {
    return this.expression();
  }

  private expression(stop = ""): ReactNode[] {
    const nodes: ReactNode[] = [];

    while (this.index < this.value.length) {
      if (stop && this.value[this.index] === stop) {
        this.index += 1;
        break;
      }

      if (/\s/.test(this.value[this.index])) {
        this.index += 1;
        continue;
      }

      nodes.push(this.with_scripts(this.atom()));
    }

    return nodes;
  }

  private with_scripts(base: ReactNode) {
    let subscript: ReactNode | undefined;
    let superscript: ReactNode | undefined;

    while (this.value[this.index] === "_" || this.value[this.index] === "^") {
      const marker = this.value[this.index];
      this.index += 1;

      if (marker === "_") subscript = this.group();
      if (marker === "^") superscript = this.group();
    }

    if (subscript && superscript) return this.el("msubsup", [base, subscript, superscript]);
    if (subscript) return this.el("msub", [base, subscript]);
    if (superscript) return this.el("msup", [base, superscript]);

    return base;
  }

  private atom(): ReactNode {
    const char = this.value[this.index];

    if (char === "{") {
      this.index += 1;
      return this.row(this.expression("}"));
    }

    if (char === "\\") return this.command();

    if (/[0-9.]/.test(char)) return this.read(/[0-9.]/, "mn");
    if (/[a-zA-Z]/.test(char)) return this.read(/[a-zA-Z]/, "mi");
    if ("+-=/*<>".includes(char)) return this.take("mo");
    if ("(),[]|".includes(char)) return this.take("mo");

    this.index += 1;
    return this.el("mtext", char);
  }

  private command(): ReactNode {
    this.index += 1;
    const name = this.read_name();

    if (name === "frac") return this.el("mfrac", [this.group(), this.group()]);
    if (name === "sqrt") return this.el("msqrt", this.group());
    if (name === "text") return this.el("mtext", this.raw_group());
    if (name === "left" || name === "right") return this.atom();

    const operators: Record<string, string> = {
      approx: "≈",
      cdot: "⋅",
      geq: "≥",
      infty: "∞",
      int: "∫",
      leq: "≤",
      neq: "≠",
      prod: "∏",
      sum: "∑",
      times: "×",
      to: "→",
    };

    if (operators[name]) return this.el("mo", operators[name]);

    const greek: Record<string, string> = {
      alpha: "α",
      beta: "β",
      delta: "δ",
      Delta: "Δ",
      epsilon: "ϵ",
      gamma: "γ",
      lambda: "λ",
      mu: "μ",
      pi: "π",
      sigma: "σ",
      theta: "θ",
    };

    return this.el("mi", greek[name] ?? name);
  }

  private group(): ReactNode {
    while (/\s/.test(this.value[this.index])) this.index += 1;

    if (this.value[this.index] === "{") {
      this.index += 1;
      return this.row(this.expression("}"));
    }

    return this.atom();
  }

  private raw_group() {
    while (/\s/.test(this.value[this.index])) this.index += 1;
    if (this.value[this.index] !== "{") return "";

    let depth = 1;
    const start = this.index + 1;
    this.index += 1;

    while (this.index < this.value.length && depth > 0) {
      if (this.value[this.index] === "{") depth += 1;
      if (this.value[this.index] === "}") depth -= 1;
      this.index += 1;
    }

    return this.value.slice(start, this.index - 1);
  }

  private read_name() {
    let name = "";

    while (/[a-zA-Z]/.test(this.value[this.index] ?? "")) {
      name += this.value[this.index];
      this.index += 1;
    }

    return name;
  }

  private read(pattern: RegExp, tag: string) {
    let value = "";

    while (pattern.test(this.value[this.index] ?? "")) {
      value += this.value[this.index];
      this.index += 1;
    }

    return this.el(tag, value);
  }

  private take(tag: string) {
    const value = this.value[this.index];
    this.index += 1;
    return this.el(tag, value);
  }

  private row(nodes: ReactNode | ReactNode[]) {
    return Array.isArray(nodes) && nodes.length === 1
      ? nodes[0]
      : this.el("mrow", nodes);
  }

  private el(tag: string, children: ReactNode | ReactNode[]) {
    return createElement(tag, { key: this.key++ }, children);
  }
}
