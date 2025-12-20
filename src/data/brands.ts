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
    name: "Cherry Restaurant",
    logo: "/images/brands/cherry restaurant.jpeg",
    description: "Cultural beverage experience"
  },
  {
    id: 4,
    name: "Resort Paradise",
    logo: "/images/brands/resort-paradise.png",
    description: "Cultural beverage experience"
  },
  {
    id: 5,
    name: "Beanshot",
    logo: "/images/brands/beanshot.png",
    description: "Energy drink specialists"
  },
  {
    id: 6,
    name: "Bookhara Restaurant",
    logo: "/images/brands/bookhara.png",
    description: "Restaurant beverage collection"
  }
];
