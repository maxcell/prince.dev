/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const { createFilePath } = require('gatsby-source-filesystem')
const slugify = require('@sindresorhus/slugify')
const path = require('path')
const _ = require('lodash')

exports.onCreateNode = ({ node, getNode, actions }) => {
  const parent = getNode(node.parent)
  const { createNodeField } = actions
  if (node.internal.type === 'MarkdownRemark') {
    const relativeFilePath = createFilePath({
      node,
      getNode,
      basePath: 'content',
    })
    let slug = node.frontmatter.slug || slugify(parent.name)
    createNodeField({
      node,
      name: 'slug',
      value: `/blog/${slug}`,
    })
  }
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPostTemplate = path.resolve('./src/templates/blog-post.js')
  const tagTemplate = path.resolve('./src/templates/tags.js')

  return graphql(`
    {
      postsRemark: allMarkdownRemark(
        limit: 2000
        sort: { fields: [frontmatter___date], order: DESC }
        filter: { frontmatter: { draft: { ne: true } } }
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
      tagsGroup: allMarkdownRemark(
        limit: 2000
        filter: { frontmatter: { draft: { ne: true } } }
      ) {
        group(field: frontmatter___tags) {
          fieldValue
        }
      }
    }
  `).then(result => {
    if (result.error) {
      return Promise.reject(result.errors)
    }

    const posts = result.data.postsRemark.edges

    posts.forEach(({ node }) => {
      post = {
        path: node.fields.slug,
        component: blogPostTemplate,
        context: {
          slug: node.fields.slug,
        },
      }

      createPage(post)
    })

    let tags = result.data.tagsGroup.group

    tags.forEach(tag => {
      createPage({
        path: `/tags/${_.kebabCase(tag.fieldValue)}`,
        component: tagTemplate,
        context: {
          tag: tag.fieldValue,
        },
      })
    })
  })
}
