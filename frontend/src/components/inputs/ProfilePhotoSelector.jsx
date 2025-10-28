import { useRef, useState } from "react";

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Update the image state
      setImage(file);

      // Generate preview URL from the file
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
    // Clear the file input
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const onChooseFile = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative group">
          <img
            src={previewUrl}
            alt="profile preview"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
          {/* Remove button */}
          <button
            type="button"
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
            onClick={handleRemoveImage}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {/* Change button */}
          <button
            type="button"
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-blue-700"
            onClick={onChooseFile}
          >
            Change
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div
            className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors duration-200"
            onClick={onChooseFile}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <button
            type="button"
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors duration-200"
            onClick={onChooseFile}
          >
            Upload Photo
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
