import React, { Fragment } from 'react'
import Head from '../components/social'
import { StaticQuery, graphql } from 'gatsby'

import Header from '../components/header'
import '../layouts/index.css'

const Layout = ({ children }) => (
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
          <div
            style={{
              padding: '1.45rem 1.0875rem 0',
            }}
          >
            {children}
          </div>
        </div>
      </Fragment>
    )}
  />
)

export default Layout
