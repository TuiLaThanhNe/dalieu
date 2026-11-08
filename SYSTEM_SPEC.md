# ĐẶC TẢ HỆ THỐNG WEBSITE HỌC TẬP Y KHOA DA LIỄU (SYSTEM SPECIFICATION)
*Mã dự án: DALIEU-EDU | Phiên bản: 2.1 (Hoàn thành Giai đoạn 1 — Khởi chạy Hệ thống)*

---

## 1. THỐNG KÊ DỮ LIỆU ĐÃ ĐỒNG BỘ 100% VÀO HỆ THỐNG

- **09 Chuyên đề bài giảng chuyên sâu (Y5 & Sau đại học):**
  1. `01. Bệnh Vảy Nến (Psoriasis Vulgaris)` — 44 đơn vị giảng | 55 ảnh | 33 flashcards
  2. `02. Trúng Độc Da Do Thuốc (SCARs)` — 50 đơn vị giảng | 74 ảnh | 30 flashcards
  3. `03. Viêm Da Cơ Địa (Atopic Dermatitis)` — 32 đơn vị giảng | 81 ảnh | 32 flashcards
  4. `04. Bệnh Giang Mai (Syphilis)` — 25 đơn vị giảng | 54 ảnh | 31 flashcards
  5. `05. Lậu & Viêm Niệu Đạo Không Do Lậu (GU & NGU)` — 18 đơn vị giảng | 28 ảnh | 27 flashcards
  6. `06. Sùi Mào Gà (Condylomata Acuminata / HPV)` — 21 đơn vị giảng | 38 ảnh | 25 flashcards
  7. `07. Mày Đay & Phù Mạch (Urticaria & Angioedema)` — 20 đơn vị giảng | 34 ảnh | 26 flashcards
  8. `08. Bệnh Vi Nấm Cạn (Dermatophytosis)` — 16 đơn vị giảng | 42 ảnh | 27 flashcards
  9. `09. Mụn Trứng Cá (Acne Vulgaris)` — 13 đơn vị giảng | 23 ảnh | 23 flashcards
- **Tổng cộng:**
  - **411 Slide gốc** được phân tách thành **239 Đơn vị giảng dạy tương tác**.
  - **429 Hình ảnh lâm sàng & vi thể** đã được kiểm tra và tự động chuẩn hóa đường dẫn (0% lỗi ảnh).
  - **90 Nguyên lý "Vàng" thực hành lâm sàng** của BSCKII (10 nguyên lý / bài).
  - **27 Tình huống lâm sàng thực tế (Mini-Cases)** có khung tự nháp chẩn đoán và đối chiếu phác đồ.
  - **254 Thẻ Flashcard 3D** chia làm 4 nhóm (Nhận diện hình thái, Nguyên lý vàng, Kinh nghiệm lâm sàng, Ca bệnh).

---

## 2. BỘ NHÂN VẬT MASCOT BÁC SĨ CÁO (DR. FOX ILLUSTRATIONS — TÁCH NỀN TRONG SUỐT)

Đã thiết kế, tách nền trong suốt (`Transparent PNG`) và tích hợp **06 biểu cảm vẽ tay Kawaii của Bác sĩ Cáo** (áo blouse trắng, ống nghe y tế, kính tròn) tại `assets/mascot/`:
1. `dr_fox_teaching.png`: Cầm sách y khoa giảng bài (dùng cho Logo chính & khi giảng lý thuyết/cơ chế bệnh sinh).
2. `dr_fox_tip.png`: Nháy mắt giơ ngón cái kèm bóng đèn sáng (dùng cho các mẹo Clinical Pearl).
3. `dr_fox_warning.png`: Nghiêm túc giơ biển cảnh báo đỏ `!` (dùng cho các dấu hiệu cờ đỏ & thuốc chống chỉ định).
4. `dr_fox_thinking.png`: Chống cằm suy tư với dấu hỏi `???` (dùng cho chẩn đoán phân biệt, mặt trước Flashcard & Ca lâm sàng).
5. `dr_fox_cheering.png`: Vui mừng giơ hai tay cổ vũ (dùng khi hoàn thành bài học & giải đúng ca lâm sàng).
6. `dr_fox_peeking.png`: Thò đầu nhìn dễ thương ở góc phải dưới màn hình (Widget trợ lý nhắc mẹo lâm sàng ngẫu nhiên).

---

## 3. LỘ TRÌNH PHÁT TRIỂN THEO GIAI ĐOẠN (ROADMAP)

### ✅ GIAI ĐOẠN 1 (ĐÃ HOÀN TẤT 100%):
- [x] **Tổng quan Khóa học (Dashboard):** Theo dõi tiến độ học tập toàn khóa, học tiếp bài đang dở chỉ với 1 click.
- [x] **Phòng Học Ảo cùng Bác sĩ Cáo (Dr. Fox Virtual Classroom):** Học từng slide song song 2 cột (Slide gốc + Hình ảnh phóng to bên trái | Giảng giải chuyên sâu của BSCKII bên phải), có đọc giọng nói tiếng Việt, lưu Bookmark & Ghi chú từng slide.
- [x] **Giáo trình Chuyên sâu Toàn văn (Medical Textbook Reader):** Đọc liền mạch như sách giáo khoa chuẩn quốc tế, có Mục lục động (Sticky TOC), lọc nhanh Hộp Kinh nghiệm Lâm sàng (Clinical Pearls), lọc riêng Bộ ảnh, render công thức Toán/Y học và sơ đồ cơ chế Mermaid离线 (Offline).
- [x] **Phòng Luyện Flashcard 3D (254 Thẻ):** Lật thẻ 3D bằng chuột hoặc phím `Space`, đánh giá mức độ thuộc bài (Spaced Repetition), xem dạng lưới, nhảy thẳng tới Slide gốc.
- [x] **Trung tâm 27 Ca Lâm Sàng & 90 Nguyên Lý Vàng:** Tự nháp biện luận lâm sàng và mở xem phân tích chi tiết của BSCKII.
- [x] **Tra cứu Toàn văn Tức thì, Atlas 429 Ảnh & Sổ tay Cá nhân:** Tìm kiếm từ khóa có tô sáng, xem kho ảnh phóng đại (Lightbox Zoom), xuất sổ tay ghi chú ra file `.md`.
- [x] **Động cơ Giao diện Color Hunt & Thanh điều hướng thu gọn:** 12+ bảng màu Color Hunt, nút Random bảng màu, chọn màu tùy ý, Dark Mode, cỡ chữ A-/A+ và chế độ Zen Mode thu gọn toàn bộ thanh điều hướng.

