/** @jsx jsx */
import { jsx } from 'theme-ui';
import { Link as GatsbyLink } from 'gatsby';

export default function StyledLink(props) {

  const linkStyles = {
    '&:link,&:visited': {
      color: 'text',
    },
    '&:hover': {
      color: 'white',
      bg: 'primary'
    }
  }



  const isInternal = /^\/(?!\/)/.test(props.to)

  if (isInternal) {
    return (
      <GatsbyLink
        {...props}
        sx={linkStyles}
      >
        {props.children}
      </GatsbyLink>
    )
  } else {
    return (
      <a {...props} sx={linkStyles}>
        {props.children}
      </a>
    )
  }
}