/*document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".hextra-sidebar-collapsible-button");
  buttons.forEach(function (button) {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const list = button.parentElement.parentElement;
      if (list) {
        list.classList.toggle("open")
      }
    });
  });
});*/


document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".hextra-sidebar-collapsible-link");
  buttons.forEach(function (button) {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const list = button.parentElement;
      if (list) {
        list.classList.toggle("open")
      }
    });
  });
});
