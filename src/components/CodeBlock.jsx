import React from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import rangeParser from 'parse-numeric-range';

import { getParameters } from 'codesandbox/lib/api/define';

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


export default ({ children, className, metastring, playground }) => {
  // Pull the className
  const language = className?.replace(/language-/, '') || ""

  // Determine if we need highlighting
  const shouldHighlightLine = calculateLinesToHighlight(metastring)
  let url;
  if (playground && language === 'rust') {
    const playgroundBaseURL = "https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&code="
    const encodedCode = encodeURI(children)
    url = playgroundBaseURL + encodedCode



    return (
      <iframe
        src={url}
        loading='lazy'>

      </iframe>
    )
  }

  return (
    <React.Fragment>
      {playground && <a style={{ color: 'white', marginBottom: '30px' }} href={url}>Go to the playground</a>}
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
    </React.Fragment>
  )
}