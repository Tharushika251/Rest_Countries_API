import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Filter from './Filter';

/**
 * Main countries listing page
 * Displays a paginated grid of country cards with search and filter functionality
 */
const Countries = () => {
    // State management
    const [countries, setCountries] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [region, setRegion] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { user, favorites, toggleFavorite } = useContext(AuthContext);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8); // Default value

    // Calculate responsive items per page
    useEffect(() => {
        const updateItemsPerPage = () => {
            const width = window.innerWidth;
            if (width >= 992) {
                setItemsPerPage(12); // 4 columns x 3 rows
            } else if (width >= 768) {
                setItemsPerPage(9); // 3 columns x 3 rows
            } else if (width >= 640) {
                setItemsPerPage(8); // 2 columns x 4 rows
            } else {
                setItemsPerPage(6); // 1 column x 6 rows
            }
        };

        updateItemsPerPage();
        window.addEventListener('resize', updateItemsPerPage);

        return () => {
            window.removeEventListener('resize', updateItemsPerPage);
        };
    }, []);

    // Fetch countries data when component mounts or region changes
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const baseUrl = 'https://restcountries.com/v3.1';
                const response = await fetch(region ? `${baseUrl}/region/${region}` : `${baseUrl}/all`);
                const data = await response.json();
                setCountries(data);
                setFiltered(data);
                setCurrentPage(1); // Reset to first page when data changes
            } catch (error) {
                console.error('Error fetching countries:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [region]);

    // Filter countries based on search term
    useEffect(() => {
        if (!searchTerm) {
            setFiltered(countries);
        } else {
            const filteredCountries = countries.filter(country =>
                country?.name?.common?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFiltered(filteredCountries);
        }
        setCurrentPage(1); // Reset to first page when search term changes
    }, [searchTerm, countries]);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    // Handle search input changes
    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    // Handle region filter changes
    const handleRegionChange = (regionValue) => {
        setRegion(regionValue === 'Filter by region' ? '' : regionValue);
        setSearchTerm('');
    };

    // Remove country from list (demo functionality)
    const removeCountry = (cca3) => {
        const newCountries = countries.filter((country) => country.cca3 !== cca3);
        setCountries(newCountries);
        setFiltered(newCountries.filter(country =>
            !searchTerm || country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    };

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Loading state
    if (isLoading) return <h1 className="loading">Loading...</h1>;

    return (
        <>
            {/* Login Prompt Banner - only shows when user is logged out */}
            {!user && (
                <div className="auth-prompt">
                    <div className="auth-prompt-content">
                        <i className="fas fa-lock auth-prompt-icon"></i>
                        <p className="auth-prompt-text">
                            To save countries to your favorites, please
                            <Link to="/login" className="auth-prompt-link"> sign in</Link>
                        </p>
                    </div>
                </div>
            )}

            {/* Search and Filter Component */}
            <Filter
                onSearch={handleSearch}
                onRegionChange={handleRegionChange}
            />

            {/* Countries Grid */}
            <section className='grid'>
                {currentItems.length > 0 ? (
                    currentItems.map((country) => {
                        const { cca3, name, population, region, capital, flags } = country;
                        return (
                            <article key={cca3}>
                                <div className='card-container'>
                                    {/* Country Flag */}
                                    <img src={flags.png} alt={name.common} />

                                    {/* Country Details */}
                                    <div className='details'>
                                        <h3>{name.common}</h3>
                                        <h4>Population: <span>{population}</span></h4>
                                        <h4>Region: <span>{region}</span></h4>
                                        <h4>Capital: <span>{capital}</span></h4>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className='buttons'>
                                        <Link to={`/countries/${name.common}`} className='btn'>
                                            Learn more
                                        </Link>
                                        <div className='action-buttons'>
                                            {user && (  // Only show if user is logged in
                                                <button
                                                    className='btn favorite-btn'
                                                    onClick={() => toggleFavorite(cca3)}
                                                    aria-label={favorites.includes(cca3) ? 'Remove from favorites' : 'Add to favorites'}
                                                >
                                                    <i className={favorites.includes(cca3) ? 'fas fa-heart' : 'far fa-heart'}></i>
                                                </button>
                                            )}
                                            <button className='btn' onClick={() => removeCountry(cca3)}>
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        );
                    })
                ) : (
                    <div className="no-results">
                        No countries found matching your criteria.
                    </div>
                )}
            </section>

            {/* Pagination Controls */}
            {filtered.length > itemsPerPage && (
                <div className="pagination">
                    <button
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="btn"
                    >
                        Previous
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Show pages around current page
                        let pageNumber;
                        if (totalPages <= 5) {
                            pageNumber = i + 1;
                        } else if (currentPage <= 3) {
                            pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNumber = totalPages - 4 + i;
                        } else {
                            pageNumber = currentPage - 2 + i;
                        }

                        return (
                            <button
                                key={pageNumber}
                                onClick={() => paginate(pageNumber)}
                                className={`btn ${currentPage === pageNumber ? 'active' : ''}`}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="btn"
                    >
                        Next
                    </button>
                </div>
            )}
        </>
    );
};

export default Countries;