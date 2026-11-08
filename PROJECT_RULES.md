# QUY ĐỊNH & NGUYÊN TẮC PHÁT TRIỂN HỆ THỐNG (PROJECT RULES)
*Dự án: Hệ thống Web Học tập & Ôn tập Y khoa Da Liễu Đa Tương tác (Dermatology E-Learning Platform)*  
*Phiên bản: 2.0 (Cập nhật theo yêu cầu chi tiết của Người dùng) | Non-Coder Friendly*

---

## 1. NGUYÊN TẮC CỐT LÕI (CORE PRINCIPLES)

1. **Non-Coder First (Tối giản 100% về mặt kỹ thuật cho người dùng):**
   - Hệ thống được xây dựng dưới dạng **Web Ứng dụng Một trang Tĩnh (Static Single-Page Application)**.
   - **Cách chạy Offline:** Người dùng chỉ cần nhấp đúp (Double-click) vào file `index.html` (hoặc file chạy nhanh `start.bat`) là mở học ngay trên trình duyệt (Chrome, Edge, Safari...) mà không cần cài đặt Node.js, Python, Docker hay cơ sở dữ liệu.
   - **Cách chạy Online:** Mã nguồn sẵn sàng 100% để kéo thả lên GitHub Pages hoặc Vercel hoàn toàn miễn phí, có link riêng để học trên điện thoại/iPad khi đi lâm sàng tại bệnh viện.
   - Toàn bộ việc viết code, fix lỗi, nâng cấp tính năng do AI phụ trách.

2. **Bảo tồn Dữ liệu & Tri thức Y khoa Gốc:**
   - Thư mục `markdown/` và `PDF/` là kho tri thức gốc bất biến.
   - Dữ liệu hình ảnh lâm sàng và vi thể trong `markdown/assets/` phải được bảo toàn đường dẫn, hiển thị trung thực màu sắc và độ sắc nét phục vụ chẩn đoán.
   - Các bảng điểm lâm sàng (PASI, SCORTEN, Hanifin & Rajka, CDC 2021...) phải chính xác tuyệt đối theo y văn.

3. **Lưu trữ Cục bộ & Bảo mật Tuyệt đối (Zero-Leak Local Storage):**
   - Toàn bộ ghi chú cá nhân (Personal Notes), dấu trang (Bookmarks), tiến độ bài học và lịch sử điểm trắc nghiệm được lưu ngay trong bộ nhớ trình duyệt (`localStorage`) của thiết bị. Không gửi dữ liệu đi bất kỳ đâu.

---

## 2. QUY ĐỊNH VỀ THIẾT KẾ & TÍNH NĂNG (FEATURE & DESIGN RULES)

### 2.1. Nhân vật Giảng viên Ảo - Bác sĩ Cáo (Mascot Dr. Fox)
- **Tạo hình & Phong thái:** Chú cáo thông thái, đeo ống nghe y tế hoặc mặc áo blouse trắng, biểu cảm thân thiện, hóm hỉnh nhưng nghiêm túc về mặt chuyên môn.
- **Vai trò trong Phòng học ảo (Virtual Classroom):**
  - Giảng dạy từng slide một: Đọc nội dung cốt lõi của slide từ tài liệu, sau đó "bật mí" các kinh nghiệm lâm sàng sâu sắc của BSCKII.
  - Tương tác với người học: Đặt câu hỏi gợi mở, nhắc nhở các "bẫy lâm sàng" nguy hiểm (ví dụ: cảnh báo dị ứng thuốc SCARs, không dùng Corticoid toàn thân trong vảy nến...).
  - Động viên khi làm đúng trắc nghiệm và an ủi, giải thích ân cần khi trả lời sai.

### 2.2. Trắc nghiệm Tức thì & Ca Lâm sàng (Instant Quiz & Mini-Cases)
- **Cơ chế phản hồi tức thì (Instant Feedback):** Khi người học bấm chọn đáp án, hệ thống phải **hiển thị kết quả đúng/sai ngay lập tức**, không bắt buộc phải đợi nộp cả bài mới biết kết quả.
- **Giải thích chi tiết (Deep Explanation):** Đi kèm phân tích tại sao đáp án này đúng, các đáp án kia sai ở đâu, và trích dẫn chuẩn chỉ từ slide/tài liệu bài giảng.

