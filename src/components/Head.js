import React from 'react'
import Helmet from 'react-helmet'

const Head = props => {
  const socialImage =
    props.socialImage || 'https://res.cloudinary.com/maxcell/image/upload/v1579584116/main_social.png'
  return (
    <Helmet defaultTitle={props.title}>
      <link
        rel="stylesheet"
        href="//cdn.jsdelivr.net/npm/hack-font@3/build/web/hack.css"
      />
      <link
        href="https://fonts.googleapis.com/css?family=IBM+Plex+Sans:400,500,700"
        rel="stylesheet"
      />
      <link rel="icon" type="image/x-icon" href="favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={props.description} />
      <meta name="author" content="Prince Wilson" />
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
