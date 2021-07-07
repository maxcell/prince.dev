import React, { Fragment } from 'react'
import { MDXProvider } from '@mdx-js/react'
import Head from '../components/Head'
import { StaticQuery, graphql } from 'gatsby'

import Header from '../components/header'
import Link from '../components/Link'
import CodeBlock from '../components/CodeBlock'
import { ColorProvider } from '../components/ColorSwitcher'
import InlineCode from '../components/InlineCode'
import Callout from '../components/Callout'
import '../layouts/index.css'


const components = {
  a: (props) => <Link {...props} />,
  pre: (props) => <div {...props} />,
  code: CodeBlock,
  inlineCode: InlineCode,
  Callout
}

const Layout = ({ children }) => (
  <MDXProvider
    components={components}
  >
    <ColorProvider>
      <StaticQuery
        query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
            description
            twitter
          }
        }
      }
    `}
        render={({ site: { siteMetadata } }) => (
          <Fragment>
            <Head
              title={siteMetadata.title}
              description={siteMetadata.description}
            />
            <div className="container">
              <Header siteTitle={siteMetadata.title} />
              <main
                style={{
                  paddingTop: '1.45rem',
                  paddingBottom: '0px'
                }}
              >
                {children}
              </main>
            </div>
          </Fragment>
        )}
      />
    </ColorProvider>
  </MDXProvider>
)

export default Layout
