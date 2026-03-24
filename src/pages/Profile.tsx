import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ================= TYPES ================= */
type FormData = {
  fullName: string;
  email: string;
  phone: string;
  college: string;
};

type TabType = "profile" | "subscription" | "security";

/* ================= INPUT ================= */
const InputField = ({
  label,
  name,
  value,
  disabled,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div>
    <p className="text-gray-500 mb-1">{label}</p>
    <input
      name={name}
      value={value}
      disabled={disabled}
      onChange={onChange}
      className={`w-full rounded-lg px-3 py-2 outline-none ${
        disabled ? "bg-gray-100" : "bg-white border"
      }`}
    />
  </div>
);

/* ================= MAIN ================= */
const Profile: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState<FormData>({
    fullName: "John Doe",
    email: "kamit0864@gmail.com",
    phone: "+91 9876543210",
    college: "Indian Institute of Technology, Delhi",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-600 text-white p-8">
        <p
          onClick={() => navigate("/dashboard")}
          className="text-sm cursor-pointer"
        >
          ← Back to Dashboard
        </p>
        <h1 className="text-2xl font-semibold mt-2">Profile & Settings</h1>
        <p className="text-sm opacity-80">
          Manage your account and preferences
        </p>
      </div>

      {/* BODY */}
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-12 gap-6">
        {/* LEFT CARD */}
        <div className="col-span-12 md:col-span-4 space-y-6">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl">
              👤
            </div>
            <h2 className="mt-3 font-semibold">{form.fullName}</h2>
            <p className="text-gray-500 text-sm">{form.email}</p>

            <span className="mt-3 inline-block text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full">
              Active Member
            </span>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold mb-4">Quick Stats</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Exams Completed</span>
                <span className="text-green-500">0</span>
              </div>
              <div className="flex justify-between">
                <span>Active Courses</span>
                <span className="text-purple-600">2</span>
              </div>
              <div className="flex justify-between">
                <span>Certificates Earned</span>
                <span className="text-yellow-500">2</span>
              </div>
              <div className="flex justify-between">
                <span>Member Since</span>
                <span>14/02/2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-span-12 md:col-span-8">
          {/* TABS */}
          <div className="bg-gray-200 rounded-full p-1 flex text-sm mb-4">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 py-2 rounded-full ${
                activeTab === "profile" && "bg-white font-medium"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("subscription")}
              className={`flex-1 py-2 rounded-full ${
                activeTab === "subscription" && "bg-white font-medium"
              }`}
            >
              Subscription
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex-1 py-2 rounded-full ${
                activeTab === "security" && "bg-white font-medium"
              }`}
            >
              Security
            </button>
          </div>

          {/* ================= PROFILE TAB ================= */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-xl shadow p-6 space-y-4">
              <div className="flex justify-between">
                <h3 className="font-semibold">Personal Information</h3>

                {!isEdit ? (
                  <button
                    onClick={() => setIsEdit(true)}
                    className="bg-purple-600 text-white px-4 py-1 rounded-lg text-sm"
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEdit(false)}
                    className="border px-4 py-1 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <InputField
                label="Full Name"
                name="fullName"
                value={form.fullName}
                disabled={!isEdit}
                onChange={handleChange}
              />

              <InputField
                label="Email ID"
                name="email"
                value={form.email}
                disabled
              />

              <InputField
                label="Phone Number"
                name="phone"
                value={form.phone}
                disabled={!isEdit}
                onChange={handleChange}
              />

              <InputField
                label="College Name"
                name="college"
                value={form.college}
                disabled={!isEdit}
                onChange={handleChange}
              />

              {isEdit && (
                <button className="w-full bg-gradient-to-r from-purple-700 to-purple-600 text-white py-2 rounded-lg">
                  💾 Save Changes
                </button>
              )}
            </div>
          )}

          {/* ================= SUBSCRIPTION TAB ================= */}
          {activeTab === "subscription" && (
            <div className="bg-white rounded-xl shadow p-6 space-y-4">
              <h3 className="font-semibold">Subscription Details</h3>

              <div className="bg-purple-100 rounded-xl p-5">
                <h4 className="font-semibold">Dual Course Plan</h4>
                <p className="text-sm text-gray-600">Current Plan</p>

                <div className="mt-4 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span className="text-green-600">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Validity</span>
                    <span>Until 14/02/2027</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Exams</span>
                    <span>0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount Paid</span>
                    <span>₹0</span>
                  </div>
                </div>
              </div>

              <button className="w-full border rounded-lg py-2 text-sm">
                View Payment History
              </button>

              <button className="w-full bg-yellow-500 text-white rounded-lg py-2">
                🔒 Upgrade Plan
              </button>
            </div>
          )}

          {/* ================= SECURITY TAB ================= */}
          {activeTab === "security" && (
            <div className="bg-white rounded-xl shadow p-6 space-y-6">
              <h3 className="font-semibold">Security Settings</h3>

              <div className="bg-gray-100 rounded-lg p-4">
                <p className="font-medium">Password</p>
                <p className="text-sm text-gray-500">
                  Keep your account secure by using a strong password
                </p>
                <button className="mt-3 border w-full rounded-lg py-2">
                  Change Password
                </button>
              </div>

              <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                <p className="font-semibold text-red-600">Danger Zone</p>
                <p className="text-sm">Permanently log out from all devices</p>
                <button className="mt-3 w-full bg-red-500 text-white py-2 rounded-lg">
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
