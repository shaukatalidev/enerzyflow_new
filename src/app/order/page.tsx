"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  ChevronDown,
  Edit3,
  Loader2,
  AlertCircle,
  CheckCircle,
  Tag,
} from "lucide-react";
import { orderService, CreateOrderRequest } from "../services/orderService";
import { useAuth } from "../context/AuthContext";

interface Label {
  label_id?: string;
  name?: string;
  label_url?: string;
}

const CustomDropdown = ({
  label,
  value,
  options,
  onSelect,
  hasEditIcon = false,
  disabled = false,
}: {
  label: string;
  value: string;
  options: string[];
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
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      {hasEditIcon && (
        <Edit3 className="absolute right-10 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      )}
    </div>
  </div>
);

const NumberInput = ({
  label,
  value,
  onChange,
  min = 1,
  disabled = false,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  disabled?: boolean;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
    </label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value) || min)}
      min={min}
      disabled={disabled}
      className={`w-full px-4 py-3 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#4A90E2] ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    />
  </div>
);

const ColorSwatch = ({ color }: { color: string }) => (
  <span
    className="w-5 h-5 rounded-full border border-gray-300"
    style={{ backgroundColor: color }}
  ></span>
);

export default function CreateOrderPage() {
  const router = useRouter();
  const { user, profileLoading, loadProfile, profileLoaded } = useAuth();

  const profileLoadAttempted = useRef(false);
  const labelSelectedRef = useRef(false);

  const [selectedLabelId, setSelectedLabelId] = useState<string>("");
  const [bottleVariant, setBottleVariant] = useState("conical");
  const [capColor, setCapColor] = useState("red");
  const [volume, setVolume] = useState(500);
  const [quantity, setQuantity] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  const userLabels: Label[] = useMemo(() => {
    return (user?.labels || []) as Label[];
  }, [user?.labels]);

  const selectedLabel = useMemo(() => {
    return userLabels.find((l) => l.label_id === selectedLabelId);
  }, [userLabels, selectedLabelId]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profileLoaded, profileLoading]);

  useEffect(() => {
    const shouldSetDefaultLabel = 
      userLabels.length > 0 && 
      !selectedLabelId && 
      !labelSelectedRef.current;

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

  const capColorOptions = [
    {
      name: "white",
      displayName: "White",
      color: "#FFFFFF",
      recommended: true,
    },
    {
      name: "black",
      displayName: "Black",
      color: "#000000",
      recommended: true,
    },
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
  ];

  const bottleVariantOptions = [
    { value: "conical", label: "Conical Bottle" },
    { value: "round", label: "Round Bottle" },
    { value: "square", label: "Square Bottle" },
  ];

  const volumeOptions = [
    { value: 200, label: "200 ml" },
    { value: 250, label: "250 ml" },
    { value: 500, label: "500 ml" },
    { value: 1000, label: "1 Litre" },
    { value: 2000, label: "2 Litre" },
  ];

  const handleGenerateOrder = async () => {
    setError(null);
    setCreatedOrderId(null);

    if (!selectedLabelId) {
      setError("Please select a label to create an order.");
      return;
    }

    if (quantity <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    setLoading(true);

    try {
      const orderData: CreateOrderRequest = {
        label_id: selectedLabelId,
        variant: bottleVariant,
        qty: quantity,
        cap_color: capColor,
        volume: volume,
      };

      const result = await orderService.createOrder(orderData);

      setCreatedOrderId(result.order.order_id);

      // Navigate to invoice page
      setTimeout(() => {
        router.push(`/order/${result.order.order_id}/invoice`);
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
      setError(errorMessage);
      console.error("❌ Failed to create order:", err);
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/dashboard");
  };

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
                  onClick={() => router.push("/profile")}
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
        {/* Page Header */}
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

        {/* Profile Info Banner */}
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

        {/* Success Message */}
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

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-400 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 lg:gap-12">
          {/* Left Column: Preview & Initial Selection */}
          <div className="space-y-6">
            {/* Label Preview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="w-full h-64 bg-gray-100/70 rounded-lg flex flex-col items-center justify-center relative">
                {selectedLabel?.label_url ? (
                  <div className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-2">
                      <Image
                        src={selectedLabel.label_url}
                        alt={selectedLabel.name || "Label"}
                        width={128}
                        height={128}
                        className="object-cover rounded-lg"
                        unoptimized
                      />
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                      {selectedLabel.name || "Unnamed Label"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {
                        bottleVariantOptions.find(
                          (v) => v.value === bottleVariant
                        )?.label
                      }
                    </p>
                  </div>
                ) : (
                  <>
                    <Tag className="w-16 h-16 text-gray-300 mb-2" />
                    <p className="text-gray-400">
                      {selectedLabel?.name || "Select a label"}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {
                        bottleVariantOptions.find(
                          (v) => v.value === bottleVariant
                        )?.label
                      }
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Selection Options */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              {/* Label Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Select Label
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedLabelId}
                    onChange={(e) => setSelectedLabelId(e.target.value)}
                    disabled={loading}
                    className={`w-full appearance-none px-4 py-3 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#4A90E2] transition-all pr-10 ${
                      loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
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
                label="Bottle Variant"
                value={bottleVariant}
                options={bottleVariantOptions.map((v) => v.value)}
                onSelect={setBottleVariant}
                disabled={loading}
                hasEditIcon={true}
              />

              <NumberInput
                label="Quantity (pieces)"
                value={quantity}
                onChange={setQuantity}
                min={1}
                disabled={loading}
              />
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="space-y-6 mt-6 md:mt-0">
            {/* Cap Color Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Cap Color
              </h3>
              <div className="space-y-3">
                {capColorOptions.map((option) => (
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
                        onChange={(e) => setCapColor(e.target.value)}
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

            {/* Volume Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Volume
                </label>
                <div className="relative">
                  <select
                    value={volume}
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    disabled={loading}
                    className={`w-full appearance-none px-4 py-3 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#4A90E2] transition-all pr-10 ${
                      loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    {volumeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <Edit3 className="absolute right-10 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Order Summary Preview */}
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
                  <span className="text-gray-600">Variant:</span>
                  <span className="font-medium text-gray-900">
                    {
                      bottleVariantOptions.find(
                        (v) => v.value === bottleVariant
                      )?.label
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium text-gray-900">
                    {quantity} pcs
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cap Color:</span>
                  <span className="font-medium text-gray-900">
                    {
                      capColorOptions.find((c) => c.name === capColor)
                        ?.displayName
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Volume:</span>
                  <span className="font-medium text-gray-900">
                    {volumeOptions.find((v) => v.value === volume)?.label}
                  </span>
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

            {/* Submit Button */}
            <div className="pt-4">
              <button
                onClick={handleGenerateOrder}
                disabled={loading || !selectedLabelId || !!createdOrderId}
                className={`w-full py-4 text-lg font-semibold text-white rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
                  loading || !selectedLabelId || createdOrderId
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
