import React, { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';

const TableSearch = ({ data, columns, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Debounce the search term for better performance (optional)
        const timeoutId = setTimeout(() => {
            handleSearch(searchTerm);
        }, 300);  // Adjust debounce delay as needed

        return () => clearTimeout(timeoutId);  // Clear timeout on unmount or searchTerm change
    }, [searchTerm]);

    const handleSearch = (term) => {
        // Convert search term to lowercase for case-insensitive search
        const lowerCaseTerm = term.toLowerCase();

        // Filter the data based on the search term
        const filteredData = data.filter((item) => {
            return columns.some((column) => {
                if (!item[column]) return false; // Handle undefined values
                return item[column].toString().toLowerCase().includes(lowerCaseTerm);
            });
        });

        onSearch(filteredData); // Pass the filtered data to the parent component
    };

    return (
        <div className="flex items-center rounded-md bg-base-200 py-2 px-3 mb-4 w-full md:w-1/3">
            <SearchIcon className="opacity-60 mr-2" size={16} />
            <input
                type="text"
                placeholder="Buscar..."
                className="bg-transparent outline-none w-full text-base-content"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    );
};

export default TableSearch;