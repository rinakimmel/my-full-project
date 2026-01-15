function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    return (
        <div className="pagination">
            <button
                onClick={() => onPageChange(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
            >
                הקודם
           </button>

            <span>
                עמוד {currentPage + 1} מתוך {totalPages}
            </span>

            <button
                onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
            >
                הבא
            </button>
        </div>
    );
}

export default Pagination;
