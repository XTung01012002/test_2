import { api } from "./api";

// api bắt đầu chơi
export const startGame = async () => {
  try {
    console.log("📌 Bắt đầu game mới");
    const response = await api.post("game/start");
    console.log("resonpe", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
}

// api lấy vị trí bóng hiện tại của game đóđó
export const getGame = async (id ) => {
  try {
    const response = await api.get(`game/${id}/position`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
}

// api di chuyển bóng
export const moveBall = async (id, direction) => {
  try {
    const response = await api.put(`game/move/${id}`, direction );
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
}

//api sinh bóng mới
export const generateBall = async (id) => {
  try {
    const response = await api.put(`game/spawn/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
}

// api trợ giúp
export const assistMove = async (id) => {
  try {
    const response = await api.post(`game/${id}/assist`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
}

