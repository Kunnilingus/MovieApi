//Настройки
const apiKey = "bbd09c97-b8e9-48a6-b3a8-71d99e8437aa";
const url = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";
const options = {
  method: "GET",
  headers: {
    "X-API-KEY": apiKey,
    "Content-Type": "application/json",
  },
};

//ДОМ элементы
const filmsWrapper = document.querySelector(".films");
const loader = document.querySelector(".loader-wrapper");
const showMoreBtn = document.querySelector(".show-more");

showMoreBtn.onclick = fetchAndRenderFilms;

let page = 1;

//Получение и вывод топ250 фильиов
async function fetchAndRenderFilms() {
  //Показываем прелоадер
  loader.classList.remove("none");

  //Получаем данные по фильмам
  const data = await fetchData(url + `top?page=${page}`, options);

  if (data.pagesCount > 1) {
    page++;
  }

  //Проверка на наличие дополнительных страниц с фильмами
  if (data.pagesCount > 1) {
    //Отображаем кнопку
    showMoreBtn.classList.remove("none");
  }

  //Убираем прелоадер
  loader.classList.add("none");

  //Отображаем фильмы на странице
  renderFilms(data.films);

  //Скрываем кнопку,когда последняя страница отображена
  if (page > data.pagesCount) {
    showMoreBtn.classList.add("none");
  }
}

function renderFilms(films) {
  for (film of films) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.id = film.filmId;
    card.onclick = openFilmDetails;

    const html = `
    <img src=${film.posterUrlPreview} alt="Cover" class="card__img" />
    <h3 class="card__title">${film.nameRu}</h3>
    <p class="card__year">${film.year}</p>
    <p class="card__rate">Рейтинг: ${film.rating}</p>
  `;

    card.insertAdjacentHTML("afterbegin", html);

    filmsWrapper.insertAdjacentElement("beforeend", card);
  }
}

async function fetchData(url, options) {
  const response = await fetch(url, options);
  const data = await response.json();
  return data;
}

async function openFilmDetails(e) {
  //Получаем id фильма при клике на карточку
  const id = e.currentTarget.id;

  // Получаем данные фильма
  const data = await fetchData(url + id, options);

  //Отобразить детали фильиа на странице
  renderFilmData(data);
}

function renderFilmData(film) {
  //0. проверка на открытый фильм и его удаление
  if (document.querySelector(".container-right")) {
    document.querySelector(".container-right").remove();
  }

  //1. Отрендерить правый контейнер
  const containerRight = document.createElement("div");
  containerRight.classList.add("container-right");
  document.body.insertAdjacentElement("beforeend", containerRight);

  //2 Кнопка закрытия
  const btnClose = document.createElement("button");
  btnClose.classList.add("btn-close");
  btnClose.innerHTML = '<img src="./img/cross.svg" alt="close" width="24" />';
  containerRight.insertAdjacentElement("afterbegin", btnClose);

  //2.1 Кнопка закрытия по клику - удаление контейнера со страницы
  btnClose.onclick = () => {
    containerRight.remove();
  };

  //3 Детали фильма
  const html = `<div class="film">
  <div class="film__title">${film.nameRu}</div>
  <div class="film__img">
    <img src=${film.posterUrl} alt="cover" />
  </div>
  <div class="film__desc">
    <p class="film__details">Год: ${film.year}</p>
    <p class="film__details">Рейтинг: ${film.ratingKinopoisk}</p>
    <p class="film__details">Продолжительность: ${formatFilmLength(
      film.filmLength
    )}</p>
    <p class="film__details">Страна: ${formatCountry(film.countries)}</p>
    <p class="film__text">
    ${film.description}
    </p>
  </div>
</div>`;

  containerRight.insertAdjacentHTML("beforeend", html);
}

function formatFilmLength(value) {
  let length = "";

  const hours = Math.floor(value / 60);
  const minutes = value % 60;

  if (hours > 0) length += hours + " ч. ";
  if (minutes > 0) length += minutes + " мин.";

  return length;
}

function formatCountry(countriesArray) {
  let countriesString = "";

  for (country of countriesArray) {
    countriesString += country.country;
    if (countriesArray.indexOf(country) + 1 < countriesArray.length) {
      countriesString += ", ";
    }
  }
  return countriesString;
}

fetchAndRenderFilms().catch((err) => console.log(err));
