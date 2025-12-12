"use client";

import { useState, useEffect, useMemo, useRef, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import Image, { StaticImageData } from "next/image";
import {
  ArrowLeft,
  ChevronDown,
  Edit3,
  Loader2,
  AlertCircle,
  CheckCircle,
  Tag,
  Package,
} from "lucide-react";
import { orderService, CreateOrderRequest } from "../services/orderService";
import { useAuth } from "../context/AuthContext";
import { logoBottles } from "../../../public/images/logo_bottles";

import { motion, AnimatePresence } from "framer-motion";

interface Label {
  label_id?: string;
  name?: string;
  label_url?: string;
}

// ✅ Constants outside component
const CAP_COLOR_OPTIONS = [
  { name: "white", displayName: "White", color: "#FFFFFF", recommended: true },
  { name: "black", displayName: "Black", color: "#000000", recommended: true },
  { name: "red", displayName: "Red", color: "#FF0000", recommended: true },
  {
    name: "bislery_green",
    displayName: "Bislery Green",
    color: "#00994D",
    recommended: false,
  },
  {
    name: "kinley_blue",
    displayName: "Kinley Blue",
    color: "#0072BC",
    recommended: false,
  },
] as const;

// ✅ Volume-based categories
const VOLUME_OPTIONS = [
  { value: 200, label: "200 ml" },
  { value: 250, label: "250 ml" },
  { value: 500, label: "500 ml" },
  { value: 1000, label: "1 Litre" },
] as const;

// ✅ Category/Variant options
const CATEGORY_OPTIONS = {
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
   
  ],
} as const;

// ✅ Get categories for selected volume
const getCategoriesForVolume = (volume: number) => {
  return CATEGORY_OPTIONS[volume as keyof typeof CATEGORY_OPTIONS] || [];
};

// ✅ Get category details
const getCategoryDetails = (volume: number, category: string) => {
  const categories = getCategoriesForVolume(volume);
  return categories.find((c) => c.value === category) || categories[0];
};

