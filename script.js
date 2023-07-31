// document
//   .getElementById("loginForm")
//   .addEventListener("submit", function (event) {
//     event.preventDefault();

//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;

//     const LOGIN_API = "https://dummyjson.com/auth/login";
//     fetch(LOGIN_API, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ username: email, password: password }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Login successful!");
//         console.log("Token:", data.token);
//       })
//       .catch((error) => {
//         console.error("Login failed:", error);
//       });
//   });

  
const LOGIN_API = "https://dummyjson.com/auth/login";

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const username = document.getElementById("exampleInputUsername1").value;
  const password = document.getElementById("exampleInputPassword1").value;

  try {
    // Make a POST request to the LOGIN_API endpoint with user credentials
    const response = await fetch(LOGIN_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    // Parse the response and check if login was successful
    const data = await response.json();
    if (response.ok) {
      // Login successful
      const accessToken = data.token; // Assuming the API returns a 'token' field
      localStorage.setItem("accessToken", accessToken);
      document.location = "products.html";
    } else {
      // Login failed
      alert("Неправильный логин или пароль. Пожалуйста, попробуйте снова.");
    }
  } catch (error) {
    console.error("Error occurred during login:", error);
    alert("Произошла ошибка при попытке входа. Пожалуйста, попробуйте позже.");
  }
});