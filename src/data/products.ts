import { StaticImageData } from "next/image";
import { logoBottles } from "../../public/images/logo_bottles";

export interface Product {
  id: number;
  name: string;
  category: string;
  image: StaticImageData;
  details: string;
}

export const products: Product[] = [
  // -------------------------
  // 1000 ML
  // -------------------------
  {
    id: 1,
    name: "Classic 1000ML",
    category: "1 Litre Collection",
    image: logoBottles.classic_1000,
    details: "Rate: ₹11 | MOQ: 100"
  },
  {
    id: 2,
    name: "Elite 1000ML",
    category: "1 Litre Collection",
    image: logoBottles.elite_1000,
    details: "Rate: ₹14.25 | MOQ: 50"
  },
  {
    id: 3,
    name: "Exclusive 1000ML",
    category: "1 Litre Collection",
    image: logoBottles.exclusive_1000,
    details: "Rate: ₹15.45 | MOQ: 50"
  },
  {
    id: 4,
    name: "Ultra 1000ML",
    category: "1 Litre Collection",
    image: logoBottles.ultra_1000,
    details: "Rate: ₹16.25 | MOQ: 50"
  },
  {
    id: 5,
    name: "Conical Premier 1000ML",
    category: "1 Litre Collection",
    image: logoBottles.conical_1000,
    details: "Rate: ₹16.95 | MOQ: 50"
  },

  // -------------------------
  // 500 ML
  // -------------------------
  {
    id: 6,
    name: "Classic 500ML",
    category: "500 ml Collection",
    image: logoBottles.classic_500,
    details: "Rate: ₹7.2 | MOQ: 50"
  },
  {
    id: 7,
    name: "Elite 500ML",
    category: "500 ml Collection",
    image: logoBottles.elite_500,
    details: "Rate: ₹8.45 | MOQ: 50"
  },
  {
    id: 8,
    name: "Premier 500ML",
    category: "500 ml Collection",
    image: logoBottles.elite_500, // you reused same icon
    details: "Rate: ₹9.75 | MOQ: 50"
  },

  // -------------------------
  // 200 ML
  // -------------------------
  {
    id: 9,
    name: "Classic 200ML - Case 1",
    category: "200 ml Collection",
    image: logoBottles.classic_200,
    details: "Rate: ₹3.9 | MOQ: 50"
  },
  {
    id: 10,
    name: "Classic 200ML - Case 2",
    category: "200 ml Collection",
    image: logoBottles.classic_200,
    details: "Rate: ₹4.8 | MOQ: 50"
  },

  // -------------------------
  // 250 ML
  // -------------------------
  {
    id: 11,
    name: "Celebrate 250ML - Case 1",
    category: "250 ml Collection",
    image: logoBottles.celeb_250,
    details: "Rate: ₹5.2 | MOQ: 50"
  },
  {
    id: 12,
    name: "Celebrate 250ML - Case 2",
    category: "250 ml Collection",
    image: logoBottles.celeb_250,
    details: "Rate: ₹6.1 | MOQ: 50"
  }
];

export const CATEGORY_OPTIONS = {
  1000: [
    {
      value: "classic",
      label: "Classic",
      rate: 11,
      moq: 100,
      x: 15,
      icon: logoBottles.classic_1000,
      ads_logo: logoBottles.classic_1000_ads,
    },
    {
      value: "elite",
      label: "Elite",
      rate: 14.25,
      moq: 50,
      x: 15,
      icon: logoBottles.elite_1000,
      ads_logo: logoBottles.elite_1000_ads,
    },
    {
      value: "exclusive",
      label: "Exclusive",
      rate: 15.45,
      moq: 50,
      x: 15,
      icon: logoBottles.exclusive_1000,
      ads_logo: logoBottles.exclusive_1000_ads,
    },
    {
      value: "ultra",
      label: "Ultra",
      rate: 16.25,
      moq: 50,
      x: 15,
      icon: logoBottles.ultra_1000,
      ads_logo: logoBottles.ultra_1000_ads,
    },
    {
      value: "conical",
      label: "Conical Premier",
      rate: 16.95,
      moq: 50,
      x: 12,
      icon: logoBottles.conical_1000,
      ads_logo: logoBottles.conical_1000_ads,
    },
  ],
  500: [
    {
      value: "classic",
      label: "Classic",
      rate: 7.2,
      moq: 50,
      x: 24,
      icon: logoBottles.classic_500,
      ads_logo: logoBottles.classic_500_ads,
    },
    {
      value: "elite",
      label: "Elite",
      rate: 8.45,
      moq: 50,
      x: 24,
      icon: logoBottles.elite_500,
      ads_logo: logoBottles.elite_500_ads,
    },
    {
      value: "premier",
      label: "Premier",
      rate: 9.75,
      moq: 50,
      x: 24,
      icon: logoBottles.elite_500,
      ads_logo: logoBottles.elite_500_ads,
    },
  ],
  200: [
    {
      value: "classic_case1",
      label: "Classic 200ML - Case 1",
      rate: 3.9,
      moq: 50,
      x: 24,
      icon: logoBottles.classic_200,
      ads_logo: logoBottles.classic_200_ads,
    },
    {
      value: "classic_case2",
      label: "Classic 200ML - Case 2",
      rate: 4.8,
      moq: 50,
      x: 24,
      icon: logoBottles.classic_200,
      ads_logo: logoBottles.classic_200_ads,
    },
  ],
  250: [
    {
      value: "celebrate_case1",
      label: "Celebrate 250ML - Case 1",
      rate: 5.2,
      moq: 50,
      x: 18,
      icon: logoBottles.celeb_250,
      ads_logo: logoBottles.celeb_250,
    },
    {
      value: "celebrate_case2",
      label: "Celebrate 250ML - Case 2",
      rate: 6.1,
      moq: 50,
      x: 18,
      icon: logoBottles.celeb_250,
      ads_logo: logoBottles.celeb_250,
    },
  ],
} as const;
export const categories = [

  "1 Litre Collection",
  "500 ml Collection",
  "200 ml Collection",
  "250 ml Collection"
];
