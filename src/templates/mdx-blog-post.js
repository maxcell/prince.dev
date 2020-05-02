import React from 'react'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import getShareImage from '@jlengstorf/get-share-image'

import Footer from '../components/footer'
import Layout from '../pages/layout'
import Head from '../components/social'

import { ColorSwitcher } from '../components/ColorSwitcher'

export default ({ data }) => {
  const post = data.mdx

  const socialImage = getShareImage({
    title: post.frontmatter.title,
    titleExtraConfig: '_bold',
    tagline: '',
    cloudName: 'maxcell',
    imagePublicID: 'prince_social_template',
    titleFont: 'roboto',
    textColor: '222426',
    textAreaWidth: 616,
    textLeftOffset: 624,
  })

  return (
    <Layout>
      <Head
        title={post.frontmatter.title}
        description={post.excerpt}
        socialImage={socialImage}
      />
      <h1>{post.frontmatter.title}</h1>
      <ColorSwitcher />
      <MDXRenderer>
        {post.body}

      </MDXRenderer>
      <Footer />
    </Layout>
  )
}

export const query = graphql`
  query MdxBlogPostQuery($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      body
      excerpt
      frontmatter {
        title
      }
    }
  }
`
