import React from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'

const calculateLinesToHighlight = (meta) => {
  const RE = /{([\d,-]+)}/

  if (!RE.test(meta)) {
    return () => false
  } else {
    const lineNumbers = RE.exec(meta)[1]
      .split(',')
      .map((v) => v.split('-').map((v) => parseInt(v, 10)))

    console.log('Line numbers to highlight: ', lineNumbers)
    return (index) => {
      const lineNumber = index + 1
      const inRange = lineNumbers.some(([start, end]) =>
        end ? lineNumber >= start && lineNumber <= end : lineNumber === start
      )
      return inRange
    }
  }
}


export default ({ children, className, metastring }) => {
  // Pull the className
  console.log('Props: ', children)
  const language = className.replace(/language-/, '')

  // Determine if we need highlighting
  console.log('metastring: ', metastring)
  const shouldHighlightLine = calculateLinesToHighlight(metastring)

  return (
    <Highlight {...defaultProps} code={children} language={language} theme={undefined}>
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
        }
        </pre>
      )}
    </Highlight>
  )
}