import React from 'react'
import Helmet from 'react-helmet'
import logo from '../assets/maxcell.png'

const Head = props => {
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
      <meta property="twitter:card" content="summary" />
      <meta property="twitter:description" content={props.description} />
      <meta property="twitter:title" content={props.title} />
      <meta property="twitter:image" content={'https://maxcell.me' + logo} />
      <meta property="og:image" content={logo} />
      {/* Global site tag (gtag.js) - Google Analytics */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=UA-82244410-2"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'UA-82244410-2');
      </script>
    </Helmet>
  )
}

export default Head
