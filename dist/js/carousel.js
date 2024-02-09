jQuery.noConflict();
(function ($) {
    $(document).ready(function () {
        // Função para criar carrosséis de filmes
        function createMovieCarousel(selector, movies, isPopular = false) {
            const carousel = $(selector);
            carousel.empty();
            let slides = '';

            movies.forEach(movie => {
                const slideClass = isPopular ? 'slide-popular' : 'slide-genre';
                slides += `<div class="${slideClass}"><img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}";"></div>`;
            });

            carousel.html('<div class="slider responsive">' + slides + '</div>');

            // Inicializa o Slick Slider após a criação do carrossel
            if (isPopular) {
                initializePopularMoviesCarousel(selector + ' .slider');
            } else {
                initializeGenreMoviesCarousel(selector + ' .slider');
            }
        }

        // Função para inicializar o Slick Slider para filmes populares
        function initializePopularMoviesCarousel(selector) {
            $(selector).slick({
                dots: true,
                autoplay: true,
                autoplaySpeed: 4000,
                infinite: true,
                speed: 300,
                slidesToShow: 3, // Atualizado para manter consistência com o requisito
                slidesToScroll: 1,
                arrows: true,
                centerMode: true,
                focusOnSelect: true,
                responsive: [
                    { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
                    { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } },
                    { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } }
                ]
            });
        }

        // Função para inicializar o Slick Slider para filmes por gênero
        function initializeGenreMoviesCarousel(selector) {
            $(selector).slick({
                dots: true,
                infinite: false,
                speed: 300,
                slidesToShow: 5, // Valor conforme especificação
                slidesToScroll: 5,
                arrows: true,
                responsive: [
                    { breakpoint: 1024, settings: { slidesToShow: 5, slidesToScroll: 5 } },
                    { breakpoint: 600, settings: { slidesToShow: 3, slidesToScroll: 3 } },
                    { breakpoint: 480, settings: { slidesToShow: 2, slidesToScroll: 2 } }
                ]
            });
        }

        // Função para buscar filmes da API de forma assíncrona
        async function fetchMoviesAsync(selector, genreId = '') {
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3YmEzM2JhNmMzNjIxZjIxMDk0ZTI1OTU2OGM3YjU3NCIsInN1YiI6IjY1YmMzYjdmNDU5YWQ2MDE3YTZjZWUzNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.yzDp_R0UW_E9eYl8H_7AkPvvtsxiyAKrZW-j48Sr5Ls'
                }
            };

            const limit = genreId === '' ? 5 : 15;
            let url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=pt-BR&page=1&sort_by=popularity.desc`;
            if (genreId) url += `&with_genres=${genreId}`;

            try {
                const response = await fetch(url, options);
                const data = await response.json();
                createMovieCarousel(selector, data.results.slice(0, limit), genreId === '');
            } catch (err) {
                console.error(err);
            }
        }

        // Carrega o primeiro carrossel de forma assíncrona e espera sua conclusão antes de carregar os demais
        fetchMoviesAsync('#carousel-popularmovie').then(() => {
            fetchMoviesAsync('#carousel-categorymovie.horror', '27');
            fetchMoviesAsync('#carousel-categorymovie.action', '28');
            fetchMoviesAsync('#carousel-categorymovie.comedy', '35');
            fetchMoviesAsync('#carousel-categorymovie.science', '878');
        });
    });
})(jQuery);
