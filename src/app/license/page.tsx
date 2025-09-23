// src/app/licenses/page.tsx
import React from "react";

const licenseData = [
  {
    srNo: "01",
    unitName: "EnerzyFlow Beverages Pvt. Ltd.",
    fssai: "11223344556677",
    bis: "CM/L-1234567890\n(IS 14543:2016)",
    address:
      "Plot No. 21, Industrial Area,\nMIDC, Pune, Maharashtra –\n411038, India",
  },
  {
    srNo: "02",
    unitName: "EnerzyFlow Beverages Pvt. Ltd.",
    fssai: "11223344556677",
    bis: "CM/L-1234567890\n(IS 14543:2016)",
    address:
      "Plot No. 21, Industrial Area,\nMIDC, Pune, Maharashtra –\n411038, India",
  },
  {
    srNo: "03",
    unitName: "EnerzyFlow Beverages Pvt. Ltd.",
    fssai: "11223344556677",
    bis: "CM/L-1234567890\n(IS 14543:2016)",
    address:
      "Plot No. 21, Industrial Area,\nMIDC, Pune, Maharashtra –\n411038, India",
  },
  {
    srNo: "04",
    unitName: "EnerzyFlow Beverages Pvt. Ltd.",
    fssai: "11223344556677",
    bis: "CM/L-1234567890\n(IS 14543:2016)",
    address:
      "Plot No. 21, Industrial Area,\nMIDC, Pune, Maharashtra –\n411038, India",
  },
];

const LicensesPage = () => {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Trusted. Verified. Certified.
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Certified by{" "}
            <span className="text-cyan-600 font-semibold">FSSAI, BIS</span> &{" "}
            trusted authorities.
          </p>
        </div>

        {/* Table Wrapper */}
        <div className="mt-16 overflow-hidden rounded-xl border border-gray-200 shadow-md">
          <table className="w-full border-collapse table-fixed">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                {/* ## CHANGES HERE ## - Added widths and adjusted text color */}
                <th className="p-4 text-left font-semibold text-black border-r w-[10%]">
                  Sr No.
                </th>
                <th className="p-4 text-left font-semibold text-black border-r w-[25%]">
                  Manufacturing unit name
                </th>
                <th className="p-4 text-left font-semibold text-black border-r w-[20%]">
                  Fssai License No.
                </th>
                <th className="p-4 text-left font-semibold text-black border-r w-[20%]">
                  BIS License No.
                </th>
                <th className="p-4 text-left font-semibold text-black w-[25%]">
                  Address
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-200">
              {licenseData.map((item) => (
                <tr key={item.srNo} className="text-gray-700">
                  <td className="p-4 font-bold text-gray-800 border-r">
                    {item.srNo}
                  </td>
                  <td className="p-4 border-r">{item.unitName}</td>
                  <td className="p-4 border-r">{item.fssai}</td>
                  <td className="p-4 whitespace-pre-line border-r">
                    {item.bis}
                  </td>
                  <td className="p-4 whitespace-pre-line">{item.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default LicensesPage;