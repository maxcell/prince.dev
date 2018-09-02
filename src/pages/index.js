import React from 'react'
import Link from 'gatsby-link'

const BlogList = ({edges}) => (    
  edges.map(markdown => {
    return (
      <div><span>{markdown.node.frontmatter.date} - <Link to={markdown.node.fields.slug}>{markdown.node.frontmatter.title} </Link></span></div>
    )
  })
)

const IndexPage = ({data}) => (
    (
    <BlogList edges={data.allMarkdownRemark.edges}/>
    )
)

export default IndexPage


export const query = graphql`
    query BlogPageQuery {
        allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, filter: { frontmatter: { draft: {ne: true} }}){
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
`