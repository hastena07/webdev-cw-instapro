import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";

  const render = () => {
    const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>
        <div class="form">
          <h3 class="form-title">Добавить пост</h3>
          <div class="form-inputs">
            <div class="upload-image-container"></div>
            <textarea
              class="input textarea"
              id="description-input"
              placeholder="Опишите фото"
            ></textarea>
            <div class="form-error"></div>
            <button class="button" id="add-button">Опубликовать</button>
          </div>
        </div>
      </div>
    `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    renderUploadImageComponent({
      element: uploadImageContainer,
      onImageUrlChange(newImageUrl) {
        imageUrl = newImageUrl;
      },
    });

    const setError = (message) => {
      appEl.querySelector(".form-error").textContent = message;
    };

    document.getElementById("add-button").addEventListener("click", () => {
      setError("");

      const description = document
        .getElementById("description-input")
        .value.trim();

      if (!imageUrl) {
        setError("Загрузите фотографию");
        return;
      }

      if (!description) {
        setError("Добавьте описание");
        return;
      }

      onAddPostClick({ description, imageUrl });
    });
  };

  render();
}
