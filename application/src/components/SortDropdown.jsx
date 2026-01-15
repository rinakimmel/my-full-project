function SortDropdown({ sortOptions, sortBy, setSortBy }) {
    return (
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="" disabled>בחר ערך למיון</option>
            {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}

export default SortDropdown;
