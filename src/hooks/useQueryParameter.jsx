import React from 'react';

export default function useQueryParamState(searchParamName) {
  const [value, setValue] = React.useState(() => {
    if (typeof window === 'undefined') {
      return ''
    }
    const searchParams = new URL(window.location).searchParams
    if (searchParams.has(searchParamName)) {
      return searchParams.get(searchParamName)
    } else {
      return ''
    }
  })

  React.useEffect(() => {
    const newUrl = new URL(window.location)
    newUrl.searchParams.set(searchParamName, value)
    if (value) {
      window.history.replaceState(window.history.state, '', newUrl)
    } else {
      newUrl.searchParams.delete(searchParamName)
      window.history.replaceState(window.history.state, '', newUrl)
    }
  }, [searchParamName, value])

  return [value, setValue]
}