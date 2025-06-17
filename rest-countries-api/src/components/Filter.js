import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Filter component for searching and filtering countries by region
 * @param {Function} onSearch - Callback for search input changes
 * @param {Function} onRegionChange - Callback for region select changes
 */
const Filter = ({ onSearch, onRegionChange }) => {
    const { darkMode } = useTheme();
    const [searchValue, setSearchValue] = useState('');

    // Handle search input changes
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        if (onSearch) onSearch(value);
    };

    // Handle region selection changes
    const handleRegionChange = (e) => {
        const region = e.target.value;
        if (onRegionChange) onRegionChange(region);
    };

    return (
        <section className={`filter ${!darkMode ? 'light-theme' : ''}`}>
            {/* Search Input */}
            <form className='form-control'>
                <input
                    type='search'
                    name='search'
                    id='search'
                    placeholder='Search for a country'
                    value={searchValue}
                    onChange={handleSearchChange}
                />
            </form>

            {/* Region Filter Dropdown */}
            <div className='region-filter'>
                <select
                    name='select'
                    id='select'
                    className='select'
                    onChange={handleRegionChange}
                >
                    <option value='all'>Filter by region</option>
                    <option value='Africa'>Africa</option>
                    <option value='Americas'>America</option>
                    <option value='Asia'>Asia</option>
                    <option value='Europe'>Europe</option>
                    <option value='Oceania'>Oceania</option>
                </select>
            </div>
        </section>
    );
};

export default Filter;