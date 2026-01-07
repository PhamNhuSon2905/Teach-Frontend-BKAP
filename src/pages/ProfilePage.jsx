import React, { useState, useRef, useEffect } from "react";
import profileApi from "../api/profileApi";
import { buildFileUrl } from "../utils/fileUrl";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Camera,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  CheckCircle,
  X,
} from "lucide-react";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { toast } from "../ui/toast";

export default function ProfilePage() {
  useScrollToTop();
  const { updateUser } = useContext(AuthContext);
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    avatarPreview: "",
    avatarFile: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await profileApi.getMe();
        const p = res.data.data;
        updateUser(p);

        setForm({
          fullname: p.fullname || "",
          email: p.email || "",
          phone: p.phone || "",
          address: p.address || "",
          avatarPreview: buildFileUrl(p.avatar),
          avatarFile: null,
        });
      } catch (e) {
        toast.error("Không tải được thông tin hồ sơ");
      }
    };

    loadProfile();
  }, []);

  /* ===================== HANDLERS ===================== */
  const onChange = (key) => (e) =>
    setForm((s) => ({ ...s, [key]: e.target.value }));

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((s) => ({
      ...s,
      avatarFile: file,
      avatarPreview: URL.createObjectURL(file),
    }));
  };

  const handleSave = async () => {
    try {
      const fd = new FormData();

      fd.append(
        "data",
        new Blob(
          [
            JSON.stringify({
              fullname: form.fullname,
              email: form.email,
              phone: form.phone,
              address: form.address,
            }),
          ],
          { type: "application/json" }
        )
      );

      if (form.avatarFile) {
        fd.append("avatar", form.avatarFile);
      }

      const res = await profileApi.updateProfile(fd);
      const updated = res.data.data;
      updateUser(updated);

      setForm({
        fullname: updated.fullname,
        email: updated.email,
        phone: updated.phone,
        address: updated.address,
        avatarPreview: buildFileUrl(updated.avatar),
        avatarFile: null,
      });

      toast.success("Cập nhật hồ sơ thành công");
      setIsEditing(false);
    } catch (e) {
      toast.error(e.response?.data?.message || "Cập nhật thất bại");
    }
  };

  /* ===================== UI ===================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* LEFT PROFILE CARD */}
        <div className="lg:col-span-1 bg-white rounded-3xl shadow-xl p-6 text-center">
          <div
            className="relative mx-auto w-36 h-36 rounded-full overflow-hidden cursor-pointer group"
            onClick={isEditing ? handleAvatarClick : undefined}
          >
            <img
              src={form.avatarPreview}
              alt={form.fullname}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-black/60 ${isEditing ? "opacity-0 group-hover:opacity-100" : "hidden"} flex items-center justify-center transition`}>
              <Camera className="text-white w-8 h-8" />
            </div>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>

          <h2 className="mt-4 text-xl font-bold">{form.fullname}</h2>
          <p className="text-gray-500 text-sm">{form.email}</p>

          <div className="mt-4 space-y-2 text-left">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4" /> {form.phone}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4" /> {form.address}
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="lg:col-span-3 bg-white rounded-3xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Thông tin giảng viên</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white"
            >
              {isEditing ? <X /> : <Edit3 />}
              {isEditing ? "Hủy" : "Chỉnh sửa"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Họ và tên"
              icon={<User />}
              value={form.fullname}
              disabled={!isEditing}
              onChange={onChange("fullname")}
            />

            <Input
              label="Email"
              icon={<Mail />}
              value={form.email}
              disabled
            />

            <Input
              label="Số điện thoại"
              icon={<Phone />}
              value={form.phone}
              disabled={!isEditing}
              onChange={onChange("phone")}
            />

            <Input
              label="Địa chỉ"
              icon={<MapPin />}
              value={form.address}
              disabled={!isEditing}
              onChange={onChange("address")}
            />
          </div>

          {isEditing && (
            <div className="flex justify-end mt-8 gap-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 border rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg flex items-center gap-2"
              >
                <Save /> Lưu
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===================== SMALL INPUT COMPONENT ===================== */
function Input({ label, icon, value, onChange, disabled }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
        <input
          disabled={disabled}
          value={value}
          onChange={onChange}
          className={`w-full pl-10 pr-3 py-2 border rounded-lg ${disabled ? "bg-gray-100" : "bg-white"
            }`}
        />
      </div>
    </div>
  );
}
