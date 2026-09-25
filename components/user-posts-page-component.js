import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, user, handleLikeClick } from "../index.js";
import { formatDate, escapeHtml } from "../helpers.js";

export function renderUserPostsPageComponent({ appEl, userId }) {
  const getAuthor = (post) => post.user || post.author || {};
  const getAuthorName = (post) => getAuthor(post).name || post.userName || "Пользователь";
  const getAuthorImage = (post) =>
    getAuthor(post).imageUrl || getAuthor(post).avatar || "";
  const getPostImage = (post) => post.imageUrl || post.image || "";
  const getPostId = (post) => post.id || post._id || "";

  const author = posts.length > 0 ? getAuthor(posts[0]) : null;

  const postsHtml = posts
    .map((post) => {
      const postId = getPostId(post);
      const currentUserId = user ? user.id : null;
      const isLiked = currentUserId
        ? (post.likes || []).some((like) => {
            if (typeof like === "string" || typeof like === "number") {
              return String(like) === String(currentUserId);
            }
            const likedUserId = like.user_id ?? like.userId ?? like.id;
            return String(likedUserId) === String(currentUserId);
          })
        : false;
      const likeIconSrc = isLiked
        ? "./assets/images/like-active.svg"
        : "./assets/images/like-not-active.svg";

      const authorName = escapeHtml(getAuthorName(post));
      const description = escapeHtml(post.description || "");
      const postImage = escapeHtml(getPostImage(post));

      return `
        <li class="post">
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

  const authorName = author ? escapeHtml(author.name || "Пользователь") : "Пользователь";
  const authorImage = author ? escapeHtml(author.imageUrl || author.avatar || "") : "";

  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="posts-user-header">
        <img
          src="${authorImage}"
          class="posts-user-header__user-image"
          alt="Аватар"
        >
        <p class="posts-user-header__user-name">${authorName}</p>
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
