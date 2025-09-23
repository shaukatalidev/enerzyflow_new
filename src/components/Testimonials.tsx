import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sobo Mastics',
    company: 'Founder @ Iklex',
    quote: 'Yet preference connection unpleasant yet melancholy but end appearance. And excellence partiality estimating terminated day everything.',
    rating: 5,
  },
  {
    name: 'Sam',
    company: 'Founder @ Mgenko',
    quote: 'Yet preference connection unpleasant yet melancholy but end appearance. And excellence partiality estimating terminated day everything.',
    rating: 5,
  },
  {
    name: 'Mansur',
    company: 'Founder @ Google',
    quote: 'Yet preference connection unpleasant yet melancholy but end appearance. And excellence partiality estimating terminated day everything.',
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Bottles With a Voice</h2>
          <p className="mt-2 text-gray-600">See how brands are leaving their mark with EnerzyFlow</p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            // MODIFICATION: Added transition and hover:scale classes
            <div 
              key={testimonial.name} 
              className="bg-white p-8 rounded-lg shadow-md transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer"
            >
              <div className="flex">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-current" size={20} />
                ))}
              </div>
              <p className="mt-4 text-gray-600">"{testimonial.quote}"</p>
              <div className="mt-6">
                <p className="font-semibold text-gray-800">{testimonial.name}</p>
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