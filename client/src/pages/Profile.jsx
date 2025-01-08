import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
} from "../redux/user/userSlice";

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerch, setFilePerch] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    password: "",
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Trigger file upload whenever a new file is selected
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle file upload to Cloudinary
  const handleFileUpload = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "dziyp8dr8"); // Replace with your Cloudinary unsigned preset name

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dziyp8dr8/image/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload file.");

      const data = await res.json();
      setFormData((prev) => ({ ...prev, avatar: data.secure_url }));
      setFileUploadError(false);
    } catch (error) {
      console.error("File upload failed:", error);
      setFileUploadError(true);
    }
  };

  // Handle form submission to update user profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || data.success === false) {
        dispatch(updateUserFailure(data.message || "Failed to update profile."));
        alert(data.message || "Profile update failed.");
        return;
      }
        // If update is successful
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);
        alert("Profile updated successfully.");
    } catch (error) {
        console.error("Update failed:", error);
        dispatch(updateUserFailure(error.message || "An error occurred."));
        alert(`Update failed: ${error.message || "An error occurred. Please try again."}`);
    };
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    dispatch(deleteUserStart());
    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete account.");

      dispatch(deleteUserSuccess());
      alert("Account deleted successfully.");
      window.location.href = "/";
    } catch (error) {
      console.error("Account deletion failed:", error);
      dispatch(deleteUserFailure(error.message || "An error occurred."));
      alert("Failed to delete account. Please try again.");
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      {loading && <p className="text-center text-blue-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {updateSuccess && (
        <p className="text-center text-green-500">Profile updated successfully!</p>
      )}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <input
          type="text"
          id="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />
        <button
          type="submit"
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
          disabled={loading || filePerch > 0}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span
          className="text-red-700 cursor-pointer"
          onClick={handleDeleteAccount}
        >
          Delete account
        </span>
        <span
          className="text-red-700 cursor-pointer"
          onClick={handleSignOut}
        >
          Sign out
        </span>
      </div>
      {filePerch > 0 && (
        <p className="text-center mt-3">
          Uploading file: {filePerch}% complete
        </p>
      )}
    </div>
  );
}