document.addEventListener('DOMContentLoaded', function() {
    const movieLookupForm = document.getElementById('movieLookupForm');
    const movieTitleInput = document.getElementById('movieTitle');
    const movieContainer = document.getElementById('movieContainer');
    const movieDetails = document.getElementById('movieDetails');
    const flipCard = document.getElementById('flipCard');
    const flipCardInner = flipCard.querySelector('.flip-card-inner');
    const showTrailerButton = document.getElementById('showTrailerButton');
    const trailerModal = document.getElementById('trailerModal');
    const closeButton = document.querySelector('.close-button');
    const trailerContainer = document.getElementById('trailerContainer');
    const loadingSpinner = document.getElementById('loadingSpinner');
  
    const OMDB_API_KEY = 'b988764d';
    const YOUTUBE_API_KEY = 'AIzaSyDTp30iS-PU426tTYaDn1ZME79HdbW9m08';
  
    movieLookupForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const movieTitle = movieTitleInput.value.trim();
      if (movieTitle) {
        searchMovie(movieTitle);
      }
    });
  
    async function searchMovie(title) {
        try {
          console.log('Searching for movie:', title);
          loadingSpinner.style.display = 'block';
      
          const response = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}`);
          const data = await response.json();
          console.log('OMDb API response:', data);
      
          if (data.Response === 'True') {
            displayMovieDetails(data);
            flipCard.classList.add('show-back');
          } else {
            alert('Movie not found. Please try another title.');
          }
        } catch (error) {
          console.error('Error fetching movie data:', error);
          alert('An error occurred while fetching movie data.');
        } finally {
          loadingSpinner.style.display = 'none';
        }
      }
      
  
    function displayMovieDetails(data) {
      console.log('Displaying movie details:', data);
      movieDetails.innerHTML = `
        <img src="${data.Poster !== 'N/A' ? data.Poster : 'images/no_poster.png'}" alt="${data.Title} Poster">
        <h2>${data.Title}</h2>
        <p><strong>Year:</strong> ${data.Year}</p>
        <p><strong>Rated:</strong> ${data.Rated}</p>
        <p><strong>Genre:</strong> ${data.Genre}</p>
        <p><strong>Plot:</strong> ${data.Plot}</p>
      `;
    }
  
    showTrailerButton.addEventListener('click', function() {
      const movieTitle = movieTitleInput.value.trim();
      if (movieTitle) {
        fetchTrailer(movieTitle);
        trailerModal.style.display = 'block';
      }
    });
  
    async function fetchTrailer(title) {
      try {
        console.log('Fetching trailer for:', title);
        trailerContainer.innerHTML = '<p>Loading trailer...</p>';
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(title + ' trailer')}&key=${YOUTUBE_API_KEY}&type=video&videoEmbeddable=true`);
        const data = await response.json();
        console.log('YouTube API response:', data);
  
        if (data.items && data.items.length > 0) {
          const videoId = data.items[0].id.videoId;
          displayTrailer(videoId);
        } else {
          trailerContainer.innerHTML = '<p>Trailer not found.</p>';
        }
      } catch (error) {
        console.error('Error fetching trailer:', error);
        trailerContainer.innerHTML = '<p>An error occurred while fetching the trailer.</p>';
      }
    }
  
    function displayTrailer(videoId) {
      console.log('Displaying trailer with video ID:', videoId);
      trailerContainer.innerHTML = `
        <iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
      `;
    }
  
    closeButton.addEventListener('click', function() {
      trailerModal.style.display = 'none';
      trailerContainer.innerHTML = '';
    });
  

    window.addEventListener('click', function(event) {
      if (event.target == trailerModal) {
        trailerModal.style.display = 'none';
        trailerContainer.innerHTML = '';
      }
    });
  });
  