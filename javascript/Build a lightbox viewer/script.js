
const galleryItems = document.querySelectorAll(".gallery-item");


const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const closeBtn = document.getElementById("close-btn");


function openLightbox(e) {

    const fullSrc = e.target.src.replace("-thumbnail", "");
    lightboxImage.src = fullSrc;


    lightbox.style.display = "flex";
}
galleryItems.forEach((item) => {
    item.addEventListener("click", openLightbox);
});


function closeLightbox() {
    lightbox.style.display = "none";
    lightboxImage.src = ""; // clear src
}

// Close lightbox when clicking close button
closeBtn.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});