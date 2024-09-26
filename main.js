document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Ready...FAMILY');
    const movieForm = document.querySelector('#movieLookupForm');
    console.log('MOVIE FORM: ', movieForm);

    movieForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Corrected the typo
        console.log('FORM SUBMITTED!');
        const formData = new FormData(e.target);
        console.log('FORM DATA: ', formData);
        const movieTitle = formData.get('movieTitle');
        lookupMovie(movieTitle);
    });
    function lookupMovie(movieTitle) {
        const url = `https://www.omdbapi.com/?apikey=b988764d=${movieTitle}`;
        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log('MOVIE DATA: ', data);
                return generateMovie(data);
            });
    }
    function generateMovie(movie) {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie');
        movieDiv.innerHTML = `
      <h2>${movie.Title}</h2>
      <p>Released: ${movie.Released}</p>
      <p>Runtime: ${movie.Runtime}</p>
      <p>Genre: ${movie.Genre}</p>
      <img src="${movie.Poster}" alt="${movie.Title} movie poster">
    `;
        return movieDiv;
    }
});
