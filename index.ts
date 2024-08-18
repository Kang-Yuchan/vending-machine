const apiKey = import.meta.env.VITE_PIXABAY_API_KEY;
const url = `https://pixabay.com/api/?key=${apiKey}&q=animals&image_type=photo&per_page=22`;

let config: Config = {
  sliderCon: null,
  logoCon: null,
  infoCon: null,
  btnCon: null,
};
class Controller {
  static slideJump(input: number) {
    input--;
    let main = document.getElementById("main");
    let index: number;
    if (main) {
      index = parseInt(main.getAttribute("data-index") ?? "0");
      let currentElement = document.createElement("div");
      currentElement.classList.add("flex", "justify-center");

      if (index == -1) {
        currentElement.innerHTML += `
								<img class='w-5/6 object-contain' src='${zoo[0].imgUrl}' alt=''>
						`;
      } else {
        currentElement.innerHTML += `
								<img class='w-5/6 object-contain' src='${zoo[index].imgUrl}' alt=''>
						`;
      }

      const animationType = Algorithm.chooseRotation(index, input, zoo.length);

      index = input;

      let nextElement = document.createElement("div");
      nextElement.classList.add("flex", "justify-center");
      nextElement.innerHTML = `
						<img class='w-5/6 object-contain' src='${zoo[index].imgUrl}' alt=''>
				`;

      config.infoCon!.innerHTML = "";
      View.createInfoContainer(zoo[index]);

      main.setAttribute("data-index", index.toString());
      this.animateMain(currentElement, nextElement, animationType);
    }
  }

  static animateMain(
    currentElement: Node,
    nextElement: Node,
    animationType: AnimationType
  ) {
    let main = document.getElementById("main");
    let extra = document.getElementById("extra");
    let sliderShow = document.getElementById("sliderShow");

    if (main && extra && sliderShow) {
      main.innerHTML = "";
      main.append(nextElement);

      extra.innerHTML = "";
      extra.append(currentElement);

      main.classList.add("expand-animation");
      extra.classList.add("deplete-animation");

      if (animationType === "right") {
        sliderShow.innerHTML = "";
        sliderShow.append(extra);
        sliderShow.append(main);
      } else if (animationType === "left") {
        sliderShow.innerHTML = "";
        sliderShow.append(main);
        sliderShow.append(extra);
      }
    }
  }
}

class View {
  static createButtons() {
    let htmlString = "";
    zoo.forEach((_, i) => {
      htmlString += `
							<div class='col-3 text-center py-2'>
									<button class='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 text-center border border-gray-400 rounded shadow w-full'>${
                    i + 1
                  }</button>
							</div>    
					`;
    });

    config.btnCon!.innerHTML = `
					<div class='w-full px-0 py-2 grid grid-cols-4 gap-4'>
							${htmlString}
					</div>
			`;

    zoo.forEach((_, i) => {
      config
        .btnCon!.querySelectorAll("button")
        [i].addEventListener("click", () => {
          Controller.slideJump(i + 1);
        });
    });
  }

  static createInfoContainer(animal: Animal) {
    config.infoCon!.innerHTML = `
					<div class='w-full px-0 pl-2'>
							<p class='m-0 text-slate-200'>Name : ${animal.name}</p>
							<p class='m-0 text-slate-200'>Price : $${animal.price}</p>
					</div>
			`;
  }

  static createSlider() {
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
  }
}

class Algorithm {
  static chooseRotation(
    curr: number,
    input: number,
    length: number
  ): AnimationType {
    let distance = curr - input;

    if (
      (distance < 0 && Math.abs(distance) > length / 2) ||
      (distance > 0 && Math.abs(distance) < length / 2)
    )
      return "left";
    else return "right";
  }
}

const getPixabayImages = async () => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Data = await response.json();
    zoo = data.hits.map((animalData) => {
      const { downloads, views, tags, likes, comments, largeImageURL } =
        animalData;
      const [category] = tags.split(",").filter((tag) => tag !== "animal");
      const price = Math.floor(
        downloads / 100 + views / 100 + comments + likes
      );

      return new Animal(category, price, largeImageURL);
    });
  } catch (error) {
    console.error("Error fetching Pixabay images:", error);
  }
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

const initializeApp = async () => {
  const app = document.getElementById("app");
  await getPixabayImages();

  if (app && zoo.length > 0) {
    app.innerHTML = `
            <div class='h-screen flex justify-center items-center'>
                <div class='lg:w-2/3 md:w-11/12 md:flex-row flex-col w-full bg-blue-950 flex wrap rounded-sm px-5'>
                    <div id='slider'>
                    </div>
                    <div class='md:w-5/12 w-full py-2'>
                        <div id='logoContainer'>
                        </div>
                        <div id='infoContainer'>
                        </div> 
                        
                        <div id='btnContainer'>
                        </div>
                        <div id='companyContainer'>
                        </div>
                    </div>
                </div>
            </div>
        `;

    config.sliderCon = document.getElementById("slider");
    config.logoCon = document.getElementById("logoContainer");
    config.infoCon = document.getElementById("infoContainer");
    config.btnCon = document.getElementById("btnContainer");
    View.createSlider();
    View.createButtons();
  }
};

initializeApp();