### 2.3. Hệ thống Giao diện Động & Color Hunt Palette
- **Màu Y khoa Chuẩn & Dark Mode:** Mặc định tông màu Y tế dịu mắt (Medical Slate/Teal/Navy), có nút bật/tắt Dark Mode tức thì để học đêm không lóa mắt.
- **Tùy biến Theme & Nút Random Color Hunt:**
  - Tích hợp sẵn bộ sưu tập các bảng màu (Palettes) thịnh hành từ **Color Hunt**.
  - Có nút **"🎲 Đổi màu ngẫu nhiên (Random Color Hunt Theme)"** giúp làm mới không gian học tập bất cứ lúc nào chỉ với 1 click.
  - Cho phép người dùng tùy chọn màu chủ đạo theo sở thích cá nhân.
- **Thanh điều hướng Động & Ô Thao Tác Mini Tại Chỗ (Compact Navbar & Inline Mini Popovers):**
  - **Tinh gọn tối đa:** Loại bỏ các nhãn phụ rườm rà (`Y5 & CKII`, `ĐHQG-HCM...`) khỏi thanh điều hướng chính; chỉ hiển thị trong bảng thông tin nhỏ (Hover Popover) khi người dùng di chuột vào logo hoặc biểu tượng `ℹ️`.
  - **Khoảng cách thoáng đãng:** Các nút chức năng (`Tổng quan`, `Phòng học Dr. Fox`, `Giáo trình`, `Flashcard`, `Ca lâm sàng`, `Tra cứu & Atlas`) có khoảng cách rõ ràng, không bị tràn hay rớt dòng.
  - **Ô thao tác Mini ngay tại màn hình hiện tại (`🎨 Giao diện`):** Tích hợp toàn bộ nút `🎲 Color Hunt`, danh sách 12 bảng màu, chỉnh cỡ chữ `A- / A+`, `Chế độ Tối/Sáng` và `Tự chọn màu` vào một **ô thao tác mini xổ xuống ngay tại màn hình đang học** (không chuyển tab, không làm gián đoạn việc đọc bài).
  - **Xem PDF ngay trên màn hình:** Bấm nút `📄 PDF` sẽ mở khung xem PDF nổi ngay trên màn hình hiện tại thay vì bắt buộc chuyển sang tab mới.
  - **Logo & Mascot Bác sĩ Cáo Tách nền Trong suốt (Transparent PNG):** Toàn bộ 6 trạng thái của Bác sĩ Cáo (`assets/mascot/dr_fox_*.png`) và logo trang web được tách nền trắng 100%, hiển thị hòa quyện tự nhiên trên mọi bảng màu Color Hunt cũng như Chế độ Tối (Dark Mode).
  - **Thanh Điều hướng & Thanh Cuộn Thông minh Đồng bộ Theme:**
    - **Trên Thanh điều hướng ngang (Topbar):** Ẩn hoàn toàn thanh trượt ngang trắng mặc định của trình duyệt; tích hợp 2 nút mũi tên nhỏ (`❮` / `❯`) đồng bộ màu Theme ở hai đầu (tự động xuất hiện khi màn hình hẹp) kết hợp hỗ trợ lăn chuột ngang mượt mà.
    - **Trên Danh mục 9 chuyên đề (Sidebar) & Mục lục bài giảng (TOC):** Áp dụng **Thanh cuộn thông minh Tự ẩn/hiện (Auto-hide 4px)** — bình thường ẩn trong suốt 100%, chỉ hiện vạch mảnh 4px mang màu Chủ đạo (`--primary`) của Theme khi di chuột vào vùng danh mục/mục lục.

---

## 3. QUY TRÌNH CẬP NHẬT & TIẾP NHẬN PHẢN HỒI

- Bất cứ khi nào người dùng nói một ý tưởng mới hoặc yêu cầu chỉnh sửa, AI sẽ:
  1. Cập nhật mã nguồn hệ thống.
  2. Ghi nhận điều chỉnh vào `PROJECT_RULES.md` và `SYSTEM_SPEC.md`.
  3. Cập nhật chỉ dẫn trong `USER_GUIDE.md`.
  4. Báo cáo rõ ràng để người dùng chỉ việc mở web kiểm tra.
