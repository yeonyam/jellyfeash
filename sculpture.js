document.addEventListener("DOMContentLoaded", () => {
  const titleEl = document.getElementById("detail-title");
  const galleryEl = document.getElementById("detail-gallery");

  //click
  const DATA = {
    a: {
      title: "back",
      images: ["sculpture/IMG_5382.JPG", "sculpture/IMG_5430.jpg", "sculpture/IMG_5431.jpg"],
    },

    b: {
      title: "face",
      images: ["sculpture/IMG_0549.jpg", "sculpture/IMG_0562.JPG", "sculpture/IMG_0580.jpg"],
    },

    c: {
      title: "isopod",
      images: []
    },

    d: {
      title: "org",
      images: ["sculpture/ex-121.JPG", "sculpture/ex-122.JPG", "sculpture/ex-128.jpg", "sculpture/ex-137.JPG"],
    },

    e: {
      title: "pillow",
      images: []
    },

    f: {
      title: "washing",
      images: []
    },
    };

  document.querySelectorAll("[data-key]").forEach((el) => {
    el.addEventListener("click", (evt) => {
      evt.preventDefault(); //link(<a>)면 페이지 이동 막기

      const key = el.dataset.key;
      const item = DATA[key];
      if(!item) return;

      //title
      titleEl.textContent = item.title;

      //empty gallery
      galleryEl.innerHTML = "";

      //fill image
      item.images.forEach((src) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = item.title;
        galleryEl.appendChild(img);
      });

      //하단 스크롤
      document.getElementById("detail").scrollIntoView({behavior:"smooth"});
    });
  });
});