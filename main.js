let movieList = [];

document.addEventListener('DOMContentLoaded', function () {
    const movieLookupForm = document.getElementById('movieLookupForm');
    const trailerModal = document.getElementById('trailerModal');
    const closeButton = document.querySelector('.close-button');
    const trailerContainer = document.getElementById('trailerContainer');

    movieLookupForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const movieTitle = movieLookupForm.movieTitle.value.trim();

        if (movieTitle) {
            fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=b988764d`)
                .then(response => response.json())
                .then(data => {
                    if (data.Response === 'True') {
                        movieList.push(data);

                        displayMovies();

                        movieLookupForm.movieTitle.value = '';
                    } else {
                        alert('Movie not found. Please try another title.');
                    }
                })
                .catch(error => {
                    console.error('Error fetching movie data:', error);
                    alert('Error fetching movie data. Please try again later.');
                });
        }
    });

    function displayMovies() {
        const movieContainer = document.getElementById('movieContainer');
        movieContainer.innerHTML = '';

        movieList.forEach(movie => {
            const movieDiv = document.createElement('div');
            movieDiv.classList.add('movie-item');

            movieDiv.innerHTML = `
                ${movie.Poster !== 'N/A' ? `<img src="${movie.Poster}" alt="${movie.Title} Poster">` : ''}
                <h2>${movie.Title}</h2>
                <p><strong>Year:</strong> ${movie.Year}</p>
                <p><strong>Genre:</strong> ${movie.Genre}</p>
                <p><strong>Plot:</strong> ${movie.Plot}</p>
                <p><strong>Rated:</strong> ${movie.Rated}</p>
                <p><strong>IMDB Rating:</strong> ${movie.imdbRating}</p>
                <p><strong>Metascore:</strong> ${movie.Metascore}</p>
                
                <button class="show-trailer-button" data-title="${movie.Title}">Watch Trailer</button>
            `;

            movieContainer.appendChild(movieDiv);
        });

        const trailerButtons = document.querySelectorAll('.show-trailer-button');
        trailerButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                const movieTitle = e.target.getAttribute('data-title');
                getYouTubeTrailer(movieTitle);
            });
        });
    }

    closeButton.addEventListener('click', function () {
        trailerModal.style.display = 'none';
        trailerContainer.innerHTML = '';
    });

    window.addEventListener('click', function (event) {
        if (event.target == trailerModal) {
            trailerModal.style.display = 'none';
            trailerContainer.innerHTML = '';
        }
    });

    function getYouTubeTrailer(movieTitle) {
        const apiKey = "AIzaSyDTp30iS-PU426tTYaDn1ZME79HdbW9m08";
        const query = encodeURIComponent(`${movieTitle} official trailer`);
        fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${query}&key=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                if (data.items && data.items.length > 0) {
                    const videoId = data.items[0].id.videoId;
                    const iframe = document.createElement('iframe');
                    iframe.src = `https://www.youtube.com/embed/${videoId}`;
                    iframe.width = '100%';
                    iframe.height = '400';
                    iframe.frameBorder = '0';
                    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                    iframe.allowFullscreen = true;

                    trailerContainer.innerHTML = '';
                    trailerContainer.appendChild(iframe);
                    trailerModal.style.display = 'block';
                } else {
                    alert('Trailer not found.');
                }
            })
            .catch(error => {
                console.error('Error fetching YouTube data:', error);
                alert('Error fetching trailer. Please try again later.');
            });
    }
});
