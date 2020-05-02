/** @jsx jsx */
import { useContext } from 'react'
import { jsx } from '@emotion/core';
import Highlight, { defaultProps } from 'prism-react-renderer'
import rangeParser from 'parse-numeric-range';

import { ColorContext } from './ColorSwitcher';

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

/* Fix for my overflowing highlights */
const wrappingStyles = (codeBlockTheme) => ({
  backgroundColor: codeBlockTheme ? codeBlockTheme.plain.backgroundColor : '#1d1f21',
  borderRadius: '0.3em',
  margin: '2em 0',
  padding: '1em',
  overflow: 'auto',
  boxShadow: 'rgba(0, 0, 0, 0.25) 0px 10px 24px',
  "& pre[class*='language-']": {
    backgroundColor: 'transparent',
    margin: 0,
    padding: 0,
    overflow: 'initial',
    float: 'left',
    minWidth: '100%'
  }
})


export default ({ children, className, metastring }) => {
  // Pull the className
  const language = className.replace(/language-/, '') || ""

  // Determine if we need highlighting
  const shouldHighlightLine = calculateLinesToHighlight(metastring)

  const { codeBlockTheme } = useContext(ColorContext);

  return (
    <div css={wrappingStyles(codeBlockTheme)}>
      <Highlight
        {...defaultProps}
        code={children}
        language={language}
        theme={codeBlockTheme}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            {tokens.map((line, index) => {
              const lineProps = getLineProps({ line, key: index })
              if (shouldHighlightLine(index)) { lineProps.className = `${lineProps.className} highlight-line` }
              if (line.length === 1 && line[0].empty === true && index === tokens.length - 1) return null;
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
    </div>
  )
}