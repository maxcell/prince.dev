import React from 'react'
import Helmet from 'react-helmet'
import BLM from '../assets/blm.jpg'

const Head = props => {
  const socialImage =
    props.socialImage || BLM
  return (
    <Helmet defaultTitle={props.title}>
      <link
        rel="stylesheet"
        href="//cdn.jsdelivr.net/npm/hack-font@3/build/web/hack.css"
      />
      <link
        href="https://fonts.googleapis.com/css?family=IBM+Plex+Sans:400,700"
        rel="stylesheet"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={props.description} />
      <meta name="image" content={socialImage} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={props.title} />

      <meta property="og:image" content={socialImage} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={props.title} />
      <meta name="og:description" content={props.description} />
    </Helmet>
  )
}

export default Head
