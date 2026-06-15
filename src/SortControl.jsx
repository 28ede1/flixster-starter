import { useState } from 'react'
import './SortControl.css'

const SORT_TABS = [
  { key: "az", label: "A-Z" },
  { key: "newest", label: "Newest" },
  { key: "rating", label: "Rating" },
];

const SortControl = ({ sortBy, onSortChange }) => {
  // controlled if a sortBy prop is passed, otherwise track our own active tab
  const [internalSort, setInternalSort] = useState(null);
  const active = sortBy !== undefined ? sortBy : internalSort;

  const handleClick = (key) => {
    // clicking the active tab again clears the sort
    const next = active === key ? null : key;
    if (onSortChange) onSortChange(next);
    if (sortBy === undefined) setInternalSort(next);
  };

  return (
    <div className="SortControl">
      <h2 className="NowPlayingHeader">Now Playing</h2>

      <div className="SortTabs">
        {SORT_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`sort-tab-button${active === tab.key ? " active" : ""}`}
            onClick={() => handleClick(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SortControl
