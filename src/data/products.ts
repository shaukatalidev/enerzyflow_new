export interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  details: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "EcoFlow Classic",
    category: "Classic Cylindrical",
    image: "/images/bottles/pr1.jpg",
    details: "Starting at ₹120/Bottle - 500 ml"
  },
  {
    id: 2,
    name: "EcoFlow Classic Pro", 
    category: "Classic Cylindrical",
    image: "/images/bottles/pr2.jpg",
    details: "Starting at ₹130/Bottle - 600 ml"
  },
  {
    id: 3,
    name: "SlimStick Pure",
    category: "Slim / Sleek",
    image: "/images/bottles/pr3.jpg",
    details: "Starting at ₹140/Bottle - 400 ml"
  },
  {
    id: 4,
    name: "SlimStick Elite",
    category: "Slim / Sleek", 
    image: "/images/bottles/pr4.jpg",
    details: "Starting at ₹150/Bottle - 450 ml"
  },
  {
    id: 5,
    name: "ErgoGrip Flow",
    category: "Curved / Ergonomic",
    image: "/images/bottles/pr5.jpg",
    details: "Starting at ₹180/Bottle - 550 ml"
  },
  {
    id: 6,
    name: "Crystal Clear Premium",
    category: "Premium Glass",
    image: "/images/bottles/pr6.jpg",
    details: "Starting at ₹250/Bottle - 750 ml"
  },
  {
    id: 7,
    name: "GreenBottle Eco",
    category: "Eco-Friendly PET",
    image: "/images/bottles/pr7.jpg",
    details: "Starting at ₹100/Bottle - 500 ml"
  }
];

export const categories = [
  "All Bottles",
  "Classic Cylindrical",
  "Slim / Sleek", 
  "Curved / Ergonomic",
  "Premium Glass",
  "Eco-Friendly PET"
];
