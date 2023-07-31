function getProduct() {
  const product = JSON.parse(localStorage.getItem("product"));
  console.log("product: ", product);
  const name = document.getElementById("name");
  name.innerHTML = `${product.title}`;

  const img = document.getElementById("img");

  img.src = product.images[0];

  const price = document.getElementById("price");
  price.innerHTML = `price:`  + product.price + ` $`;

  const description = document.getElementById("description");
  description.innerHTML = `Description: `  + product.description;

  const brand = document.getElementById("brand");
  brand.innerHTML = product.brand;
}
getProduct();
