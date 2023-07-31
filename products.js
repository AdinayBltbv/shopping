let allProducts = [];
const form = document.getElementById("form");
const searchElement = document.getElementById("search");
const container = document.getElementById("container");
form.addEventListener("submit", searchProduct);

async function showProducts(products) {
  const row = document.createElement("div");
  row.id = "row";
  row.classList.add("row", "row-gap-5");

  products.forEach((product) => {
    const col = createProductCard(product);
    row.appendChild(col);
  });

  container.appendChild(row);
}

async function getAllProducts() {
  const response = await fetch(`https://dummyjson.com/products`);
  const { products } = await response.json();
  allProducts = products;
  showProducts(allProducts);
}

async function searchProduct() {
  event.preventDefault();
  const response = await fetch(
    `https://dummyjson.com/products/search?q=` + searchElement.value
  );
  const { products } = await response.json();
  allProducts = products;
  container.removeChild(document.getElementById("row"));
  showProducts(allProducts);
}

function clearSearch() {
  searchElement.value = "";
  container.removeChild(document.getElementById("row"));
  getAllProducts();
}

function createProductCard(product) {
  const col = document.createElement("div");
  col.classList.add("col");
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.productId = product.id;
  const photo = document.createElement("img");
  photo.classList.add("card-img-top");
  photo.src = product.images[0];

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");
  const productName = document.createElement("h5");
  productName.classList.add("card-title");
  productName.innerHTML = product.title;

  const productPrice = document.createElement("h5");
  productPrice.classList.add("card-price");
  productPrice.innerHTML = `Price: ${product.price} $`;

  const more = document.createElement("a");
  more.classList.add("btn", "btn-light");
  more.innerHTML = "More";
  more.href = "details.html";
  more.addEventListener("click", () => {
    localStorage.setItem("product", JSON.stringify(product));
  });

  const editButton = document.createElement("button");
  editButton.classList.add("btn", "btn-secondary", "edit-button");
  editButton.innerHTML = "Edit";
  editButton.setAttribute("type", "button");
  editButton.addEventListener("click", () => {
    showEditModal(product);
  });

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("btn", "btn-danger", "delete-button");
  deleteButton.innerHTML = "Delete";
  deleteButton.setAttribute("type", "button");
  deleteButton.addEventListener("click", () => {
    const isConfirmed = confirm(
      "Are you sure you want to delete this product?"
    );
    if (isConfirmed) {
      deleteProduct(product.id);
    }
  });

  cardBody.appendChild(productName);
  cardBody.appendChild(productPrice);
  cardBody.appendChild(more);
  cardBody.appendChild(editButton);
  cardBody.appendChild(deleteButton);

  card.appendChild(photo);
  card.appendChild(cardBody);
  col.appendChild(card);

  return col;
}

async function deleteProduct(id) {
  const DELETE_API = (id) => `https://dummyjson.com/products/${id}`;

  const response = await fetch(DELETE_API(id), {
    method: "DELETE",
  });

  if (response.ok) {
    const productCard = document.querySelector(`[data-product-id="${id}"]`);
    if (productCard) {
      productCard.remove();
    }
  } else {
    alert("Failed to delete the product. Please try again.");
  }
}

function showEditModal(product) {
  const editModal = document.createElement("div");
  editModal.classList.add("modal", "fade");
  editModal.id = "editProductModal";
  editModal.setAttribute("tabindex", "-1");
  editModal.setAttribute("aria-labelledby", "editProductModalLabel");
  editModal.setAttribute("aria-hidden", "true");

  const modalDialog = document.createElement("div");
  modalDialog.classList.add("modal-dialog");
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  const modalHeader = document.createElement("div");
  modalHeader.classList.add("modal-header");
  const modalTitle = document.createElement("h5");
  modalTitle.classList.add("modal-title");
  modalTitle.textContent = "Edit Product";
  modalHeader.appendChild(modalTitle);

  const modalBody = document.createElement("div");
  modalBody.classList.add("modal-body");
  const titleInput = document.createElement("input");
  titleInput.classList.add("form-control");
  titleInput.type = "text";
  titleInput.placeholder = "Enter Title";
  titleInput.value = product.title;
  const priceInput = document.createElement("input");
  priceInput.classList.add("form-control");
  priceInput.type = "number";
  priceInput.placeholder = "Enter Price";
  priceInput.value = product.price;
  modalBody.appendChild(titleInput);
  modalBody.appendChild(priceInput);

  const modalFooter = document.createElement("div");
  modalFooter.classList.add("modal-footer");
  const cancelButton = document.createElement("button");
  cancelButton.classList.add("btn", "btn-secondary");
  cancelButton.setAttribute("type", "button");
  cancelButton.textContent = "Cancel";
  cancelButton.setAttribute("data-bs-dismiss", "modal");
  const saveButton = document.createElement("button");
  saveButton.classList.add("btn", "btn-primary");
  saveButton.setAttribute("type", "button");
  saveButton.textContent = "Save";
  saveButton.addEventListener("click", () => {
    updateProduct(product.id, titleInput.value, parseFloat(priceInput.value));
  });
  modalFooter.appendChild(cancelButton);
  modalFooter.appendChild(saveButton);

  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modalContent.appendChild(modalFooter);
  modalDialog.appendChild(modalContent);
  editModal.appendChild(modalDialog);

  document.body.appendChild(editModal);

  const editProductModal = new bootstrap.Modal(
    document.getElementById("editProductModal")
  );
  editProductModal.show();

  editModal.addEventListener("hidden.bs.modal", () => {
    editModal.remove();
  });
}

async function updateProduct(id, title, price) {
  const UPDATE_API = (id) => `https://dummyjson.com/products/${id}`;

  const response = await fetch(UPDATE_API(id), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: title,
      price: price,
    }),
  });

  if (response.ok) {
    const productCard = document.querySelector(`[data-product-id="${id}"]`);
    if (productCard) {
      const productName = productCard.querySelector(".card-title");
      const productPrice = productCard.querySelector(".card-price");
      productName.textContent = title;
      productPrice.textContent = `Price: ${price} $`;
    }
  } else {
    alert("Failed to update the product. Please try again.");
  }

  const editProductModal = new bootstrap.Modal(
    document.getElementById("editProductModal")
  );
  editProductModal.hide();
}

const ADD_API = "https://dummyjson.com/products/add";

async function addProduct(title, price) {
  const response = await fetch(ADD_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: title,
      price: price,
    }),
  });

  if (response.ok) {
  } else {
    alert("Failed to add a new product. Please try again.");
  }
}

async function createNewProduct(title, price) {
  await addProduct(title, price);

  const addProductModal = new bootstrap.Modal(
    document.getElementById("addProductModal")
  );
  addProductModal.hide();
}

const createButton = document.getElementById("createButton");
createButton.addEventListener("click", async () => {
  const titleInput = document.getElementById("titleInput").value;
  const priceInput = document.getElementById("priceInput").value;

  if (titleInput.trim() === "" || priceInput.trim() === "") {
    alert("Please enter both title and price.");
  } else {
    await createNewProduct(titleInput, parseFloat(priceInput));

    document.getElementById("titleInput").value = "";
    document.getElementById("priceInput").value = "";
  }
});
getAllProducts();
