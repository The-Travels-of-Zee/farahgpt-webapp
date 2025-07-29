"use client";
import { useState, useEffect } from "react";
import {
  Camera,
  Save,
  User,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  Plus,
  Trash2,
  Link,
  Loader2,
  AlertCircle,
  CheckCircle,
  Link as LinkIcon,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { useUser } from "@/hooks/useUser";

const ProfileAndSocialSettings = () => {
  const {
    user,
    displayName,
    photoUrl,
    currentUser,
    refreshUser,
    updateProfile,
    uploadProfilePicture,
    deleteProfilePicture,
  } = useUser();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    profileImage: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Load user data on component mount
  useEffect(() => {
    if (user?.id) {
      loadUserProfile();
    }
  }, [user?.id]);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      await refreshUser(user?.id);

      // Update form data with current user information
      setFormData({
        fullName: user?.name || displayName || "",
        email: user?.email || "",
        profileImage: photoUrl || null,
      });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load profile" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please select an image file" });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image size must be less than 5MB" });
      return;
    }

    try {
      setImageUploading(true);
      const result = await uploadProfilePicture(user?.id, file);

      setFormData((prev) => ({ ...prev, profileImage: result.imageUrl }));
      setMessage({ type: "success", text: "Profile picture updated successfully" });
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to upload image" });
    } finally {
      setImageUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    try {
      setImageUploading(true);
      await deleteProfilePicture(user?.id);

      setFormData((prev) => ({ ...prev, profileImage: null }));
      setMessage({ type: "success", text: "Profile picture removed successfully" });
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to remove image" });
    } finally {
      setImageUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await updateProfile(user?.id, formData);

      setMessage({ type: "success", text: "Profile updated successfully" });
      setIsEditing(false);

      // Refresh user data to get latest information
      await refreshUser(user?.id);
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to update profile" });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const [socialLinks, setSocialLinks] = useState([
    { id: 1, platform: "github", url: "https://github.com/shaheer", icon: Github },
    { id: 2, platform: "twitter", url: "https://twitter.com/shaheer", icon: Twitter },
    { id: 3, platform: "linkedin", url: "https://linkedin.com/in/shaheer", icon: Linkedin },
  ]);

  const socialPlatforms = [
    { name: "github", icon: Github, placeholder: "GitHub username or URL" },
    { name: "twitter", icon: Twitter, placeholder: "Twitter username or URL" },
    { name: "linkedin", icon: Linkedin, placeholder: "LinkedIn profile URL" },
    { name: "instagram", icon: Instagram, placeholder: "Instagram username or URL" },
    { name: "facebook", icon: Facebook, placeholder: "Facebook profile URL" },
    { name: "youtube", icon: Youtube, placeholder: "YouTube channel URL" },
  ];

  const addSocialLink = () => {
    const availablePlatforms = socialPlatforms.filter(
      (platform) => !socialLinks.some((link) => link.platform === platform.name)
    );

    if (availablePlatforms.length > 0) {
      const newPlatform = availablePlatforms[0];
      setSocialLinks((prev) => [
        ...prev,
        {
          id: Date.now(),
          platform: newPlatform.name,
          url: "",
          icon: newPlatform.icon,
        },
      ]);
    }
  };

  const updateSocialLink = (id, field, value) => {
    setSocialLinks((prev) => prev.map((link) => (link.id === id ? { ...link, [field]: value } : link)));
  };

  const removeSocialLink = (id) => {
    setSocialLinks((prev) => prev.filter((link) => link.id !== id));
  };

  const inputClass =
    "w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all";

  return (
    <div className="p-4 mb-18 max-w-4xl mx-auto min-h-screen overflow-y-auto space-y-8">
      {/* Message Display */}
      {message.text && (
        <div
          className={`p-4 rounded-md flex items-center gap-2 ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Profile Information */}
      <div className="space-y-6 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>

        {/* Profile Picture */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center overflow-hidden">
              {imageUploading ? (
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              ) : photoUrl ? (
                <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-white" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition cursor-pointer">
              <Camera className="w-4 h-4 text-gray-600" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={imageUploading}
              />
            </label>
          </div>

          {photoUrl && (
            <button
              onClick={handleDeleteImage}
              disabled={imageUploading}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
            >
              Remove Photo
            </button>
          )}
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "fullName", label: "Full Name" },
            { name: "email", label: "Email", type: "email", disabled: true }, // Email is read-only
          ].map(({ name, label, type = "text", disabled }) => (
            <div key={name}>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
              <input
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleInputChange}
                disabled={disabled || !isEditing}
                className={`${inputClass} ${!isEditing ? "bg-gray-100 cursor-not-allowed" : ""} ${
                  disabled ? "cursor-not-allowed" : ""
                }`}
                placeholder={label}
              />
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={() => {
              setIsEditing(!isEditing);
              if (isEditing) {
                // Reset form data when canceling
                loadUserProfile();
              }
            }}
            disabled={isLoading}
            className={`px-4 py-2 text-sm rounded-md transition ${
              isEditing ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-blue-500 text-white hover:bg-blue-600"
            } disabled:opacity-50`}
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>

          {isEditing && (
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-sm px-4 py-2 text-sm rounded-md hover:from-teal-600 hover:to-teal-700 transition flex items-center disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileAndSocialSettings;
