# Bật GPU Rendering Profiling trên Android

- `Kích hoạt tùy chọn nhà phát triển`: Đầu tiên, vào `Cài đặt > Giới thiệu điện thoại và nhấn 7 lần vào Số phiên bản (Build Number)` để kích hoạt Tùy chọn nhà phát triển.
- Bật GPU Rendering Profiling:
Vào `Cài đặt > Hệ thống > Nâng cao > Tùy chọn nhà phát triển`.
Tìm tùy chọn `GPU Rendering Profiling` và chọn một trong các chế độ hiển thị:
`On screen as bars (hiển thị trên màn hình)`.
- In adb shell dumpsys gfxinfo (sử dụng adb để trích xuất thông tin).

## Cách hiểu màu sắc trên biểu đồ GPU Rendering

Biểu đồ sẽ hiển thị các thanh màu sắc đại diện cho các giai đoạn xử lý khác nhau của mỗi khung hình:
1. `Xanh lá cây (Input Handling)`: Đây là thời gian dành cho xử lý các sự kiện đầu vào (chạm, kéo thả, vv.). Nếu quá cao, có thể ứng dụng đang xử lý các sự kiện quá nhiều.
2. `Xanh da trời (Animation)`: Thời gian dành cho xử lý các hoạt ảnh (animations). Các hoạt ảnh phức tạp hoặc nhiều hoạt ảnh cùng lúc có thể làm tăng giá trị này.
3. `Tím (Measure/Layout)`: Thời gian để đo đạc và sắp xếp các thành phần UI. Nếu biểu đồ màu tím cao, có thể có vấn đề về việc sắp xếp hoặc tính toán kích thước của các thành phần.
4. `Đỏ (Draw)`: Thời gian dành cho việc vẽ các thành phần trên màn hình. Nếu phần đỏ quá cao, các yếu tố đồ họa có thể đang quá phức tạp để vẽ trong một khung hình.
5. `Vàng (Sync)`: Thời gian đồng bộ hóa giữa CPU và GPU. Giá trị này thường khá nhỏ, nhưng nếu cao có thể do việc truyền dữ liệu giữa CPU và GPU đang gặp vấn đề.
6. `Cam (Swap Buffers)`: Đây là giai đoạn cuối cùng khi GPU trao đổi bộ đệm để hiển thị hình ảnh ra màn hình. Nếu thời gian này cao, có thể do GPU đang gặp khó khăn trong việc hiển thị khung hình mới.
