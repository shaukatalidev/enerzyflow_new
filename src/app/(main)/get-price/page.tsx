"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GetPricePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    businessName: "",
    businessCity: "",
    product: "",
    quantity: "",
  });

  // Handle input/select changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = () => {
    console.log("Price Request:", form);
    alert("Thanks! Our team will contact you shortly.");
    router.push("/franchise"); // Redirect after submission
  };

  return (
    <section className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-xl glass-panel rounded-3xl p-10 border border-cyan-400/20">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">
            Get <span className="text-cyan-400">Wholesale Price</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Fill the form and receive pricing within soon!
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-400 outline-none"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-400 outline-none"
          />

          <input
            type="text"
            name="businessName"
            placeholder="Business Name"
            value={form.businessName}
            onChange={handleChange}
            className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-400 outline-none"
          />

          <input
            type="text"
            name="businessCity"
            placeholder="Business City"
            value={form.businessCity}
            onChange={handleChange}
            className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-400 outline-none"
          />

          <select
            aria-label="Select Bottle Type"
            name="product"
            value={form.product}
            onChange={handleChange}
            className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-400 outline-none"
          >
            <option value="">Select Bottle Type</option>
            <option value="Corporate Bottle">Corporate Bottle</option>
            <option value="Hotel Bottle">Hotel Bottle</option>
            <option value="Gym Bottle">Gym Bottle</option>
            <option value="Luxury Bottle">Luxury Bottle</option>
          </select>

          <input
            type="number"
            name="quantity"
            placeholder="Estimated Quantity (e.g. 5000)"
            value={form.quantity}
            onChange={handleChange}
            className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-400 outline-none"
          />

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full mt-4 py-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold shadow-[0_0_25px_rgba(0,240,255,0.5)] hover:scale-105 transition"
          >
            Request Price
          </button>

          <p className="text-center text-xs text-gray-500 mt-4">
            🔒 Your details are safe. No spam. No obligation.
          </p>
        </div>
      </div>
    </section>
  );
}
