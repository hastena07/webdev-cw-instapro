const BASE_URL = "https://wedev-api.sky.pro/api/v1/hastena07/instapro";
const UPLOAD_URL = "https://wedev-api.sky.pro/api/upload/image";

export const getPosts = async ({ token }) => {
  const res = await fetch(BASE_URL, {
    method: "GET",
    headers: token ? { Authorization: token } : {},
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ошибка ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.posts || [];
};

export const getUserPosts = async ({ token, userId }) => {
  const res = await fetch(`${BASE_URL}/${userId}/user-posts`, {
    method: "GET",
    headers: token ? { Authorization: token } : {},
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ошибка ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.posts || [];
};

export const addPost = async ({ token, description, imageUrl }) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: JSON.stringify({
      description,
      imageUrl,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ошибка ${res.status}: ${text.slice(0, 200)}`);
  }

  return await res.json();
};

export const likePost = async ({ token, postId }) => {
  
  const res = await fetch(`${BASE_URL}/${postId}/like`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ошибка ${res.status}: ${text.slice(0, 200)}`);
  }

  return await res.json();
};

export const dislikePost = async ({ token, postId }) => {
  
  const res = await fetch(`${BASE_URL}/${postId}/dislike`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ошибка ${res.status}: ${text.slice(0, 200)}`);
  }

  return await res.json();
};

export const registerUser = async ({ login, password, name, imageUrl }) => {
  const res = await fetch("https://wedev-api.sky.pro/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ошибка ${res.status}: ${text.slice(0, 200)}`);
  }

  return await res.json();
};

export const loginUser = async ({ login, password }) => {
  const res = await fetch("https://wedev-api.sky.pro/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ошибка ${res.status}: ${text.slice(0, 200)}`);
  }

  return await res.json();
};

export const uploadImage = async ({ file }) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ошибка ${res.status}: ${text.slice(0, 200)}`);
  }

  return await res.json();
};
