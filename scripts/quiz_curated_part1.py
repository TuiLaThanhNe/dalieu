# -*- coding: utf-8 -*-
"""
Curated High-Yield Board MCQs — Part 1 (Lectures 01 to 05)
12 core expert questions per lecture (60 questions total in Part 1).
"""

CURATED_PART1 = [
    # =========================================================================
    # CHUYÊN ĐỀ 01: BỆNH VẢY NẾN (PSORIASIS VULGARIS)
    # =========================================================================
    {
        "lectureId": "01",
        "category": "nhan-biet",
        "difficulty": "Cơ bản",
        "slideId": "01-slide-5",
        "slideRef": "Slide 5: Sinh bệnh học – Trục miễn dịch",
        "question": "Trục miễn dịch trung tâm đóng vai trò cốt lõi nhất trong cơ chế bệnh sinh của bệnh Vảy nến mảng thông thường (Psoriasis vulgaris) hiện nay là:",
        "options": [
            "Trục Th2 – IL-4 / IL-13 và IgE",
            "Trục TNF-α – IL-23 – Th17 / IL-17A",
            "Trục bổ thể C3a / C5a và đại thực bào đơn thuần",
            "Phản ứng quá mẫn độc tế bào qua trung gian kháng thể IgG/IgM (Type II)"
        ],
        "correctIndex": 1,
        "explanation": "Trong bệnh vảy nến, tế bào tua (Dendritic cells) tiết **TNF-α** và **IL-23** kích hoạt tế bào **Th17** sản xuất **IL-17A, IL-17F, IL-22**, thúc đẩy tăng sinh tế bào sừng (keratinocytes) rút ngắn chu kỳ từ 28 ngày xuống chỉ còn 3–5 ngày."
    },
    {
        "lectureId": "01",
        "category": "nhan-biet",
        "difficulty": "Cơ bản",
        "slideId": "01-slide-6",
        "slideRef": "Slide 6: Yếu tố di truyền HLA",
        "question": "Alen kháng nguyên bạch cầu người (HLA) nào liên quan chặt chẽ nhất với Vảy nến khởi phát sớm (Type I, trước 40 tuổi, tiền sử gia đình dương tính)?",
        "options": [
            "HLA-B*15:02",
            "HLA-B*58:01",
            "HLA-Cw6 (HLA-C*06:02)",
            "HLA-DR4"
        ],
        "correctIndex": 2,
        "explanation": "**HLA-Cw6 (nằm ở vùng PSORS1 trên NST 6p21)** là yếu tố di truyền quan trọng nhất gắn liền với Vảy nến khởi phát sớm (Type I). Trong khi đó HLA-B*15:02 liên quan Carbamazepine và HLA-B*58:01 liên quan Allopurinol."
    },
    {
        "lectureId": "01",
        "category": "chan-doan",
        "difficulty": "Trung bình",
        "slideId": "01-slide-14",
        "slideRef": "Slide 14: Nghiệm pháp cạo Brocq",
        "question": "Khi thực hiện nghiệm pháp cạo vảy Brocq trên thương tổn vảy nến mảng điển hình, thứ tự 3 dấu hiệu xuất hiện lần lượt từ nông đến sâu là:",
        "options": [
            "Giọt sương máu Auspitz → Vết đèn cầy → Màng bong Duncan-Bulkley",
            "Vết đèn cầy → Màng bong (hành xác) → Giọt sương máu (Auspitz)",
            "Màng bong → Vết đèn cầy → Dấu hiệu Nikolsky dương tính",
            "Vết đèn cầy → Dấu hiệu Koebner → Giọt sương máu Auspitz"
        ],
        "correctIndex": 1,
        "explanation": "Nghiệm pháp cạo Brocq qua 3 bước kinh điển: **(1) Dấu hiệu vết đèn cầy** (vảy trắng bong ra như sáp nến do á sừng) → **(2) Dấu hiệu màng bong** (lớp thượng bì mỏng cuối cùng bong ra thành mảng) → **(3) Dấu hiệu giọt sương máu Auspitz** (những chấm xuất huyết nhỏ li ti không tụ lại do chạm vào đỉnh nhú bì giãn mạch)."
    },
    {
        "lectureId": "01",
        "category": "nhan-biet",
        "difficulty": "Trung bình",
        "slideId": "01-slide-15",
        "slideRef": "Slide 15: Hiện tượng Koebner",
        "question": "Sự xuất hiện các thương tổn vảy nến mới dọc theo vết cào gãi, vết sẹo mổ hoặc vùng da bị chấn thương cơ học trên bệnh nhân đang tiến triển gọi là:",
        "options": [
            "Dấu hiệu Auspitz",
            "Dấu hiệu Nikolsky",
            "Hiện tượng đồng dạng Koebner (Isomorphic phenomenon)",
            "Dấu hiệu Darier"
        ],
        "correctIndex": 2,
        "explanation": "**Hiện tượng Koebner (đồng dạng)** là sự hình thành thương tổn vảy nến mới trên vùng da lành vừa chịu kích thích/chấn thương vật lý (cào gãi, bỏng nắng, hình xăm, vết mổ), báo hiệu bệnh đang trong giai đoạn **tiến triển hoạt động**."
    },
    {
        "lectureId": "01",
        "category": "chan-doan",
        "difficulty": "Trung bình",
        "slideId": "01-slide-17",
        "slideRef": "Slide 17: Vảy nến giọt (Guttate psoriasis)",
        "question": "Thể lâm sàng nào của bệnh vảy nến thường khởi phát cấp tính ở trẻ em và thanh thiếu niên sau đợt viêm họng do Liên cầu khuẩn tan huyết nhóm A (Streptococcus pyogenes)?",
        "options": [
            "Vảy nến mủ toàn thân von Zumbusch",
            "Vảy nến thể giọt (Guttate psoriasis)",
            "Vảy nến đảo ngược (Inverse psoriasis)",
            "Vảy nến đỏ da toàn thân"
        ],
        "correctIndex": 1,
        "explanation": "**Vảy nến thể giọt (Guttate psoriasis)** đặc trưng bởi các sẩn đỏ có vảy nhỏ đường kính 1–10 mm như giọt nước mưa rải rác khắp thân mình, rất hay khởi phát 1–3 tuần sau nhiễm **Streptococcus pyogenes** vùng hầu họng ở người trẻ."
    },
    {
        "lectureId": "01",
        "category": "chan-doan",
        "difficulty": "Khó",
        "slideId": "01-slide-22",
        "slideRef": "Slide 22: Mô bệnh học Vảy nến",
        "question": "Trên tiêu bản mô bệnh học của mảng vảy nến điển hình, sự tập trung của các bạch cầu đa nhân trung tính nằm trong lớp sừng á sừng được gọi là:",
        "options": [
            "Vi áp-xe Pautrier",
            "Vi áp-xe Munro (Munro's microabscess)",
            "Thể Civatte (Civatte bodies)",
            "Tế bào Tzanck gai phân"
        ],
        "correctIndex": 1,
        "explanation": "Mô bệnh học vảy nến có 2 hình ảnh tụ tập bạch cầu đa nhân trung tính đặc trưng: **Vi áp-xe Munro** (nằm trong lớp sừng á sừng) và **Mụn mủ dạng bọt biển của Kogoj** (nằm ở lớp gai thượng bì)."
    },
    {
        "lectureId": "01",
        "category": "chan-doan",
        "difficulty": "Trung bình",
        "slideId": "01-slide-26",
        "slideRef": "Slide 26: Đánh giá độ nặng PASI, BSA, DLQI",
        "question": "TheoQuy tắc số 10 (Rule of Tens) trong phân độ nặng bệnh Vảy nến mảng, bệnh nhân được xếp vào nhóm Vảy nến Trung bình – Nặng khi có một trong các chỉ số nào sau đây?",
        "options": [
            "BSA > 5% hoặc PASI > 5 hoặc DLQI > 5",
            "BSA > 10% hoặc PASI > 10 hoặc DLQI > 10",
            "BSA > 20% hoặc PASI > 15 hoặc DLQI > 15",
            "BSA > 30% kèm sốt cao"
        ],
        "correctIndex": 1,
        "explanation": "**Quy tắc số 10 (Rule of Tens):** Vảy nến được phân loại mức độ Trung bình – Nặng (cần chỉ định quang trị liệu hoặc thuốc toàn thân/thuốc sinh học) khi **BSA > 10%** hoặc **PASI > 10** hoặc **DLQI > 10**."
    },
    {
        "lectureId": "01",
        "category": "dieu-tri",
        "difficulty": "Khó",
        "slideId": "01-slide-7",
        "slideRef": "Slide 7: Yếu tố khởi phát & Bẫy điều trị",
        "question": "CẢNH BÁO ĐỎ LÂM SÀNG: Việc lạm dụng Corticosteroid đường toàn thân (uống Dexamethasone, Prednisolone hoặc tiêm K-cort) rồi ngưng đột ngột ở bệnh nhân vảy nến mảng có nguy cơ cao nhất dẫn đến biến chứng nào?",
        "options": [
            "Khỏi bệnh hoàn toàn không tái phát",
            "Bùng phát Vảy nến mủ toàn thân (von Zumbusch) hoặc Đỏ da toàn thân đe dọa tính mạng",
            "Chuyển sang bệnh Pemphigus thông thường",
            "Chỉ gây sạm da nhẹ tại chỗ"
        ],
        "correctIndex": 1,
        "explanation": "**Tuyệt đối chống chỉ định Corticoid đường toàn thân** trong điều trị vảy nến mảng thông thường vì hiệu ứng dội ngược (Rebound phenomenon) khi giảm liều/ngưng thuốc sẽ kích phát **Vảy nến mủ toàn thân von Zumbusch** hoặc **Đỏ da toàn thân** kèm rối loạn huyết động."
    },
    {
        "lectureId": "01",
        "category": "dieu-tri",
        "difficulty": "Trung bình",
        "slideId": "01-slide-31",
        "slideRef": "Slide 31: Điều trị tại chỗ Vảy nến",
        "question": "Phối hợp thuốc bôi tại chỗ nào được xem là tiêu chuẩn vàng đầu tay cho vảy nến mảng mức độ nhẹ - trung bình nhờ cơ chế hiệp đồng và giảm tác dụng phụ teo da?",
        "options": [
            "Kháng sinh Mupirocin phối hợp Ketoconazole",
            "Dẫn xuất Vitamin D3 (Calcipotriol) phối hợp Corticosteroid bôi (Betamethasone dipropionate)",
            "Bôi đơn độc cồn Iod 5%",
            "Kem Acyclovir 5% bôi ngày 5 lần"
        ],
        "correctIndex": 1,
        "explanation": "Sự phối hợp cố định giữa **Calcipotriol (dẫn xuất Vitamin D3)** giúp biệt hóa sừng và **Betamethasone dipropionate (Corticoid mạnh)** giúp kháng viêm vừa nâng cao hiệu quả sạch tổn thương vừa giảm kích ứng da và giảm nguy cơ teo da."
    },
    {
        "lectureId": "01",
        "category": "dieu-tri",
        "difficulty": "Khó",
        "slideId": "01-slide-36",
        "slideRef": "Slide 36: Thuốc toàn thân cổ điển",
        "question": "Thuốc toàn thân cổ điển nào thuộc nhóm Retinoid đường uống, KHÔNG ức chế miễn dịch, hiệu quả tốt trong vảy nến mủ nhưng chống chỉ định tuyệt đối ở phụ nữ mang thai hoặc dự định mang thai trong vòng 3 năm sau ngưng thuốc?",
        "options": [
            "Methotrexate",
            "Cyclosporine A",
            "Acitretin",
            "Secukinumab"
        ],
        "correctIndex": 2,
        "explanation": "**Acitretin** là retinoid thế hệ 2 không ức chế miễn dịch (an toàn ở người nhiễm HIV/viêm gan siêu vi cần tránh ức chế miễn dịch), rất nhạy với vảy nến mủ. Tuy nhiên, khi gặp rượu bia sẽ chuyển hóa thành Etretinate tích lũy lâu trong mô mỡ nên **phụ nữ trong độ tuổi sinh đẻ phải tránh thai ít nhất 3 năm sau khi ngưng thuốc**."
    },
    {
        "lectureId": "01",
        "category": "dieu-tri",
        "difficulty": "Khó",
        "slideId": "01-slide-39",
        "slideRef": "Slide 39: Thuốc sinh học (Biologics)",
        "question": "Trước khi khởi trị các thuốc sinh học kháng TNF-α (Infliximab, Adalimumab, Etanercept) hoặc kháng IL-17 / IL-23 cho bệnh nhân vảy nến, xét nghiệm tầm soát bắt buộc quan trọng nhất là:",
        "options": [
            "Đo điện tâm đồ gắng sức",
            "Tầm soát Lao tiềm ẩn (IGRA / QuantiFERON-TB, X-quang phổi) và Viêm gan siêu vi B, C (HBsAg, Anti-HBc, Anti-HCV)",
            "Định lượng nồng độ Cortisol máu buổi sáng",
            "Soi tươi tìm nấm KOH tại sang thương"
        ],
        "correctIndex": 1,
        "explanation": "Các thuốc sinh học (đặc biệt nhóm **kháng TNF-α**) làm phá vỡ cấu trúc u hạt kìm hãm vi khuẩn lao, có thể làm **bùng phát Lao tiềm ẩn hoặc tái hoạt Viêm gan siêu vi B tối cấp**. Do đó bắt buộc phải tầm soát Lao và HBV/HCV trước điều trị."
    },
    {
        "lectureId": "01",
        "category": "ca-lam-sang",
        "difficulty": "Khó",
        "slideId": "01-slide-20",
        "slideRef": "Slide 20: Viêm khớp vảy nến (PsA)",
        "question": "Dấu hiệu lâm sàng nào ở móng tay và ngón tay là yếu tố dự báo mạnh nhất bệnh nhân vảy nến da đang hoặc sắp tiến triển thành Viêm khớp vảy nến (Psoriatic Arthritis - PsA)?",
        "options": [
            "Chỉ có mảng đỏ ở vùng khuỷu tay đơn thuần",
            "Tổn thương vảy nến móng (rỗ móng, tách móng, dấu giọt dầu) kèm sưng viêm ngón hình khúc dồi (Dactylitis) và đau khớp liên đốt xa (DIP)",
            "Rụng tóc từng mảng không sẹo",
            "Dát giảm sắc tố ở vùng lưng"
        ],
        "correctIndex": 1,
        "explanation": "Giường móng gắn liền giải phẫu với điểm bám gân cơ duỗi vào **khớp liên đốt xa (DIP)**. Do đó, **vảy nến móng (đặc biệt rỗ móng, ly móng)** kèm **viêm ngón hình khúc dồi (Dactylitis)** và viêm điểm bám gân (Enthesitis) là dấu chỉ điểm sớm nhất của Viêm khớp vảy nến."
    },

    # =========================================================================
    # CHUYÊN ĐỀ 02: TRÚNG ĐỘC DA DO THUỐC (SCARs)
    # =========================================================================
    {
        "lectureId": "02",
        "category": "nhan-biet",
        "difficulty": "Cơ bản",
        "slideId": "02-slide-7",
        "slideRef": "Slide 7: Dược lý di truyền HLA & SCARs",
        "question": "Tại quần thể người Việt Nam và Đông Nam Á, alen HLA nào cần được xét nghiệm tầm soát trước khi kê đơn Carbamazepine để phòng ngừa hội chứng SJS/TEN?",
        "options": [
            "HLA-B*58:01",
            "HLA-B*15:02",
            "HLA-B*57:01",
            "HLA-Cw6"
        ],
        "correctIndex": 1,
        "explanation": "Cặp đôi kinh điển bắt buộc nhớ trên lâm sàng: **HLA-B*15:02 gắn liền với SJS/TEN do Carbamazepine**, còn **HLA-B*58:01 gắn liền với SJS/TEN và DRESS do Allopurinol**."
    },
    {
        "lectureId": "02",
        "category": "chan-doan",
        "difficulty": "Trung bình",
        "slideId": "02-slide-22",
        "slideRef": "Slide 22: Phân loại phổ SJS / TEN theo BSA",
        "question": "Tiêu chuẩn phân biệt giữa Hội chứng Stevens-Johnson (SJS), Chồng lấp SJS/TEN và Hoại tử thượng bì nhiễm độc (TEN - Lyell) dựa trên tỷ lệ diện tích da bị bóc tách/trợt (BSA detachment) là:",
        "options": [
            "SJS < 5% BSA | SJS-TEN: 5–15% BSA | TEN > 15% BSA",
            "SJS < 10% BSA | SJS-TEN: 10–30% BSA | TEN > 30% BSA",
            "SJS < 20% BSA | SJS-TEN: 20–50% BSA | TEN > 50% BSA",
            "Phân loại chỉ dựa vào số lượng niêm mạc bị loét, không phụ thuộc diện tích da"
        ],
        "correctIndex": 1,
        "explanation": "Theo phân loại quốc tế Bastuji-Garin: **SJS** khi diện tích thượng bì bóc tách (hoặc Nikolsky dương tính) **< 10% BSA**; **Hội chứng chồng lấp SJS-TEN** khi từ **10% – 30% BSA**; và **TEN (Hội chứng Lyell)** khi **> 30% BSA**."
    },
    {
        "lectureId": "02",
        "category": "chan-doan",
        "difficulty": "Trung bình",
        "slideId": "02-slide-10",
        "slideRef": "Slide 10: Dấu hiệu cờ đỏ (Red flags) của SCARs",
        "question": "Khi tiếp nhận một bệnh nhân phát ban đỏ sau dùng thuốc, các dấu hiệu 'Cờ đỏ' (Red flags) cảnh báo nguy cơ diễn tiến thành phản ứng da nặng (SCARs) bao gồm TẤT CẢ các dấu hiệu sau, NGOẠI TRỪ:",
        "options": [
            "Đau rát da lan tỏa (Cutaneous pain) và phù nề vùng mặt trung tâm",
            "Loét trợt từ 2 hốc tự nhiên/niêm mạc trở lên (mắt, miệng, sinh dục)",
            "Sẩn phù mày đay ngứa, tự lặn sạch hoàn toàn sau 4 giờ không để lại dấu vết",
            "Dấu hiệu Nikolsky dương tính, xuất hiện bóng nước nhão hoặc ban xuất huyết/hoại tử"
        ],
        "correctIndex": 2,
        "explanation": "Sẩn phù tự lặn nhanh trong vòng < 24 giờ không để lại vết thâm là đặc điểm của **mày đay cấp thông thường**. Ngược lại, **đau rát da, sốt cao, phù mặt, loét niêm mạc, Nikolsky (+), bóng nước nhão, hạch to** là các dấu hiệu Cờ đỏ của SJS/TEN hoặc DRESS."
    },
    {
        "lectureId": "02",
        "category": "chan-doan",
        "difficulty": "Khó",
        "slideId": "02-slide-31",
        "slideRef": "Slide 31: Hội chứng DRESS / DIHS",
        "question": "Đặc điểm lâm sàng và cận lâm sàng nổi bật giúp phân biệt Hội chứng DRESS (Phản ứng thuốc có tăng bạch cầu ái toan và triệu chứng hệ thống) với các phát ban thuốc thông thường là:",
        "options": [
            "Thời gian tiềm ẩn rất ngắn (1–2 giờ sau uống thuốc) và chỉ nổi mẩn ngứa nhẹ",
            "Thời gian tiềm ẩn kéo dài (2–8 tuần sau bắt đầu thuốc), sốt cao, phù mặt, hạch to, tăng bạch cầu ái toan (Eosinophils) và tổn thương tạng (nhất là Gan, Thận)",
            "Chỉ gây bong vảy lòng bàn tay bàn chân mà không có sốt hay tổn thương nội tạng",
            "Bóc tách toàn bộ thượng bì > 50% diện tích cơ thể trong vòng 24 giờ"
        ],
        "correctIndex": 1,
        "explanation": "**Hội chứng DRESS** có thời gian tiềm ẩn rất dài (**2–8 tuần** sau khởi dùng thuốc chống động kinh, Allopurinol, Dapsone...), đặc trưng bởi **phù mặt, sốt, hạch to lan tỏa, tăng Eosinophils máu ngoại vi (> 700/µL hoặc ≥ 10%), xuất hiện Lympho bào không điển hình và viêm gan/viêm thận cấp** (liên quan tái hoạt HHV-6)."
    },
    {
        "lectureId": "02",
        "category": "chan-doan",
        "difficulty": "Khó",
        "slideId": "02-slide-38",
        "slideRef": "Slide 38: Hội chứng AGEP",
        "question": "Bệnh nhân sốt cao đột ngột sau 24–48 giờ uống kháng sinh Beta-lactam, trên nền da đỏ phù nề vùng nếp gấp xuất hiện hàng trăm mụn mủ nhỏ li ti vô trùng đầu đinh ghim không cư trú ở nang lông. Chẩn đoán phù hợp nhất là:",
        "options": [
            "Hội chứng ngoại ban mụn mủ toàn thân cấp tính (AGEP)",
            "Hội chứng DRESS",
            "Hội chứng Lyell (TEN)",
            "Hồng ban sắc tố cố định (FDE)"
        ],
        "correctIndex": 0,
        "explanation": "**AGEP (Acute Generalized Exanthematous Pustulosis)** có thời gian tiềm ẩn cực ngắn (**thường < 4 ngày**, đặc biệt 24–48 giờ với kháng sinh Beta-lactam, Macrolide, CCB), biểu hiện bằng hàng trăm **mụn mủ vô trùng không nang lông** trên nền ban đỏ vùng nếp gấp kèm tăng bạch cầu đa nhân trung tính và tự thoái lui bong vảy sau 1–2 tuần ngưng thuốc."
    },
    {
        "lectureId": "02",
        "category": "chan-doan",
        "difficulty": "Trung bình",
        "slideId": "02-slide-18",
        "slideRef": "Slide 18: Hồng ban sắc tố cố định (FDE)",
        "question": "Thương tổn da là một hoặc vài mảng đỏ tím tròn sắc nét, đôi khi có bóng nước ở giữa, sau khi lành để lại dát tăng sắc tố thâm đen và LUÔN TÁI PHÁT ĐÚNG TẠI VỊ TRÍ CŨ mỗi khi uống lại thuốc dị ứng là đặc trưng của:",
        "options": [
            "Phát ban dạng dát sẩn (MPE)",
            "Hồng ban sắc tố cố định do thuốc (Fixed Drug Eruption - FDE)",
            "Hội chứng Stevens-Johnson (SJS)",
            "Bệnh vảy nến thể mảng"
        ],
        "correctIndex": 1,
        "explanation": "**Hồng ban sắc tố cố định (FDE)** do các tế bào T nhớ cư trú tại mô biểu bì (Resident memory CD8+ T cells). Mỗi lần bệnh nhân uống lại thuốc thủ phạm (NSAIDs, Bactrim, Tetracycline...), thương tổn sẽ bùng lên **chính xác tại vị trí cũ** trong vòng 30 phút – 8 giờ."
    },
    {
        "lectureId": "02",
        "category": "chan-doan",
        "difficulty": "Khó",
        "slideId": "02-slide-28",
        "slideRef": "Slide 28: Thang điểm tiên lượng SCORTEN",
        "question": "Thang điểm SCORTEN dùng để tiên lượng tỷ lệ tử vong cho bệnh nhân SJS/TEN bao gồm 7 thông số lâm sàng và xét nghiệm nào sau đây?",
        "options": [
            "Tuổi ≥ 40, Nhịp tim ≥ 120 l/p, Có bệnh ác tính, BSA bóc tách ≥ 10%, Ure máu > 10 mmol/L, Glucose máu > 14 mmol/L, Bicarbonat < 20 mmol/L",
            "Tuổi ≥ 60, Huyết áp tâm thu < 90 mmHg, Bạch cầu ái toan > 1500/µL, Men gan AST > 200 U/L, Creatinin > 2 mg/dL, Sốt > 39°C, Hạch to",
            "Chỉ tính dựa trên diện tích da bóc tách và số lượng niêm mạc bị tổn thương",
            "Tuổi, Giới tính, Tiền sử dị ứng gia đình, IgE toàn phần, CRP, Procalcitonin, Albumin máu"
        ],
        "correctIndex": 0,
        "explanation": "7 yếu tố tiên lượng tử vong trong **SCORTEN** (mỗi yếu tố = 1 điểm, đánh giá vào Ngày 1 và Ngày 3 nhập viện): **(1) Tuổi ≥ 40**, **(2) Nhịp tim ≥ 120 chu kỳ/phút**, **(3) Có bệnh lý ác tính (ung thư)**, **(4) Diện tích thượng bì bóc tách ≥ 10% BSA**, **(5) Ure huyết thanh > 10 mmol/L**, **(6) Glucose máu > 14 mmol/L**, **(7) Bicarbonat huyết thanh < 20 mmol/L**."
    },
    {
        "lectureId": "02",
        "category": "nhan-biet",
        "difficulty": "Trung bình",
        "slideId": "02-slide-24",
        "slideRef": "Slide 24: Cơ chế chết tế bào sừng trong SJS/TEN",
        "question": "Trong cơ chế bệnh sinh của SJS/TEN, chất trung gian gây độc tế bào nào đóng vai trò chủ chốt nhất gây chết tế bào sừng hàng loạt theo chương trình (Apoptosis / Necroptosis)?",
        "options": [
            "Histamin và Leukotriene",
            "Granulysin (cùng hệ thống Perforin/Granzyme B và Fas-FasL) tiết ra từ tế bào T CD8+ độc tế bào và tế bào NK",
            "Kháng thể tự miễn chống Desmoglein 1 và 3",
            "Độc tố Exfoliative toxin của tụ cầu vàng"
        ],
        "correctIndex": 1,
        "explanation": "**Granulysin** được giải phóng với nồng độ cực cao trong dịch bóng nước từ tế bào T CD8+ đặc hiệu thuốc và tế bào NK chính là 'vũ khí' quan trọng nhất gây hoại tử thượng bì lan tỏa trong SJS/TEN."
    },
    {
        "lectureId": "02",
        "category": "dieu-tri",
        "difficulty": "Cơ bản",
        "slideId": "02-slide-44",
        "slideRef": "Slide 44: Nguyên tắc cấp cứu SCARs",
        "question": "Hành động CẤP CỨU ĐẦU TIÊN và quyết định nhất giúp giảm tỷ lệ tử vong khi nghi ngờ một bệnh nhân mắc SJS/TEN hoặc DRESS là:",
        "options": [
            "Truyền ngay kháng sinh phổ rộng liều cao cho tất cả bệnh nhân",
            "Xác định và NGỪNG NGAY LẬP TỨC mọi thuốc nghi ngờ (đặc biệt các thuốc mới dùng trong vòng 1–8 tuần qua)",
            "Cắt lọc lột bỏ toàn bộ lớp thượng bì bị bong tróc tại phòng mổ",
            "Thử lại liều nhỏ thuốc nghi ngờ (Oral provocation test) ngay trong giai đoạn cấp"
        ],
        "correctIndex": 1,
        "explanation": "**Ngừng ngay lập tức thuốc nghi ngờ** (đặc biệt các thuốc có thời gian bán thải ngắn) chứng minh làm giảm đáng kể tỷ lệ tử vong trong SJS/TEN. Tuyệt đối không cắt lọc thô bạo lớp thượng bì bong vì lớp da này đóng vai trò như một màng băng sinh học tự nhiên bảo vệ lớp bì bên dưới."
    },
    {
        "lectureId": "02",
        "category": "dieu-tri",
        "difficulty": "Trung bình",
        "slideId": "02-slide-46",
        "slideRef": "Slide 46: Chăm sóc đa chuyên khoa SJS/TEN",
        "question": "Trong chăm sóc bệnh nhân SJS/TEN, ngoài hồi sức dịch - điện giải và chống nhiễm trùng ở phòng cách ly vô khuẩn, chuyên khoa nào cần được hội chẩn SỚM NHẤT ngay khi nhập viện để phòng ngừa biến chứng tàn phế vĩnh viễn?",
        "options": [
            "Chuyên khoa Răng Hàm Mặt để nhổ răng dự phòng",
            "Chuyên khoa Mắt (Nhãn khoa) để chăm sóc giác - kết mạc hàng ngày, phòng dính mi cầu và mù lòa",
            "Chuyên khoa Ngoại thần kinh",
            "Chuyên khoa Chấn thương chỉnh hình"
        ],
        "correctIndex": 1,
        "explanation": "Di chứng **mắt (dính mi - cầu mắt, khô mắt nặng, loét thủng giác mạc gây mù lòa)** là di chứng lâu dài nặng nề nhất ở người sống sót sau SJS/TEN. Do đó bắt buộc hội chẩn bác sĩ Nhãn khoa ngay từ ngày đầu để nhỏ nước mắt nhân tạo không chất bảo quản, kháng viêm tại chỗ và tách dính kết mạc."
    },
    {
        "lectureId": "02",
        "category": "dieu-tri",
        "difficulty": "Khó",
        "slideId": "02-slide-35",
        "slideRef": "Slide 35: Điều trị hội chứng DRESS",
        "question": "Đối với hội chứng DRESS có tổn thương nội tạng (viêm gan, viêm thận, viêm phổi mô kẽ), phác đồ điều trị chuẩn về việc sử dụng Corticosteroid toàn thân là:",
        "options": [
            "Chỉ dùng Corticoid trong 3–5 ngày rồi ngưng đột ngột",
            "Chống chỉ định hoàn toàn Corticoid toàn thân",
            "Dùng Corticosteroid toàn thân (Prednisone/Methylprednisolone 0,5–1 mg/kg/ngày) và GIẢM LIỀU RẤT CHẬM trong 6–12 tuần để tránh bùng phát tái phát",
            "Chỉ bôi kem dưỡng ẩm đơn thuần"
        ],
        "correctIndex": 2,
        "explanation": "Khác với AGEP (tự giới hạn nhanh), **DRESS** có phản ứng miễn dịch kéo dài và tái hoạt virus Herpes (HHV-6). Nếu ngưng hoặc giảm liều Corticoid quá nhanh (< 4 tuần), bệnh sẽ **bùng phát dữ dội trở lại (Relapse)** và nguy cơ tiến triển sang suy đa tạng hoặc bệnh tự miễn hậu DRESS."
    },
    {
        "lectureId": "02",
        "category": "ca-lam-sang",
        "difficulty": "Khó",
        "slideId": "02-slide-49",
        "slideRef": "Slide 49: Tư vấn dị ứng chéo & Thẻ dị ứng",
        "question": "Bệnh nhân từng bị SJS do Carbamazepine. Khi cần điều trị động kinh hoặc đau dây thần kinh sau này, nhóm thuốc chống co giật nào có nguy cơ DỊ ỨNG CHÉO cao nhất cần tuyệt đối tránh?",
        "options": [
            "Nhóm chống động kinh có vòng thơm (Aromatic anticonvulsants) như Phenytoin, Phenobarbital, Oxcarbazepine, Lamotrigine",
            "Levetiracetam",
            "Gabapentin hoặc Pregabalin",
            "Acid Valproic"
        ],
        "correctIndex": 0,
        "explanation": "Các thuốc chống co giật có **nhân thơm (Aromatic ring)** gồm **Carbamazepine, Oxcarbazepine, Phenytoin, Phenobarbital (và Lamotrigine)** có tỷ lệ **dị ứng chéo rất cao (lên tới 40–80%)**. Cần cấp Thẻ Dị Ứng Thuốc suốt đời và chuyển sang nhóm không có vòng thơm như Levetiracetam hoặc Gabapentin."
    },

    # =========================================================================
    # CHUYÊN ĐỀ 03: VIÊM DA CƠ ĐỊA (ATOPIC DERMATITIS)
    # =========================================================================
    {
        "lectureId": "03",
        "category": "nhan-biet",
        "difficulty": "Cơ bản",
        "slideId": "03-slide-5",
        "slideRef": "Slide 9 & 10: 3 Trụ cột bệnh sinh Viêm da cơ địa",
        "question": "Ba trụ cột cốt lõi tạo nên vòng xoắn bệnh lý của bệnh Viêm da cơ địa (Atopic Dermatitis) bao gồm:",
        "options": [
            "Tăng tiết bã nhờn, Bít tắc cổ nang lông và Vi khuẩn C. acnes",
            "Suy giảm hàng rào bảo vệ da (đột biến Filaggrin, thiếu Ceramide), Rối loạn miễn dịch (ưu thế Th2: IL-4, IL-13, IL-31) và Mất cân bằng hệ vi sinh vật da (tăng tụ cầu vàng S. aureus)",
            "Lắng đọng phức hợp miễn dịch IgA tại nhú bì và nhạy cảm Gluten",
            "Nhiễm xoắn khuẩn toàn thân và viêm nội mạc mạch máu"
        ],
        "correctIndex": 1,
        "explanation": "Viêm da cơ địa xoay quanh 3 trụ cột tương tác qua lại: **(1) Khiếm khuyết hàng rào thượng bì** (đột biến gen *FLG* mã hóa Filaggrin, giảm lipid gian bào) → **(2) Rối loạn miễn dịch lệch hướng Th2** (IL-4, IL-13, IL-31 gây ngứa) → **(3) Mất cân bằng hệ vi sinh** (*Staphylococcus aureus* chiếm ưu thế và tiết siêu kháng nguyên)."
    },
    {
        "lectureId": "03",
        "category": "nhan-biet",
        "difficulty": "Trung bình",
        "slideId": "03-slide-7",
        "slideRef": "Slide 13–15: Protein Filaggrin & Đột biến gen FLG",
        "question": "Khiếm khuyết hoặc đột biến mất chức năng gen mã hóa protein nào đóng vai trò di truyền quan trọng nhất gây suy yếu hàng rào thượng bì và thiếu hụt Yếu tố giữ ẩm tự nhiên (NMF) trong Viêm da cơ địa?",
        "options": [
            "Keratin 5 và Keratin 14",
            "Filaggrin (Gen FLG)",
            "Collagen type VII",
            "Desmoglein 3"
        ],
        "correctIndex": 1,
        "explanation": "**Filaggrin (Filament Aggregating Protein)** giúp gắn kết các sợi keratin tạo khung sừng vững chắc, và khi thoái giáng sẽ tạo ra các **Yếu tố giữ ẩm tự nhiên (NMF)** đồng thời duy trì pH acid bảo vệ da. Đột biến gen *FLG* làm da khô, tăng mất nước qua thượng bì (TEWL) và tăng pH da."
    },
    {
        "lectureId": "03",
        "category": "chan-doan",
        "difficulty": "Cơ bản",
        "slideId": "03-slide-14",
        "slideRef": "Slide 27–32: Đặc điểm lâm sàng theo 3 giai đoạn tuổi",
        "question": "Vị trí phân bố thương tổn điển hình nhất của Viêm da cơ địa ở giai đoạn Nhũ nhi (dưới 2 tuổi) so với giai đoạn Trẻ lớn / Người lớn là:",
        "options": [
            "Nhũ nhi chủ yếu ở nếp khuỷu, nếp khoeo; Người lớn chủ yếu ở hai má",
            "Nhũ nhi đặc trưng bởi chàm cấp tính (đỏ da, mụn nước, rỉ dịch) ở HAI MÁ, trán, mặt duỗi chi (thường chừa vùng tam giác mũi-miệng); Trẻ lớn và người lớn ưu thế mảng liken hóa ở NẾP GẤP (nếp khuỷu, nếp khoeo, cổ)",
            "Cả hai giai đoạn chỉ khu trú duy nhất ở lòng bàn tay, bàn chân",
            "Nhũ nhi chỉ có thương tổn ở vùng tã lót"
        ],
        "correctIndex": 1,
        "explanation": "Đặc trưng theo tuổi: **Nhũ nhi (< 2 tuổi)** khởi phát chàm cấp rỉ dịch đối xứng ở **hai má** (chừa vùng quanh mũi miệng – dấu hiệu *Headlight sign* và thường chừa vùng tã lót do ẩm). **Trẻ em (2–12 tuổi) và Người lớn** chuyển sang mạn tính, dày da **liken hóa ở các nếp gấp** (nếp khuỷu, nếp khoeo)."
    },
    {
        "lectureId": "03",
        "category": "chan-doan",
        "difficulty": "Trung bình",
        "slideId": "03-slide-19",
        "slideRef": "Slide 41–44: Tiêu chuẩn chẩn đoán Hanifin & Rajka",
        "question": "Theo tiêu chuẩn vàng của Hanifin & Rajka (1980), để chẩn đoán xác định Viêm da cơ địa, bệnh nhân cần thỏa mãn tối thiểu bao nhiêu tiêu chuẩn chính và phụ?",
        "options": [
            "Ít nhất 1 tiêu chuẩn chính và 1 tiêu chuẩn phụ",
            "Ít nhất 2 tiêu chuẩn chính và 2 tiêu chuẩn phụ",
            "Ít nhất 3 trong 4 tiêu chuẩn chính VÀ ít nhất 3 trong 23 tiêu chuẩn phụ",
            "Bắt buộc có đủ cả 4 tiêu chuẩn chính và IgE máu tăng cao"
        ],
        "correctIndex": 2,
        "explanation": "Tiêu chuẩn **Hanifin & Rajka** yêu cầu **≥ 3/4 tiêu chuẩn chính** (1. Ngứa; 2. Hình thái và vị trí điển hình theo tuổi; 3. Tiến triển mạn tính hay tái phát; 4. Tiền sử cá nhân hoặc gia đình mắc bệnh cơ địa: hen, viêm mũi dị ứng, VDCĐ) kết hợp với **≥ 3/23 tiêu chuẩn phụ**."
    },
    {
        "lectureId": "03",
        "category": "nhan-biet",
        "difficulty": "Trung bình",
        "slideId": "03-slide-2",
        "slideRef": "Slide 3 & 4: Tiến trình dị ứng (The Atopic March)",
        "question": "Khái niệm 'Hành trình dị ứng' (The Atopic March) mô tả diễn tiến tự nhiên thường gặp của các bệnh lý cơ địa từ thời thơ ấu đến khi trưởng thành theo trình tự nào?",
        "options": [
            "Viêm mũi dị ứng → Vảy nến → Mụn trứng cá",
            "Viêm da cơ địa & Dị ứng thức ăn (khởi phát sớm ở nhũ nhi) → Hen phế quản → Viêm mũi dị ứng",
            "Mày đay mạn tính → Suy thận → Lupus ban đỏ",
            "Nhiễm nấm da → Viêm mô bào → Nhiễm trùng huyết"
        ],
        "correctIndex": 1,
        "explanation": "**The Atopic March** bắt đầu bằng sự phá vỡ hàng rào da trong **Viêm da cơ địa khởi phát sớm** tạo điều kiện cho dị nguyên xuyên qua da gây mẫn cảm hệ thống → **Dị ứng thức ăn** → **Hen phế quản** → **Viêm mũi dị ứng**."
    },
    {
        "lectureId": "03",
        "category": "chan-doan",
        "difficulty": "Khó",
        "slideId": "03-slide-18",
        "slideRef": "Slide 39–40: Biến chứng Eczema Herpeticum (Kaposi)",
        "question": "Bệnh nhi Viêm da cơ địa đột ngột sốt cao, mệt lả, trên nền chàm xuất hiện hàng loạt mụn nước đồng dạng lõm giữa mọc thành chùm, nhanh chóng vỡ để lại các vết trợt tròn nhỏ như bấm lỗ (punched-out erosions) đóng vảy tiết máu. Biến chứng cấp cứu nào cần nghĩ tới ngay?",
        "options": [
            "Bội nhiễm vi nấm sợi tơ (Tinea corporis)",
            "Eczema Herpeticum (Phát ban dạng thủy đậu Kaposi do nhiễm HSV lan tỏa)",
            "Bệnh vảy cá thông thường",
            "Vảy phấn trắng (Pityriasis alba)"
        ],
        "correctIndex": 1,
        "explanation": "**Eczema Herpeticum** là biến chứng cấp cứu da liễu do virus **Herpes Simplex (HSV-1 hoặc HSV-2)** lan tỏa trên nền da suy giảm hàng rào và thiếu hụt peptide kháng khuẩn (Cathelicidin LL-37). Cần khởi trị ngay **Acyclovir đường toàn thân** và hội chẩn Nhãn khoa nếu tổn thương vùng quanh mắt."
    },
    {
        "lectureId": "03",
        "category": "dieu-tri",
        "difficulty": "Cơ bản",
        "slideId": "03-slide-26",
        "slideRef": "Slide 61–64: Dưỡng ẩm & Quy tắc 3 phút",
        "question": "Trong điều trị nền tảng (Baseline therapy) cho MỌI mức độ Viêm da cơ địa, cách sử dụng chất dưỡng ẩm (Emollients) đúng chuẩn nhất là:",
        "options": [
            "Chỉ thoa dưỡng ẩm khi nào da đang đỏ rỉ dịch, khi da lành thì ngưng hẳn",
            "Thoa dưỡng ẩm hàng ngày, liên tục kể cả khi da đã ổn định, và thoa ngay trong vòng 3 phút sau khi tắm lúc da còn ẩm ('Soak and Seal')",
            "Tắm bằng nước thật nóng và xà phòng kiềm mạnh trước khi thoa dưỡng ẩm",
            "Chỉ thoa một lượng thật mỏng 10g cho toàn thân mỗi tháng"
        ],
        "correctIndex": 1,
        "explanation": "**Chất dưỡng ẩm là nền tảng bắt buộc của mọi bậc điều trị VDCĐ.** Nguyên tắc **'Ngâm và Khóa ẩm' (Soak and Seal - Quy tắc 3 phút):** tắm nước ấm vừa phải (32–37°C) trong 5–10 phút bằng sữa tắm dịu nhẹ pH 5.5, thấm khô nhẹ và thoa dưỡng ẩm ngay trong vòng **3 phút** (lượng chuẩn khoảng 150–250g/tuần ở trẻ nhỏ, 250–500g/tuần ở người lớn)."
    },
    {
        "lectureId": "03",
        "category": "dieu-tri",
        "difficulty": "Trung bình",
        "slideId": "03-slide-28",
        "slideRef": "Slide 67–69: Đơn vị đầu ngón tay (FTU) & Corticoid bôi",
        "question": "Một 'Đơn vị đầu ngón tay' (1 Fingertip Unit - FTU, bóp từ nếp lằn đốt xa đến đầu ngón trỏ người lớn qua đầu tuýp chuẩn 5mm) tương đương bao nhiêu gam thuốc và đủ bôi cho diện tích da bằng bao nhiêu?",
        "options": [
            "Khoảng 0,1 gram thuốc – đủ bôi cho 1 lòng bàn tay",
            "Khoảng 0,5 gram thuốc – đủ bôi cho diện tích bằng 2 lòng bàn tay người lớn (tương đương ~2% BSA)",
            "Khoảng 2,0 gram thuốc – đủ bôi cho cả hai chân",
            "Khoảng 5,0 gram thuốc – đủ bôi toàn thân"
        ],
        "correctIndex": 1,
        "explanation": "**1 FTU ≈ 0,5 gram thuốc mỡ/kem**, đủ để thoa đều cho diện tích tương đương **2 lòng bàn tay người lớn (~2% BSA)**. Việc hướng dẫn FTU giúp bệnh nhân bôi đủ liều điều trị và tránh tâm lý sợ Corticoid (Corticophobia) dẫn đến bôi quá ít không kiểm soát được viêm."
    },
    {
        "lectureId": "03",
        "category": "dieu-tri",
        "difficulty": "Trung bình",
        "slideId": "03-slide-29",
        "slideRef": "Slide 70–71: Thuốc ức chế Calcineurin tại chỗ (TCIs)",
        "question": "Ưu điểm vượt trội nhất của nhóm thuốc ức chế Calcineurin bôi tại chỗ (Tacrolimus, Pimecrolimus) so với Corticosteroid bôi tại chỗ trong điều trị Viêm da cơ địa là:",
        "options": [
            "Tác dụng diệt tụ cầu vàng mạnh hơn kháng sinh",
            "KHÔNG gây teo da, giãn mạch hay rạn da nên cực kỳ an toàn khi dùng lâu dài ở các vùng da mỏng nhạy cảm (mặt, mí mắt, cổ, nếp gấp, sinh dục)",
            "Giá thành rẻ hơn và không bao giờ gây cảm giác châm chích",
            "Dùng được cho cả nhiễm trùng Herpes đang hoạt động"
        ],
        "correctIndex": 1,
        "explanation": "**TCIs (Tacrolimus 0,03% / 0,1% và Pimecrolimus 1%)** ức chế chọn lọc sự hoạt hóa tế bào T mà không ức chế tổng hợp collagen của nguyên bào sợi, do đó **không gây teo da, giãn mạch, trứng cá đỏ hay tăng nhãn áp**, là lựa chọn ưu tiên cho vùng mặt, mí mắt và các nếp gấp."
    },
    {
        "lectureId": "03",
        "category": "dieu-tri",
        "difficulty": "Khó",
        "slideId": "03-slide-30",
        "slideRef": "Slide 72–73: Liệu pháp Chủ động (Proactive Therapy)",
        "question": "Chiến lược 'Điều trị chủ động' (Proactive therapy) nhằm ngăn ngừa tái phát ở những vùng da hay bị bùng phát Viêm da cơ địa lặp đi lặp lại được thực hiện như thế nào?",
        "options": [
            "Sau khi kiểm soát sạch đợt cấp, tiếp tục dưỡng ẩm hàng ngày toàn thân VÀ thoa ngắt quãng Corticoid bôi hoặc Tacrolimus bôi 2 lần/tuần (ví dụ: Thứ Bảy & Chủ Nhật) vào đúng những vùng da cũ hay tái phát",
            "Uống kháng sinh dự phòng liên tục suốt 6 tháng",
            "Đợi đến khi da đỏ rực và rỉ nước nhiều mới bắt đầu bôi thuốc",
            "Tiêm Corticoid tác dụng kéo dài mỗi tháng một lần"
        ],
        "correctIndex": 0,
        "explanation": "Tại vùng da vừa lành thương tổn VDCĐ vẫn còn tồn tại **viêm dưới lâm sàng (Subclinical inflammation)** và hàng rào da chưa hồi phục hoàn toàn. **Proactive therapy (bôi Tacrolimus hoặc TCS độ mạnh trung bình 2 ngày/tuần vào vùng da từng tổn thương + dưỡng ẩm mỗi ngày)** giúp kéo dài thời gian lui bệnh và giảm mạnh số đợt cấp trong năm."
    },
    {
        "lectureId": "03",
        "category": "dieu-tri",
        "difficulty": "Khó",
        "slideId": "03-slide-31",
        "slideRef": "Slide 74–76: Thuốc sinh học Dupilumab",
        "question": "Thuốc sinh học đầu tiên được FDA phê duyệt điều trị Viêm da cơ địa trung bình – nặng từ 6 tháng tuổi trở lên là Dupilumab. Đích tác động phân tử của Dupilumab là:",
        "options": [
            "Kháng thể đơn dòng ức chế tiểu đơn vị thụ thể IL-4Rα, qua đó khóa đồng thời tín hiệu của cả hai cytokine chủ chốt là IL-4 và IL-13",
            "Kháng thể đơn dòng kháng trực tiếp TNF-α",
            "Kháng thể đơn dòng gắn chọn lọc vào IgE tự do",
            "Thuốc ức chế chọn lọc IL-17A"
        ],
        "correctIndex": 0,
        "explanation": "**Dupilumab** là kháng thể đơn dòng người hoàn toàn gắn vào tiểu đơn vị **IL-4Rα** (thụ thể dùng chung của cả IL-4 và IL-13), từ đó ức chế kép con đường viêm Th2, cải thiện nhanh triệu chứng ngứa và phục hồi biểu hiện Filaggrin."
    },
    {
        "lectureId": "03",
        "category": "chan-doan",
        "difficulty": "Trung bình",
        "slideId": "03-slide-22",
        "slideRef": "Slide 48–50: Chẩn đoán phân biệt VDCĐ với Ghẻ",
        "question": "Khi đứng trước một trẻ nhỏ hoặc người lớn ngứa dữ dội toàn thân, những đặc điểm lâm sàng nào giúp hướng ngay đến bệnh GHẺ (Scabies) để không chẩn đoán nhầm là Viêm da cơ địa?",
        "options": [
            "Da khô toàn thân và có tiền sử viêm mũi dị ứng",
            "Ngứa dữ dội nhất về ban đêm, có yếu tố dịch tễ nhiều người sống chung cùng ngứa, và có luống ghẻ/mụn nước ở kẽ ngón tay, mặt trước cổ tay, quanh rốn, sẩn cục ở bìu/quy đầu",
            "Mảng đỏ giới hạn rõ phủ vảy trắng dày như sáp nến ở hai đầu gối",
            "Dát giảm sắc tố nhẹ ở hai má không ngứa"
        ],
        "correctIndex": 1,
        "explanation": "**Sai lầm lâm sàng rất phổ biến** là chẩn đoán nhầm bệnh Ghẻ thành Viêm da cơ địa rồi cho bôi Corticoid làm thành **Ghẻ incognito / Ghẻ vảy Na Uy**. Luôn phải hỏi **yếu tố dịch tễ gia đình cùng ngứa về đêm** và khám kỹ **kẽ ngón tay, nếp cổ tay, bộ phận sinh dục nam**."
    },

    # =========================================================================
    # CHUYÊN ĐỀ 04: BỆNH GIANG MAI (SYPHILIS)
    # =========================================================================
    {
        "lectureId": "04",
        "category": "nhan-biet",
        "difficulty": "Cơ bản",
        "slideId": "04-slide-2",
        "slideRef": "Slide 3: Tác nhân vi sinh Treponema pallidum",
        "question": "Đặc điểm vi sinh học chính xác của xoắn khuẩn Giang mai (Treponema pallidum subsp. pallidum) giải thích tại sao phác đồ điều trị chuẩn cần duy trì nồng độ Penicillin kéo dài trong máu là:",
        "options": [
            "Vi khuẩn có vỏ sáp dày kháng cồn - kháng toan như trực khuẩn lao",
            "Xoắn khuẩn nhân đôi rất chậm (chu kỳ phân chia khoảng 30–33 giờ) và chưa thể nuôi cấy thường quy trên môi trường nhân tạo thông thường",
            "Vi khuẩn tạo nha bào tồn tại hàng chục năm ngoài môi trường",
            "Vi khuẩn có khả năng tiết men Beta-lactamase kháng hoàn toàn Penicillin"
        ],
        "correctIndex": 1,
        "explanation": "*Treponema pallidum* có chu kỳ phân chia rất chậm (**~30–33 giờ** ở giai đoạn sớm và còn chậm hơn ở giai đoạn muộn). Vì Penicillin chỉ diệt khuẩn khi vi khuẩn đang phân chia tổng hợp vách tế bào, nên cần dùng **Benzathine Penicillin G phóng thích chậm** để duy trì nồng độ diệt khuẩn liên tục nhiều ngày."
    },
    {
        "lectureId": "04",
        "category": "chan-doan",
        "difficulty": "Cơ bản",
        "slideId": "04-slide-5",
        "slideRef": "Slide 6 & 7: Đặc tính lâm sàng của Săng giang mai",
        "question": "Tứ chứng lâm sàng kinh điển của một Săng giang mai (Hard chancre) điển hình trong Giang mai thời kỳ I là:",
        "options": [
            "Nhiều vết loét nông bờ nham nhở, đáy bẩn có mủ vàng, nền mềm và đau nhức dữ dội",
            "Thường là 1 vết trợt nông hình tròn/bầu dục đều đặn, đáy sạch bóng màu đỏ thịt tươi, nền cộm cứng như mảnh bìa khi bóp nhẹ, và KHÔNG NGỨA – KHÔNG ĐAU",
            "Chùm mụn nước nhỏ trên nền hồng ban gây bỏng rát, vỡ để lại vết trợt đa cung đau rát",
            "U sùi mềm màu hồng nhạt hình súp lơ hoặc mào gà"
        ],
        "correctIndex": 1,
        "explanation": "**Săng giang mai (Giang mai I)** xuất hiện sau ủ bệnh trung bình **21 ngày (10–90 ngày)** tại nơi xoắn khuẩn xâm nhập với 4 đặc tính vàng: **Tròn/bầu dục giới hạn rõ – Đáy sạch màu thịt đỏ tươi tiết thanh dịch trong – Nền cộm cứng như sụn/bìa cứng – Không đau**, đi kèm chùm hạch vùng có 1 hạch chúa to, di động, không đau, không hóa mủ."
    },
    {
        "lectureId": "04",
        "category": "chan-doan",
        "difficulty": "Trung bình",
        "slideId": "04-slide-9",
        "slideRef": "Slide 15–18: Giang mai thời kỳ II (Đào ban & Sẩn)",
        "question": "Các biểu hiện da - niêm mạc nào sau đây là đặc trưng điển hình của Giang mai thời kỳ II ('Nhà bắt chước vĩ đại')?",
        "options": [
            "Chỉ có 1 vết trợt cứng duy nhất tại rãnh quy đầu và huyết thanh còn âm tính",
            "Đào ban giang mai (dát hồng nhạt không ngứa tự mất), Sẩn giang mai đa dạng ở lòng bàn tay - bàn chân có viền vảy 'Cổ áo Biett', Mảng niêm mạc, Sẩn phì đại ẩm (Condyloma lata) và Rụng tóc kiểu rừng thưa",
            "Gôm giang mai hoại tử tạo loét sâu như miệng núi lửa phá hủy vách ngăn mũi",
            "Mảng đỏ phủ vảy trắng nhiều lớp ở cùi chỏ và đầu gối"
        ],
        "correctIndex": 1,
        "explanation": "**Giang mai II** là giai đoạn nhiễm xoắn khuẩn huyết toàn thân rầm rộ nhất. Các dấu hiệu kinh điển gồm: **Đào ban (Roseola)**, **Sẩn lòng bàn tay/bàn chân kèm viền vảy Biett (Biett's collarette)**, **Vòng vệ nữ (leukomelanoderma ở cổ)**, **Sẩn ướt Condyloma lata** (chứa cực nhiều xoắn khuẩn) và **rụng tóc nham nhở kiểu mối gặm (moth-eaten alopecia)**."
    },
    {
        "lectureId": "04",
        "category": "chan-doan",
        "difficulty": "Trung bình",
        "slideId": "04-slide-14",
        "slideRef": "Slide 26–28: Phân loại Giang mai kín (Latent Syphilis)",
        "question": "Giang mai kín (Latent syphilis - huyết thanh dương tính nhưng hoàn toàn không có triệu chứng lâm sàng) được chia thành Giang mai kín sớm và Giang mai kín muộn dựa trên mốc thời gian nhiễm bệnh là:",
        "options": [
            "Mốc 6 tháng",
            "Mốc 1 năm (theo WHO là 2 năm): Kín sớm khi nhiễm < 1 năm (hoặc < 2 năm theo WHO), Kín muộn khi nhiễm ≥ 1 năm (hoặc không rõ thời gian mắc)",
            "Mốc 5 năm",
            "Mốc 10 năm"
        ],
        "correctIndex": 1,
        "explanation": "Việc phân biệt **Giang mai kín sớm** và **Giang mai kín muộn / không rõ thời gian** có ý nghĩa quyết định trực tiếp đến phác đồ điều trị: Giang mai sớm (I, II, kín sớm) chỉ cần **1 liều duy nhất** Benzathine Penicillin G 2,4 triệu UI tiêm bắp; trong khi Giang mai kín muộn / không rõ thời gian bắt buộc phải tiêm **3 liều (mỗi tuần 1 liều × 3 tuần = tổng 7,2 triệu UI)**."
    },
    {
        "lectureId": "04",
        "category": "chan-doan",
        "difficulty": "Khó",
        "slideId": "04-slide-18",
        "slideRef": "Phần Huyết thanh học: So sánh RPR/VDRL và TPHA/TPPA",
        "question": "Vai trò chính xác của hai nhóm xét nghiệm huyết thanh học Giang mai: Nhóm Không đặc hiệu (RPR, VDRL) và Nhóm Đặc hiệu (TPHA, TPPA, Syphilis EIA/CIA) trong thực hành lâm sàng là:",
        "options": [
            "Dùng TPHA định lượng hiệu giá để theo dõi đáp ứng sau điều trị vì TPHA sẽ âm tính ngay sau 3 tháng",
            "TPHA/TPPA khẳng định từng nhiễm xoắn khuẩn (thường dương tính suốt đời); còn RPR/VDRL định lượng hiệu giá (1:2, 1:4, 1:16, 1:64...) dùng để đánh giá hoạt tính bệnh và THEO DÕI ĐÁP ỨNG ĐIỀU TRỊ (thành công khi hiệu giá giảm ≥ 4 lần)",
            "Chỉ cần một xét nghiệm RPR dương tính 1:2 là đủ khẳng định chắc chắn 100% mắc giang mai không cần làm TPHA",
            "RPR và VDRL không bao giờ cho kết quả dương tính giả"
        ],
        "correctIndex": 1,
        "explanation": "Nguyên tắc vàng huyết thanh học: **(1) Chẩn đoán xác định bắt buộc phải phối hợp cả 2 nhóm xét nghiệm (RPR/VDRL + TPHA/TPPA)**. **(2) Không dùng TPHA để theo dõi điều trị** vì TPHA là 'sẹo huyết thanh' tồn tại suốt đời. **(3) Phải dùng hiệu giá RPR/VDRL (cùng một loại test)** để theo dõi: điều trị thành công khi hiệu giá giảm **≥ 4 lần** (tương đương giảm 2 độ pha loãng, ví dụ từ 1:32 xuống ≤ 1:8) sau 6–12 tháng."
    },
    {
        "lectureId": "04",
        "category": "chan-doan",
        "difficulty": "Khó",
        "slideId": "04-slide-20",
        "slideRef": "Phần Huyết thanh học: Hiện tượng Prozone (Âm tính giả)",
        "question": "Một bệnh nhân có ban sẩn lòng bàn tay, bàn chân rất điển hình của Giang mai thời kỳ II (và đồng nhiễm HIV), nhưng kết quả xét nghiệm RPR định tính ban đầu trả về ÂM TÍNH, trong khi TPHA DƯƠNG TÍNH rất mạnh. Giải thích hợp lý nhất và bước xử trí tiếp theo tại phòng xét nghiệm là:",
        "options": [
            "Kết luận bệnh nhân đã tự khỏi giang mai, không cần điều trị",
            "Đây là Hiện tượng Prozone (Quá thừa kháng thể ngăn cản phản ứng kết bông ở huyết thanh nguyên chất) → Yêu cầu phòng xét nghiệm PHA LOÃNG HUYẾT THANH để làm lại RPR định lượng sẽ thấy dương tính ở hiệu giá rất cao",
            "Đây là hiện tượng cửa sổ huyết thanh giai đoạn săng ngày thứ 2",
            "Do vi khuẩn đã đột biến mất kháng nguyên Cardiolipin"
        ],
        "correctIndex": 1,
        "explanation": "**Hiện tượng Prozone** xảy ra ở khoảng 1–2% bệnh nhân **Giang mai II, phụ nữ mang thai hoặc đồng nhiễm HIV** khi nồng độ kháng thể trong máu quá cao làm bão hòa kháng nguyên trong huyết thanh chưa pha loãng, gây **RPR âm tính giả**. Khi pha loãng huyết thanh (1:16, 1:64, 1:256...) kết quả sẽ chuyển sang dương tính rõ."
    },
    {
        "lectureId": "04",
        "category": "chan-doan",
        "difficulty": "Trung bình",
        "slideId": "04-slide-8",
        "slideRef": "Slide 13 & 14: Cửa sổ huyết thanh Giang mai I",
        "question": "Tại sao một bệnh nhân đến khám chỉ 3–5 ngày sau khi mới xuất hiện Săng giang mai ở quy đầu có thể có kết quả xét nghiệm máu RPR và TPHA đều ÂM TÍNH?",
        "options": [
            "Vì săng ở quy đầu không kích thích hệ miễn dịch tạo kháng thể",
            "Vì bệnh nhân đang trong 'Giai đoạn cửa sổ huyết thanh' (kháng thể thường chỉ xuất hiện 1–4 tuần sau khi có săng); lúc này cần soi kính hiển vi nền đen/PCR tại vết loét hoặc hẹn xét nghiệm lại huyết thanh sau 1–2 tuần",
            "Vì bệnh nhân chắc chắn bị loét hạ cam chứ không phải giang mai",
            "Vì xét nghiệm RPR chỉ dương tính ở Giang mai thời kỳ III"
        ],
        "correctIndex": 1,
        "explanation": "Trong **1–2 tuần đầu tiên sau khi Săng giang mai vừa xuất hiện**, khoảng 20–30% trường hợp xét nghiệm huyết thanh (đặc biệt RPR) chưa kịp dương tính (**Giai đoạn cửa sổ huyết thanh**). Lúc này tiêu chuẩn vàng là tìm trực tiếp xoắn khuẩn bằng **Kính hiển vi nền đen / PCR dịch săng** hoặc làm lại huyết thanh sau 1–2 tuần."
    },
    {
        "lectureId": "04",
        "category": "dieu-tri",
        "difficulty": "Cơ bản",
        "slideId": "04-slide-22",
        "slideRef": "Slide Phác đồ điều trị chuẩn CDC / Bộ Y tế",
        "question": "Phác đồ thuốc ĐẦU TAY chuẩn quốc tế (CDC, WHO, Bộ Y tế) để điều trị Giang mai sớm (bao gồm Giang mai I, Giang mai II và Giang mai kín sớm < 1 năm) ở người lớn không dị ứng Penicillin là:",
        "options": [
            "Benzathine Penicillin G 2,4 triệu đơn vị (UI), tiêm bắp sâu 1 liều duy nhất (thường chia 2 bên mông, mỗi bên 1,2 triệu UI)",
            "Benzathine Penicillin G 2,4 triệu UI tiêm tĩnh mạch nhanh",
            "Uống Amoxicillin 500mg × 2 viên/ngày trong 5 ngày",
            "Uống Ciprofloxacin 500mg liều duy nhất"
        ],
        "correctIndex": 0,
        "explanation": "**Benzathine Penicillin G 2,4 triệu đơn vị tiêm bắp sâu 1 liều duy nhất** là tiêu chuẩn vàng điều trị mọi thể Giang mai sớm (I, II, kín sớm). Lưu ý: **Tuyệt đối chỉ tiêm bắp sâu, KHÔNG ĐƯỢC TIÊM TĨNH MẠCH** Benzathine Penicillin G vì nguy cơ tắc mạch và ngưng tuần hoàn."
    },
    {
        "lectureId": "04",
        "category": "dieu-tri",
        "difficulty": "Khó",
        "slideId": "04-slide-23",
        "slideRef": "Slide Điều trị Giang mai ở Phụ nữ mang thai",
        "question": "Một phụ nữ mang thai tuần thứ 16 được chẩn đoán Giang mai kín sớm nhưng có tiền sử DỊ ỨNG với Penicillin (nổi mày đay). Thái độ xử trí ĐÚNG DUY NHẤT theo khuyến cáo của CDC và Bộ Y tế để vừa chữa khỏi cho mẹ vừa ngăn ngừa Giang mai bẩm sinh cho thai nhi là:",
        "options": [
            "Chuyển sang cho uống Doxycycline 100mg × 2 lần/ngày trong 14 ngày",
            "Chuyển sang uống Erythromycin vì Erythromycin qua nhau thai rất tốt",
            "Nhập viện tiến hành GIẢI MẪN CẢM (Desensitization) với Penicillin theo phác đồ chuẩn, sau đó điều trị bằng Benzathine Penicillin G",
            "Trì hoãn không điều trị gì, đợi sinh con xong mới điều trị"
        ],
        "correctIndex": 2,
        "explanation": "**Penicillin là kháng sinh DUY NHẤT có hiệu quả qua nhau thai để phòng ngừa và điều trị Giang mai bẩm sinh cho thai nhi.** Doxycycline chống chỉ định ở thai phụ (hỏng men răng, xương thai nhi), còn Macrolide (Erythromycin/Azithromycin) không qua nhau thai đủ nồng độ và tỷ lệ kháng thuốc cao. Do đó, thai phụ dị ứng Penicillin **bắt buộc phải giải mẫn cảm rồi tiêm Penicillin**."
    },
    {
        "lectureId": "04",
        "category": "dieu-tri",
        "difficulty": "Trung bình",
        "slideId": "04-slide-24",
        "slideRef": "Slide Phản ứng Jarisch-Herxheimer",
        "question": "Sau khi tiêm liều Benzathine Penicillin G đầu tiên khoảng 4–6 giờ, bệnh nhân Giang mai II đột ngột sốt cao 39°C, ớn lạnh, đau đầu, đau cơ và các nốt đào ban trên da đỏ rực rõ hơn, nhưng huyết áp ổn định và không có khó thở hay phù thanh quản. Hiện tượng này là gì và xử trí ra sao?",
        "options": [
            "Sốc phản vệ với Penicillin → Ngưng vĩnh viễn Penicillin và tiêm Adrenalin",
            "Phản ứng Jarisch-Herxheimer (do xoắn khuẩn bị tiêu diệt hàng loạt giải phóng lipoprotein kích hoạt cytokine) → Trấn an bệnh nhân, cho nghỉ ngơi, bù nước và dùng thuốc hạ sốt giảm đau (Paracetamol/NSAIDs); phản ứng sẽ tự hết sau 24 giờ",
            "Bội nhiễm tụ cầu vàng tại vết tiêm",
            "Biến chứng hoại tử thượng bì nhiễm độc (TEN)"
        ],
        "correctIndex": 1,
        "explanation": "**Phản ứng Jarisch-Herxheimer** là phản ứng sốt cấp tính lành tính xảy ra trong vòng **2–24 giờ đầu** sau liều điều trị giang mai đầu tiên (nhất là Giang mai II có tải lượng xoắn khuẩn cao). Cần phân biệt rõ với dị ứng Penicillin để tránh chẩn đoán nhầm. Lưu ý ở **phụ nữ mang thai nửa sau thai kỳ**, phản ứng này có thể kích thích cơn gò tử cung hoặc suy thai thoáng qua nên cần dặn dò theo dõi sát cử động thai."
    },
    {
        "lectureId": "04",
        "category": "chan-doan",
        "difficulty": "Khó",
        "slideId": "04-slide-16",
        "slideRef": "Slide Giang mai Thần kinh & Giang mai Bẩm sinh",
        "question": "Giang mai thần kinh (Neurosyphilis) và Giang mai mắt / tai có thể xảy ra ở giai đoạn nào của bệnh và được điều trị bằng chế phẩm Penicillin nào?",
        "options": [
            "Chỉ xảy ra duy nhất ở Giang mai thời kỳ III sau 20 năm nhiễm bệnh",
            "Có thể xảy ra ở BẤT KỲ GIAI ĐOẠN NÀO của bệnh (từ giai đoạn sớm I, II đến muộn) và bắt buộc phải điều trị bằng Penicillin G hòa tan (Aqueous Crystalline Penicillin G) truyền tĩnh mạch 18–24 triệu UI/ngày trong 10–14 ngày",
            "Điều trị bằng 1 mũi Benzathine Penicillin G 2,4 triệu UI tiêm bắp vì thuốc này thấm qua hàng rào máu não rất mạnh",
            "Điều trị bằng thuốc bôi Acyclovir tại mắt"
        ],
        "correctIndex": 1,
        "explanation": "Xoắn khuẩn xâm nhập hệ thần kinh trung ương rất sớm. Do **Benzathine Penicillin G tiêm bắp KHÔNG đạt được nồng độ diệt khuẩn trong dịch não tủy**, nên mọi trường hợp **Giang mai thần kinh, Giang mai mắt và Giang mai tai** (có thể gặp ở bất kỳ giai đoạn nào) bắt buộc phải truyền tĩnh mạch **Penicillin G nước (Aqueous Crystalline Penicillin G) 3–4 triệu UI mỗi 4 giờ (18–24 triệu UI/ngày) × 10–14 ngày**."
    },
    {
        "lectureId": "04",
        "category": "ca-lam-sang",
        "difficulty": "Trung bình",
        "slideId": "04-slide-11",
        "slideRef": "Slide Chẩn đoán phân biệt Săng giang mai vs Sùi mào gà vs Herpes",
        "question": "Để phân biệt thương tổn Sẩn phì đại ẩm ướt vùng quanh hậu môn - sinh dục của Giang mai II (Condyloma lata) với Sùi mào gà (Condyloma acuminata do HPV), đặc điểm hình thái quan trọng nhất là:",
        "options": [
            "Condyloma lata là các sẩn mảng dẹt bề mặt phẳng, trơn láng, màu xám nhạt/hồng nhạt, ướt đẫm thanh dịch chứa đầy xoắn khuẩn và chân rộng; còn Sùi mào gà là các u nhú sần sùi có gai nhọn như mào gà hoặc bông súp lơ",
            "Condyloma lata có cuống rất nhỏ và bề mặt khô cứng sừng hóa",
            "Condyloma lata gây đau nhức dữ dội còn Sùi mào gà luôn kèm loét hoại tử",
            "Không thể phân biệt được bằng lâm sàng hay xét nghiệm RPR/TPHA"
        ],
        "correctIndex": 0,
        "explanation": "**Condyloma lata (Sẩn dẹt giang mai II)** có bề mặt **phẳng (flat-topped), ẩm ướt, màu hồng xám, đáy rộng** và xét nghiệm huyết thanh **RPR/TPHA dương tính hiệu giá rất cao**. Ngược lại, **Condyloma acuminata (Sùi mào gà)** có bề mặt **nhú gai sần sùi như súp lơ/mào gà**."
    },

    # =========================================================================
    # CHUYÊN ĐỀ 05: LẬU & VIÊM NIỆU ĐẠO KHÔNG DO LẬU (GU & NGU)
    # =========================================================================
    {
        "lectureId": "05",
        "category": "nhan-biet",
        "difficulty": "Cơ bản",
        "slideId": "05-slide-2",
        "slideRef": "Slide 2 & 3: Tác nhân vi sinh Lậu cầu",
        "question": "Đặc điểm hình thái vi sinh kinh điển của vi khuẩn Lậu (Neisseria gonorrhoeae) trên tiêu bản nhuộm Gram dịch mủ niệu đạo nam giới cấp tính là:",
        "options": [
            "Trực khuẩn Gram dương xếp thành chuỗi dài",
            "Song cầu khuẩn Gram âm (bắt màu đỏ hồng), hình hạt cà phê xếp từng đôi mặt lõm quay vào nhau, nằm BÊN TRÔNG tế bào bạch cầu đa nhân trung tính",
            "Xoắn khuẩn mảnh có 8–14 vòng xoắn đều đặn",
            "Cầu khuẩn Gram dương xếp thành từng đám như chùm nho"
        ],
        "correctIndex": 1,
        "explanation": "Tiêu chuẩn vàng chẩn đoán nhanh tại phòng khám đối với nam giới viêm niệu đạo cấp có mủ: Nhuộm Gram thấy **Song cầu khuẩn Gram âm hình hạt cà phê nằm nội bào trong bạch cầu đa nhân trung tính (PMNs)** có độ nhạy và độ đặc hiệu **> 95%**."
    },
    {
        "lectureId": "05",
        "category": "nhan-biet",
        "difficulty": "Trung bình",
        "slideId": "05-slide-4",
        "slideRef": "Slide 5: Căn nguyên Viêm niệu đạo không do lậu (NGU)",
        "question": "Tác nhân vi sinh hàng đầu và đứng thứ hai gây hội chứng Viêm niệu đạo không do lậu (Non-gonococcal urethritis - NGU) trên toàn cầu là:",
        "options": [
            "Hàng đầu là Chlamydia trachomatis (serovar D–K); đứng thứ hai là Mycoplasma genitalium",
            "Hàng đầu là Treponema pallidum; đứng thứ hai là Haemophilus ducreyi",
            "Hàng đầu là nấm Candida albicans; đứng thứ hai là tụ cầu vàng",
            "Hàng đầu là HPV type 6, 11; đứng thứ hai là Molluscum contagiosum"
        ],
        "correctIndex": 0,
        "explanation": "Trong **NGU**, **Chlamydia trachomatis (type D–K)** là tác nhân phổ biến nhất (chiếm 20–50%), tiếp theo là **Mycoplasma genitalium** (15–25% — đặc biệt hay gặp trong NGU dai dẳng/tái phát), sau đó là *Trichomonas vaginalis*, *Ureaplasma urealyticum*, HSV và Adenovirus."
    },
    {
        "lectureId": "05",
        "category": "chan-doan",
        "difficulty": "Cơ bản",
        "slideId": "05-slide-6",
        "slideRef": "Slide 7–9: So sánh lâm sàng Lậu cấp vs NGU ở nam giới",
        "question": "Khi so sánh triệu chứng lâm sàng điển hình ở nam giới giữa Viêm niệu đạo do Lậu (GU) và Viêm niệu đạo không do Lậu (NGU), nhận định nào sau đây là ĐÚNG?",
        "options": [
            "Lậu có thời gian ủ bệnh rất dài (3–6 tuần) và dịch tiết trong suốt rất ít; còn NGU ủ bệnh 1 ngày và chảy mủ xanh đặc",
            "Lậu cấp có thời gian ủ bệnh ngắn (2–5 ngày), tiểu buốt rát dữ dội ('tiểu ra lưỡi dao cạo') kèm chảy mủ đặc vàng xanh tự nhiên nhiều vào buổi sáng ('Giọt mủ ban mai'); còn NGU ủ bệnh dài hơn (1–3 tuần), dịch tiết nhầy trong hoặc trắng đục lượng ít ('Giọt sương ban mai')",
            "Cả Lậu và NGU ở nam giới luôn kèm loét hoại tử quy đầu",
            "Lậu cầu chỉ gây bệnh ở nữ giới, không gây triệu chứng ở nam giới"
        ],
        "correctIndex": 1,
        "explanation": "Sự tương phản lâm sàng kinh điển: **Lậu cấp (GU)** ủ bệnh ngắn (**2–5 ngày**), khởi phát rầm rộ, tiểu buốt gắt và chảy **mủ đặc vàng/vàng xanh lượng nhiều**. **NGU (Chlamydia)** ủ bệnh dài (**7–21 ngày**), triệu chứng âm ỉ, ngứa nhột niệu đạo và chỉ có **dịch trong/nhầy trắng lượng ít vào sáng sớm trước khi đi tiểu lần đầu**."
    },
    {
        "lectureId": "05",
        "category": "chan-doan",
        "difficulty": "Trung bình",
        "slideId": "05-slide-8",
        "slideRef": "Slide 10–11: Đặc điểm Lậu ở Nữ giới & Vị trí ngoài sinh dục",
        "question": "Tại sao bệnh Lậu và nhiễm Chlamydia ở NỮ GIỚI được xem là 'Kẻ thù thầm lặng' nguy hiểm đối với sức khỏe sinh sản?",
        "options": [
            "Vì 100% phụ nữ mắc lậu sẽ tử vong trong vòng 48 giờ",
            "Vì có tới 50–80% phụ nữ nhiễm Lậu cầu và Chlamydia ở cổ tử cung KHÔNG CÓ TRIỆU CHỨNG hoặc triệu chứng rất mơ hồ, dẫn đến không được điều trị sớm và biến chứng ngược dòng gây Viêm vùng chậu (PID), vô sinh do tắc vòi trứng và thai ngoài tử cung",
            "Vì ở nữ giới kháng sinh hoàn toàn không có tác dụng",
            "Vì lậu ở nữ chỉ gây tổn thương ở da bàn tay"
        ],
        "correctIndex": 1,
        "explanation": "Trái ngược với nam giới (> 90% lậu niệu đạo có triệu chứng), ở **nữ giới trên 50–80% trường hợp nhiễm lậu/Chlamydia cổ tử cung không có triệu chứng đặc hiệu**. Nhiễm trùng âm thầm lan lên tử cung, vòi trứng gây **Viêm vùng chậu (PID), đau vùng chậu mạn, thai ngoài tử cung và vô sinh**."
    },
    {
        "lectureId": "05",
        "category": "chan-doan",
        "difficulty": "Khó",
        "slideId": "05-slide-11",
        "slideRef": "Slide 14–16: Cận lâm sàng Nhuộm Gram vs NAAT vs Nuôi cấy",
        "question": "Đối với bệnh phẩm dịch cổ tử cung ở nữ giới, dịch hầu họng, trực tràng hoặc mẫu nước tiểu đầu dòng ở bệnh nhân không triệu chứng, xét nghiệm nào có độ nhạy và độ đặc hiệu CAO NHẤT (Tiêu chuẩn vàng hiện đại)?",
        "options": [
            "Chỉ nhuộm soi tươi với nước muối sinh lý",
            "Kỹ thuật khuếch đại acid nucleic – NAAT / PCR (Multiplex PCR phát hiện đồng thời N. gonorrhoeae, C. trachomatis, M. genitalium)",
            "Nhuộm Gram đơn thuần dịch hầu họng",
            "Xét nghiệm công thức máu thường quy"
        ],
        "correctIndex": 1,
        "explanation": "Ở cổ tử cung nữ, hầu họng và trực tràng có rất nhiều tạp khuẩn *Neisseria* chí sinh không gây bệnh nên **Nhuộm Gram có độ nhạy thấp (< 50%) và dễ dương tính giả**. Do đó, **NAAT / Realtime PCR** là tiêu chuẩn vàng hiện nay để phát hiện *N. gonorrhoeae*, *C. trachomatis* và *M. genitalium*."
    },
    {
        "lectureId": "05",
        "category": "chan-doan",
        "difficulty": "Trung bình",
        "slideId": "05-slide-12",
        "slideRef": "Slide 16: Tiêu chuẩn vi thể chẩn đoán Viêm niệu đạo",
        "question": "Trên tiêu bản nhuộm Gram dịch quệt niệu đạo nam giới, tiêu chuẩn xác định có tình trạng VIÊM NIỆU ĐẠO nhưng được xếp vào nhóm Không do lậu (NGU) là khi:",
        "options": [
            "Có ≥ 2 đến ≥ 5 bạch cầu đa nhân trung tính (PMNs) trên mỗi vi trường độ phóng đại dầu (×1000) VÀ KHÔNG tìm thấy song cầu khuẩn Gram âm nội bào",
            "Không có bất kỳ bạch cầu nào trên tiêu bản",
            "Thấy hàng trăm song cầu Gram âm nằm trong bạch cầu đa nhân",
            "Thấy sợi tơ nấm có vách ngăn"
        ],
        "correctIndex": 0,
        "explanation": "Tiêu chuẩn chẩn đoán **NGU trên nhuộm Gram dịch niệu đạo**: Có hiện tượng viêm (**≥ 2 PMNs/quang trường dầu ×1000 theo CDC 2021** hoặc ≥ 5 PMNs/quang trường theo tiêu chuẩn cổ điển; hoặc ≥ 10 PMNs trong cặn lắng nước tiểu đầu dòng ×400) **NHƯNG vắng mặt song cầu Gram âm nội bào**."
    },
    {
        "lectureId": "05",
        "category": "dieu-tri",
        "difficulty": "Cơ bản",
        "slideId": "05-slide-14",
        "slideRef": "Slide 19–21: Phác đồ điều trị Lậu không biến chứng (CDC 2021)",
        "question": "Theo Hướng dẫn cập nhật của CDC Hoa Kỳ (2021), phác đồ ĐẦU TAY điều trị Lậu không biến chứng (niệu đạo, cổ tử cung, trực tràng) ở người lớn cân nặng < 150 kg là:",
        "options": [
            "Ciprofloxacin 500mg uống 1 viên duy nhất",
            "Ceftriaxone 500mg tiêm bắp (IM) 1 liều duy nhất (nếu ≥ 150kg dùng 1g IM); kết hợp Doxycycline 100mg uống 2 lần/ngày × 7 ngày nếu CHƯA loại trừ được đồng nhiễm Chlamydia",
            "Penicillin G uống trong 10 ngày",
            "Gentamicin bôi tại chỗ lỗ sáo"
        ],
        "correctIndex": 1,
        "explanation": "Cập nhật cực kỳ quan trọng của **CDC 2021**: Nâng liều **Ceftriaxone từ 250mg lên 500mg tiêm bắp liều duy nhất** (1g nếu bệnh nhân ≥ 150 kg) do xu hướng giảm nhạy cảm kháng sinh, và thay thế Azithromycin 1g bằng **Doxycycline 100mg × 2 lần/ngày × 7 ngày** để điều trị đồng nhiễm *Chlamydia* (vì *Mycoplasma genitalium* và *N. gonorrhoeae* kháng Azithromycin ngày càng tăng)."
    },
    {
        "lectureId": "05",
        "category": "dieu-tri",
        "difficulty": "Trung bình",
        "slideId": "05-slide-15",
        "slideRef": "Slide 22: Điều trị NGU do Chlamydia trachomatis",
        "question": "Thuốc kháng sinh ĐẦU TAY được ưu tiên số 1 hiện nay để điều trị Viêm niệu đạo / Viêm cổ tử cung không do lậu (NGU) do Chlamydia trachomatis ở người không mang thai là:",
        "options": [
            "Doxycycline 100mg uống 2 lần/ngày trong 7 ngày",
            "Metronidazole 2g uống liều duy nhất",
            "Cefixime 400mg uống liều duy nhất",
            "Acyclovir 400mg × 3 lần/ngày"
        ],
        "correctIndex": 0,
        "explanation": "Theo CDC 2021, **Doxycycline 100mg uống 2 lần/ngày × 7 ngày** là phác đồ ưu tiên số 1 cho nhiễm *Chlamydia trachomatis* vì có hiệu quả sạch khuẩn vượt trội hơn hẳn Azithromycin 1g liều duy nhất (đặc biệt ở vị trí trực tràng và hầu họng). Riêng **ở phụ nữ mang thai**, chống chỉ định Doxycycline nên dùng **Azithromycin 1g uống liều duy nhất**."
    },
    {
        "lectureId": "05",
        "category": "dieu-tri",
        "difficulty": "Khó",
        "slideId": "05-slide-16",
        "slideRef": "Slide 23–24: Xử trí NGU dai dẳng / tái phát do Mycoplasma genitalium",
        "question": "Một nam bệnh nhân NGU đã uống tuân thủ đúng 7 ngày Doxycycline 100mg × 2 lần/ngày và kiêng quan hệ tình dục, nhưng sau 2 tuần vẫn còn dịch tiết niệu đạo và tiểu rát. Tác nhân cần nghi ngờ hàng đầu và hướng xử trí tiếp theo là:",
        "options": [
            "Nghi ngờ nhiễm Mycoplasma genitalium kháng thuốc hoặc Trichomonas vaginalis → Cần làm xét nghiệm NAAT tìm M. genitalium và T. vaginalis; nếu do M. genitalium thì điều trị nối tiếp bằng Moxifloxacin 400mg/ngày × 7 ngày (theo phác đồ 2 bước Doxycycline → Moxifloxacin)",
            "Tiếp tục uống lại đúng Doxycycline thêm 1 tháng nữa",
            "Bơm rửa niệu đạo bằng cồn sát khuẩn",
            "Kết luận bệnh nhân chỉ bị tâm lý lo âu, không cần làm gì thêm"
        ],
        "correctIndex": 0,
        "explanation": "Nguyên nhân hàng đầu của **NGU dai dẳng/tái phát** sau khi đã dùng Doxycycline là **Mycoplasma genitalium** (tỷ lệ sạch khuẩn với Doxycycline đơn độc chỉ ~30–40%) hoặc **Trichomonas vaginalis**. Phác đồ chuẩn của CDC cho *M. genitalium* là điều trị nối tiếp: **Doxycycline 100mg × 2 lần/ngày × 7 ngày** (để giảm tải lượng khuẩn) tiếp nối ngay bằng **Moxifloxacin 400mg × 1 lần/ngày × 7 ngày**."
    },
    {
        "lectureId": "05",
        "category": "chan-doan",
        "difficulty": "Khó",
        "slideId": "05-slide-9",
        "slideRef": "Slide 12: Biến chứng Hội chứng Fitz-Hugh-Curtis & DGI",
        "question": "Ở phụ nữ bị nhiễm Lậu cầu hoặc Chlamydia trachomatis lan ngược dòng lên ổ bụng gây viêm bao gan (Perihepatitis) với triệu chứng đau hạ sườn phải giống viêm túi mật cấp và hình ảnh 'dây đàn vĩ cầm' (violin-string adhesions) nối mặt trước gan với thành bụng được gọi là:",
        "options": [
            "Hội chứng Reiter (Viêm khớp phản ứng)",
            "Hội chứng Fitz-Hugh-Curtis",
            "Hội chứng Waterhouse-Friderichsen",
            "Hội chứng Ramsay Hunt"
        ],
        "correctIndex": 1,
        "explanation": "**Hội chứng Fitz-Hugh-Curtis** là biến chứng viêm bao gan (perihepatitis) thứ phát sau Viêm vùng chậu (PID) do *Chlamydia trachomatis* hoặc *Neisseria gonorrhoeae*, gây đau nhói hạ sườn phải lan lên vai phải nhưng nhu mô gan và men gan thường bình thường hoặc tăng rất nhẹ."
    },
    {
        "lectureId": "05",
        "category": "chan-doan",
        "difficulty": "Trung bình",
        "slideId": "05-slide-10",
        "slideRef": "Slide 13: Hội chứng Reiter (Viêm khớp phản ứng)",
        "question": "Tam chứng kinh điển: (1) Viêm niệu đạo không do lậu + (2) Viêm kết mạc mắt + (3) Viêm khớp không đối xứng (kèm dày sừng lậu ở lòng bàn chân và viêm quy đầu vòng) thường gặp ở người mang gen HLA-B27 sau nhiễm Chlamydia được gọi là:",
        "options": [
            "Hội chứng Viêm khớp phản ứng (Hội chứng Reiter: 'Can't see, can't pee, can't climb a tree')",
            "Viêm khớp dạng thấp",
            "Bệnh Gout cấp tính",
            "Hội chứng Behçet"
        ],
        "correctIndex": 0,
        "explanation": "**Hội chứng Reiter (Reactive Arthritis - SARA)** khởi phát 1–4 tuần sau nhiễm *Chlamydia trachomatis* niệu đạo-sinh dục ở cơ địa **HLA-B27 dương tính**, với câu ghi nhớ kinh điển: **'Can't see (Viêm kết mạc), Can't pee (Viêm niệu đạo), Can't climb a tree (Viêm khớp chi dưới)'**."
    },
    {
        "lectureId": "05",
        "category": "dieu-tri",
        "difficulty": "Cơ bản",
        "slideId": "05-slide-17",
        "slideRef": "Slide 25–27: Quản lý bạn tình & Dự phòng tái nhiễm",
        "question": "Trong điều trị bệnh Lậu và Viêm niệu đạo không do lậu (Chlamydia), quy tắc bắt buộc về Quản lý bạn tình (Partner management) và kiêng quan hệ tình dục để ngăn chặn hiệu ứng 'Bóng bàn' (Ping-pong reinfection) là:",
        "options": [
            "Chỉ điều trị cho người có triệu chứng, bạn tình không có triệu chứng thì không cần khám hay uống thuốc",
            "Khám và điều trị đồng thời cho TẤT CẢ bạn tình có quan hệ trong vòng 60 ngày trước khi khởi phát triệu chứng; cả bệnh nhân và bạn tình phải kiêng quan hệ tình dục ít nhất 7 ngày sau khi bắt đầu phác đồ 1 liều hoặc cho đến khi hoàn thành hết đợt thuốc 7 ngày và hết hẳn triệu chứng",
            "Chỉ cần rửa sạch bằng dung dịch vệ sinh là quan hệ lại được ngay trong ngày tiêm thuốc",
            "Chỉ cần xét nghiệm lại sau 5 năm"
        ],
        "correctIndex": 1,
        "explanation": "Nguyên nhân số 1 khiến bệnh nhân bị 'tái phát' Lậu hoặc Chlamydia là **Tái nhiễm từ bạn tình chưa được điều trị**. Bắt buộc điều trị bạn tình trong vòng **60 ngày qua**, kiêng quan hệ tình dục cho đến khi hoàn tất phác đồ **≥ 7 ngày** ở cả hai người, và đồng thời tầm soát luôn **HIV, Giang mai, Viêm gan B/C**."
    },
]
