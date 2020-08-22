/** @jsx jsx */
import React, { useState } from 'react';
import { jsx } from '@emotion/core';
import Fuse from 'fuse.js';

const HARDCODED_TOPICS = ['Rust', 'React', 'Learning', 'MDX'];

const fuseOptions = {
  threshold: 0.35,
  location: 0,
  distance: 100,
  minMatchCharLength: 1,
  shouldSort: true,
  includeScore: true,
  useExtendedSearch: true,
  keys: ['title', 'tags']
};

const TagButton = ({ isSelected, onTagClick, tag }) => (
  <li css={{
    listStyle: 'none',
    ':not(:first-child)': {
      marginLeft: '1rem'
    }
  }}><button type="button"
    css={() => {
      const selectedStyles = {
        color: '#FEFEFE',
        backgroundColor: 'rgb(94, 8, 135)',
      }

      const unselectedStyles = {
        color: 'rgb(94, 8, 135)',
        backgroundColor: '#FEFEFE'
      }

      const baseStyles = {
        padding: '4px 8px',
        border: '1px solid FEFEFE',
        borderRadius: '10px',
        fontSize: '1rem',
      }

      return isSelected ? { ...baseStyles, ...selectedStyles } : { ...baseStyles, ...unselectedStyles }
    }}
    onClick={e => onTagClick(tag)}
  >
      {tag}
    </button>
  </li>
)



const SearchBox = ({ articles, handleFilter }) => {
  // TODO: Put query into the url
  const [searchValue, setSearchValue] = useState('');
  const [searchTags, setSearchTags] = useState([]);
  const fuse = new Fuse(articles, fuseOptions);

  React.useEffect(() => {
    if (searchValue === '' && searchTags.length === 0) {
      handleFilter(articles);
    } else {
      // Allow for a search for tag
      const formattedTags = [...searchTags.map(item => ({ tags: item }))]
      const formattedTitle = searchValue.length ? [{ title: searchValue }] : []
      const queries = {
        $or: [
          { tags: searchValue },
          { title: searchValue },
          {
            $and: [...formattedTags, ...formattedTitle]
          }
        ]
      }
      const results = fuse.search(queries).map(result => result.item);
      handleFilter(results)
    }
  }, [searchValue, searchTags])

  const onChange = (e) => {
    const { value } = e.target;
    setSearchValue(value);
  }

  const onTagClick = (tag) => {
    if (searchTags.includes(tag)) {
      setSearchTags(searchTags.filter(included => included != tag))
    } else {
      setSearchTags([...searchTags, tag])
    }
  }

  const buttonTags = HARDCODED_TOPICS.map((tag) => (
    <TagButton
      isSelected={searchTags.includes(tag)}
      onTagClick={onTagClick}
      tag={tag}
    />)
  )

  return (
    <form>
      <ol css={{ display: 'flex', flexDirection: 'row', margin: '0', marginBottom: '1em' }}>{buttonTags}</ol>
      <label htmlFor="search-term" css={{ paddingRight: '0.5rem' }}>Type in any search terms</label>
      <input
        id="search-term"
        value={searchValue}
        onChange={onChange}
      />
    </form>
  );
}

export default SearchBox;