"use client";

import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import Image from "next/image";
import {
  User,
  Edit3,
  Image as ImageIcon,
  Pencil,
  AlertCircle,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import { CloudinaryUploadWidget } from "@/components/CloudinaryWrapper";
import toast from "react-hot-toast";

interface UserProfile {
  name?: string;
  contactNo?: string;
  email?: string;
  brandCompanyName?: string;
  businessAddress?: string;
  profilePhoto?: string;
  labelName?: string;
  logo?: string;
  role?: "plant" | "printing" | "business_owner" | "admin";
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

interface CloudinaryUploadResult {
  info?: {
    secure_url?: string;
  };
}

// ✅ Memoized Components
const EditableInput = memo(
  ({
    value,
    onChange,
    placeholder,
    type = "text",
    disabled = false,
    hasError = false,
  }: {
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    type?: string;
    disabled?: boolean;
    hasError?: boolean;
  }) => (
    <div className="relative">
      <input
        type={type}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-3 bg-gray-100/70 rounded-lg text-gray-800 focus:outline-none focus:ring-2 transition-all pr-10 disabled:opacity-50 disabled:cursor-not-allowed ${
          hasError
            ? "border-2 border-red-300 focus:ring-red-400"
            : "focus:ring-[#4A90E2]"
        }`}
      />
      <Pencil className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
    </div>
  )
);

EditableInput.displayName = "EditableInput";

const StaticField = memo(
  ({ value, placeholder }: { value?: string; placeholder?: string }) => (
    <p className="w-full px-4 py-3 bg-gray-100/70 rounded-lg text-gray-800 break-words min-h-[48px] flex items-center">
      {value || <span className="text-gray-400">{placeholder}</span>}
    </p>
  )
);

StaticField.displayName = "StaticField";

const ErrorAlert = memo(
  ({ message, onClose }: { message: string; onClose: () => void }) => (
    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-red-800 text-sm">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-red-500 hover:text-red-700 cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
);

ErrorAlert.displayName = "ErrorAlert";

// ✅ Profile Photo Section
// ✅ Profile Photo Section - Display Only (No Upload Button)
const ProfilePhotoSection = memo(
  ({
    profileImageUrl,
    formData,
  }: {
    profileImageUrl: string;
    formData: UserProfile;
  }) => {
    const imageUrl = profileImageUrl || formData.profilePhoto;

    return (
      <div className="md:w-1/3 lg:w-1/4">
        <div className="flex flex-col items-center justify-center md:bg-white md:rounded-xl md:shadow-sm md:border md:border-gray-100 md:p-6">
          <div className="relative w-24 h-24 mb-3">
            <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
              {imageUrl ? (
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
              )}
            </div>
          </div>

          <div className="hidden md:block text-center mt-4">
            <h2 className="text-xl font-bold text-gray-900">
              {formData.name || "Your Name"}
            </h2>
          </div>
        </div>
      </div>
    );
  }
);

ProfilePhotoSection.displayName = "ProfilePhotoSection";

// ✅ Profile Photo Input Section
const ProfilePhotoInputSection = memo(
  ({
    profileImageUrl,
    formData,
    isEditing,
    isLoading,
    onUploadSuccess,
  }: {
    profileImageUrl: string;
    formData: UserProfile;
    isEditing: boolean;
    isLoading: boolean;
    onUploadSuccess: (result: CloudinaryUploadResult) => void;
  }) => {
    const imageUrl = profileImageUrl || formData.profilePhoto;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Profile Photo
        </label>

        {isEditing ? (
          <CloudinaryUploadWidget onSuccess={onUploadSuccess}>
            {({ open }) => (
              <div
                onClick={() => !isLoading && open()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#4A90E2] hover:bg-gray-50 transition-all"
              >
                {/* Profile Image Preview */}
                <div className="w-24 h-24 mb-4 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                  {imageUrl ? (
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
                  )}
                </div>

                {/* Upload Text */}
                <p className="text-sm text-gray-600 mb-1">
                  <span className="text-[#4A90E2] font-medium">
                    Click to upload
                  </span>{" "}
                  or drop photo
                </p>
                <p className="text-xs text-gray-400">
                  Max File size up to 10 mb
                </p>
              </div>
            )}
          </CloudinaryUploadWidget>
        ) : (
          <div className="border-2 border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center">
            {/* Profile Image Display */}
            <div className="w-24 h-24 mb-4 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
              {imageUrl ? (
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
              )}
            </div>
            <p className="text-sm text-gray-600">
              {imageUrl ? "Photo uploaded" : "No photo uploaded"}
            </p>
          </div>
        )}
      </div>
    );
  }
);

ProfilePhotoInputSection.displayName = "ProfilePhotoInputSection";

// ✅ Personal Info Section
const PersonalInfoSection = memo(
  ({
    formData,
    isEditing,
    isLoading,
    showValidation,
    validationErrors,
    onInputChange,
  }: {
    formData: UserProfile;
    isEditing: boolean;
    isLoading: boolean;
    showValidation: boolean;
    validationErrors: { [key: string]: string };
    onInputChange: (field: keyof UserProfile, value: string) => void;
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Your Name <span className="text-red-500">*</span>
        </label>
        {isEditing ? (
          <>
            <EditableInput
              value={formData.name}
              onChange={(e) => onInputChange("name", e.target.value)}
              placeholder="Enter your name here"
              disabled={isLoading}
              hasError={showValidation && !!validationErrors.name}
            />
            {showValidation && validationErrors.name && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {validationErrors.name}
              </p>
            )}
          </>
        ) : (
          <StaticField
            value={formData.name}
            placeholder="Enter your name here"
          />
        )}
      </div>

      {/* Contact Number Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Contact No. <span className="text-red-500">*</span>
        </label>
        {isEditing ? (
          <>
            <EditableInput
              value={formData.contactNo}
              onChange={(e) => onInputChange("contactNo", e.target.value)}
              placeholder="Enter your contact no."
              type="tel"
              disabled={isLoading}
              hasError={showValidation && !!validationErrors.contactNo}
            />
            {showValidation && validationErrors.contactNo && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {validationErrors.contactNo}
              </p>
            )}
          </>
        ) : (
          <StaticField
            value={formData.contactNo}
            placeholder="Enter your contact no."
          />
        )}
      </div>

      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Email
        </label>
        <StaticField
          value={formData.email}
          placeholder="Enter your email here"
        />
      </div>
    </div>
  )
);

PersonalInfoSection.displayName = "PersonalInfoSection";

// ✅ Company Info Section
const CompanyInfoSection = memo(
  ({
    formData,
    isEditing,
    isLoading,
    showValidation,
    validationErrors,
    hasMultipleOutlets,
    onInputChange,
    onMultipleOutletsToggle,
  }: {
    formData: UserProfile;
    isEditing: boolean;
    isLoading: boolean;
    showValidation: boolean;
    validationErrors: { [key: string]: string };
    hasMultipleOutlets: boolean;
    onInputChange: (field: keyof UserProfile, value: string) => void;
    onMultipleOutletsToggle: () => void;
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Brand/Company Name <span className="text-red-500">*</span>
        </label>
        {isEditing ? (
          <>
            <EditableInput
              value={formData.brandCompanyName}
              onChange={(e) =>
                onInputChange("brandCompanyName", e.target.value)
              }
              placeholder="Enter your Brand name"
              disabled={isLoading}
              hasError={showValidation && !!validationErrors.brandCompanyName}
            />
            {showValidation && validationErrors.brandCompanyName && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {validationErrors.brandCompanyName}
              </p>
            )}
          </>
        ) : (
          <StaticField
            value={formData.brandCompanyName}
            placeholder="Enter your Brand name"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Business Address <span className="text-red-500">*</span>
        </label>
        {isEditing ? (
          <>
            <EditableInput
              value={formData.businessAddress}
              onChange={(e) => onInputChange("businessAddress", e.target.value)}
              placeholder="Enter your Business Address"
              disabled={isLoading}
              hasError={showValidation && !!validationErrors.businessAddress}
            />
            {showValidation && validationErrors.businessAddress && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {validationErrors.businessAddress}
              </p>
            )}
          </>
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
            onChange={onMultipleOutletsToggle}
            className="w-4 h-4 text-[#4A90E2] bg-gray-100 border-gray-300 rounded focus:ring-[#4A90E2] focus:ring-2 cursor-pointer"
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
  )
);

CompanyInfoSection.displayName = "CompanyInfoSection";

// ✅ Labels Section Component
const LabelsSection = memo(
  ({
    labelsData,
    isEditing,
    isLoading,
    showValidation,
    validationErrors,
    lockedLabels,
    onLabelNameChange,
    onAddLabel,
    onRemoveLabel,
    onLabelUploadSuccess,
  }: {
    labelsData: Array<{ label_id?: string; name: string; url: string }>;
    isEditing: boolean;
    isLoading: boolean;
    showValidation: boolean;
    validationErrors: { [key: string]: string };
    lockedLabels: Set<string>;
    onLabelNameChange: (index: number, name: string) => void;
    onAddLabel: () => void;
    onRemoveLabel: (index: number) => void;
    onLabelUploadSuccess: (
      result: CloudinaryUploadResult,
      index: number
    ) => void;
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Labels
        </label>
        {isEditing && (
          <button
            onClick={onAddLabel}
            className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-[#4A90E2] bg-blue-50 rounded-md hover:bg-blue-100 transition-colors cursor-pointer"
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
            const hasError =
              showValidation && validationErrors[`label_${index}`];

            return (
              <div
                key={label.label_id || index}
                className={`flex items-center gap-4 p-3 rounded-lg ${
                  isLocked
                    ? "bg-amber-50 border border-amber-200"
                    : hasError
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
                    <ImageIcon
                      className={`w-6 h-6 ${
                        hasError ? "text-red-400" : "text-gray-400"
                      }`}
                    />
                  )}
                </div>

                <div className="flex-grow">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={label.name}
                        onChange={(e) =>
                          onLabelNameChange(index, e.target.value)
                        }
                        placeholder={`Label ${index + 1} name *`}
                        className={`w-full px-3 py-2 bg-white rounded-md border text-gray-800 text-sm focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                          hasError
                            ? "border-red-300 focus:ring-red-400"
                            : "border-gray-200 focus:ring-[#4A90E2]"
                        }`}
                        disabled={isLoading || isLocked}
                      />

                      {hasError && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {validationErrors[`label_${index}`]}
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
                                onLabelUploadSuccess(result, index)
                              }
                            >
                              {({ open }) => (
                                <button
                                  onClick={() => open()}
                                  className={`text-xs cursor-pointer ${
                                    hasError
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
                                onClick={() => onRemoveLabel(index)}
                                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
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
                          This label is attached to existing orders and cannot
                          be deleted.
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
              onClick={onAddLabel}
              className="mt-2 text-sm text-[#4A90E2] hover:text-[#357ABD] cursor-pointer"
            >
              Add your first label
            </button>
          )}
        </div>
      )}
    </div>
  )
);

LabelsSection.displayName = "LabelsSection";

// ✅ Outlets Section Component
const OutletsSection = memo(
  ({
    outletsData,
    isEditing,
    isLoading,
    showValidation,
    validationErrors,
    hasMultipleOutlets,
    onOutletChange,
    onAddOutlet,
    onRemoveOutlet,
  }: {
    outletsData: Array<{ id?: string; name: string; address: string }>;
    isEditing: boolean;
    isLoading: boolean;
    showValidation: boolean;
    validationErrors: { [key: string]: string };
    hasMultipleOutlets: boolean;
    onOutletChange: (
      index: number,
      field: "name" | "address",
      value: string
    ) => void;
    onAddOutlet: () => void;
    onRemoveOutlet: (index: number) => void;
  }) => {
    if (!hasMultipleOutlets && !outletsData.length) return null;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Outlets
          </label>
          {isEditing && (
            <button
              onClick={onAddOutlet}
              className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-[#4A90E2] bg-blue-50 rounded-md hover:bg-blue-100 transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              Add Outlet
            </button>
          )}
        </div>

        <div className="space-y-4">
          {outletsData.map((outlet, index) => {
            const hasError =
              showValidation && validationErrors[`outlet_${index}`];

            return (
              <div
                key={outlet.id || index}
                className={`p-4 rounded-lg ${
                  hasError ? "bg-red-50 border border-red-200" : "bg-gray-50"
                }`}
              >
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={outlet.name}
                      onChange={(e) =>
                        onOutletChange(index, "name", e.target.value)
                      }
                      placeholder={`Outlet ${index + 1} name *`}
                      className={`w-full px-3 py-2 bg-white rounded-md border text-gray-800 text-sm focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                        hasError
                          ? "border-red-300 focus:ring-red-400"
                          : "border-gray-200 focus:ring-[#4A90E2]"
                      }`}
                      disabled={isLoading}
                    />

                    <input
                      type="text"
                      value={outlet.address}
                      onChange={(e) =>
                        onOutletChange(index, "address", e.target.value)
                      }
                      placeholder={`Outlet ${index + 1} address *`}
                      className={`w-full px-3 py-2 bg-white rounded-md border text-gray-800 text-sm focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                        hasError
                          ? "border-red-300 focus:ring-red-400"
                          : "border-gray-200 focus:ring-[#4A90E2]"
                      }`}
                      disabled={isLoading}
                    />

                    {hasError && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {validationErrors[`outlet_${index}`]}
                      </p>
                    )}

                    <div className="flex gap-2 items-center">
                      {outlet.id && (
                        <span className="text-xs text-gray-400">
                          (Existing)
                        </span>
                      )}

                      {outletsData.length > 1 && (
                        <button
                          onClick={() => onRemoveOutlet(index)}
                          className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
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
                      {outlet.name || `Outlet ${index + 1}`}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {outlet.address || "No address"}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

OutletsSection.displayName = "OutletsSection";

// ✅ Main Component with Optimized Hooks
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
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const [showValidation, setShowValidation] = useState(false);

  const initialDataSet = useRef(false);

  // ✅ Memoized helper
  const isProfileComplete = useCallback((profile: UserProfile): boolean => {
    return !!(
      profile.name?.trim() &&
      profile.contactNo?.trim() &&
      profile.brandCompanyName?.trim() &&
      profile.businessAddress?.trim()
    );
  }, []);

  // ✅ Effect to sync props
  useEffect(() => {
    if (!userProfile) return;

    setFormData(userProfile);
    setOriginalData(userProfile);
    setProfileImageUrl(userProfile.profilePhoto || "");
    setLogoUrl(userProfile.logo || "");
    setLabelsData(userProfile.labels || []);
    setOutletsData(userProfile.outlets || []);
    setHasMultipleOutlets((userProfile.outlets?.length || 0) > 0);

    if (!initialDataSet.current) {
      const profileComplete = isProfileComplete(userProfile);
      if (!profileComplete) {
        setIsEditing(true);
        toast("Please complete your profile information", {
          icon: "ℹ️",
          duration: 4000,
          position: "top-center",
          style: { background: "#3b82f6", color: "#fff" },
        });
      }
      initialDataSet.current = true;
    }
  }, [userProfile, isProfileComplete]);

  // ✅ Memoized handlers
  const handleInputChange = useCallback(
    (field: keyof UserProfile, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (showValidation) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [showValidation]
  );

  const handleLabelNameChange = useCallback(
    (index: number, name: string) => {
      setLabelsData((prev) =>
        prev.map((label, i) => (i === index ? { ...label, name } : label))
      );
      if (showValidation) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[`label_${index}`];
          return newErrors;
        });
      }
    },
    [showValidation]
  );

  const addNewLabel = useCallback(() => {
    setLabelsData((prev) => [...prev, { name: "", url: "" }]);
  }, []);

  const removeLabel = useCallback(
    (index: number) => {
      const label = labelsData[index];

      if (label.label_id && lockedLabels.has(label.label_id)) {
        toast.error(
          "This label cannot be deleted because it is attached to existing orders.",
          {
            duration: 4000,
            position: "top-center",
          }
        );
        return;
      }

      setLabelsData((prev) => prev.filter((_, i) => i !== index));
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`label_${index}`];
        return newErrors;
      });
    },
    [labelsData, lockedLabels]
  );

  const handleOutletChange = useCallback(
    (index: number, field: "name" | "address", value: string) => {
      setOutletsData((prev) =>
        prev.map((outlet, i) =>
          i === index ? { ...outlet, [field]: value } : outlet
        )
      );
      if (showValidation) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[`outlet_${index}`];
          return newErrors;
        });
      }
    },
    [showValidation]
  );

  const addNewOutlet = useCallback(() => {
    setOutletsData((prev) => [...prev, { name: "", address: "" }]);
  }, []);

  const removeOutlet = useCallback((index: number) => {
    setOutletsData((prev) => prev.filter((_, i) => i !== index));
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`outlet_${index}`];
      return newErrors;
    });
  }, []);

  const handleMultipleOutletsToggle = useCallback(() => {
    setHasMultipleOutlets((prev) => !prev);
    setOutletsData((prev) => {
      if (!hasMultipleOutlets && prev.length === 0) {
        return [{ name: "", address: "" }];
      } else if (hasMultipleOutlets) {
        return [];
      }
      return prev;
    });
  }, [hasMultipleOutlets]);

  const validateFormData = useCallback((): {
    isValid: boolean;
    errors: { [key: string]: string };
  } => {
    const errors: { [key: string]: string } = {};

    if (!formData.name?.trim()) errors.name = "Name is required";
    if (!formData.contactNo?.trim())
      errors.contactNo = "Contact number is required";
    if (!formData.brandCompanyName?.trim())
      errors.brandCompanyName = "Brand/Company name is required";
    if (!formData.businessAddress?.trim())
      errors.businessAddress = "Business address is required";

    labelsData.forEach((label, index) => {
      const hasName = label.name?.trim();
      const hasUrl = label.url?.trim();

      if (!hasName && !hasUrl) {
        errors[`label_${index}`] =
          "Please either delete this label or add both name and image";
      } else if (!hasName && hasUrl) {
        errors[`label_${index}`] = "Please add a name for this label";
      } else if (hasName && !hasUrl) {
        errors[`label_${index}`] = `Please upload an image for "${label.name}"`;
      }
    });

    outletsData.forEach((outlet, index) => {
      const hasName = outlet.name?.trim();
      const hasAddress = outlet.address?.trim();

      if (!hasName && !hasAddress) {
        errors[`outlet_${index}`] =
          "Please either delete this outlet or add both name and address";
      } else if (!hasName && hasAddress) {
        errors[`outlet_${index}`] = "Please add a name for this outlet";
      } else if (hasName && !hasAddress) {
        errors[
          `outlet_${index}`
        ] = `Please add an address for "${outlet.name}"`;
      }
    });

    return { isValid: Object.keys(errors).length === 0, errors };
  }, [formData, labelsData, outletsData]);

  const isFormValid = useMemo((): boolean => {
    return !!(
      formData.name?.trim() &&
      formData.contactNo?.trim() &&
      formData.brandCompanyName?.trim() &&
      formData.businessAddress?.trim()
    );
  }, [
    formData.name,
    formData.contactNo,
    formData.brandCompanyName,
    formData.businessAddress,
  ]);

  const handleSubmit = useCallback(async () => {
    setShowValidation(true);
    const validation = validateFormData();

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      const errorMessages = Object.values(validation.errors).slice(0, 3);
      errorMessages.forEach((error, index) => {
        setTimeout(() => {
          toast.error(error, { duration: 5000, position: "top-center" });
        }, index * 100);
      });

      if (Object.keys(validation.errors).length > 3) {
        setTimeout(() => {
          toast.error(
            `And ${
              Object.keys(validation.errors).length - 3
            } more errors. Please check all fields.`,
            {
              duration: 5000,
              position: "top-center",
            }
          );
        }, 300);
      }
      return;
    }

    try {
      setIsLoading(true);

      const validLabels = labelsData.filter(
        (label) => label.name.trim() && label.url.trim()
      );
      const validOutlets = outletsData.filter(
        (outlet) => outlet.name.trim() && outlet.address.trim()
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
            return { ...blockedLabel, url: originalLabel?.url || "" };
          });

          setLabelsData((prev) => [...prev, ...labelsWithUrls]);

          toast(
            `Note: ${newBlockedLabels.length} label(s) could not be deleted because they are attached to existing orders.`,
            {
              duration: 5000,
              position: "top-center",
              icon: "⚠️",
              style: {
                background: "#f59e0b",
                color: "#fff",
                maxWidth: "600px",
              },
            }
          );
        }
      }

      const updatedProfile = {
        ...formData,
        labels: validLabels,
        outlets: validOutlets,
        profilePhoto: profileImageUrl,
        logo: logoUrl,
      };

      setOriginalData(updatedProfile);
      setShowValidation(false);
      setValidationErrors({});
      setIsLoading(false);
      setIsEditing(false);

      toast.success("Profile updated successfully!", {
        duration: 3000,
        position: "top-center",
        icon: "✅",
      });
    } catch (error: unknown) {
      setIsLoading(false);
      console.error("❌ Failed to update profile:", error);

      let errorMessage = "Failed to update profile. Please try again.";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object" && "message" in error) {
        errorMessage = String(error.message);
      }

      toast.error(errorMessage, {
        duration: 6000,
        position: "top-center",
        icon: "❌",
        style: {
          background: "#ef4444",
          color: "#fff",
          maxWidth: "700px",
          fontSize: "14px",
          padding: "16px",
        },
      });
    }
  }, [
    validateFormData,
    labelsData,
    outletsData,
    formData,
    profileImageUrl,
    logoUrl,
    onProfileUpdate,
    originalData.labels,
  ]);

  const handleCancel = useCallback(() => {
    setFormData(originalData);
    setProfileImageUrl(originalData.profilePhoto || "");
    setLogoUrl(originalData.logo || "");
    setLabelsData(originalData.labels || []);
    setOutletsData(originalData.outlets || []);
    setHasMultipleOutlets((originalData.outlets?.length || 0) > 0);
    setIsEditing(false);
    setLockedLabels(new Set());
    setShowValidation(false);
    setValidationErrors({});
    onClearError?.();
  }, [originalData, onClearError]);

  const handleProfileUploadSuccess = useCallback(
    (result: CloudinaryUploadResult) => {
      if (result.info?.secure_url) {
        const newUrl = result.info.secure_url;
        setProfileImageUrl(newUrl);
        setLogoUrl(newUrl);
        setFormData((prev) => ({
          ...prev,
          profilePhoto: newUrl,
          logo: newUrl,
        }));
      }
    },
    []
  );

  const handleLabelUploadSuccess = useCallback(
    (result: CloudinaryUploadResult, index: number) => {
      if (result.info?.secure_url) {
        const newUrl = result.info.secure_url;
        setLabelsData((prev) =>
          prev.map((label, i) =>
            i === index ? { ...label, url: newUrl } : label
          )
        );
        if (showValidation) {
          setValidationErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[`label_${index}`];
            return newErrors;
          });
        }
      }
    },
    [showValidation]
  );

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
              className="flex items-center justify-center gap-2 px-5 py-2.5 w-full md:w-auto text-sm font-semibold text-white bg-[#4A90E2] hover:bg-[#357ABD] rounded-lg transition-all shadow-sm cursor-pointer"
            >
              <Edit3 size={16} />
              <span>Edit Profile</span>
            </button>
          )}
        </header>

        {isEditing && !isProfileComplete(formData) && (
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Please complete the required fields below to set up your
                  profile.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:gap-8 lg:gap-12">
          {/* Left Section - Profile Photo Display Only (No Upload) */}
          <ProfilePhotoSection
            profileImageUrl={profileImageUrl}
            formData={formData}
          />

          {/* Right Section - All Form Inputs */}
          <div className="md:w-2/3 lg:w-3/4 mt-8 md:mt-0">
            <div className="space-y-6">
              <PersonalInfoSection
                formData={formData}
                isEditing={isEditing}
                isLoading={isLoading}
                showValidation={showValidation}
                validationErrors={validationErrors}
                onInputChange={handleInputChange}
              />

              <CompanyInfoSection
                formData={formData}
                isEditing={isEditing}
                isLoading={isLoading}
                showValidation={showValidation}
                validationErrors={validationErrors}
                hasMultipleOutlets={hasMultipleOutlets}
                onInputChange={handleInputChange}
                onMultipleOutletsToggle={handleMultipleOutletsToggle}
              />

              <OutletsSection
                outletsData={outletsData}
                isEditing={isEditing}
                isLoading={isLoading}
                showValidation={showValidation}
                validationErrors={validationErrors}
                hasMultipleOutlets={hasMultipleOutlets}
                onOutletChange={handleOutletChange}
                onAddOutlet={addNewOutlet}
                onRemoveOutlet={removeOutlet}
              />

              {/* NEW: Profile Photo Input Section (Above Labels) */}
              <ProfilePhotoInputSection
                profileImageUrl={profileImageUrl}
                formData={formData}
                isEditing={isEditing}
                isLoading={isLoading}
                onUploadSuccess={handleProfileUploadSuccess}
              />

              <LabelsSection
                labelsData={labelsData}
                isEditing={isEditing}
                isLoading={isLoading}
                showValidation={showValidation}
                validationErrors={validationErrors}
                lockedLabels={lockedLabels}
                onLabelNameChange={handleLabelNameChange}
                onAddLabel={addNewLabel}
                onRemoveLabel={removeLabel}
                onLabelUploadSuccess={handleLabelUploadSuccess}
              />

              {isEditing && (
                <div className="flex items-center justify-end gap-4 pt-4">
                  <button
                    onClick={handleCancel}
                    className="px-8 py-3 text-sm font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || !isFormValid}
                    className="px-8 py-3 text-sm font-semibold text-white bg-[#4A90E2] hover:bg-[#357ABD] rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
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