// ✅ Memoized Components
const CustomDropdown = memo(
  ({
    label,
    value,
    options,
    onSelect,
    hasEditIcon = false,
    disabled = false,
  }: {
    label: string;
    value: string;
    options: readonly { value: string | number; label: string }[] | string[];
    onSelect: (value: string) => void;
    hasEditIcon?: boolean;
    disabled?: boolean;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onSelect(e.target.value)}
          disabled={disabled}
          className={`w-full appearance-none px-4 py-3 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#4A90E2] transition-all pr-10 ${
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {options.map((option) => {
            const optValue =
              typeof option === "string" ? option : String(option.value);
            const optLabel = typeof option === "string" ? option : option.label;
            return (
              <option key={optValue} value={optValue}>
                {optLabel}
              </option>
            );
          })}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        {hasEditIcon && (
          <Edit3 className="absolute right-10 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        )}
      </div>
    </div>
  )
);

CustomDropdown.displayName = "CustomDropdown";

const NumberInput = memo(
  ({
    label,
    value,
    onChange,

    disabled = false,
    helperText,
    error,
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    disabled?: boolean;
    helperText?: string;
    error?: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const inputValue = parseInt(e.target.value);
          // Allow any input, including empty or below minimum
          if (isNaN(inputValue) || e.target.value === "") {
            onChange(0);
          } else {
            onChange(inputValue);
          }
        }}
        min={1} // Remove the min restriction for better UX
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 ${
          error
            ? "ring-2 ring-red-500 focus:ring-red-500"
            : "focus:ring-[#4A90E2]"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      />
      {helperText && (
        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
          <Package className="w-3 h-3" />
          {helperText}
        </p>
      )}
      {error && (
        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  )
);

NumberInput.displayName = "NumberInput";

const ColorSwatch = memo(({ color }: { color: string }) => (
  <span
    className="w-5 h-5 rounded-full border border-gray-300"
    style={{ backgroundColor: color }}
  ></span>
));

ColorSwatch.displayName = "ColorSwatch";

const LabelSlider = ({
  image1,
  image2,
  alt1,
  alt2,
}: {
  image1: StaticImageData;
  image2: StaticImageData;
  alt1?: string;
  alt2?: string;
}) => {
  const [showFirst, setShowFirst] = useState(true);

  useEffect(() => {
    // reset to first image whenever URLs change
    setShowFirst(true);

    const timer = setTimeout(() => {
      setShowFirst(false);
    }, 1000); // 1 second

    return () => clearTimeout(timer);
  }, [image1, image2]);

  return (
    <div className="w-full aspect-[4/3] mx-auto mb-4 relative overflow-hidden">
      <AnimatePresence mode="wait">
        {showFirst ? (
          <motion.div
            key="first"
            initial={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image
              src={image1}
              alt={alt1 || "Label 1"}
              fill
              className="object-contain"
              sizes="128px"
              unoptimized
            />
          </motion.div>
        ) : (
          <motion.div
            key="second"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image
              src={image2}
              alt={alt2 || "Label 2"}
              fill
              className="object-contain"
              sizes="128px"
              unoptimized
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ✅ Memoized Label Preview
const LabelPreview = memo(
  ({
    selectedLabel,
    category,
    volume,
  }: {
    selectedLabel?: Label;
    category: string;
    volume: number;
  }) => {
    const categoryDetails = getCategoryDetails(volume, category);
    const volumeLabel = VOLUME_OPTIONS.find((v) => v.value === volume)?.label;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
        <div className="text-center">
          <LabelSlider
            image1={categoryDetails?.icon}
            image2={categoryDetails?.ads_logo}
          />
          <p className="text-lg font-bold text-blue-600 mb-1">{volumeLabel}</p>
          <p className="text-sm font-medium text-gray-900 mb-1">
            {selectedLabel?.name || "Unnamed Label"}
          </p>
          <p className="text-xs text-gray-500">{categoryDetails?.label}</p>
        </div>
      </div>
    );
  }
);

LabelPreview.displayName = "LabelPreview";

// ✅ Memoized Order Summary
const OrderSummary = memo(
  ({
    selectedLabel,
    category,
    quantity,
    cases,
    capColor,
    volume,
    selectedLabelId,
    bottlesPerCase,
    rate,
  }: {
    selectedLabel?: Label;
    category: string;
    quantity: number;
    cases: number;
    capColor: string;
    volume: number;
    selectedLabelId: string;
    bottlesPerCase: number;
    rate: number;
  }) => {
    const categoryDetails = getCategoryDetails(volume, category);
    const capColorLabel = CAP_COLOR_OPTIONS.find(
      (c) => c.name === capColor
    )?.displayName;
    const volumeLabel = VOLUME_OPTIONS.find((v) => v.value === volume)?.label;
    const totalPrice = (quantity * rate).toFixed(2);

    return (
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="text-sm font-semibold text-blue-900 mb-3">
          Order Summary
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Label:</span>
            <span className="font-medium text-gray-900">
              {selectedLabel?.name || "Not selected"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Volume:</span>
            <span className="font-medium text-blue-600">{volumeLabel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Category:</span>
            <span className="font-medium text-gray-900">
              {categoryDetails?.label}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-blue-200">
            <span className="text-gray-600">Cases:</span>
            <span className="font-bold text-lg text-blue-600">
              {cases} cases
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Bottles per case (X):</span>
            <span className="font-medium text-gray-700">{bottlesPerCase}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Quantity:</span>
            <span className="font-medium text-gray-900">
              {quantity} bottles
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Rate per bottle:</span>
            <span className="font-medium text-gray-900">₹{rate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Cap Color:</span>
            <span className="font-medium text-gray-900">{capColorLabel}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-blue-200">
            <span className="text-gray-600 font-semibold">
              Estimated Total:
            </span>
            <span className="font-bold text-gray-900">₹{totalPrice}</span>
          </div>
          {selectedLabelId && (
            <div className="flex justify-between pt-2 border-t border-blue-200">
              <span className="text-gray-600">Label ID:</span>
              <span className="font-mono text-xs text-gray-900">
                {selectedLabelId.slice(0, 8)}...
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

OrderSummary.displayName = "OrderSummary";

// ✅ Memoized Cap Color Selector
const CapColorSelector = memo(
  ({
    capColor,
    onCapColorChange,
    loading,
  }: {
    capColor: string;
    onCapColorChange: (color: string) => void;
    loading: boolean;
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Cap Color</h3>
      <div className="space-y-3">
        {CAP_COLOR_OPTIONS.map((option) => (
          <label
            key={option.name}
            className={`flex items-center justify-between cursor-pointer p-3 rounded-lg border-2 transition-all ${
              capColor === option.name
                ? "border-[#4A90E2] bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="capColor"
                value={option.name}
                checked={capColor === option.name}
                onChange={(e) => onCapColorChange(e.target.value)}
                disabled={loading}
                className="h-4 w-4 text-[#4A90E2] border-gray-300 focus:ring-[#4A90E2] disabled:opacity-50 cursor-pointer"
              />
              <ColorSwatch color={option.color} />
              <span className="text-gray-800 font-medium">
                {option.displayName}
              </span>
            </div>
            {option.recommended && (
              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                Recommended
              </span>
            )}
          </label>
        ))}
      </div>
    </div>
  )
);

