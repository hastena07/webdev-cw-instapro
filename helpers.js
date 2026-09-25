export function saveUserToLocalStorage(user) {
  window.localStorage.setItem("user", JSON.stringify(user));
}

export function getUserFromLocalStorage() {
  try {
    return JSON.parse(window.localStorage.getItem("user"));
  } catch (error) {
    return null;
  }
}

export function removeUserFromLocalStorage() {
  window.localStorage.removeItem("user");
}

function plural(n, forms) {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return forms[0];
  if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return forms[1];
  return forms[2];
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (seconds < 60) return "только что";
  if (minutes < 60) {
    return `${minutes} ${plural(minutes, ["минуту", "минуты", "минут"])} назад`;
  }
  if (hours < 24) {
    return `${hours} ${plural(hours, ["час", "часа", "часов"])} назад`;
  }
  if (days < 7) {
    return `${days} ${plural(days, ["день", "дня", "дней"])} назад`;
  }
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} ${plural(weeks, ["неделю", "недели", "недель"])} назад`;
  }
  if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} ${plural(months, ["месяц", "месяца", "месяцев"])} назад`;
  }
  const years = Math.floor(days / 365);
  return `${years} ${plural(years, ["год", "года", "лет"])} назад`;
}

export function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
