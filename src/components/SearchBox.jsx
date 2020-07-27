import React, { useState } from 'react';
import Fuse from 'fuse.js';

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

const HARDCODED_TOPICS = ['Rust', 'React', 'Learning', 'MDX'];

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

  return (
    <form>
      <label htmlFor="search-term">Type in any search terms</label>
      {HARDCODED_TOPICS.map(tag => (
        <button type="button"
          onClick={e => onTagClick(tag)}
        >
          {tag}
        </button>
      ))}
      <input
        id="search-term"
        value={searchValue}
        onChange={onChange}
      />
    </form>
  );
}

export default SearchBox;