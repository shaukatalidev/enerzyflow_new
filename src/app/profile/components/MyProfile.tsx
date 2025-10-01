"use client";

import { useState, useEffect } from "react";
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
  labels?: Array<{ name: string; url: string }>;
  outlets?: Array<{ name: string; address: string }>; // ✅ Added outlets
}

// ✅ Updated interface to include outlets
interface MyProfileProps {
  userProfile: UserProfile;
  onProfileUpdate: (
    updatedProfile: UserProfile,
    profileImageUrl?: string,
    logoUrl?: string,
    labelsData?: Array<{ name: string; url: string }>,
    outletsData?: Array<{ name: string; address: string }>
  ) => Promise<any>;
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

  // ✅ Updated state management
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [labelsData, setLabelsData] = useState<
    Array<{ name: string; url: string }>
  >([]);
  const [outletsData, setOutletsData] = useState<
    Array<{ name: string; address: string }>
  >([]); // ✅ Added outlets state
  const [hasMultipleOutlets, setHasMultipleOutlets] = useState(false);

  useEffect(() => {
    setFormData(userProfile);
    setOriginalData(userProfile);
    setProfileImageUrl(userProfile.profilePhoto || "");
    setLogoUrl(userProfile.logo || "");
    setLabelsData(userProfile.labels || []);
    setOutletsData(userProfile.outlets || []); // ✅ Set outlets data
    setHasMultipleOutlets((userProfile.outlets?.length || 0) > 0);
  }, [userProfile]);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Handle label changes
  const handleLabelNameChange = (index: number, name: string) => {
    setLabelsData((prev) =>
      prev.map((label, i) => (i === index ? { ...label, name } : label))
    );
  };

  // ✅ Handle outlet changes
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
    setLabelsData((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Outlet management functions
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

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const result = await onProfileUpdate(
        formData,
        profileImageUrl || undefined,
        logoUrl || undefined,
        labelsData.length > 0 ? labelsData : undefined,
        outletsData.length > 0 ? outletsData : undefined // ✅ Pass outlets data
      );

      setOriginalData(formData);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error: any) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setProfileImageUrl(originalData.profilePhoto || "");
    setLogoUrl(originalData.logo || "");
    setLabelsData(originalData.labels || []);
    setOutletsData(originalData.outlets || []); // ✅ Reset outlets
    setHasMultipleOutlets((originalData.outlets?.length || 0) > 0);
    setIsEditing(false);
    onClearError?.();
  };

  // Upload handlers (same as before)
  const handleProfileUploadSuccess = (result: any) => {
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

  const handleLogoUploadSuccess = (result: any) => {
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

  const handleLabelUploadSuccess = (result: any, index: number) => {
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
                      <img
                        src={imageUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error(
                            "Profile image failed to load:",
                            imageUrl
                          );
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
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

                {/* ✅ Multiple Outlets Checkbox */}
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

              {/* ✅ Outlets Section */}
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
                      {outletsData.map((outlet, index) => (
                        <div
                          key={index}
                          className="p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-medium text-gray-800">
                              Outlet {index + 1} (Landmark)
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

                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Outlet Name
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
                                  placeholder={`Enter Outlet ${
                                    index + 1
                                  } Name`}
                                  disabled={isLoading}
                                />
                              ) : (
                                <StaticField
                                  value={outlet.name}
                                  placeholder={`Enter Outlet ${
                                    index + 1
                                  } Name`}
                                />
                              )}
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Outlet Address
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
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No outlets added yet</p>
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
                    {({ open }) => (
                      <button
                        onClick={() => open()}
                        className="w-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg text-center transition-colors"
                      >
                        {logoUrl ? (
                          <div className="w-full max-h-32 flex items-center justify-center mb-2">
                            <img
                              src={logoUrl}
                              alt="Logo preview"
                              className="max-h-20 max-w-full object-contain"
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
                    )}
                  </CloudinaryUploadWidget>
                ) : (
                  <div className="w-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-lg">
                    {logoUrl || formData.logo ? (
                      <img
                        src={logoUrl || formData.logo}
                        alt="Logo"
                        className="max-h-20 max-w-full object-contain"
                      />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          No logo uploaded
                        </p>
                      </>
                    )}
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
                    {labelsData.map((label, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          {label.url ? (
                            <img
                              src={label.url}
                              alt={`Label ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-gray-400" />
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
                                placeholder={`Label ${index + 1} name`}
                                className="w-full px-3 py-2 bg-white rounded-md border border-gray-200 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                                disabled={isLoading}
                              />

                              <div className="flex gap-2">
                                <CloudinaryUploadWidget
                                  onSuccess={(result) =>
                                    handleLabelUploadSuccess(result, index)
                                  }
                                >
                                  {({ open }) => (
                                    <button
                                      onClick={() => open()}
                                      className="text-xs text-[#4A90E2] hover:text-[#357ABD]"
                                    >
                                      {label.url
                                        ? "Change Image"
                                        : "Upload Image"}
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
                              </div>
                            </div>
                          ) : (
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {label.name || `Label ${index + 1}`}
                              </p>
                              <p className="text-xs text-gray-500">
                                {label.url ? "Image uploaded" : "No image"}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
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
