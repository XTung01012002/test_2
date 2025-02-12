import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { updateProfile,getUser } from "../services/authService";




const Profile = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    nickname: "",
    age: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("hi")
        const response = await getUser();
        setUser(response);
      } catch (error) {
        toast.error("⚠️ Lỗi lấy thông tin user!", { position: "top-right" });
        console.error("Lỗi lấy thông tin user:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await updateProfile(token, {
        email: user.email,
        nickname: user.nickname,
        age: Number(user.age),
      });
      toast.success("🎉 Cập nhật thành công!", { position: "top-right", autoClose: 2000 });
      setTimeout(() => navigate("/dashboard"), 2000);

    } catch (error) {
      toast.error("❌ Cập nhật thất bại!", { position: "top-right" });
      console.error("Lỗi khi cập nhật:", error);
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2 className="mb-4 text-center">Thay đổi thông tin cá nhân</h2>
      <div className="card p-4">
        <form>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input type="text" id="username" name="username" value={user.username} className="form-control" disabled />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" id="email" name="email" value={user.email} onChange={handleChange} className="form-control" placeholder="Nhập email" />
          </div>

          <div className="mb-3">
            <label htmlFor="nickname" className="form-label">Nickname</label>
            <input type="text" id="nickname" name="nickname" value={user.nickname} onChange={handleChange} className="form-control" placeholder="Nhập nickname" />
          </div>

          <div className="mb-3">
            <label htmlFor="age" className="form-label">Age</label>
            <input type="number" id="age" name="age" value={user.age} onChange={handleChange} className="form-control" placeholder="Nhập tuổi" />
          </div>

          <div className="d-flex justify-content-between">
            <button type="button" onClick={handleUpdate} className="btn btn-primary">Cập nhật</button>
            <button type="button" onClick={() => navigate("/dashboard")} className="btn btn-secondary">Quay lại</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
