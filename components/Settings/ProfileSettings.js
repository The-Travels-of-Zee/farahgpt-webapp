"use client";
import { useState } from "react";
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
  Link as LinkIcon,
} from "lucide-react";
import Button from "@/components/ui/Button";

const ProfileAndSocialSettings = () => {
  const [formData, setFormData] = useState({
    firstName: "Shaheer",
    lastName: "Mansoor",
    email: "shaheer@example.com",
    phone: "+92 300 1234567",
    bio: "Full-stack developer passionate about creating amazing user experiences.",
    location: "Gujranwala, Punjab, Pakistan",
    birthdate: "1995-06-15",
    website: "https://shaheermansoor.dev",
    profileImage: null,
  });

  const [socialLinks, setSocialLinks] = useState([
    { id: 1, platform: "github", url: "https://github.com/shaheer", icon: Github },
    { id: 2, platform: "twitter", url: "https://twitter.com/shaheer", icon: Twitter },
    { id: 3, platform: "linkedin", url: "https://linkedin.com/in/shaheer", icon: Linkedin },
  ]);

  const [isEditing, setIsEditing] = useState(false);

  const socialPlatforms = [
    { name: "github", icon: Github, placeholder: "GitHub username or URL" },
    { name: "twitter", icon: Twitter, placeholder: "Twitter username or URL" },
    { name: "linkedin", icon: Linkedin, placeholder: "LinkedIn profile URL" },
    { name: "instagram", icon: Instagram, placeholder: "Instagram username or URL" },
    { name: "facebook", icon: Facebook, placeholder: "Facebook profile URL" },
    { name: "youtube", icon: Youtube, placeholder: "YouTube channel URL" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

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

  const handleSave = () => {
    console.log("Saving profile data:", formData);
    console.log("Saving social links:", socialLinks);
    setIsEditing(false);
  };

  const inputClass =
    "w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all";

  return (
    <div className="p-4 mb-18 max-w-4xl mx-auto min-h-screen overflow-y-auto space-y-8">
      {/* Profile Information */}
      <div className="space-y-6 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>

        {/* Profile Picture */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
              {formData.profileImage ? (
                <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-white" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition">
              <Camera className="w-4 h-4 text-gray-600" />
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "firstName", label: "First Name" },
            { name: "lastName", label: "Last Name" },
            { name: "email", label: "Email", type: "email" },
            { name: "phone", label: "Phone", type: "tel" },
            // { name: "location", label: "Location" },
            // { name: "birthdate", label: "Birth Date", type: "date" },
            // { name: "website", label: "Website", type: "url", colSpan: 2 },
          ].map(({ name, label, type = "text", colSpan }) => (
            <div key={name} className={colSpan === 2 ? "md:col-span-2" : ""}>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
              <input
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`${inputClass} ${!isEditing ? "bg-gray-100 cursor-not-allowed" : ""}`}
                placeholder={label}
              />
            </div>
          ))}

          {/* <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Bio</label>
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`${inputClass} resize-none ${!isEditing ? "bg-gray-100 cursor-not-allowed" : ""}`}
              placeholder="Tell us about yourself..."
            />
          </div> */}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant={isEditing ? "outline" : "primarySettings"} onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel" : "Edit"}
          </Button>
          {isEditing && (
            <Button
              variant="primarySettings"
              onClick={handleSave}
              className="bg-gradient-to-r from-teal-200 to-teal-100 text-teal-700 shadow-sm px-4 py-2 text-sm rounded-md transition flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          )}
        </div>
      </div>

      {/* Social Links */}
      {/* <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <LinkIcon className="w-5 h-5 mr-2" />
            Social Links
          </h3>
          <Button
            variant="primarySettings"
            onClick={addSocialLink}
            disabled={socialLinks.length >= socialPlatforms.length}
            className="bg-gradient-to-r from-teal-200 to-teal-100 text-teal-700 shadow-sm px-4 py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed text-sm flex items-center transition"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Link
          </Button>
        </div>

        <div className="space-y-4">
          {socialLinks.map((link) => {
            const platform = socialPlatforms.find((p) => p.name === link.platform);
            const IconComponent = platform?.icon || LinkIcon;

            return (
              <div key={link.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <IconComponent className="w-6 h-6 text-gray-600" />
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={link.platform}
                    onChange={(e) => {
                      const selectedPlatform = socialPlatforms.find((p) => p.name === e.target.value);
                      updateSocialLink(link.id, "platform", e.target.value);
                      updateSocialLink(link.id, "icon", selectedPlatform?.icon || LinkIcon);
                    }}
                    className={inputClass}
                  >
                    {socialPlatforms.map((platform) => (
                      <option key={platform.name} value={platform.name}>
                        {platform.name.charAt(0).toUpperCase() + platform.name.slice(1)}
                      </option>
                    ))}
                  </select>
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateSocialLink(link.id, "url", e.target.value)}
                    placeholder={platform?.placeholder || "Enter URL"}
                    className={inputClass}
                  />
                </div>
                <Button variant="danger" onClick={() => removeSocialLink(link.id)}>
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            );
          })}
        </div>

        {socialLinks.length > 0 && (
          <div className="mt-6 flex justify-end">
            <Button variant="primarySettings" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Social Links
            </Button>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default ProfileAndSocialSettings;
