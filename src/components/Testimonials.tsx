import { Star } from "lucide-react";

const testimonials = [
  {
    name: "General Manager",
    company: "Resort Paradise & Rajbari Kharagpur",
    quote:
      "In a luxury resort setting, every detail must speak of quality and exclusivity. The customized Enerzyflow water bottles have been a game-changer. The premium aesthetic, matching our royal Rajbari theme perfectly, elevates the dining table immediately. But the real value is the ‘Live QR’ feature. Our guests scan it to see the day’s special sunset cocktails or a limited-time spa package. It's a subtle, high-class way to drive upsells without being intrusive, and the engagement rate is fantastic. The bottle itself is a symbol of our commitment to guest well-being and a superior brand experience.",
    rating: 5,
  },
  {
    name: "General Manager",
    company: "House of Punjab, Kolkata",
    quote:
      "Our philosophy is to deliver an authentic, hearty, and memorable Punjabi dining experience. The customized Enerzyflow bottles fit right in by providing a touch of modern sophistication alongside our traditional cuisine. The bottle’s crystal clarity and custom label, featuring our logo prominently, reinforces our brand's attention to detail. The ‘Live QR’ is particularly effective for us. We use it to showcase our new seasonal dessert menu or even a short video on the chef's special dish of the week. It’s a seamless blend of hydration and interactive marketing that customers genuinely enjoy. It’s a very smart investment.",
    rating: 5,
  },
  {
    name: "General Manager",
    company: "Undergroundcafe Asansol",
    quote:
      "As a vibrant, contemporary cafe, we are always looking for innovative ways to connect with our young, tech-savvy customers. The Enerzyflow bottles with the integrated ‘Live QR’ have been a massive hit. They look sleek on our tables—a definite aesthetic upgrade from standard bottles. We use the QR code not just for menu offers, but to promote our live music schedule, late-night happy hour deals, and even link directly to our social media for contests. It adds an interactive layer to the dining experience. Our customers are scanning it and sharing the links—it’s marketing that pays for itself through increased social traction and direct promotions.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Bottles With a Voice
          </h2>
          <p className="mt-2 text-gray-600">
            See how brands are leaving their mark with EnerzyFlow
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            // MODIFICATION: Added transition and hover:scale classes
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-md transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer"
            >
              <div className="flex">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="text-yellow-400 fill-current"
                    size={20}
                  />
                ))}
              </div>
              {/* ✅ FIX: Escaped quotes */}
              <p className="mt-4 text-gray-600">
                &quot;{testimonial.quote}&quot;
              </p>
              <div className="mt-6">
                <p className="font-semibold text-gray-800">
                  {testimonial.name}
                </p>
                <p className="text-sm text-gray-500">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
