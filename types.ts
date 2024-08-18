type Data = {
  hits: AnimalData[];
  total: number;
  totalHits: number;
};

type AnimalData = {
  id: number;
  collections: number;
  downloads: number;
  largeImageURL: string;
  likes: number;
  tags: string;
  views: number;
  comments: number;
};

type AnimationType = "left" | "right";

type Config = {
  sliderCon: HTMLElement | null;
  logoCon: HTMLElement | null;
  infoCon: HTMLElement | null;
  btnCon: HTMLElement | null;
};
