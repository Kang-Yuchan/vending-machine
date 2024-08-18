const apiKey = import.meta.env.VITE_PIXABAY_API_KEY;
const url = `https://pixabay.com/api/?key=${apiKey}&q=animals&image_type=photo&per_page=22`;

let config: Config = {
  sliderCon: null,
  logoCon: null,
  infoCon: null,
  btnCon: null,
};

class Animal {
  name: string = "";
  price: number = 0;
  imgUrl: string = "";
  constructor(name: string, price: number, imgUrl: string) {
    this.name = name;
    this.price = price;
    this.imgUrl = imgUrl;
  }
}

let zoo: Animal[] = [];

// データ取得関数
const getPixabayImages = async (): Promise<Animal[]> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Data = await response.json();
    return data.hits.map(
      ({ downloads, views, tags, likes, comments, largeImageURL }) => {
        const [category] = tags.split(",").filter((tag) => tag !== "animal");
        const price = Math.floor(
          downloads / 100 + views / 100 + comments + likes
        );
        return new Animal(category, price, largeImageURL);
      }
    );
  } catch (error) {
    console.error("Error fetching Pixabay images:", error);
    return [];
  }
};

// DOM要素を更新する関数
const updateDOM = (config: Config, zoo: Animal[]) => {
  const app = document.getElementById("app");
  if (app && zoo.length > 0) {
    app.innerHTML = `
      <div class='h-screen flex justify-center items-center'>
        <div class='lg:w-2/3 md:w-11/12 md:flex-row flex-col w-full bg-blue-950 flex wrap rounded-sm px-5'>
          <div id='slider'></div>
          <div class='md:w-5/12 w-full py-2'>
            <div id='logoContainer'></div>
            <div id='infoContainer'></div>
            <div id='btnContainer'></div>
            <div id='companyContainer'></div>
          </div>
        </div>
      </div>
    `;

    config.sliderCon = document.getElementById("slider");
    config.logoCon = document.getElementById("logoContainer");
    config.infoCon = document.getElementById("infoContainer");
    config.btnCon = document.getElementById("btnContainer");

    createSlider(config);
    createButtons(config, zoo);
  }
};

// ボタン作成関数
const createButtons = (config: Config, zoo: Animal[]) => {
  const buttonsHTML = zoo
    .map(
      (_, i) => `
    <div class='col-3 text-center py-2'>
      <button class='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 text-center border border-gray-400 rounded shadow w-full'>${
        i + 1
      }</button>
    </div>
  `
    )
    .join("");

  config.btnCon!.innerHTML = `<div class='w-full px-0 py-2 grid grid-cols-4 gap-4'>${buttonsHTML}</div>`;

  config.btnCon!.querySelectorAll("button").forEach((btn, i) => {
    btn.addEventListener("click", () => slideJump(config, i + 1, zoo));
  });
};

// スライド作成関数
const createSlider = (config: Config) => {
  config.sliderCon!.classList.add(
    "md:w-7/12",
    "w-full",
    "flex",
    "justify-center",
    "items-center"
  );
  config.sliderCon!.innerHTML = `
    <div id='sliderShow' class='w-full flex py-2'>
      <div id='main' class='main w-full' data-index='0'></div>
      <div id='extra' class='extra w-full'></div>
    </div>
  `;
};

// スライドジャンプ関数
const slideJump = (config: Config, input: number, zoo: Animal[]) => {
  input--;
  const main = document.getElementById("main");
  if (main) {
    let index = parseInt(main.getAttribute("data-index") ?? "0");
    const currentElement = createSlideElement(zoo, index);
    index = input;
    const nextElement = createSlideElement(zoo, index);

    config.infoCon!.innerHTML = "";
    createInfoContainer(config, zoo[index]);

    main.setAttribute("data-index", index.toString());
    animateMain(
      currentElement,
      nextElement,
      chooseRotation(index, input, zoo.length)
    );
  }
};

// スライド要素作成関数
const createSlideElement = (zoo: Animal[], index: number) => {
  const element = document.createElement("div");
  element.classList.add("flex", "justify-center");
  element.innerHTML = `<img class='w-5/6 object-contain' src='${zoo[index].imgUrl}' alt=''>`;
  return element;
};

// アニメーション関数
const animateMain = (
  currentElement: Node,
  nextElement: Node,
  animationType: AnimationType
) => {
  const main = document.getElementById("main");
  const extra = document.getElementById("extra");
  const sliderShow = document.getElementById("sliderShow");

  if (main && extra && sliderShow) {
    main.innerHTML = "";
    main.append(nextElement);

    extra.innerHTML = "";
    extra.append(currentElement);

    main.classList.add("expand-animation");
    extra.classList.add("deplete-animation");

    sliderShow.innerHTML =
      animationType === "right" ? "" : sliderShow.innerHTML;
    sliderShow.append(animationType === "right" ? extra : main);
    sliderShow.append(animationType === "right" ? main : extra);
  }
};

// アニメーション方向を選ぶ関数
const chooseRotation = (
  curr: number,
  input: number,
  length: number
): AnimationType => {
  let distance = curr - input;
  return (distance < 0 && Math.abs(distance) > length / 2) ||
    (distance > 0 && Math.abs(distance) < length / 2)
    ? "left"
    : "right";
};

const createInfoContainer = (config: Config, animal: Animal) => {
  config.infoCon!.innerHTML = `
    <div class='w-full px-0 pl-2'>
      <p class='m-0 text-slate-200'>Name : ${animal.name}</p>
      <p class='m-0 text-slate-200'>Price : $${animal.price}</p>
    </div>
  `;
};

// アプリケーションの初期化関数
const initializeApp = async () => {
  zoo = await getPixabayImages();
  updateDOM(config, zoo);
};

initializeApp();
