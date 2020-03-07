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
)

export default Layout
