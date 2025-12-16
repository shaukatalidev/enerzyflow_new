import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.elements.namedItem(
      "email"
    ) as HTMLInputElement;
    console.log("Subscribed:", email.value);
  };

  return (
    <footer className="relative bg-black text-white overflow-hidden">
      {/* ================= CTA SECTION ================= */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-brand/5 skew-y-3 transform origin-bottom-right" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="flex justify-center mb-8">
            <Image
              src="/images/logo_bottles/logo.png"
              alt="Enerzyflow Logo"
              width={160}
              height={48}
              priority
            />
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6 tracking-tighter">
            Ready to <span className="text-brand text-glow">Flow?</span>
          </h2>

          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-xl mx-auto">
            Transforming bottles into branding powerhouses. Turn your water bottles
            into your most profitable brand asset with premium design and smart QR
            integration.
          </p>
<Link href="/solutions">
  <button className="bg-brand text-white text-lg md:text-xl font-bold px-10 md:px-12 py-4 md:py-5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(0,240,255,0.5)]">
    Partner With Us
  </button>
</Link>
        </div>
      </section>

      {/* ================= FOOTER CONTENT ================= */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Product */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Product</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="#">Features</Link></li>
              <li><Link href="#">Pricing</Link></li>
              <li><Link href="#">Case studies</Link></li>
              <li><Link href="#">Reviews</Link></li>
              <li><Link href="#">Updates</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Company</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="#">About</Link></li>
              <li><Link href="#">Contact us</Link></li>
              <li><Link href="#">Careers</Link></li>
              <li><Link href="#">Culture</Link></li>
              <li><Link href="#">Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Support</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="#">Getting started</Link></li>
              <li><Link href="#">Help center</Link></li>
              <li><Link href="#">Server status</Link></li>
              <li><Link href="#">Report a bug</Link></li>
              <li><Link href="#">Chat support</Link></li>
            </ul>
          </div>

          {/* Downloads */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Downloads</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="#">iOS</Link></li>
              <li><Link href="#">Android</Link></li>
              <li><Link href="#">Mac</Link></li>
              <li><Link href="#">Windows</Link></li>
              <li><Link href="#">Chrome</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-semibold text-sm mb-4">
              Subscribe to our newsletter
            </h3>
            <p className="text-gray-400 text-xs mb-4">
              Stay updated with the latest trends in custom branding and
              innovative solutions.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 rounded-full bg-white/10 text-white placeholder-gray-400 
                border border-white/20
                focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <button
                type="submit"
                className="w-40 bg-brand text-white px-6 py-3 
                rounded-full font-semibold 
                border border-white/20
                hover:opacity-90 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-400 text-xs">
          <p>© 2024 Enerzyflow | All Rights Reserved</p>

          <div className="flex gap-4">
            <Link href="https://www.facebook.com/share/19obQzdUev/" target="_blank">
              <Image src="/images/brands/f.png" alt="Facebook" width={20} height={20} />
            </Link>
            <Link href="https://www.linkedin.com/company/106605789/admin/page-posts/published/" target="_blank">
              <Image src="/images/brands/linkedin.png" alt="LinkedIn" width={20} height={20} />
            </Link>
            <Link href="https://www.instagram.com/enerzyflow" target="_blank">
              <Image src="/images/brands/insta.png" alt="Instagram" width={20} height={20} />
            </Link>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
