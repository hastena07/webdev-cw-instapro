import { getPosts, getUserPosts, addPost, likePost, dislikePost } from "./api.js";
import { renderAddPostPageComponent } from "./components/add-post-page-component.js";
import { renderAuthPageComponent } from "./components/auth-page-component.js";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  LOADING_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE,
} from "./routes.js";
import { renderPostsPageComponent } from "./components/posts-page-component.js";
import { renderLoadingPageComponent } from "./components/loading-page-component.js";
import { renderUserPostsPageComponent } from "./components/user-posts-page-component.js";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "./helpers.js";

export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];
export let pageData = null;

const getToken = () => (user ? `Bearer ${user.token}` : undefined);

export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};


const getPostId = (post) => post.id || post._id || "";


const getAuthorId = (post) => {
  const author = post.author || post.user || {};
  return author.id || post.userId || "";
};

export const handleLikeClick = (postId) => {
  if (!user) {
    goToPage(AUTH_PAGE);
    return;
  }

  console.log("Лайк клик, postId:", postId);
  console.log("Доступные посты:", posts.map((p) => getPostId(p)));

  
  const post = posts.find((p) => getPostId(p) === postId);
  if (!post) {
    console.error("Пост не найден:", postId);
    return;
  }

  const isLiked = (post.likes || []).some(
    (like) => (like.user_id || like.userId) === user.id
  );
  const token = getToken();

  console.log("isLiked:", isLiked, "postId:", postId);

  const apiCall = isLiked
    ? dislikePost({ token, postId })
    : likePost({ token, postId });

  apiCall
    .then((responseData) => {
      console.log("Ответ API лайка:", responseData);
      
      const updatedPost = responseData.post || responseData;
      const index = posts.findIndex((p) => getPostId(p) === postId);
      if (index !== -1) {
        posts[index] = updatedPost;
      }
      renderApp();
    })
    .catch((error) => {
      console.error("Ошибка при лайке:", error);
      
      if (page === POSTS_PAGE) {
        goToPage(POSTS_PAGE);
      } else if (page === USER_POSTS_PAGE && pageData) {
        goToPage(USER_POSTS_PAGE, pageData);
      }
    });
};

export const goToPage = (newPage, data) => {
  if (
    [POSTS_PAGE, AUTH_PAGE, ADD_POSTS_PAGE, USER_POSTS_PAGE, LOADING_PAGE].includes(
      newPage
    )
  ) {
    if (newPage === ADD_POSTS_PAGE) {
      page = user ? ADD_POSTS_PAGE : AUTH_PAGE;
      return renderApp();
    }

    if (newPage === POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();
      return getPosts({ token: getToken() })
        .then((newPosts) => {
          page = POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          goToPage(POSTS_PAGE);
        });
    }

    if (newPage === USER_POSTS_PAGE) {
      page = LOADING_PAGE;
      pageData = data;
      renderApp();
      return getUserPosts({ token: getToken(), userId: data.userId })
        .then((newPosts) => {
          page = USER_POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          goToPage(POSTS_PAGE);
        });
    }

    page = newPage;
    renderApp();
    return;
  }
  throw new Error("страницы не существует");
};

const renderApp = () => {
  const appEl = document.getElementById("app");
  if (page === LOADING_PAGE) {
    return renderLoadingPageComponent({ appEl, user, goToPage });
  }

  if (page === AUTH_PAGE) {
    return renderAuthPageComponent({
      appEl,
      setUser: (newUser) => {
        user = newUser;
        saveUserToLocalStorage(user);
        goToPage(POSTS_PAGE);
      },
      user,
      goToPage,
    });
  }

  if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({
      appEl,
      onAddPostClick({ description, imageUrl }) {
        const token = getToken();
        addPost({ token, description, imageUrl })
          .then(() => goToPage(POSTS_PAGE))
          .catch((error) => {
            console.error(error);
            alert(error.message);
          });
      },
    });
  }

  if (page === POSTS_PAGE) {
    return renderPostsPageComponent({ appEl });
  }

  if (page === USER_POSTS_PAGE) {
    return renderUserPostsPageComponent({
      appEl,
      userId: pageData ? pageData.userId : null,
    });
  }
};

goToPage(POSTS_PAGE);
