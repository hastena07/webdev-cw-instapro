import { goToPage, logout, user } from "../index.js";
import { ADD_POSTS_PAGE, AUTH_PAGE, POSTS_PAGE } from "../routes.js";

export function renderHeaderComponent({ element }) {
  const userImageUrl = user?.imageUrl || user?.avatar || "";

  element.innerHTML = `
    <div class="page-header">
      <h1 class="logo">instapro</h1>

      <button class="header-button add-or-login-button">
        ${
          user
            ? `<div title="Добавить пост" class="add-post-sign"></div>`
            : "Войти"
        }
      </button>

      ${
        user
          ? `
            <button class="header-button logout-button">
              ${userImageUrl ? `<img src="${userImageUrl}" class="header-user-avatar" alt="Аватар пользователя" />` : ""}
              Выйти
            </button>
          `
          : ""
      }
    </div>
  `;

  // Клик по «Добавить пост» / «Войти»
  element
    .querySelector(".add-or-login-button")
    .addEventListener("click", () => {
      if (user) {
        goToPage(ADD_POSTS_PAGE);
      } else {
        goToPage(AUTH_PAGE);
      }
    });

  // Клик по логотипу
  element.querySelector(".logo").addEventListener("click", () => {
    goToPage(POSTS_PAGE);
  });

  // Клик по кнопке «Выйти»
  const logoutBtn = element.querySelector(".logout-button");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  return element;
}
