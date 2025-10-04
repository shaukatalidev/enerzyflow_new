"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  User,
  Edit3,
  Image as ImageIcon,
  Upload,
  Pencil,
  AlertCircle,
  X,
  Plus,
  Trash2,
  MapPin,
} from "lucide-react";
import { CloudinaryUploadWidget } from "@/components/CloudinaryWrapper";

interface UserProfile {
  name?: string;
  contactNo?: string;
  email?: string;
  designation?: string;
  brandCompanyName?: string;
  businessAddress?: string;
  profilePhoto?: string;
  labelName?: string;
  logo?: string;
  role?: "user" | "plant" | "printing";
  labels?: Array<{ label_id?: string; name: string; url: string }>;
  outlets?: Array<{ id?: string; name: string; address: string }>;
}

interface ProfileUpdateResult {
  blocked_labels?: Array<{
    label_id: string;
    name: string;
  }>;
}

interface MyProfileProps {
  userProfile: UserProfile;
  onProfileUpdate: (
    updatedProfile: UserProfile,
    profileImageUrl?: string,
    logoUrl?: string,
    labelsData?: Array<{ label_id?: string; name: string; url: string }>,
    outletsData?: Array<{ id?: string; name: string; address: string }>
  ) => Promise<ProfileUpdateResult>;
  error?: string | null;
  onClearError?: () => void;
}

const EditableInput = ({
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
}: {
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  disabled?: boolean;
}) => (
  <div className="relative">
    <input
      type={type}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full px-4 py-3 bg-gray-100/70 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4A90E2] transition-all pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
    />
    <Pencil className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
  </div>
);

const StaticField = ({
  value,
  placeholder,
}: {
  value?: string;
  placeholder?: string;
}) => (
  <p className="w-full px-4 py-3 bg-gray-100/70 rounded-lg text-gray-800 break-words min-h-[48px] flex items-center">
    {value || <span className="text-gray-400">{placeholder}</span>}
  </p>
);

const ErrorAlert = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => (
  <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
    <div className="flex-1">
      <p className="text-red-800 text-sm">{message}</p>
    </div>
    <button onClick={onClose} className="text-red-500 hover:text-red-700">
      <X className="w-4 h-4" />
    </button>
  </div>
);

interface CloudinaryUploadResult {
  info?: {
    secure_url?: string;
  };
}

