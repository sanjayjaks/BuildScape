import React from 'react';

interface SearchFilterProps {
  onSearch: (search: string) => void;
  onCategoryChange: (category: string) => void;
  categories: string[];
  searchValue: string;
  categoryValue: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearch,
  onCategoryChange,
  categories,
  searchValue,
  categoryValue,
}) => {
  return (
    <form
      className="search-filter-form"
      onSubmit={e => e.preventDefault()}
    >
      <h3>Find Services</h3>
      <div className="filter-controls">
        <input
          type="text"
          placeholder="Search by name or keyword..."
          value={searchValue}
          onChange={e => onSearch(e.target.value)}
        />
        <select
          value={categoryValue}
          onChange={e => onCategoryChange(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">
        Search
      </button>
    </form>
  );
};

export default SearchFilter; 