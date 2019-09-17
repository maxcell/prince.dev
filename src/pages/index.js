import React, { Fragment } from 'react'
import { Link } from 'gatsby'
import Layout from './layout'
import { StaticQuery, graphql } from 'gatsby'

import '../layouts/prism-atom-dark.css'

const BlogList = ({ edges }) =>
  edges.map(markdown => {
    return (
      <li>
        <Link to={markdown.node.fields.slug}>
          {markdown.node.frontmatter.title}
        </Link>
      </li>
    )
  })

const BlogSection = () => {
  return (
    <StaticQuery
      query={graphql`
        query BlogPageQuery {
          allMarkdownRemark(
            sort: { fields: [frontmatter___date], order: DESC }
            filter: { frontmatter: { draft: { ne: true } } }
          ) {
            edges {
              node {
                frontmatter {
                  title
                  date(formatString: "MMM Do")
                }
                fields {
                  slug
                }
                timeToRead
                html
              }
            }
          }
        }
      `}
      render={data => (
        <ol class="blog-list">
          <BlogList edges={data.allMarkdownRemark.edges} />
        </ol>
      )}
    />
  )
}

const ShortAbout = () => {
  return (
    <Fragment>
      <h1>Howdy, I'm Prince!</h1>
      <p>
        I am a full-stack web developer based in NYC. I love building things and
        making sure to bring people together around accessibility and security.
        Beyond the work I do, I really love corgis.
      </p>
    </Fragment>
  )
}

const IndexPage = () => (
  <Layout>
    <ShortAbout />
    <h2>Articles</h2>
    <BlogSection />
  </Layout>
)

export default IndexPage
