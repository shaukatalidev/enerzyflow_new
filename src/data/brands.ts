export interface Brand {
  id: number;
  name: string;
  logo: string;
  description: string;
}

export const brands: Brand[] = [
  {
    id: 1,
    name: "Dragon's Den",
    logo: "/images/brands/dragons-den.png",
    description: "Premium beverage brand"
  },
  {
    id: 2,
    name: "Zakaana",
    logo: "/images/brands/zaikasa.png",
    description: "Natural refreshment solutions"
  },
  {
    id: 3,
    name: "Kulture",
    logo: "/images/brands/kuture.png",
    description: "Cultural beverage experience"
  },
  {
    id: 4,
    name: "Beanshot",
    logo: "/images/brands/beanshot.png",
    description: "Energy drink specialists"
  },
  {
    id: 5,
    name: "Bookhara Restaurant",
    logo: "/images/brands/bookhara.png",
    description: "Restaurant beverage collection"
  }
];
