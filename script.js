const API_URL = 'https://api.github.com';
let resultUrl;
const form = document.querySelector('.search__form');
const submitBtn = form.elements.submitBtn;
const inputText = form.elements.text;
let inputString = form.elements.text.value;
const title = document.querySelector('.search__title');
const repoList = document.querySelector('.repo__list');

inputText.addEventListener('change', () => {
  inputString = form.elements.text.value;
  makeQuery(inputString);
});

inputText.addEventListener('blur', () => {
  if (inputString.length < 3) errorMessage(inputText);
});

inputText.addEventListener('focus', () => {
  if (inputText.nextElementSibling.classList.contains('error')) {
    inputText.nextElementSibling.remove();
    inputText.style.border = '2px solid transparent';
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  if (
    !inputText.nextElementSibling.classList.contains('error') &&
    inputString.length < 3
  ) {
    errorMessage(inputText);
  }

  if (inputString.length < 3) {
    console.log(inputString.length);
  } else {
    go();
  }
});

function makeQuery(inputStr) {
  resultUrl = `${API_URL}/search/repositories?q=${inputStr}`;
}

function errorMessage(element) {
  const msg = document.createElement('div');
  msg.innerHTML = 'Заполните это поле (минимум 3 символа)';
  msg.classList.add('error');
  element.after(msg);
  element.style.border = '2px solid crimson';
}

async function getRepos() {
  try {
    const response = await fetch(resultUrl);
    const result = await response.json();

    return result.items;
  } catch (error) {
    title.append(error.toString());
  }
}

async function go() {
  displayRepos();
}

async function displayRepos() {
  const data = await getRepos();

  repoList.innerHTML = '';

  data?.forEach((element) => {
    const name = element.name;
    const url = element.html_url;

    const description = element.description;
    const language = element.language;
    const owner = element.owner.login;

    const li = document.createElement('li');
    li.classList.add('repo__item');

    li.innerHTML = `<p class="repo__label">Название:</p>
                  <p class="repo__name">
                  <a
                  href="${url}"
                  class="repo__link"
                  target="_blank"
                  >${name}</a
                  >
                  </p>
                  <p class="repo__label">Описание:</p>
                  <p class="repo__description">${description}</p>
                  <p class="repo__label">Язык:</p>
                  <p class="repo__language">${language}</p>
                  <p class="repo__label">Автор:</p>
                  <p class="repo__owner">${owner}</p>`;
    repoList.append(li);
  });
}