### ✅ GIAI ĐOẠN 2 (ĐÃ HOÀN TẤT 100%):
- [x] **Ngân hàng 270 Câu hỏi Trắc nghiệm Lâm sàng Đa cấp độ (`js/quiz-data.js` — 30 câu/chuyên đề × 9 chuyên đề):**
  - **108 Câu hỏi Lý thuyết & Lâm sàng Trọng tâm (Board MCQs):** Bao phủ sinh bệnh học, HLA, triệu chứng đặc hiệu, tiêu chuẩn chẩn đoán (PASI, SCORTEN, Hanifin & Rajka, RPR/TPHA, CDC 2021, EAACI/WAO...) và phác đồ thuốc.
  - **90 Câu hỏi Vận dụng Nguyên lý Vàng & Bẫy Y khoa:** Chuyển hóa từ 90 Nguyên lý Vàng thực hành của BSCKII.
  - **27 Câu hỏi Tình huống Lâm sàng (Clinical Vignette MCQs):** Chuyển hóa từ 27 ca bệnh thực tế.
  - **45 Câu hỏi Nhận diện Hình ảnh Lâm sàng thực tế (Visual Atlas MCQs):** Tích hợp ảnh thương tổn phóng đại từ kho ảnh gốc.
- [x] **Phòng Luyện Tập Trắc Nghiệm Tức Thì (`⚡ Luyện tập tức thì`):**
  - Bấm chọn đáp án (hoặc bấm phím `1–4` / `A–D`) biết ngay kết quả Đúng/Sai tức thì.
  - Bác sĩ Cáo tương tác khen ngợi (khi Đúng) hoặc cảnh báo bẫy lâm sàng (khi Sai), đi kèm hộp **Giải thích chi tiết của BSCKII** và nút **`🔗 Xem ngay Slide gốc trong Phòng học`**.
  - Hỗ trợ Bản đồ câu hỏi bên phải, lọc câu chưa làm / câu làm sai / câu gắn sao, đếm chuỗi trả lời đúng liên tiếp (`🔥 Streak`) và chuyển đổi chế độ xem Từng câu / Danh sách.
- [x] **Phòng Thi Thử Lâm Sàng Tính Giờ (`🏆 Phòng Thi thử tính giờ`):**
  - Tạo đề thi tự động theo 4 cấu hình: Đề Ôn Nhanh (15 câu – 10 phút), Đề Chuẩn Y5 (30 câu – 20 phút), Đề Chuyên Sâu CKII/BSNT (50 câu – 35 phút) và Đề Xoáy Sâu Câu Sai & Sao.
  - Có đồng hồ đếm ngược, chấm điểm thang 10, phân tích năng lực theo từng chuyên đề và lưu lịch sử các lần thi.
- [x] **Kho Ngân Hàng Câu Hỏi & Bản Đồ Thông Thạo (`📚 Kho Ngân hàng & Thống kê`):**
  - Theo dõi tỷ lệ hoàn thành của từng chuyên đề trong 9 chuyên đề, tìm kiếm từ khóa trong 270 câu hỏi và có chế độ bật xem toàn bộ Đáp án & Giải thích như đề cương ôn thi.


### 5.8. Bộ máy Hiển thị Y khoa Chuyên sâu (`js/markdown-renderer.js`)
- **Bảng so sánh & Hộp Cảnh báo Đỏ trong danh sách**: Tự động nhận diện và tách biệt các bảng (`| ... |`), hộp cảnh báo (`> [!TIP]`, `> [!CAUTION]`, `> [!WARNING]`, `> [!IMPORTANT]`), sơ đồ và công thức kể cả khi nằm lồng bên trong danh sách gạch đầu dòng (như bảng phân loại Vảy nến Type I & Type II tại Slide 4 Bài 01).
- **Bảo vệ ký hiệu Gen / Alen Y khoa**: Bảo vệ dấu sao `*` trong danh pháp kháng nguyên bạch cầu (`HLA-C*06:02`, `HLA-B*15:02`, `HLA-B*58:01`) để không làm vỡ định dạng in đậm/in nghiêng.
- **23 Sơ đồ Lâm sàng & Lưu đồ Phác đồ (`Mermaid Flowchart & Gantt`)**: Hỗ trợ đầy đủ sơ đồ phân nhánh cây đa cột, sơ đồ bậc thang liên hoàn, vòng xoắn bệnh sinh hai chiều (`<-->`) và biểu đồ dòng thời gian khởi phát dị ứng thuốc (`Gantt Timeline`).
- **Công thức Lâm sàng & Bảng LaTeX (`$$ ... $$`)**: Hiển thị trực quan công thức tính điểm PASI, SCORAD và bảng tỷ lệ tử vong SCORTEN (`\begin{array}`).
