import React from 'react';
import Helmet from 'react-helmet';
import logo from '../assets/maxcell.png'


const Head = (props) => {  
 return (
  <Helmet defaultTitle={props.title}>
      <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/hack-font@3/build/web/hack.css"></link>
      <link href="https://fonts.googleapis.com/css?family=IBM+Plex+Sans:400,700" rel="stylesheet"></link>
      <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
      <meta property="twitter:card" content="summary" />
      <meta property="twitter:description" content={props.description} />
      <meta property="twitter:title" content={props.title} />
      <meta property="twitter:image" content={"https://maxcell.me" + logo}/>
      <meta property="og:image" content={logo}/>
  </Helmet>
)
}

export default Head;