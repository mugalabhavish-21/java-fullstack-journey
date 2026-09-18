document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("myButton");

    if (btn) {
        btn.addEventListener("mouseover", function () {
            document.body.style.backgroundColor = "yellow";
        });

        btn.addEventListener("mouseleave", function () {
            document.body.style.backgroundColor = "black";
        });

        btn.addEventListener("click", function () {
            alert("Button was clicked!");
        });
    }
});
