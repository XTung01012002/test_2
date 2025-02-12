import {api} from "./api"; // Import instance Axios đã cấu hình

// 🏠 Tạo phòng chơi
export const createRoom = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Bạn chưa đăng nhập!");
        }
        const response = await api.post("gamecaro/create-room", {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("✅ Tạo phòng thành công:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Lỗi khi tạo phòng:", error.response?.data?.message || error.message);
        throw error;
    }
};


// 🎮 Tham gia phòng chờ
export const joinRoom = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Bạn chưa đăng nhập!");

        const response = await api.post(`gamecaro/join`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        console.error("❌ Lỗi khi tham gia phòng:", error);
        throw error;
    }
};

// 🚪 Rời phòng chơi
export const leaveRoom = async (roomId, player) => {
    try {
        console.log(`📌 Người chơi ${player} rời phòng ${roomId}`);
        const response = await api.post(`gamecaro/leave/${roomId}`, { player });
        console.log("✅ Rời phòng thành công:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Lỗi khi rời phòng:", error);
        throw error;
    }
};

export const makeMove = async (roomId, player, x, y) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Bạn chưa đăng nhập!");
        }
        const response = await api.post(`gamecaro/move/${roomId}`, {
            player,
            x,
            y,
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("✅ Nước đi hợp lệ:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Lỗi khi đánh cờ:", error.response?.data?.message || error.message);
        throw error;
    }
};

