import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, user, handleLikeClick } from "../index.js";
import { formatDate, escapeHtml } from "../helpers.js";

export function renderPostsPageComponent({ appEl }) {
  const getAuthor = (post) => post.user || post.author || {};
  const getAuthorId = (post) => getAuthor(post).id || post.userId || "";
  const getAuthorName = (post) => getAuthor(post).name || post.userName || "Без имени";
  const getAuthorImage = (post) =>
    getAuthor(post).imageUrl || getAuthor(post).avatar || "";
  const getPostImage = (post) => post.imageUrl || post.image || "";
  const getPostId = (post) => post.id || post._id || "";

  const postsHtml = posts
    .map((post) => {
      const postId = getPostId(post);
      const userId = user ? user.id : null;
      const isLiked = userId
        ? (post.likes || []).some((like) => {
            if (typeof like === "string" || typeof like === "number") {
              return String(like) === String(userId);
            }
            const likedUserId = like.user_id ?? like.userId ?? like.id;
            return String(likedUserId) === String(userId);
          })
        : false;
      const likeIconSrc = isLiked
        ? "./assets/images/like-active.svg"
        : "./assets/images/like-not-active.svg";

      const authorName = escapeHtml(getAuthorName(post));
      const description = escapeHtml(post.description || "");
      const authorImage = escapeHtml(getAuthorImage(post));
      const postImage = escapeHtml(getPostImage(post));

      return `
        <li class="post">
          <div class="post-header" data-user-id="${getAuthorId(post)}">
            <img src="${authorImage}" class="post-header__user-image" alt="Аватар">
            <p class="post-header__user-name">${authorName}</p>
          </div>
          <div class="post-image-container">
            <img class="post-image" src="${postImage}" alt="Пост">
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
            <span class="user-name">${authorName}</span>
            ${description}
          </p>
          <p class="post-date">${formatDate(post.createdAt || post.created_at || new Date().toISOString())}</p>
        </li>
      `;
    })
    .join("");

  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">
        ${posts.length === 0 ? "<li>Постов пока нет</li>" : postsHtml}
      </ul>
    </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, { userId: userEl.dataset.userId });
    });
  }

  for (let likeBtn of document.querySelectorAll(".like-button")) {
    likeBtn.addEventListener("click", () => {
      handleLikeClick(likeBtn.dataset.postId);
    });
  }
}
