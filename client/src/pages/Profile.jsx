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
import { Link } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const userId = currentUser?._id || currentUser?.id;
  const [file, setFile] = useState(undefined);
  const [filePerch, setFilePerch] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    password: "",
    avatar: currentUser?.avatar || "",
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const saveUser = async (payload) => {
    dispatch(updateUserStart());
    const res = await fetch(`/api/user/update/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || data.success === false) {
      dispatch(updateUserFailure(data.message || "Failed to update profile."));
      return null;
    }
    dispatch(updateUserSuccess(data));
    setUpdateSuccess(true);
    return data;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleFileUpload = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB.");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", "d2mlr36v");

    try {
      setFilePerch(10);
      const res = await fetch("https://api.cloudinary.com/v1_1/dziyp8dr8/image/upload", {
        method: "POST",
        body: uploadData,
      });
      if (!res.ok) throw new Error("Failed to upload file.");

      const data = await res.json();
      const avatar = data.secure_url;
      setFormData((prev) => ({ ...prev, avatar }));
      setFileUploadError(false);
      setFilePerch(70);

      const saved = await saveUser({ avatar });
      setFilePerch(saved ? 100 : 0);
      if (!saved) {
        setFileUploadError(true);
        alert("Photo uploaded, but it was not saved to your account.");
      }
    } catch (error) {
      console.error("File upload failed:", error);
      setFileUploadError(true);
      setFilePerch(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        avatar: formData.avatar,
      };
      if (formData.password && formData.password.trim() !== "") {
        payload.password = formData.password;
      }
      const saved = await saveUser(payload);
      if (!saved) {
        alert("Profile update failed.");
        return;
      }
      alert("Profile updated successfully.");
    } catch (error) {
      console.error("Update failed:", error);
      dispatch(updateUserFailure(error.message || "An error occurred."));
      alert(`Update failed: ${error.message || "An error occurred. Please try again."}`);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    dispatch(deleteUserStart());
    try {
      const res = await fetch(`/api/user/delete/${userId}`, {
        method: "DELETE",
        credentials: "include",
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
      const res = await fetch("/api/auth/signout", { credentials: "include" });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message || "An error occurred."));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${userId}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        console.error(data.message || "Failed to delete listing.");
        return;
      }

      setUserListings((previousListings) =>
        previousListings.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.error(error.message);
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
        {fileUploadError && (
          <p className="text-center text-red-600 text-sm">Photo could not be saved.</p>
        )}
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
          disabled={loading || (filePerch > 0 && filePerch < 100)}
        >
          {loading ? "Updating..." : "Update"}
        </button>
        <Link className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95" to="/create-listing">
          Create Listing
        </Link>
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
      {filePerch > 0 && filePerch < 100 && (
        <p className="text-center mt-3">
          Uploading file: {filePerch}% complete
        </p>
      )}
      <button onClick={handleShowListings} className="text-green-700 w-full">
        Show Listings
      </button>
      <p className="text-red-700 mt-5">{showListingsError ? "Error showing listings" : ""}</p>

      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div key={listing._id} className="border rounded-lg p-3 flex justify-between items-center gap-4">
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col item-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}