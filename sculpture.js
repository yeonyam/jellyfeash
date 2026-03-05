document.addEventListener("DOMContentLoaded", () => {
  const titleEl = document.getElementById("detail-title");
  const textEl = document.getElementById("detail-text");
  const galleryEl = document.getElementById("detail-gallery")
  const audio = document.getElementById("bgm");
  const btn = document.getElementById("music-btn");

  //click
  const DATA = {
    a: {
      title: "you don't see me (2025)",
      text: "steel, chiffon fabric, and wool",
      images: ["sculpture/IMG_5382.JPG",
               "sculpture/IMG_5430.jpg",
               "sculpture/IMG_5431.jpg"],
    },

    b: {
      title: "an experiment",
      text: "oil painted on beeswax with 3D printed spines and glycerine-gelatin bio plastics",
      images: ["sculpture/IMG_0549.jpg",
               "sculpture/IMG_0562.JPG",
               "sculpture/IMG_0580.jpg"],
    },

    c: {
      title: "an isopod",
      images: ["sculpture/IMG_5046.jpg",
               "sculpture/49C35CD9-1A27-4F66-BB59-9A68186F0445.jpg"
      ],
    },

    d: {
      title: "불가살이",
      text: "metal, dragonskin, wool and wax",
      images: ["sculpture/ex-121.JPG",
               "sculpture/ex-122.JPG",
               "sculpture/ex-128.jpg",
               "sculpture/ex-137.JPG"],
    },

    e: {
      title: "known faces",
      text: "metal, glass, silicone, vinyl tubing, and water",
      images: ["sculpture/20251209-IMG_4319.jpg",
               "sculpture/20251209-IMG_4330.jpg",
               "sculpture/20251209-IMG_4332.jpg",
               "sculpture/20251209-IMG_4345.jpg",
               "sculpture/20251209-IMG_4347.jpg",
               ],
    },

    f: {
      title: "washing machine",
      text: "bad image(yet)",
      images: ["sculpture/IMG_9544.jpg"],
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
          const ext = src.split(".").pop().toLowerCase();

          //video 확장자 목록
          const videoExts = ["mp4", "webm", "mov"];

          let element;

          if (videoExts.includes(ext)) {
            //gen vid
            element = document.createElement("video");
            element.src = src;
            element.controls = true;
            element.autoplay = false;
            element.loop = true;
            element.muted = true; //자동재생
          } else {
            //gen image
            element = document.createElement("img");
            element.src = src;
            element.alt = item.title;
          }

          element.className = "detail-media";

          if (element.tagName === "IMG") {
            element.loading = "lazy";
          }

          videoExts.preload = "none";

          galleryEl.appendChild(element);
        });
      } else {
        console.error("images가 배열이 아님:", key, item);
      }

      //하단 스크롤
      document.getElementById("detail").scrollIntoView({behavior:"smooth"});
    });
  });
});

const audio = document.getElementById("bgm");
const btn = document.getElementById("music-btn");

 async function tryPlayIfOn() {
    if (localStorage.getItem("bgm_on") === "1") {
      try {
        await audio.play();
        btn.textContent = "Pause";
      } catch (e) {
        btn.textContent = "Play";
      }
    }
  }

  async function tryPlayIfOn() {
    if (localStorage.getItem("bgm_on") === "1") {
      try {
        await audio.play();
        btn.textContent = "pause";
      } catch (e) {
        btn.textContent = "play";
      }
    }
  }

  btn.addEventListener("click", async () => {
    try {
      if (audio.paused) {
        await audio.play();
        btn.textContent = "pause";
        localStorage.setItem("bgm_on", "1");
      } else {
        audio.pause();
        btn.textContent = "play";
        localStorage.setItem("bgm_on", "0");
      }
    } catch (e) {
      console.log(e);
    }
  });

  tryPlayIfOn();



  