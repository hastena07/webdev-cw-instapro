import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, user, handleLikeClick } from "../index.js";
import { formatDate } from "../helpers.js";

export function renderUserPostsPageComponent({ appEl, userId }) {
  const getAuthor = (post) => post.author || post.user || {};
  const getAuthorName = (post) => getAuthor(post).name || post.userName || "Пользователь";
  const getAuthorImage = (post) =>
    getAuthor(post).imageUrl || getAuthor(post).avatar || "";
  const getPostImage = (post) => post.image || post.imageUrl || "";
  const getPostId = (post) => post.id || post._id || "";

  const author = posts.length > 0 ? getAuthor(posts[0]) : null;

  const postsHtml = posts
    .map((post) => {
      const postId = getPostId(post);
      const isLiked = user
        ? (post.likes || []).some(
            (like) => (like.user_id || like.userId) === user.id
          )
        : false;
      const likeIconSrc = isLiked
        ? "./assets/images/like-active.svg"
        : "./assets/images/like-not-active.svg";

      return `
        <li class="post">
          <div class="post-image-container">
            <img class="post-image" src="${getPostImage(post)}" alt="Пост">
          </div>
          <div class="post-likes">
            <button data-post-id="${postId}" class="like-button">
              <img src="${likeIconSrc}" alt="Лайк">
            </button>
            <p class="post-likes-text">
              Нравится: <strong>${(post.likes || []).length}</strong>
            </p>
          </div>
          <p class="post-text">
            <span class="user-name">${getAuthorName(post)}</span>
            ${post.description || ""}
          </p>
          <p class="post-date">${formatDate(post.createdAt || post.created_at || new Date().toISOString())}</p>
        </li>
      `;
    })
    .join("");

  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="posts-user-header">
        <img
          src="${author ? (author.imageUrl || author.avatar || "") : ""}"
          class="posts-user-header__user-image"
          alt="Аватар"
        >
        <p class="posts-user-header__user-name">
          ${author ? (author.name || "Пользователь") : "Пользователь"}
        </p>
      </div>
      <ul class="posts">
        ${posts.length === 0 ? "<li>У этого пользователя пока нет постов</li>" : postsHtml}
      </ul>
    </div>
  `;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let likeBtn of document.querySelectorAll(".like-button")) {
    likeBtn.addEventListener("click", () => {
      handleLikeClick(likeBtn.dataset.postId);
    });
  }
}
