import React from 'react';
import Link from 'gatsby-link';

const Tags = ({ pathContext, data }) => {
  const { tag } = pathContext
  const { edges, totalCount } = data.allMarkdownRemark;
  const tagHeader = `${totalCount} post${totalCount > 1 ? "s" : ""} tagged with "${tag}"`

  return (
    <div>
      <h1>{tagHeader}</h1>
      <ul>
        {edges.map(({node}) => {
          const { title } = node.frontmatter
          const { slug } = node.fields
          return (
            <li key={slug}>
              <Link to={slug}>{title}</Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Tags;

export const pageQuery = graphql`
  query TagPage($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC}
      filter: { frontmatter: { tags: { in: [$tag] }}}
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
