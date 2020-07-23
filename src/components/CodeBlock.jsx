import React from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import rangeParser from 'parse-numeric-range';

// Create a closure that determines if we have
// to highlight the given index
const calculateLinesToHighlight = (meta) => {
  const RE = /{([\d,-]+)}/
  if (RE.test(meta)) {
    const strlineNumbers = RE.exec(meta)[1]
    const lineNumbers = rangeParser(strlineNumbers)
    return (index) => (lineNumbers.includes(index + 1))
  } else {
    return () => false
  }
}


export default ({ children, className, metastring }) => {
  // Pull the className
  const language = className?.replace(/language-/, '') || ""

  // Determine if we need highlighting
  const shouldHighlightLine = calculateLinesToHighlight(metastring)

  return (
    <Highlight
      {...defaultProps}
      code={children}
      language={language}
      theme={undefined}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={{ ...style }}>
          {tokens.map((line, index) => {
            const lineProps = getLineProps({ line, key: index })
            if (shouldHighlightLine(index)) { lineProps.className = `${lineProps.className} highlight-line` }
            return (
              <div key={index} {...lineProps}>
                {line.map((token, key) => (
                  <span key={key}{...getTokenProps({ token, key })} />
                ))}
              </div>
            )
          }
          )}
        </pre>
      )}
    </Highlight>
  )
}