CapColorSelector.displayName = "CapColorSelector";

export default function CreateOrderPage() {
  const router = useRouter();
  const { user, profileLoading, loadProfile, profileLoaded } = useAuth();

  const profileLoadAttempted = useRef(false);
  const labelSelectedRef = useRef(false);

  const [selectedLabelId, setSelectedLabelId] = useState<string>("");
  const [category, setCategory] = useState("classic");
  const [capColor, setCapColor] = useState("red");
  const [volume, setVolume] = useState(1000);
  const [cases, setCases] = useState<number>(() => {
    const defaultCategory = getCategoriesForVolume(1000)[0];
    return defaultCategory?.moq || 50;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  // ✅ Get available categories for current volume
  const availableCategories = useMemo(() => {
    return getCategoriesForVolume(volume);
  }, [volume]);

  // ✅ Get current category details
  const categoryDetails = useMemo(() => {
    return getCategoryDetails(volume, category);
  }, [volume, category]);

  // ✅ Calculate derived values
  const bottlesPerCase = categoryDetails?.x || 15;
  const minimumCases = categoryDetails?.moq || 50;
  const rate = categoryDetails?.rate || 0;

  const quantity = useMemo(() => {
    return cases * bottlesPerCase;
  }, [cases, bottlesPerCase]);

  const meetsMOQ = useMemo(() => {
    return cases >= minimumCases;
  }, [cases, minimumCases]);

  // ✅ Memoized user labels
  const userLabels: Label[] = useMemo(() => {
    return (user?.labels || []) as Label[];
  }, [user?.labels]);

  // ✅ Memoized selected label
  const selectedLabel = useMemo(() => {
    return userLabels.find((l) => l.label_id === selectedLabelId);
  }, [userLabels, selectedLabelId]);

  useEffect(() => {
    const categories = getCategoriesForVolume(volume);
    if (categories.length > 0) {
      setCategory(categories[0].value);
      // Always set cases to the MOQ of the new category
      setCases(categories[0].moq);
    }
  }, [volume]);

  useEffect(() => {
    const currentCategory = getCategoryDetails(volume, category);
    if (currentCategory) {
      // Always set cases to the MOQ when category changes
      setCases(currentCategory.moq);
    }
  }, [category, volume]);

  useEffect(() => {
    const shouldLoadProfile =
      user &&
      !profileLoaded &&
      !profileLoading &&
      !profileLoadAttempted.current;

    if (shouldLoadProfile) {
      profileLoadAttempted.current = true;

      const loadUserProfile = async () => {
        try {
          await loadProfile();
        } catch (error) {
          console.error("Failed to load profile:", error);
          profileLoadAttempted.current = false;
        }
      };

      loadUserProfile();
    }
  }, [user, profileLoaded, profileLoading, loadProfile]);

  useEffect(() => {
    const shouldSetDefaultLabel =
      userLabels.length > 0 && !selectedLabelId && !labelSelectedRef.current;

    if (shouldSetDefaultLabel) {
      const firstLabel = userLabels[0];
      if (firstLabel.label_id) {
        setSelectedLabelId(firstLabel.label_id);
        labelSelectedRef.current = true;
      }
    }
  }, [userLabels, selectedLabelId]);

  useEffect(() => {
    if (!user) {
      profileLoadAttempted.current = false;
      labelSelectedRef.current = false;
    }
  }, [user]);

  // ✅ Memoized handlers
  const handleGenerateOrder = useCallback(async () => {
    setError(null);
    setCreatedOrderId(null);

    if (!selectedLabelId) {
      setError("Please select a label to create an order.");
      return;
    }

    if (!meetsMOQ) {
      setError(
        `Minimum order quantity is ${minimumCases} cases (${
          minimumCases * bottlesPerCase
        } bottles)`
      );
      return;
    }

    if (cases <= 0) {
      setError("Number of cases must be greater than 0");
      return;
    }

    setLoading(true);

    try {
      const orderData: CreateOrderRequest = {
        label_id: selectedLabelId,
        variant: category,
        qty: quantity,
        cap_color: capColor,
        volume: volume,
      };

      const result = await orderService.createOrder(orderData);
      setCreatedOrderId(result.order.order_id);

      setTimeout(() => {
        router.push(`/order/${result.order.order_id}/invoice`);
      }, 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create order";
      setError(errorMessage);
      console.error("❌ Failed to create order:", err);
      setLoading(false);
    }
  }, [
    selectedLabelId,
    meetsMOQ,
    minimumCases,
    bottlesPerCase,
    cases,
    category,
    quantity,
    capColor,
    volume,
    router,
  ]);

  const handleBack = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  const handleGoToProfile = useCallback(() => {
    router.push("/profile");
  }, [router]);

  if (profileLoading && !profileLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileLoading && userLabels.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto max-w-5xl px-4 py-8">
          <header className="flex items-center gap-4 mb-8">
            <button
              onClick={handleBack}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              Create a New Order
            </h1>
          </header>

          <div className="bg-yellow-50 border border-yellow-400 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                  No Labels Available
                </h3>
                <p className="text-yellow-700 mb-4">
                  You need to add labels to your profile before creating orders.
                </p>
                <button
                  onClick={handleGoToProfile}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
                >
                  Go to Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            Create a New Order
          </h1>
        </header>

        {user?.company?.name && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-blue-900 font-medium">
                  Company: {user.company.name}
                </p>
                <p className="text-blue-700 text-sm">
                  Available Labels: {userLabels.length}
                </p>
              </div>
            </div>
          </div>
        )}

        {createdOrderId && (
          <div className="mb-6 p-4 bg-green-50 border border-green-400 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-green-800 font-medium">
                  Order created successfully!
                </p>
                <p className="text-green-700 text-sm mt-1">
                  Order ID: {createdOrderId.slice(0, 13)}... • Redirecting to
                  invoice page...
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-400 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 lg:gap-12">
          {/* Left Column */}
          <div className="space-y-6">
            <LabelPreview
              selectedLabel={selectedLabel}
              category={category}
              volume={volume}
            />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              {/* Label Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Select Label<span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedLabelId}
                    onChange={(e) => setSelectedLabelId(e.target.value)}
                    disabled={loading}
                    className={`w-full appearance-none px-4 py-3 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#4A90E2] transition-all pr-10 ${
                      loading
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    {userLabels.length === 0 && (
                      <option value="">No labels available</option>
                    )}
                    {userLabels.map((label) => (
                      <option key={label.label_id} value={label.label_id}>
                        {label.name || "Unnamed Label"}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <Tag className="absolute right-10 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {selectedLabelId && (
                  <p className="text-xs text-gray-500 mt-1">
                    Label ID: {selectedLabelId.slice(0, 13)}...
                  </p>
                )}
              </div>

              <CustomDropdown
                label="Volume"
                value={volume.toString()}
                options={VOLUME_OPTIONS}
                onSelect={(v) => setVolume(parseInt(v))}
                disabled={loading}
                hasEditIcon={true}
              />

              <CustomDropdown
                label="Category"
                value={category}
                options={availableCategories}
                onSelect={setCategory}
                disabled={loading}
                hasEditIcon={true}
              />

              <NumberInput
                label="Number of Cases"
                value={cases}
                onChange={setCases}
                min={1}
                disabled={loading}
                helperText={`Quantity = ${bottlesPerCase} × Cases = ${quantity} bottles`}
                error={
                  cases > 0 && cases < minimumCases
                    ? `Minimum ${minimumCases} cases required`
                    : undefined
                }
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 mt-6 md:mt-0">
            <CapColorSelector
              capColor={capColor}
              onCapColorChange={setCapColor}
              loading={loading}
            />

            <OrderSummary
              selectedLabel={selectedLabel}
              category={category}
              quantity={quantity}
              cases={cases}
              capColor={capColor}
              volume={volume}
              selectedLabelId={selectedLabelId}
              bottlesPerCase={bottlesPerCase}
              rate={rate}
            />

            <div className="pt-4">
              <button
                onClick={handleGenerateOrder}
                disabled={
                  loading || !selectedLabelId || !!createdOrderId || !meetsMOQ
                }
                className={`w-full py-4 text-lg font-semibold text-white rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
                  loading || !selectedLabelId || createdOrderId || !meetsMOQ
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#4A90E2] hover:bg-[#357ABD] hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
                }`}
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {createdOrderId
                  ? "Redirecting..."
                  : loading
                  ? "Creating Order..."
                  : "Generate PI & Create Order"}
              </button>
              {!selectedLabelId && userLabels.length > 0 && (
                <p className="text-xs text-red-500 mt-2 text-center">
                  Please select a label to create an order.
                </p>
              )}
              {!meetsMOQ && selectedLabelId && (
                <p className="text-xs text-red-500 mt-2 text-center">
                  Order does not meet minimum quantity requirement (
                  {minimumCases} cases)
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
