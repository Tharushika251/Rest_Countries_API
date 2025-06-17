import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../country.css';

/**
 * Displays detailed information about a single country, including:
 * - Basic info (population, region, capital)
 * - Border countries
 * - Favorite toggle (if logged in)
 */
const Country = () => {
    // State for country data, loading, and error handling
    const [country, setCountry] = useState(null);
    const [borderCountries, setBorderCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get country name from URL and auth context
    const { name } = useParams();
    const { user, favorites, toggleFavorite } = useContext(AuthContext);

    // Fetch country data when component mounts or name changes
    useEffect(() => {
        const fetchCountryData = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `https://restcountries.com/v3.1/name/${name}?fullText=true`
                );
                const data = await response.json();
                setCountry(data[0]);

                // Fetch bordering countries if available
                if (data[0]?.borders?.length > 0) {
                    fetchBorderCountries(data[0].borders);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCountryData();
    }, [name]);

    // Fetch details for all border countries
    const fetchBorderCountries = async (borderCodes) => {
        try {
            const responses = await Promise.all(
                borderCodes.map(code => fetch(`https://restcountries.com/v3.1/alpha/${code}`))
            );
            const borderData = await Promise.all(responses.map(res => res.json()));
            setBorderCountries(borderData.map(country => country[0]));
        } catch (err) {
            console.error("Error fetching borders:", err);
        }
    };

    // Render loading/error states if needed
    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    if (!country) return <div className="error">Country not found</div>;

    // Destructure country data for cleaner rendering
    const {
        flags,
        name: countryName,
        population,
        region,
        subregion,
        capital,
        tld,
        currencies = {},
        languages = {},
        borders = []
    } = country;

    return (
        <section className='country'>
            <Link to="/" className='btn btn-light'>
                <i className='fas fa-arrow-left'></i> Back Home
            </Link>

            <article>
                <div className='country-inner'>
                    {/* Country flag image */}
                    <div className='flag'>
                        <img src={flags.png} alt={countryName.common} />
                    </div>

                    {/* Main country details */}
                    <div className='country-details'>
                        <div className='country-name'>
                            <h2>{countryName.common}</h2>
                            {/* Favorite button (visible to logged-in users) */}
                            {user && (
                                <button
                                    onClick={() => toggleFavorite(country.cca3)}
                                    className="favorite-btn"
                                    aria-label={
                                        favorites.includes(country.cca3)
                                            ? 'Remove from favorites'
                                            : 'Add to favorites'
                                    }
                                >
                                    <i className={favorites.includes(country.cca3) ? "fas fa-heart" : "far fa-heart"}></i>
                                </button>
                            )}
                        </div>

                        {/* Detailed info in two columns */}
                        <div className='detail-columns'>
                            <div>
                                <h5>Native Name: <span>{Object.values(countryName.nativeName || {})[0]?.common || 'N/A'}</span></h5>
                                <h5>Population: <span>{population.toLocaleString()}</span></h5>
                                <h5>Region: <span>{region}</span></h5>
                                <h5>Sub Region: <span>{subregion}</span></h5>
                                <h5>Capital: <span>{capital?.[0] || 'N/A'}</span></h5>
                            </div>
                            <div>
                                <h5>Top Level Domain: <span>{tld?.[0] || 'N/A'}</span></h5>
                                <h5>Currencies: <span>{Object.values(currencies)[0]?.name || 'N/A'}</span></h5>
                                <h5>Languages: <span>{Object.values(languages).join(', ') || 'N/A'}</span></h5>
                            </div>
                        </div>

                        {/* Border countries section (if available) */}
                        {borders.length > 0 && (
                            <div className='borders-section'>
                                <h3>Border Countries:</h3>
                                <div className='borders'>
                                    {borderCountries.map((border) => (
                                        <Link
                                            key={border.cca3}
                                            to={`/countries/${border.name.common}`}
                                            className='border-link'
                                        >
                                            {border.name.common}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </article>
        </section>
    );
};

export default Country;