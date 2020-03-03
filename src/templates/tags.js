import React from 'react'
import Layout from '../pages/layout'
import { Link, graphql } from 'gatsby'

const Tags = ({ pageContext, data }) => {
  const { tag } = pageContext
  const { edges, totalCount } = data.allMarkdownRemark
  const tagHeader = `${totalCount} post${
    totalCount > 1 ? 's' : ''
  } tagged with "${tag}"`

  return (
    <Layout>
      <h1>{tagHeader}</h1>
      <ul>
        {edges.map(({ node }) => {
          const { title } = node.frontmatter
          const { slug } = node.fields
          return (
            <li key={slug}>
              <Link to={slug}>{title}</Link>
            </li>
          )
        })}
      </ul>
    </Layout>
  )
}

export default Tags

export const pageQuery = graphql`
  query TagPage($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { draft: { ne: true }, tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
          }

          frontmatter {
            title
          }
        }
      }
    }
  }
`
