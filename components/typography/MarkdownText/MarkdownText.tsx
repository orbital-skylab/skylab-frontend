import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

interface Props {
  markdownContent: string;
}
const MarkdownText = ({ markdownContent }: Props) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={{
        table({ children }) {
          return (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                margin: "0.75rem 0",
                fontSize: "0.9rem",
              }}
            >
              {children}
            </table>
          );
        },
        th({ children }) {
          return (
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                background: "#f5f5f5",
                fontWeight: 600,
                textAlign: "left",
              }}
            >
              {children}
            </th>
          );
        },
        td({ children }) {
          return (
            <td
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                verticalAlign: "top",
              }}
            >
              {children}
            </td>
          );
        },
        // existing renderers
        code({ inline, children }) {
          if (inline) {
            return (
              <code
                style={{
                  background: "#eaeaea",
                  padding: "0.2em 0.4em",
                  borderRadius: "4px",
                  fontSize: "0.85em",
                }}
              >
                {children}
              </code>
            );
          }

          return (
            <pre
              style={{
                background: "#1e1e1e",
                color: "#fff",
                padding: "1rem",
                borderRadius: "8px",
                overflowX: "auto",
                fontSize: "0.85em",
              }}
            >
              <code>{children}</code>
            </pre>
          );
        },
        ul({ children }) {
          return <ul style={{ paddingLeft: "1.2rem" }}>{children}</ul>;
        },
        ol({ children }) {
          return <ol style={{ paddingLeft: "1.2rem" }}>{children}</ol>;
        },
        p({ children }) {
          return <p style={{ margin: "0" }}>{children}</p>;
        },
        h1({ children }) {
          return (
            <h1
              style={{
                borderBottom: "1px solid #d3d3d3",
                paddingBottom: "0.3rem",
              }}
            >
              {children}
            </h1>
          );
        },
        h2({ children }) {
          return (
            <h2
              style={{
                borderBottom: "1px solid #dbdbdb",
                paddingBottom: "0.2rem",
              }}
            >
              {children}
            </h2>
          );
        },
        h3({ children }) {
          return (
            <h3
              style={{
                borderBottom: "1px solid #e0e0e0",
                paddingBottom: "0.2rem",
              }}
            >
              {children}
            </h3>
          );
        },
        hr() {
          return (
            <hr
              style={{
                border: "none",
                borderTop: "1px solid #d3d3d3",
                margin: "0.75rem 0",
              }}
            />
          );
        },
        strong({ children }) {
          return <strong style={{ fontWeight: 600 }}>{children}</strong>;
        },
      }}
    >
      {markdownContent}
    </ReactMarkdown>
  );
};

export default MarkdownText;
