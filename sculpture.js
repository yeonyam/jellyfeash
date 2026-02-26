document.addEventListener("DOMContentLoaded", () => {
  const titleEl = document.getElementById("detail-title");
  const textEl = document.getElementById("detail-text");
  const galleryEl = document.getElementById("detail-gallery");

  //click
  const DATA = {
    a: {
      title: "you don't see me (2025)",
      text: "steel, chiffon fabric, and wool",
      images: ["sculpture/IMG_5382.JPG", "sculpture/IMG_5430.jpg", "sculpture/IMG_5431.jpg"],
    },

    b: {
      title: "an experiment",
      text: "oil painted on beeswax with 3D printed spines and glycerine-gelatin bio plastics",
      images: ["sculpture/IMG_0549.jpg", "sculpture/IMG_0562.JPG", "sculpture/IMG_0580.jpg"],
    },

    c: {
      title: "isopod",
      images: []
    },

    d: {
      title: "불가살이",
      text: "metal, dragonskin, wool and wax",
      images: ["sculpture/ex-121.JPG", "sculpture/ex-122.JPG", "sculpture/ex-128.jpg", "sculpture/ex-137.JPG"],
    },

    e: {
      title: "known faces",
      text: "metal, glass, silicone, vinyl tubing, and water",
      images: []
    },

    f: {
      title: "washing machine",
      images: []
    },
    };

  document.querySelectorAll("[data-key]").forEach((el) => {
    el.addEventListener("click", (evt) => {
      evt.preventDefault(); //link(<a>)면 페이지 이동 막기

      const key = el.dataset.key;
      const item = DATA[key];

      if(!item) {
        console.error("data에 이 key가 없음", key);
        return;
      }

      const list = item.items || item.images;
      if (!Array.isArray(list)) {
        console.error("items/images가 배열이 아님:", key, item);
        return;
      }

      //title
      titleEl.textContent = item.title || "";
      textEl.textContent = item.text || "";

      //empty gallery
      galleryEl.innerHTML = "";

      //fill image
      
      if (Array.isArray(item.images)) {
        item.images.forEach((src) => {
          const img = document.createElement("img");
          img.src = src;
          img.alt = item.title || "";
          img.loading = "lazy";
          galleryEl.appendChild(img);
        });
      } else {
        console.error("images가 배열이 아님:", key, item);
      }

      //하단 스크롤
      document.getElementById("detail").scrollIntoView({behavior:"smooth"});
    });
  });
});