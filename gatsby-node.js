/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

 // You can delete this file if you're not using it

 const { createFilePath } = require('gatsby-source-filesystem')
 const path = require('path')
 const _ = require('lodash')

 exports.onCreateNode = ({ node, getNode, actions }) => {
    const { createNodeField } = actions
    if(node.internal.type === "MarkdownRemark"){
        const relativeFilePath = createFilePath({ node, getNode, basePath: 'pages/posts' })
        let slug = relativeFilePath.split(/([0-9]+\-)/g)
        console.log(slug[slug.length - 1])
        createNodeField({
            node,
            name: 'slug',
            value: `/blog/${slug[slug.length - 1]}`
        })

    }
 }

 exports.createPages = ({ graphql, actions }) => {
    const { createPage } = actions

    return graphql(`
        {
          allMarkdownRemark(
            limit: 2000
            sort: { fields: [frontmatter___date], order: DESC}
            filter: { frontmatter: {draft: { ne: true }}}
          ) {
            edges {
              node {
                fields {
                  slug
                }
                frontmatter {
                  tags
                }
              }
            }
          }
        }
      `).then(result => {
        if (result.error) {
          return Promise.reject(result.errors)
        }
        
        const posts = result.data.allMarkdownRemark.edges

        posts.forEach(({node}) => {

            post = {
                path: node.fields.slug,
                component: path.resolve('./src/templates/blog-post.js'),
                context: {
                    slug: node.fields.slug
                }
            }

            createPage(post)
        })

        let tags = []

        posts.forEach(edge => {
          if(edge.node.frontmatter.tags){
            tags = [...tags, ...edge.node.frontmatter.tags]
          }
        })

        tags = [...new Set(tags)]

        tags.forEach(tag => {
          createPage({path: `/tags/${_.kebabCase(tag)}`,
          component: path.resolve('./src/templates/tags.js'),
          context: {
            tag
          }})
        })

      })
}
