const apiKey = import.meta.env.VITE_PIXABAY_API_KEY;
const url = `https://pixabay.com/api/?key=${apiKey}&q=animals&image_type=photo&per_page=22`;

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

const VenderImage = (url: string) => {
  return `
        <div class='vh-100 d-flex justify-content-center align-items-center'>
            <div class='col-lg-8 col-md-11 col-12 bg-pink d-flex flex-wrap'>
                <div id='slider'>
                </div>
                <div class='col-md-5 col-12 py-2'>
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
};

const getPixabayImages = async () => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Data = await response.json();
    console.log(data);
    zoo = data.hits.map((animalData) => {
      const { downloads, views, tags, likes, comments, largeImageURL } =
        animalData;
      const [category, ...args] = tags.split(" ");
      const price = Math.floor(
        downloads / 100 + views / 100 + comments + likes
      );

      return new Animal(category, price, largeImageURL);
    });

    console.log(zoo);
  } catch (error) {
    console.error("Error fetching Pixabay images:", error);
  }
};

getPixabayImages();
