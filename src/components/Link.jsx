/** @jsx jsx */
import { jsx } from 'theme-ui';
import { Link } from 'gatsby';

export default function StyledLink6(props) {
  return (
    <Link
      to={props.to}
      sx={{
        '&:link,&:visited': {
          color: 'text',
        },
        '&:hover': {
          color: 'white',
          bg: 'primary'
        }
      }}
      {...props}
    >
      {props.children}
    </Link>
  )
}