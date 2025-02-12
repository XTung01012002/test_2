import { api } from "./api";

// api đăng kí
export const register = async (username, password, email = "", nickname = "", age = 0) => {
    try {
        const response = await api.post("auth/register", { username, password, email, nickname, age });
        return response.data;
    } catch (error) {
        console.error("❌ Lỗi khi đăng ký:", error.response?.data?.message || error.message);
        throw error;
    }
};


// 🔑 Đăng nhập
export const login = async (username, password) => {
    try {
        const response = await api.post("auth/login", { username, password });
        const {  access_token, name } = response.data; 
        localStorage.setItem("token",  access_token);
        localStorage.setItem("user", JSON.stringify(username)); // Lưu thông tin user vào localStorage
        return response.data;
    } catch (error) {
        console.error("❌ Lỗi khi đăng nhập:", error.response?.data?.message || error.message);
        throw error;
    }
};


// 👤 Cập nhật hồ sơ người dùng (cần token)
export const updateProfile = async (token, updateData) => {
    try {
        const response = await api.put("auth/update-profile", updateData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("❌ Lỗi khi cập nhật hồ sơ:", error);
        throw error;
    }
};

// lấy thông tin user
export const getUser = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.get("auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log("response", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Lỗi lấy thông tin user:", error);
        throw error;
    }
};
