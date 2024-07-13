document.addEventListener("DOMContentLoaded", function() {
    var modal = document.getElementById("modal");
    var thumbnails = document.querySelectorAll(".thumbnail");
    var modalImg = document.querySelector(".modal-content");
    var closeBtn = document.querySelector(".close");
  
    thumbnails.forEach(function(thumbnail) {
      thumbnail.addEventListener("click", function() {
        modal.style.display = "block";
        modalImg.src = this.src;
      });
    });
  
    closeBtn.addEventListener("click", function() {
      modal.style.display = "none";
    });
  
    window.addEventListener("click", function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    });
  });
  