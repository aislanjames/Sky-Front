jQuery.noConflict();
(function ($) {
    $(document).ready(function () {
        // Função para criar carrosséis de filmes
        function createMovieCarousel(selector, movies) {
            const carousel = $(selector);
            carousel.empty(); // Limpa o conteúdo anterior
            let slides = '';

            movies.forEach(movie => {
                slides += `<div><img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}"></div>`;
            });

            carousel.html('<div class="slider responsive">' + slides + '</div>');
            initializeSlick(selector + ' .slider');
        }

        // Função para inicializar o Slick Slider
        function initializeSlick(selector) {
            $(selector).slick({
                dots: true,
                infinite: true,
                speed: 300,
                slidesToShow: 3,
                slidesToScroll: 3,
                arrows: true,
                responsive: [
                    { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3, infinite: true, dots: true } },
                    { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 2 } },
                    { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } }
                ]
            });
        }

        // Função para buscar filmes da API
        function fetchMovies(selector, genreId = '') {
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3YmEzM2JhNmMzNjIxZjIxMDk0ZTI1OTU2OGM3YjU3NCIsInN1YiI6IjY1YmMzYjdmNDU5YWQ2MDE3YTZjZWUzNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.yzDp_R0UW_E9eYl8H_7AkPvvtsxiyAKrZW-j48Sr5Ls'
                }
            };

            let url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=pt-BR&page=1&sort_by=popularity.desc';
            if (genreId) url += `&with_genres=${genreId}`;

            fetch(url, options)
                .then(response => response.json())
                .then(data => createMovieCarousel(selector, data.results.slice(0, 15))) // Assume 15 filmes por carrossel
                .catch(err => console.error(err));
        }

        // Busca e cria os carrosséis
        fetchMovies('#carousel-popularmovie'); // Filmes populares
        fetchMovies('#carousel-horror', '27'); // Terror
        fetchMovies('#carousel-science', '878'); // Ficção científica
        fetchMovies('#carousel-action', '28'); // Ação
        fetchMovies('#carousel-comedy', '35'); // Comédia
    });
})(jQuery);

