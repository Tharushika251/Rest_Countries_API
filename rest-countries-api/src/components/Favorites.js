import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Favorites = () => {
    const { user, favorites, toggleFavorite, getFavoriteCountries } = useContext(AuthContext);
    const [favoriteCountries, setFavoriteCountries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('https://restcountries.com/v3.1/all');
                const data = await response.json();
                setFavoriteCountries(getFavoriteCountries(data));
            } catch (error) {
                console.error('Error fetching favorites:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user && favorites.length > 0) {
            fetchFavorites();
        } else {
            setIsLoading(false);
            setFavoriteCountries([]);
        }
    }, [favorites, user, getFavoriteCountries]);

    if (!user) {
        return (
            <section className='favorites'>
                <h2>Favorite Countries</h2>
                <p>Please log in to view your favorite countries.</p>
            </section>
        );
    }

    if (isLoading) return <div className="loading">Loading favorites...</div>;

    return (
        <section className='favorites'>
            <h2>Your Favorite Countries</h2>
            {favoriteCountries.length === 0 ? (
                <p>You haven't added any favorites yet.</p>
            ) : (
                <div className='grid'>
                    {favoriteCountries.map((country) => (
                        <article key={country.cca3}>
                            <div className="card-container">
                                <img src={country.flags.png} alt={country.name.common} />
                                <div className='details'>
                                    <h3>{country.name.common}</h3>
                                    <h4>Population: <span>{country.population}</span></h4>
                                    <h4>Region: <span>{country.region}</span></h4>
                                    <h4>Capital: <span>{country.capital}</span></h4>
                                </div>
                                <div className='buttons'>
                                    <Link to={`/countries/${country.name.common}`} className='btn'>
                                        Learn more
                                    </Link>
                                    <button
                                        className='btn unfavorite-btn'
                                        onClick={() => toggleFavorite(country.cca3)}
                                        aria-label="Remove from favorites"
                                    >
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Favorites;