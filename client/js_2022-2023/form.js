// Base URL
// const base_url = "https://www.edciitd.com/";

// Contact Form

const contactForm = document.getElementById("myForm");
const contactLoader = document.getElementById("submitLoader");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  contactLoader.classList.add("display");
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("body").value;

  const url = `http://localhost:3000/?name=${name}&email=${email}&subject=${subject}&message=${message}`;
  try {
    axios
      .post(url, {
        mode: "no-cors",
        Headers: {
          "Content-Type": "application/json",
        },
      })
      .then((data) => {

        if (data.status == 200) {
          swal({
            title: "Message sent successfully",
            icon: "success",
          });
          document.getElementById("name").value = "";
          document.getElementById("email").value = "";
          document.getElementById("subject").value = "";
          document.getElementById("body").value = "";
          contactLoader.classList.remove("display");
        } else {
          swal({
            title: "Something went wrong, please try again",
            icon: "info",
          });
          contactLoader.classList.remove("display");
        }
      });
  } catch (error) {
    console.log("Error:" + error);
    swal({
      title: "Some Error occured",
      icon: "error",
    });
    contactLoader.classList.remove("display");
  }
});
