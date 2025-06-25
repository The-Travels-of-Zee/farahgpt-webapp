"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Check, ArrowRight, ArrowLeft, Edit3, RefreshCw } from "lucide-react";

const screens = [
  { id: "details", title: "Course Details" },
  { id: "upload", title: "Upload PDF" },
  { id: "review", title: "Review & Confirm" },
  { id: "success", title: "Complete" },
];

export default function CourseUploadFlow() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
    image: null,
    status: "draft",
  });
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleNext = () => {
    if (validateCurrentScreen()) {
      setCurrentScreen((prev) => Math.min(prev + 1, screens.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentScreen((prev) => Math.max(prev - 1, 0));
  };

  const validateCurrentScreen = () => {
    const newErrors = {};

    if (currentScreen === 0) {
      if (!formData.title.trim()) newErrors.title = "Title is required";
      if (formData.description.trim().length < 10) {
        newErrors.description = "Description must be at least 10 characters";
      }
    }

    if (currentScreen === 1) {
      if (!formData.file) newErrors.file = "PDF file is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = (file) => {
    if (file && file.type === "application/pdf") {
      setFormData((prev) => ({ ...prev, file }));
      setErrors((prev) => ({ ...prev, file: null }));
    } else {
      setErrors((prev) => ({ ...prev, file: "Only PDF files are allowed" }));
    }
  };

  const handleImageUpload = (file) => {
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, image: file }));
      setErrors((prev) => ({ ...prev, image: null }));
    } else {
      setErrors((prev) => ({ ...prev, image: "Only image files are allowed" }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = () => {
    console.log("Submitting course:", formData);
    setCurrentScreen(3);
  };

  const handleReupload = () => {
    setFormData((prev) => ({ ...prev, file: null }));
    setCurrentScreen(1);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-roboto font-medium text-gray-900 mb-2">Course Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Enter course title"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-roboto font-medium text-gray-900 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Describe your course content..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-roboto font-medium text-gray-900 mb-2">Course Image</label>
              <div className="flex items-center space-x-4">
                {formData.image && (
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Course preview"
                    className="w-16 h-16 object-cover rounded-md"
                  />
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-900 rounded-md hover:bg-secondary cursor-pointer"
                  >
                    {formData.image ? "Change Image" : "Upload Image"}
                  </label>
                </div>
              </div>
              {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
            </div>

            <div>
              <label className="block text-sm font-roboto font-medium text-gray-900 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <option value="draft">Draft</option>
                <option value="publish">Publish</option>
              </select>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : formData.file
                  ? "border-secondary/50 bg-secondary/10"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {formData.file ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <FileText className="h-8 w-8 text-secondary/60" />
                    <div>
                      <p className="text-sm font-medium text-primary/80">{formData.file.name}</p>
                      <p className="text-xs text-secondary/60">{(formData.file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFormData((prev) => ({ ...prev, file: null }))}
                    className="inline-flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Replace File</span>
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">Drop your PDF here</p>
                  <p className="text-sm text-gray-500 mb-4">or click to browse</p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center font-roboto px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 cursor-pointer"
                  >
                    Choose File
                  </label>
                </div>
              )}
            </div>
            {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-arefruqaa font-semibold">Course Summary</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center space-x-1 px-3 py-1 text-sm text-primary hover:text-primary/80"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>{isEditing ? "Save" : "Edit"}</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-roboto font-medium text-gray-900">Title:</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      className="mt-1 w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  ) : (
                    <p className="text-gray-800">{formData.title}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-roboto font-medium text-gray-900">Description:</label>
                  {isEditing ? (
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="mt-1 w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  ) : (
                    <p className="text-gray-800">{formData.description}</p>
                  )}
                </div>

                {formData.image && (
                  <div>
                    <label className="text-sm font-roboto font-medium text-gray-900">Course Image:</label>
                    <div className="flex items-center space-x-3 mt-1">
                      <img
                        src={URL.createObjectURL(formData.image)}
                        alt="Course preview"
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      {isEditing && (
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e.target.files[0])}
                            className="hidden"
                            id="image-upload-edit"
                          />
                          <label
                            htmlFor="image-upload-edit"
                            className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded cursor-pointer hover:bg-gray-200"
                          >
                            Change
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-roboto font-medium text-gray-900">Status:</label>
                  <div className="flex items-center space-x-2 mt-1">
                    {isEditing ? (
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                        className="px-2 py-1 text-sm border border-gray-300 rounded"
                      >
                        <option value="draft">Draft</option>
                        <option value="publish">Publish</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-block px-3 py-1 text-xs rounded-full ${
                          formData.status === "publish"
                            ? "bg-secondary/10 text-primary/80"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {formData.status === "publish" ? "Published" : "Draft"}
                      </span>
                    )}
                  </div>
                </div>

                {formData.file && (
                  <div>
                    <label className="text-sm font-roboto font-medium text-gray-900">File:</label>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-900" />
                        <span className="text-gray-800 text-sm">{formData.file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        onClick={handleReupload}
                        className="inline-flex items-center space-x-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-800"
                      >
                        <RefreshCw className="h-3 w-3" />
                        <span>Replace</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-secondary/60" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Upload Complete!</h2>
            <p className="text-gray-900">Your course has been successfully uploaded and is being processed.</p>

            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <h4 className="font-medium text-gray-900 mb-2">Final Course Details:</h4>
              <div className="space-y-1 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Title:</span> {formData.title}
                </p>
                <p>
                  <span className="font-medium">Status:</span>
                  <span
                    className={`ml-1 px-2 py-0.5 text-xs rounded ${
                      formData.status === "publish" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {formData.status === "publish" ? "Published" : "Draft"}
                  </span>
                </p>
                {formData.file && (
                  <p>
                    <span className="font-medium">File:</span> {formData.file.name}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                setCurrentScreen(0);
                setFormData({
                  title: "",
                  description: "",
                  file: null,
                  image: null,
                  status: "draft",
                });
                setIsEditing(false);
              }}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/80"
            >
              Upload Another Course
            </button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/40 flex items-start justify-center py-8 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {screens.map((screen, index) => (
              <div
                key={screen.id}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentScreen ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {index < currentScreen ? <Check className="h-4 w-4" /> : index + 1}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-secondary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentScreen + 1) / screens.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Screen title */}
        <h1 className="text-2xl font-arefruqaa font-bold text-gray-800 mb-6 text-center">
          {screens[currentScreen].title}
        </h1>

        {/* Screen content */}
        <AnimatePresence mode="wait">{renderScreen()}</AnimatePresence>

        {/* Navigation buttons */}
        {currentScreen < 3 && (
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentScreen === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                currentScreen === 0 ? "text-gray-400 cursor-not-allowed" : "text-gray-900 hover:text-gray-800"
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={currentScreen === 2 ? handleSubmit : handleNext}
              className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{currentScreen === 2 ? "Submit" : "Next"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
