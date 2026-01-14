/**
 * SearchFilter
 * Macro: קומפוננטה פשוטה לבחירת קריטריון חיפוש והזנת ערך לחיפוש.
 * Props:
 *  - searchOptions: array של אפשרויות { value, label }
 *  - searchBy, setSearchBy, searchValue, setSearchValue
 */
function SearchFilter({ searchOptions, searchBy, setSearchBy, searchValue, setSearchValue }) {
    return (
        <>
            <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                <option value="">בחר קריטריון חיפוש</option>
                {searchOptions.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {searchBy && (
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="הכנס ערך לחיפוש"
                />
            )}
        </>
    );
}

export default SearchFilter;
