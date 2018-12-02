import React from 'react'
import Helmet from 'react-helmet'
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
      }
    }
  }`}
  render={data=> (
    <div style={{ minHeight: 'inherit', margin: '0 auto', backgroundColor: 'white',width: '70%', maxWidth: '45em',}}>
    <Helmet
      title={data.site.siteMetadata.title}
      meta={[
        { name: 'description', content: 'An organically growing notebook of thoughts and learnings!' },
        { name: 'keywords', content: 'sample, something' },
      ]}
    >
      <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/hack-font@3/build/web/hack.css"></link>
      <link href="https://fonts.googleapis.com/css?family=IBM+Plex+Sans:400,700" rel="stylesheet"></link>
    </Helmet>
    <Header siteTitle={data.site.siteMetadata.title} />
    <hr/>
    <div
      style={{
       
        height: 'inherit', 
        padding: '1.45rem 1.0875rem 0',  
      }}
    >
      {children}
    </div>
  </div>
  )}
  />
)

export default Layout