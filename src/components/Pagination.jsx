const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];

    // Create an array of page numbers to display (e.g., 1 2 3 4 5)
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    // Function to handle page change
    const handlePageClick = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange(page);
        }
    };

    return (
        <div className="join">
            <button
                className="join-item btn"
                disabled={currentPage === 1}
                onClick={() => handlePageClick(currentPage - 1)}
            >
                «
            </button>

            {pageNumbers.map((pageNumber) => (
                <button
                    key={pageNumber}
                    className={`join-item btn ${currentPage === pageNumber ? 'btn-active' : ''}`}
                    onClick={() => handlePageClick(pageNumber)}
                >
                    {pageNumber}
                </button>
            ))}

            <button
                className="join-item btn"
                disabled={currentPage === totalPages}
                onClick={() => handlePageClick(currentPage + 1)}
            >
                »
            </button>
        </div>
    );
};

export default Pagination;