export default function MyProfile({
  userProfile,
  onProfileUpdate,
  error,
  onClearError,
}: MyProfileProps) {
  const [formData, setFormData] = useState<UserProfile>({});
  const [originalData, setOriginalData] = useState<UserProfile>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [labelsData, setLabelsData] = useState<
    Array<{ label_id?: string; name: string; url: string }>
  >([]);
  const [outletsData, setOutletsData] = useState<
    Array<{ id?: string; name: string; address: string }>
  >([]);
  const [hasMultipleOutlets, setHasMultipleOutlets] = useState(false);
  const [lockedLabels, setLockedLabels] = useState<Set<string>>(new Set());

  const initialDataSet = useRef(false);

  useEffect(() => {
    if (!userProfile) {
      console.log("⏭️ userProfile is null/undefined, skipping");
      return;
    }

    if (isEditing) {
      console.log("⏭️ Currently editing, skipping update");
      return;
    }

    const hasChanged =
      !initialDataSet.current ||
      userProfile.name !== formData.name ||
      userProfile.email !== formData.email ||
      userProfile.contactNo !== formData.contactNo ||
      userProfile.designation !== formData.designation ||
      userProfile.brandCompanyName !== formData.brandCompanyName ||
      userProfile.businessAddress !== formData.businessAddress ||
      userProfile.profilePhoto !== formData.profilePhoto ||
      userProfile.logo !== formData.logo ||
      JSON.stringify(userProfile.labels) !== JSON.stringify(labelsData) ||
      JSON.stringify(userProfile.outlets) !== JSON.stringify(outletsData);

    if (hasChanged) {
      console.log("🔄 Props changed, updating MyProfile state");
      setFormData(userProfile);
      setOriginalData(userProfile);
      setProfileImageUrl(userProfile.profilePhoto || "");
      setLogoUrl(userProfile.logo || "");
      setLabelsData(userProfile.labels || []);
      setOutletsData(userProfile.outlets || []);
      setHasMultipleOutlets((userProfile.outlets?.length || 0) > 0);
      initialDataSet.current = true;
    } else {
      console.log("⏭️ No changes detected, keeping current state");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile, isEditing]);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLabelNameChange = (index: number, name: string) => {
    setLabelsData((prev) =>
      prev.map((label, i) => (i === index ? { ...label, name } : label))
    );
  };

  const handleOutletChange = (
    index: number,
    field: "name" | "address",
    value: string
  ) => {
    setOutletsData((prev) =>
      prev.map((outlet, i) =>
        i === index ? { ...outlet, [field]: value } : outlet
      )
    );
  };

  const addNewLabel = () => {
    setLabelsData((prev) => [...prev, { name: "", url: "" }]);
  };

  const removeLabel = (index: number) => {
    const label = labelsData[index];

    if (label.label_id && lockedLabels.has(label.label_id)) {
      alert(
        "This label cannot be deleted because it is attached to existing orders."
      );
      return;
    }

    setLabelsData((prev) => prev.filter((_, i) => i !== index));
  };

  const addNewOutlet = () => {
    setOutletsData((prev) => [...prev, { name: "", address: "" }]);
  };

  const removeOutlet = (index: number) => {
    setOutletsData((prev) => prev.filter((_, i) => i !== index));
    if (outletsData.length <= 1) {
      setHasMultipleOutlets(false);
    }
  };

  const handleMultipleOutletsToggle = () => {
    setHasMultipleOutlets(!hasMultipleOutlets);
    if (!hasMultipleOutlets && outletsData.length === 0) {
      setOutletsData([{ name: "", address: "" }]);
    } else if (hasMultipleOutlets) {
      setOutletsData([]);
    }
  };

  // ✅ VALIDATION FUNCTION
  const validateFormData = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Validate Labels - must have BOTH name and URL
    if (labelsData.length > 0) {
      labelsData.forEach((label, index) => {
        const hasName = label.name && label.name.trim() !== "";
        const hasUrl = label.url && label.url.trim() !== "";

        if (!hasName && !hasUrl) {
          errors.push(
            `Label ${index + 1}: Please either delete this label or add both name and image`
          );
        } else if (!hasName && hasUrl) {
          errors.push(`Label ${index + 1}: Please add a name for this label`);
        } else if (hasName && !hasUrl) {
          errors.push(
            `Label ${index + 1}: Please upload an image for "${label.name}"`
          );
        }
      });
    }

    // Validate Outlets - must have BOTH name and address
    if (outletsData.length > 0) {
      outletsData.forEach((outlet, index) => {
        const hasName = outlet.name && outlet.name.trim() !== "";
        const hasAddress = outlet.address && outlet.address.trim() !== "";

        if (!hasName && !hasAddress) {
          errors.push(
            `Outlet ${index + 1}: Please either delete this outlet or add both name and address`
          );
        } else if (!hasName && hasAddress) {
          errors.push(
            `Outlet ${index + 1}: Please add a name for this outlet`
          );
        } else if (hasName && !hasAddress) {
          errors.push(
            `Outlet ${index + 1}: Please add an address for "${outlet.name}"`
          );
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const handleSubmit = async () => {
    // ✅ Validate before submission
    const validation = validateFormData();

    if (!validation.isValid) {
      const errorMessage = validation.errors.join("\n\n");
      alert(errorMessage);
      return;
    }

    try {
      setIsLoading(true);

      // ✅ Filter out empty labels and outlets before sending
      const validLabels = labelsData.filter(
        (label) => label.name.trim() !== "" && label.url.trim() !== ""
      );

      const validOutlets = outletsData.filter(
        (outlet) => outlet.name.trim() !== "" && outlet.address.trim() !== ""
      );

      const result = await onProfileUpdate(
        formData,
        profileImageUrl || undefined,
        logoUrl || undefined,
        validLabels.length > 0 ? validLabels : undefined,
        validOutlets.length > 0 ? validOutlets : undefined
      );

      if (result?.blocked_labels && result.blocked_labels.length > 0) {
        const lockedLabelIds = new Set<string>(
          result.blocked_labels
            .map((l) => l.label_id)
            .filter((id): id is string => Boolean(id))
        );
        setLockedLabels(lockedLabelIds);

        const blockedLabelsData = result.blocked_labels.map((l) => ({
          label_id: l.label_id,
          name: l.name,
          url: "",
        }));

        const existingIds = new Set(
          labelsData.map((l) => l.label_id).filter(Boolean)
        );

        const newBlockedLabels = blockedLabelsData.filter(
          (l) => !existingIds.has(l.label_id)
        );

        if (newBlockedLabels.length > 0) {
          const labelsWithUrls = newBlockedLabels.map((blockedLabel) => {
            const originalLabel = originalData.labels?.find(
              (ol) => ol.label_id === blockedLabel.label_id
            );
            return {
              ...blockedLabel,
              url: originalLabel?.url || "",
            };
          });

          setLabelsData((prev) => [...prev, ...labelsWithUrls]);
          alert(
            `Note: ${newBlockedLabels.length} label(s) could not be deleted because they are attached to existing orders.`
          );
        }
      }

      setOriginalData({
        ...formData,
        labels: validLabels,
        outlets: validOutlets,
        profilePhoto: profileImageUrl,
        logo: logoUrl,
      });

      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setProfileImageUrl(originalData.profilePhoto || "");
    setLogoUrl(originalData.logo || "");
    setLabelsData(originalData.labels || []);
    setOutletsData(originalData.outlets || []);
    setHasMultipleOutlets((originalData.outlets?.length || 0) > 0);
    setIsEditing(false);
    setLockedLabels(new Set());
    onClearError?.();
  };

  const handleProfileUploadSuccess = (result: CloudinaryUploadResult) => {
    if (result.info && result.info.secure_url) {
      const newUrl = result.info.secure_url;
      setProfileImageUrl(newUrl);
      setLogoUrl(newUrl);
      setFormData((prev) => ({
        ...prev,
        profilePhoto: newUrl,
        logo: newUrl,
      }));
    }
  };

  const handleLogoUploadSuccess = (result: CloudinaryUploadResult) => {
    if (result.info && result.info.secure_url) {
      const newUrl = result.info.secure_url;
      setLogoUrl(newUrl);
      setProfileImageUrl(newUrl);
      setFormData((prev) => ({
        ...prev,
        logo: newUrl,
        profilePhoto: newUrl,
      }));
    }
  };

  const handleLabelUploadSuccess = (
    result: CloudinaryUploadResult,
    index: number
  ) => {
    if (result.info && result.info.secure_url) {
      const newUrl = result.info.secure_url;
      setLabelsData((prev) =>
        prev.map((label, i) =>
          i === index ? { ...label, url: newUrl } : label
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {error && onClearError && (
          <ErrorAlert message={error} onClose={onClearError} />
        )}

        <header className="flex flex-col items-center gap-4 mb-8 text-center md:flex-row md:justify-between md:text-left">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 w-full md:w-auto text-sm font-semibold text-white bg-[#4A90E2] hover:bg-[#357ABD] rounded-lg transition-all shadow-sm"
            >
              <Edit3 size={16} />
              <span>Edit Profile</span>
            </button>
          )}
        </header>

        <div className="flex flex-col md:flex-row md:gap-8 lg:gap-12">
          {/* Left Column - Profile Photo */}
          <div className="md:w-1/3 lg:w-1/4">
            <div className="flex flex-col items-center justify-center md:bg-white md:rounded-xl md:shadow-sm md:border md:border-gray-100 md:p-6">
              <div className="relative w-24 h-24 mb-3">
                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                  {(() => {
                    const imageUrl = profileImageUrl || formData.profilePhoto;

                    return imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt="Profile"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover rounded-full"
                        unoptimized
                      />
                    ) : (
                      <User className="w-12 h-12 text-gray-400" />
                    );
                  })()}
                </div>
              </div>

              {isEditing ? (
                <CloudinaryUploadWidget onSuccess={handleProfileUploadSuccess}>
                  {({ open }) => (
                    <button
                      onClick={() => open()}
                      className="font-medium text-[#4A90E2] hover:text-[#357ABD] cursor-pointer"
                    >
                      Upload your photo
                    </button>
                  )}
                </CloudinaryUploadWidget>
              ) : (
                <span className="font-medium text-gray-600">
                  Upload your photo
                </span>
              )}

              <div className="hidden md:block text-center mt-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {formData.name || "Your Name"}
                </h2>
                <p className="text-md text-gray-500">
                  {formData.designation || "Your Designation"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Form Fields */}
          <div className="md:w-2/3 lg:w-3/4 mt-8 md:mt-0">
            <div className="space-y-6">
              {/* Personal Details Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Your Name
                  </label>
                  {isEditing ? (
                    <EditableInput
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter your name here"
                      disabled={isLoading}
                    />
                  ) : (
                    <StaticField
                      value={formData.name}
                      placeholder="Enter your name here"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Contact No.
                  </label>
                  {isEditing ? (
                    <EditableInput
                      value={formData.contactNo}
                      onChange={(e) =>
                        handleInputChange("contactNo", e.target.value)
                      }
                      placeholder="Enter your contact no."
                      type="tel"
                      disabled={isLoading}
                    />
                  ) : (
                    <StaticField
                      value={formData.contactNo}
                      placeholder="Enter your contact no."
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email
                  </label>
                  {isEditing ? (
                    <EditableInput
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="Enter your email here"
                      type="email"
                      disabled={isLoading}
                    />
                  ) : (
                    <StaticField
                      value={formData.email}
                      placeholder="Enter your email here"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Designation
                  </label>
                  {isEditing ? (
                    <EditableInput
                      value={formData.designation}
                      onChange={(e) =>
                        handleInputChange("designation", e.target.value)
                      }
                      placeholder="Enter your Designation here"
                      disabled={isLoading}
                    />
                  ) : (
                    <StaticField
                      value={formData.designation}
                      placeholder="Enter your Designation here"
                    />
                  )}
                </div>
              </div>

              {/* Business Details Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Brand/Company Name
                  </label>
                  {isEditing ? (
                    <EditableInput
                      value={formData.brandCompanyName}
                      onChange={(e) =>
                        handleInputChange("brandCompanyName", e.target.value)
                      }
                      placeholder="Enter your Brand name"
                      disabled={isLoading}
                    />
                  ) : (
                    <StaticField
                      value={formData.brandCompanyName}
                      placeholder="Enter your Brand name"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Business Address
                  </label>
                  {isEditing ? (
                    <EditableInput
                      value={formData.businessAddress}
                      onChange={(e) =>
                        handleInputChange("businessAddress", e.target.value)
                      }
                      placeholder="Enter your Business Address"
                      disabled={isLoading}
                    />
                  ) : (
                    <StaticField
                      value={formData.businessAddress}
                      placeholder="Enter your Business Address"
                    />
                  )}
                </div>

                {isEditing && (
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="multipleOutlets"
                      checked={hasMultipleOutlets}
                      onChange={handleMultipleOutletsToggle}
                      className="w-4 h-4 text-[#4A90E2] bg-gray-100 border-gray-300 rounded focus:ring-[#4A90E2] focus:ring-2"
                    />
                    <label
                      htmlFor="multipleOutlets"
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      If more than one outlet
                    </label>
                  </div>
                )}
              </div>

              {/* Outlets Section */}
              {(hasMultipleOutlets || outletsData.length > 0) && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Outlets
                    </label>
                    {isEditing && (
                      <button
                        onClick={addNewOutlet}
                        className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-[#4A90E2] bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        Add outlets
                      </button>
                    )}
                  </div>

                  {outletsData.length > 0 ? (
                    <div className="space-y-4">
                      {outletsData.map((outlet, index) => {
                        // ✅ Check if outlet is incomplete
                        const hasName = outlet.name && outlet.name.trim() !== "";
                        const hasAddress =
                          outlet.address && outlet.address.trim() !== "";
                        const isIncomplete =
                          (!hasName || !hasAddress) && (hasName || hasAddress);

                        return (
                          <div
                            key={outlet.id || index}
                            className={`p-4 border rounded-lg ${
                              isIncomplete
                                ? "border-red-300 bg-red-50"
                                : "border-gray-200"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-sm font-medium text-gray-800">
                                Outlet {index + 1} (Landmark)
                                {outlet.id && (
                                  <span className="text-xs text-gray-400 ml-2">
                                    (Existing)
                                  </span>
                                )}
                              </h3>
                              {isEditing && outletsData.length > 1 && (
                                <button
                                  onClick={() => removeOutlet(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>

                            {/* ✅ Show validation message */}
                            {isIncomplete && isEditing && (
                              <div className="mb-3 p-2 bg-red-100 border border-red-200 rounded text-xs text-red-700">
                                ⚠️ Please complete both name and address, or
                                remove this outlet
                              </div>
                            )}

                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Outlet Name {isEditing && "*"}
                                </label>
                                {isEditing ? (
                                  <EditableInput
                                    value={outlet.name}
                                    onChange={(e) =>
                                      handleOutletChange(
                                        index,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                    placeholder={`Enter Outlet ${index + 1} Name`}
                                    disabled={isLoading}
                                  />
                                ) : (
                                  <StaticField
                                    value={outlet.name}
                                    placeholder={`Enter Outlet ${index + 1} Name`}
                                  />
                                )}
                              </div>

                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Outlet Address {isEditing && "*"}
                                </label>
                                {isEditing ? (
                                  <EditableInput
                                    value={outlet.address}
                                    onChange={(e) =>
                                      handleOutletChange(
                                        index,
                                        "address",
                                        e.target.value
                                      )
                                    }
                                    placeholder={`Enter your Outlet ${
                                      index + 1
                                    } Address`}
                                    disabled={isLoading}
                                  />
                                ) : (
                                  <StaticField
                                    value={outlet.address}
                                    placeholder={`Enter your Outlet ${
                                      index + 1
                                    } Address`}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">
                        No outlets added yet
                      </p>
                      {isEditing && (
                        <button
                          onClick={addNewOutlet}
                          className="mt-2 text-sm text-[#4A90E2] hover:text-[#357ABD]"
                        >
                          Add your first outlet
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Upload Logo Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Logo
                </label>
                {isEditing ? (
                  <CloudinaryUploadWidget onSuccess={handleLogoUploadSuccess}>
                    {({ open }) => {
                      const currentLogo = logoUrl || formData.logo;

                      return (
                        <button
                          onClick={() => open()}
                          className="w-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg text-center transition-colors hover:border-[#4A90E2]"
                        >
                          {currentLogo ? (
                            <div className="w-full max-h-32 flex items-center justify-center mb-2 relative">
                              <Image
                                src={currentLogo}
                                alt="Logo preview"
                                width={200}
                                height={80}
                                className="max-h-20 w-auto object-contain"
                                unoptimized
                              />
                            </div>
                          ) : (
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          )}
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold text-[#4A90E2]">
                              Click to upload
                            </span>{" "}
                            or drop logo
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Max File size up to 10 mb
                          </p>
                        </button>
                      );
                    }}
                  </CloudinaryUploadWidget>
                ) : (
                  <div className="w-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-lg">
                    {(() => {
                      const currentLogo = logoUrl || formData.logo;

                      return currentLogo ? (
                        <Image
                          src={currentLogo}
                          alt="Logo"
                          width={200}
                          height={80}
                          className="max-h-20 w-auto object-contain"
                          unoptimized
                        />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">
                            No logo uploaded
                          </p>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Labels Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Labels
                  </label>
                  {isEditing && (
                    <button
                      onClick={addNewLabel}
                      className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-[#4A90E2] bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      Add Label
                    </button>
                  )}
                </div>

                {labelsData.length > 0 ? (
                  <div className="space-y-4">
                    {labelsData.map((label, index) => {
                      const isLocked = Boolean(
                        label.label_id && lockedLabels.has(label.label_id)
                      );

                      // ✅ Check if label is incomplete
                      const hasName = label.name && label.name.trim() !== "";
                      const hasUrl = label.url && label.url.trim() !== "";
                      const isIncomplete =
                        (!hasName || !hasUrl) && (hasName || hasUrl);

                      return (
                        <div
                          key={label.label_id || index}
                          className={`flex items-center gap-4 p-3 rounded-lg ${
                            isLocked
                              ? "bg-amber-50 border border-amber-200"
                              : isIncomplete
                              ? "bg-red-50 border border-red-200"
                              : "bg-gray-50"
                          }`}
                        >
                          <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
                            {label.url ? (
                              <Image
                                src={label.url}
                                alt={`Label ${index + 1}`}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover rounded-lg"
                                unoptimized
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center">
                                <ImageIcon
                                  className={`w-6 h-6 ${
                                    isIncomplete
                                      ? "text-red-400"
                                      : "text-gray-400"
                                  }`}
                                />
                                {isIncomplete && isEditing && (
                                  <span className="text-xs text-red-500 mt-1">
                                    Required
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex-grow">
                            {isEditing ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={label.name}
                                  onChange={(e) =>
                                    handleLabelNameChange(index, e.target.value)
                                  }
                                  placeholder={`Label ${index + 1} name *`}
                                  className={`w-full px-3 py-2 bg-white rounded-md border ${
                                    isIncomplete && !hasName
                                      ? "border-red-300 focus:ring-red-400"
                                      : "border-gray-200 focus:ring-[#4A90E2]"
                                  } text-gray-800 text-sm focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed`}
                                  disabled={isLoading || isLocked}
                                />

                                {/* ✅ Show validation message */}
                                {isIncomplete && !hasUrl && hasName && (
                                  <p className="text-xs text-red-600">
                                    ⚠️ Please upload an image for this label
                                  </p>
                                )}
                                {isIncomplete && !hasName && hasUrl && (
                                  <p className="text-xs text-red-600">
                                    ⚠️ Please add a name for this label
                                  </p>
                                )}

                                <div className="flex gap-2 items-center flex-wrap">
                                  {label.label_id && (
                                    <span
                                      className={`text-xs ${
                                        isLocked
                                          ? "text-amber-600 font-medium"
                                          : "text-gray-400"
                                      }`}
                                    >
                                      {isLocked
                                        ? "⚠️ In Use (Cannot Delete)"
                                        : "(Existing)"}
                                    </span>
                                  )}

                                  {!isLocked && (
                                    <>
                                      <CloudinaryUploadWidget
                                        onSuccess={(result) =>
                                          handleLabelUploadSuccess(
                                            result,
                                            index
                                          )
                                        }
                                      >
                                        {({ open }) => (
                                          <button
                                            onClick={() => open()}
                                            className={`text-xs ${
                                              isIncomplete && !hasUrl
                                                ? "text-red-500 hover:text-red-700 font-medium"
                                                : "text-[#4A90E2] hover:text-[#357ABD]"
                                            }`}
                                          >
                                            {label.url
                                              ? "Change Image"
                                              : "Upload Image *"}
                                          </button>
                                        )}
                                      </CloudinaryUploadWidget>

                                      {labelsData.length > 1 && (
                                        <button
                                          onClick={() => removeLabel(index)}
                                          className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                          Remove
                                        </button>
                                      )}
                                    </>
                                  )}
                                </div>

                                {isLocked && (
                                  <p className="text-xs text-amber-700 mt-1">
                                    This label is attached to existing orders
                                    and cannot be deleted.
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div>
                                <p className="text-sm font-medium text-gray-800">
                                  {label.name || `Label ${index + 1}`}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {label.url ? "Image uploaded" : "No image"}
                                </p>
                                {isLocked && (
                                  <p className="text-xs text-amber-600 mt-1">
                                    ⚠️ In use with orders
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No labels added yet</p>
                    {isEditing && (
                      <button
                        onClick={addNewLabel}
                        className="mt-2 text-sm text-[#4A90E2] hover:text-[#357ABD]"
                      >
                        Add your first label
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex items-center justify-end gap-4 pt-4">
                  <button
                    onClick={handleCancel}
                    className="px-8 py-3 text-sm font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors disabled:opacity-50"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="px-8 py-3 text-sm font-semibold text-white bg-[#4A90E2] hover:bg-[#357ABD] rounded-lg transition-colors disabled:bg-gray-400"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
