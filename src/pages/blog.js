import React from 'react'
import Link from 'gatsby-link'

const BlogPage = ({data}) => {
    // console.log(data)
    return (
    <div>
      <h1>Blog Posts</h1>
      {data.allMarkdownRemark.edges.map(markdown => {
          console.log(markdown.node)
              return <Link to={markdown.node.fields.slug}>{markdown.node.frontmatter.title} - {markdown.node.frontmatter.date} </Link>
          })}
    </div>
    )
}

export default BlogPage

export const query = graphql`
    query BlogPageQuery {
        allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }){
          edges {
            node {
              frontmatter {
                title
                date(formatString: "YYYY MM DD")
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
