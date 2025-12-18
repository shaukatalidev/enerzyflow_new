import React from "react";

const licenseData = [
  {
    srNo: "01",
    unitName: "MANGALVANI COMMODITIES PVT. LTD.",
    fssai: "12822999000357",
    bis: "N/A",
    bisStandard: "N/A",
    address: "Vill.: Srirampur, P.O. Hanral, P.S. Dadpur Dist. Hooghly 712149",
    code: "RK",
  },
  {
    srNo: "02",
    unitName: "CANNABIS BEVERAGES LLP",
    fssai: "12818019004753",
    bis: "CML- 5100139886",
    bisStandard: "IS 15490:2004",
    address:
      "6, BUROSHIBTOLA MAIN ROAD, WARD NO-117, KOLKATA:-700038, West Bengal",
    code: "CB",
  },
  {
    srNo: "03",
    unitName: "ADN Distillaries Pvt. Ltd.",
    fssai: "12821999000288",
    bis: "CML-5100196898",
    bisStandard: "IS 14543",
    address: "Dhabani, Kharagpur, Paschim Medinipur, West Bengal, 721145",
    code: "AD",
  },
];

const Licenses = () => {
  return (
    <section className="bg-black min-h-screen">
      <div className="container mx-auto px-4 py-8 sm:py-16 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl text-white mt-10 sm:text-4xl md:text-5xl font-bold text-gray-800">
            Trusted. Verified. Certified.
          </h1>
          <p className="mt-3 sm:mt-4 text-white text-base sm:text-lg text-gray-600 px-4">
            Certified by{" "}
            <span className="text-cyan-600 font-semibold">FSSAI, BIS</span> &{" "}
            trusted authorities.
          </p>
        </div>

        {/* Desktop Table View - Hidden on Mobile */}
        <div className="hidden md:block mt-12 lg:mt-16 overflow-hidden rounded-xl border border-gray-200 shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="p-4 text-left font-semibold text-black border-r min-w-[80px]">
                    Sr No.
                  </th>
                  <th className="p-4 text-left font-semibold text-black border-r min-w-[80px]">
                    Code
                  </th>
                  <th className="p-4 text-left font-semibold text-black border-r min-w-[200px]">
                    Manufacturing unit name
                  </th>
                  <th className="p-4 text-left font-semibold text-black border-r min-w-[150px]">
                    Fssai License No.
                  </th>
                  <th className="p-4 text-left font-semibold text-black border-r min-w-[180px]">
                    BIS License No.
                  </th>
                  <th className="p-4 text-left font-semibold text-black min-w-[250px]">
                    Address
                  </th>
                </tr>
              </thead>

             <tbody className="divide-y divide-gray-200">
  {licenseData.map((item) => (
    <tr
      key={item.srNo}
      className="text-white hover:bg-white hover:text-black transition-colors"
    >
      <td className="p-4 font-bold border-r">{item.srNo}</td>
      <td className="p-4 border-r">{item.code}</td>
      <td className="p-4 border-r">{item.unitName}</td>
      <td className="p-4 border-r font-mono text-sm">{item.fssai}</td>
      <td className="p-4 border-r">
        <div>{item.bis}</div>
        <div className="text-sm text-white-600">{item.bisStandard}</div>
      </td>
      <td className="p-4">{item.address}</td>
    </tr>
  ))}
</tbody>

            </table>
          </div>
        </div>

        {/* Mobile Card View - Visible on Mobile Only */}
        <div className="md:hidden space-y-4 mt-8">
          {licenseData.map((item) => (
            <div
              key={item.srNo}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="bg-cyan-600 text-white font-bold text-sm px-3 py-1 rounded-full">
                    {item.srNo}
                  </span>
                  <span className="text-sm font-semibold text-gray-700">
                    License Details
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 space-y-3">
                {/* Manufacturing Unit */}
                <div className="pb-3 border-b border-gray-100">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Manufacturing Unit
                  </div>
                  <div className="text-sm text-gray-800 font-medium">
                    {item.unitName}
                  </div>
                </div>

                {/* FSSAI License */}
                <div className="pb-3 border-b border-gray-100">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    FSSAI License No.
                  </div>
                  <div className="text-sm text-gray-800 font-mono">
                    {item.fssai}
                  </div>
                </div>

                {/* BIS License */}
                <div className="pb-3 border-b border-gray-100">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    BIS License No.
                  </div>
                  <div className="text-sm text-gray-800 font-mono">
                    {item.bis}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {item.bisStandard}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Address
                  </div>
                  <div className="text-sm text-gray-800 leading-relaxed">
                    {item.address}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Licenses;
