/** @jsx jsx */
import React, { useState } from 'react';
import { jsx } from '@emotion/core';
import { StaticQuery, graphql, Link as GatsbyLink } from 'gatsby';

import Layout from './layout';
import SearchBox from '../components/SearchBox';

const BlogList = ({ posts }) =>
  posts.map(markdown => {
    return (
      <li>
        <GatsbyLink
          css={{
            display: 'block',
            borderRadius: '5px',
            fontWeight: '700',
            padding: '0.5rem 1rem',
            '&:link,&:visited': {
              color: '#222426',
            },
            '&:hover,&:focus': {
              transition: 'background 0.1s ease-in-out 0s',
              backgroundColor: 'hsla(303,74%,92%,0.4)',
              textDecoration: 'none'
            }
          }}
          to={markdown.slug}>
          {markdown.title}
        </GatsbyLink>
      </li>
    )
  })

const BlogSection = () => {
  return (
    <StaticQuery
      query={graphql`
        query {
          allMdx(
            sort: { fields: [frontmatter___date], order: DESC }
            filter: { frontmatter: { draft: { ne: true } } }
          ) {
            edges {
              node {
                frontmatter {
                  title
                  date
                  tags
                }
                fields {
                  slug
                }
                rawBody
              }
            }
          }
        }
      `}
      render={data => {
        const { edges } = data.allMdx;

        // Make the shape easier to read
        const articles = edges.map(item => ({
          title: item.node.frontmatter.title,
          tags: item.node.frontmatter.tags,
          slug: item.node.fields.slug,
        }));

        const [filteredArticles, setFilteredArticles] = useState(articles)


        console.log('Filtered Output: ', filteredArticles)

        const handleFilter = (data) => {
          setFilteredArticles(data)
        }

        return (
          <Layout>
            <SearchBox articles={articles} handleFilter={handleFilter} />
            <ol className="blog-list">
              <BlogList posts={filteredArticles} />
            </ol>
          </Layout>
        );
      }}
    />
  )
}


export default BlogSection;