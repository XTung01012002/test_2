- Cách chạy frontend: npm start, server:  npm run start:dev
- Cổng frontend: http://localhost:3000, backend: http://localhost:8088

-  Logic của game line98: 

Khi Click vào nút "Bắt đầu", sinh ngẫu nhiên ra 3 quả bóng.

Khi người chơi thực hiện di chuyển quả bóng theo tọa độ từ (x1,y1) đến (x2,y2), sẽ gọi hàm sinh bóng (sinh ra 3 quả).

Khi Click vào nút "trợ giúp", sẽ di chuyển 1 quả bóng theo thứ tự ưu tiên nổ 1 dãy > có cơ hội tạo thành 1 dãy > có thể di chuyển. Khi số bóng đã phủ đầy ô thì game kết thúc

-  Logic xử lí của game cờ caro:

Sử dụng websocket để đồng thời tham gia quá trình chơi game của 2 người chơi.

Khi ấn bắt đầu thì người tạo phòng ứng với (X) được đi trước.

Người chơi click chọn tọa độ của ô ứng với playerX sẽ sinh ra X, playerO sinh ra O. Đến lượt người nào thì mới được phép click.

Khi người chơi đạt đủ 5 hàng liên tục X hoặc O thì game kết thúc.

Các giao diện chính của bài test như sau:

1. Giao diện đăng kí

![image](https://github.com/user-attachments/assets/653f80dc-c3ee-41c3-8d2e-8a697fd5de1e)

2. Giao diện đăng nhập

![image](https://github.com/user-attachments/assets/6e217419-c1f2-464b-94bb-a0b7fb2e3571)

3. Giao diện thay đổi thông tin.

   ![image](https://github.com/user-attachments/assets/2c1180ec-4ac7-49d2-ac3e-3ade2f3ed078)

4. Giao diện game line98

   ![image](https://github.com/user-attachments/assets/d4758927-1ada-4b39-90f8-02be691150de)

5. Giao diện khi click trợ giúp 

![image](https://github.com/user-attachments/assets/0fd10de2-7458-4f37-aee7-9b7b4a5fd5b3)

6.Giao diện kết thúc 

![image](https://github.com/user-attachments/assets/9e1f633b-3a95-4769-9f39-0125ffeefd8f)

7. Giao diện game cờ caro

![image](https://github.com/user-attachments/assets/67f8473d-3c44-4c39-9629-35329aabec2e)








