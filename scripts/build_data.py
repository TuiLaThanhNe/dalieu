import os
import sys
import re
import json
import glob

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

LECTURE_META = {
    "01_Benh_Vay_Nen_Psoriasis.md": {
        "id": "01",
        "slug": "vay-nen",
        "shortTitle": "01. Bệnh Vảy Nến",
        "title": "Bệnh Vảy Nến (Psoriasis Vulgaris)",
        "subtitle": "Sinh bệnh học trục IL-23/Th17, Đa dạng thể lâm sàng, Thang điểm PASI/CASPAR & Chiến lược Thuốc sinh học",
        "author": "ThS.BS Nguyễn Thành Đạt",
        "commentator": "BS.CKII Da liễu (Giảng viên lâm sàng)",
        "department": "Bộ môn Da liễu – ĐH Khoa học Sức khỏe, ĐHQG-HCM",
        "category": "Bệnh Da Viêm - Miễn Dịch",
        "categoryColor": "#0ea5e9",
        "icon": "🔬",
        "pdfFile": "PDF/Vảy nến-BS Đạt.pdf",
        "totalSlides": 44,
        "keyTopics": ["Trục IL-23/Th17/IL-17A", "Nghiệm pháp Brocq & Auspitz", "Hiện tượng Koebner", "Tiêu chuẩn CASPAR", "PASI / BSA / DLQI", "Thuốc sinh học"],
        "defaultIntro": "*\"Chào các em sinh viên Y5 và các bác sĩ đồng nghiệp! Vảy nến là bài giảng nền tảng mở đầu chương trình Da liễu lâm sàng. Nhiều người từng lầm tưởng bệnh da liễu chỉ cần 'thoa kem là khỏi', nhưng bài học này sẽ thay đổi hoàn toàn tư duy đó: các em sẽ thấy sự giao thoa sâu sắc giữa Da liễu, Miễn dịch học phân tử (trục IL-23/Th17), Thấp khớp học và Tim mạch học. Chúng ta sẽ đi từ kỹ năng mô tả tứ chứng kinh điển của mảng vảy nến, nghiệm pháp cạo Brocq, nhận diện các thể cấp cứu đe dọa tính mạng như vảy nến mủ toàn thân von Zumbusch, cho đến kỷ nguyên của các thuốc sinh học nhắm trúng đích giúp bệnh nhân đạt độ sạch da PASI 100!\"*"
    },
    "02_Trung_Doc_Da_Do_Thuoc_SCARs.md": {
        "id": "02",
        "slug": "scars-di-ung-thuoc",
        "shortTitle": "02. Trúng Độc Da Do Thuốc (SCARs)",
        "title": "Trúng Độc Da Do Thuốc & Phản Ứng Da Nặng (SCARs)",
        "subtitle": "SJS/TEN, DRESS/DIHS, AGEP, GBFDE, Phản vệ, Dược lý di truyền HLA & Cấp cứu Da liễu",
        "author": "ThS.BS Nguyễn Thành Đạt",
        "commentator": "BS.CKII Da liễu (Giảng viên lâm sàng)",
        "department": "Bộ môn Da liễu – ĐH Khoa học Sức khỏe, ĐHQG-HCM",
        "category": "Cấp Cứu Da Liễu - Dị Ứng",
        "categoryColor": "#ef4444",
        "icon": "🚨",
        "pdfFile": "PDF/Trúng độc da do thuốc-Y5 - BS Đạt.pdf",
        "totalSlides": 62,
        "keyTopics": ["HLA-B*15:02 & HLA-B*58:01", "Dấu hiệu Cờ đỏ (Red Flags)", "SJS/TEN & SCORTEN", "Hội chứng DRESS & HHV-6", "AGEP & GBFDE", "Phản vệ & Phù mạch"]
    },
    "03_Viem_Da_Co_Dia_Atopic_Dermatitis.md": {
        "id": "03",
        "slug": "viem-da-co-dia",
        "shortTitle": "03. Viêm Da Cơ Địa",
        "title": "Viêm Da Cơ Địa (Atopic Dermatitis)",
        "subtitle": "Đột biến Filaggrin, Loạn khuẩn S. aureus, Miễn dịch 2 pha, Tiêu chuẩn Hanifin-Rajka & Phục hồi hàng rào da",
        "author": "ThS.BS Nguyễn Thành Đạt",
        "commentator": "BS.CKII Da liễu (Giảng viên lâm sàng)",
        "department": "Bộ môn Da liễu – ĐH Khoa học Sức khỏe, ĐHQG-HCM",
        "category": "Bệnh Da Viêm - Miễn Dịch",
        "categoryColor": "#10b981",
        "icon": "🛡️",
        "pdfFile": "PDF/Atopic dermatitis- Y5- BS Đạt.pdf",
        "totalSlides": 78,
        "keyTopics": ["Đột biến gen Filaggrin (FLG)", "3 Giai đoạn lứa tuổi", "Tiêu chuẩn Hanifin & Rajka", "SCORAD / EASI", "Quy tắc dưỡng ẩm 3 phút & FTU", "Dupilumab & JAKi"]
    },
    "04_Benh_Giang_Mai_Syphilis.md": {
        "id": "04",
        "slug": "benh-giang-mai",
        "shortTitle": "04. Bệnh Giang Mai",
        "title": "Bệnh Giang Mai (Syphilis – Treponema pallidum)",
        "subtitle": "Săng giang mai I, Kẻ bắt chước vĩ đại GM II, Biện luận huyết thanh RPR/TPHA, Prozone, Serofast & Benzathine Penicillin G",
        "author": "BS.CKII Nguyễn Thị Thanh Thơ",
        "commentator": "BS.CKII Da liễu & Hoa liễu",
        "department": "BV Da Liễu TP.HCM & Bộ môn Da liễu ĐHQG-HCM",
        "category": "Bệnh Lây Truyền Qua Đường Tình Dục (STIs)",
        "categoryColor": "#8b5cf6",
        "icon": "🧬",
        "pdfFile": "PDF/BENH GIANG MAI Y5 ĐHQG.pdf",
        "totalSlides": 48,
        "keyTopics": ["Treponema pallidum", "Săng Giang mai I", "Đào ban & Viền vảy Biett", "Condyloma lata", "RPR/VDRL vs TPHA/TPPA", "Hiện tượng Prozone & Serofast", "Benzathine Penicillin G"]
    },
    "05_Lau_Va_Viem_Nieu_Dao_Khong_Do_Lau.md": {
        "id": "05",
        "slug": "lau-va-ngu",
        "shortTitle": "05. Lậu & Viêm Niệu Đạo (GU & NGU)",
        "title": "Lậu & Viêm Niệu Đạo Không Do Lậu (GU & NGU)",
        "subtitle": "Neisseria gonorrhoeae, Chlamydia trachomatis, Mycoplasma genitalium kháng thuốc & Phác đồ chuẩn CDC 2021",
        "author": "TS.BS Phạm Văn Bắc – ThS.BS Nguyễn Thành Đạt",
        "commentator": "BS.CKII Da liễu & Hoa liễu",
        "department": "Bộ môn Da liễu – ĐH Khoa học Sức khỏe, ĐHQG-HCM",
        "category": "Bệnh Lây Truyền Qua Đường Tình Dục (STIs)",
        "categoryColor": "#f59e0b",
        "icon": "🦠",
        "pdfFile": "PDF/Lậu và viêm niệu đạo không do lậu -Y5UHS-BS Đạt(1).pdf",
        "totalSlides": 27,
        "keyTopics": ["Song cầu Gram âm nội bào", "Chlamydia (Chu kỳ EB-RB)", "Mycoplasma genitalium", "Ceftriaxone 500mg IM", "Doxycycline 100mg x 7 ngày", "Chiến lược bạn tình 60 ngày"]
    },
    "06_Sui_Mao_Ga_HPV.md": {
        "id": "06",
        "slug": "sui-mao-ga-hpv",
        "shortTitle": "06. Sùi Mào Gà (HPV)",
        "title": "Sùi Mào Gà (Condylomata Acuminata / HPV)",
        "subtitle": "Cơ chế sinh ung E6/E7, Nghệ thuật chẩn đoán phân biệt 7 thực thể (PPP, Gai âm hộ, Condyloma lata) & Vaccine Gardasil 9",
        "author": "ThS.BS Phạm Thị Uyển Nhi",
        "commentator": "BS.CKII Da liễu & Hoa liễu",
        "department": "Bệnh viện Da Liễu TP.HCM & ĐHQG-HCM",
        "category": "Bệnh Lây Truyền Qua Đường Tình Dục (STIs)",
        "categoryColor": "#ec4899",
        "icon": "🎗️",
        "pdfFile": "PDF/Sui mao ga.pdf",
        "totalSlides": 45,
        "keyTopics": ["HPV 6, 11 vs HPV 16, 18", "Oncoprotein E6 (p53) & E7 (pRb)", "7 Chẩn đoán phân biệt", "Sẩn hạt ngọc & Gai âm hộ", "TCA 80-90% / Imiquimod / Áp lạnh", "Vaccine Gardasil 9"]
    },
    "07_May_Day_Urticaria.md": {
        "id": "07",
        "slug": "may-day-phu-mach",
        "shortTitle": "07. Mày Đay & Phù Mạch",
        "title": "Mày Đay & Phù Mạch (Urticaria & Angioedema)",
        "subtitle": "Cơ chế tự dị ứng Type I vs Tự miễn Type IIb, Thang điểm UAS7/UCT & Phác đồ bậc thang EAACI/GA²LEN 2022",
        "author": "BS.CKII Nguyễn Vũ Hoàng",
        "commentator": "BS.CKII Da liễu (Giảng viên lâm sàng)",
        "department": "Bệnh viện Da Liễu TP.HCM & ĐHQG-HCM",
        "category": "Cấp Cứu Da Liễu - Dị Ứng",
        "categoryColor": "#06b6d4",
        "icon": "⚡",
        "pdfFile": "PDF/Me day  2.10.2025.pdf",
        "totalSlides": 38,
        "keyTopics": ["Dưỡng bào (Mast cell) & Histamine", "Sẩn phù (Wheal) vs Phù mạch", "Mày đay cấp vs Mạn tính (6 tuần)", "Tự dị ứng Type I vs Tự miễn IIb", "Thang điểm UAS7 & UCT", "sgAH1 liều gấp 4 & Omalizumab"]
    },
    "08_Benh_Vi_Nam_Can_Dermatophytosis.md": {
        "id": "08",
        "slug": "benh-vi-nam-can",
        "shortTitle": "08. Bệnh Vi Nấm Cạn",
        "title": "Bệnh Vi Nấm Cạn (Dermatophytosis, Candida, Malassezia)",
        "subtitle": "Vi nấm sợi tơ ưa keratin, Nấm men Candida, Lang ben, Kỹ thuật soi tươi KOH, Bẫy Tinea incognito & Thuốc kháng nấm",
        "author": "BS Thảo Vũ",
        "commentator": "BS.CKII Da liễu (Giảng viên lâm sàng)",
        "department": "Bộ môn Da liễu – ĐH Khoa học Sức khỏe, ĐHQG-HCM",
        "category": "Bệnh Nhiễm Trùng - Ký Sinh Trùng",
        "categoryColor": "#84cc16",
        "icon": "🍄",
        "pdfFile": "PDF/Bệnh vi nấm cạn - BS Thảo Vũ.pdf",
        "totalSlides": 39,
        "keyTopics": ["Dermatophytes / Candida / Malassezia", "Bờ đa cung tiến triển ly tâm", "Tinea incognito (Bẫy Corticoid)", "Kerion de Celse", "Soi tươi KOH 10-20%", "Terbinafine vs Itraconazole"]
    },
    "09_Mun_Trung_Ca_Acne_Vulgaris.md": {
        "id": "09",
        "slug": "mun-trung-ca",
        "shortTitle": "09. Mụn Trứng Cá (Acne Vulgaris)",
        "title": "Mụn Trứng Cá (Acne Vulgaris)",
        "subtitle": "4 Cơ chế bệnh sinh phân tử, Phân độ lâm sàng, Trứng cá tối cấp, Phác đồ Retinoids/BPO/Isotretinoin & Dự phòng sẹo",
        "author": "BS Tâm Anh",
        "commentator": "BS.CKII Da liễu (Giảng viên lâm sàng)",
        "department": "Bộ môn Da liễu – ĐH Khoa học Sức khỏe, ĐHQG-HCM",
        "category": "Bệnh Phần Phụ Của Da",
        "categoryColor": "#f97316",
        "icon": "✨",
        "pdfFile": "PDF/Mụn-trứng-cá-Y5UHS-BS-Tâm-Anh.pdf",
        "totalSlides": 30,
        "keyTopics": ["4 Cơ chế bệnh sinh cốt lõi", "Comedones (Đầu đen & Đầu trắng)", "Trứng cá tối cấp (Acne Fulminans)", "Chẩn đoán phân biệt Rosacea", "Retinoids + BPO + Kháng sinh", "Isotretinoin & Chống quái thai"]
    }
}

FALLBACK_IMAGE_MAP = {
    "assets/di_ung_thuoc/slide_32_img_4.jpeg": "assets/di_ung_thuoc/slide_32_img_5.jpeg",
    "assets/giang_mai/slide_2_img_1.jpeg": "assets/giang_mai/slide_2_img_3.png",
    "assets/giang_mai/slide_9_img_4.jpeg": "assets/giang_mai/slide_9_img_7.png",
    "assets/giang_mai/slide_9_img_5.jpeg": "assets/giang_mai/slide_9_img_8.jpeg",
    "assets/giang_mai/slide_33_img_2.jpeg": "assets/giang_mai/slide_33_img_4.jpeg",
    "assets/giang_mai/slide_37_img_1.jpeg": "assets/giang_mai/slide_37_img_7.jpeg",
    "assets/giang_mai/slide_37_img_2.jpeg": "assets/giang_mai/slide_37_img_8.jpeg",
    "assets/giang_mai/slide_39_img_2.jpeg": "assets/giang_mai/slide_39_img_5.jpeg",
    "assets/giang_mai/slide_40_img_2.jpeg": "assets/giang_mai/slide_40_img_5.jpeg",
    "assets/giang_mai/slide_40_img_3.jpeg": "assets/giang_mai/slide_40_img_6.jpeg",
    "assets/sui_mao_ga/slide_8_img_1.png": "assets/sui_mao_ga/slide_9_img_1.jpeg",
    "assets/sui_mao_ga/slide_19_img_1.jpeg": "assets/sui_mao_ga/slide_20_img_1.jpeg",
    "assets/sui_mao_ga/slide_25_img_1.jpeg": "assets/sui_mao_ga/slide_26_img_1.jpeg",
    "assets/sui_mao_ga/slide_27_img_1.jpeg": "assets/sui_mao_ga/slide_28_img_1.jpeg",
    "assets/sui_mao_ga/slide_35_img_1.png": "assets/sui_mao_ga/slide_33_img_1.png",
    "assets/mun_trung_ca/slide_27_img_1.png": "assets/mun_trung_ca/slide_28_img_1.png"
}

def load_packed_atlas_keys():
    keys = set()
    for p in sorted(glob.glob("markdown/atlas_pack_*.js")):
        try:
            with open(p, "r", encoding="utf-8") as fp:
                txt = fp.read()
            for m in re.finditer(r'"(markdown/assets/[^"]+)"\s*:', txt):
                keys.add(m.group(1))
        except Exception:
            pass
    return keys

PACKED_ATLAS_KEYS = load_packed_atlas_keys()

def asset_exists(rel_with_markdown):
    if rel_with_markdown in PACKED_ATLAS_KEYS:
        return True
    return os.path.exists(rel_with_markdown)

def resolve_asset_rel_path(rel_path):
    rel_clean = rel_path.strip()
    if rel_clean.startswith("markdown/"):
        rel_clean = rel_clean[len("markdown/"):]
    if rel_clean in FALLBACK_IMAGE_MAP:
        rel_clean = FALLBACK_IMAGE_MAP[rel_clean]
    cand = "markdown/" + rel_clean
    if asset_exists(cand):
        return cand
    # Try swapping .jpeg <-> .png
    base_no_ext, ext = os.path.splitext(rel_clean)
    alt_ext = ".png" if ext.lower() in [".jpg", ".jpeg"] else ".jpeg"
    alt_cand = "markdown/" + base_no_ext + alt_ext
    if asset_exists(alt_cand):
        return alt_cand
    return cand

def fix_asset_paths(md_text):
    def repl(match):
        alt = match.group(1)
        rel = match.group(2)
        resolved = resolve_asset_rel_path(rel)
        return f"![{alt}]({resolved})"
    return re.sub(r'\!\[([^\]]*)\]\(([^)]+)\)', repl, md_text)

def extract_images(md_text):
    imgs = []
    for m in re.finditer(r'\!\[([^\]]*)\]\(([^)]+)\)', md_text):
        alt = m.group(1).strip() or "Hình ảnh lâm sàng"
        src = m.group(2).strip()
        imgs.append({"alt": alt, "src": src})
    return imgs

def extract_alerts(md_text):
    alerts = []
    lines = md_text.splitlines()
    i = 0
    while i < len(lines):
        m = re.match(r'^\s*>\s*\[!(TIP|WARNING|IMPORTANT|CAUTION|NOTE)\]\s*(.*)', lines[i], re.I)
        if m:
            atype = m.group(1).upper()
            first_line = m.group(2).strip()
            body_lines = [first_line] if first_line else []
            i += 1
            while i < len(lines) and re.match(r'^\s*>', lines[i]):
                clean_line = re.sub(r'^\s*>\s?', '', lines[i])
                body_lines.append(clean_line)
                i += 1
            alerts.append({
                "type": atype,
                "content": "\n".join(body_lines).strip()
            })
        else:
            i += 1
    return alerts

def build_dr_fox_speech(slide_title, slide_orig, clinical_exp, alerts, part_title):
    text_upper = (slide_title + " " + clinical_exp).upper()
    mood = "teaching"
    if any(w in text_upper for w in ["CẤM KỴ", "NGUY KỊCH", "CỜ ĐỎ", "RED FLAGS", "TỬ VONG", "CHỐNG CHỈ ĐỊNH", "CẤP CỨU", "THẢM HỌA", "PHẢN VỆ"]):
        mood = "warning"
    elif alerts or any(w in text_upper for w in ["KINH NGHIỆM LÂM SÀNG", "CLINICAL PEARL", "NGUYÊN LÝ", "MẸO", "ĐẶC HIỆU", "TIÊU CHUẨN VÀNG"]):
        mood = "tip"
    elif any(w in text_upper for w in ["CHẨN ĐOÁN PHÂN BIỆT", "SO SÁNH", "CÂU HỎI", "TÌNH HUỐNG", "CẠM BẪY", "BẪY"]):
        mood = "thinking"
    elif any(w in text_upper for w in ["KẾT THÚC", "CẢM ƠN", "HOÀN TOÀN", "PASI 100", "LỜI CẢM ƠN"]):
        mood = "cheering"

    highlights = []
    for line in (clinical_exp or slide_orig).splitlines():
        clean = line.strip()
        if clean.startswith(("-", "*")) and len(clean) > 25:
            clean_bullet = re.sub(r'^[-*]\s+', '', clean)
            if "**" in clean_bullet:
                highlights.append(clean_bullet)
        if len(highlights) >= 3:
            break
    if not highlights:
        for line in (slide_orig or clinical_exp).splitlines():
            clean = line.strip()
            if clean.startswith(("-", "*", "1.", "2.")) and len(clean) > 15:
                highlights.append(re.sub(r'^([-*]|\d+\.)\s+', '', clean))
            if len(highlights) >= 2:
                break

    greeting_map = {
        "teaching": "🦊 **Bác sĩ Cáo giảng bài:** Ở slide này, chúng ta cùng nắm vững cấu trúc cốt lõi và bản chất bệnh sinh nhé!",
        "tip": "🦊 **Mẹo Lâm Sàng từ Bác sĩ Cáo:** Đây là chi tiết 'ăn điểm' cực kỳ quan trọng khi đi buồng bệnh và thi lâm sàng đó nha!",
        "warning": "🦊 **Cảnh báo Đỏ từ Bác sĩ Cáo:** Tuyệt đối lưu tâm! Sai lầm ở bước này trên lâm sàng có thể gây nguy hiểm trực tiếp cho bệnh nhân!",
        "thinking": "🦊 **Bác sĩ Cáo đặt vấn đề:** Cùng suy luận thật sắc bén nhé, rất nhiều bác sĩ trẻ bị nhầm lẫn ở điểm phân biệt này đấy!",
        "cheering": "🦊 **Bác sĩ Cáo vỗ tay:** Tuyệt vời lắm! Bạn đang tiến bộ vượt bậc trên hành trình làm chủ lâm sàng Da liễu!"
    }

    return {
        "mood": mood,
        "greeting": greeting_map[mood],
        "keyPoints": highlights[:3]
    }

def build_flashcards_for_lecture(meta, slides, golden_list, mini_cases):
    cards = []
    lec_id = meta["id"]
    lec_short = meta["shortTitle"]

    # 1. All 10 Golden Principles -> High-yield Golden Flashcards
    for gp in golden_list:
        cards.append({
            "id": f"fc-{lec_id}-golden-{gp['number']}",
            "lectureId": lec_id,
            "lectureTitle": lec_short,
            "category": "golden",
            "categoryLabel": "🌟 Nguyên lý Vàng Lâm Sàng",
            "badge": f"Nguyên lý #{gp['number']}",
            "frontTitle": f"{gp['title']}",
            "frontPrompt": f"Trong **{meta['title']}**, nguyên lý lâm sàng cốt lõi về **\"{gp['title']}\"** được BSCKII đúc kết như thế nào?",
            "frontImage": None,
            "backTitle": f"Nguyên lý #{gp['number']}: {gp['title']}",
            "backContent": gp["content"],
            "slideRef": "Tổng kết 10 Nguyên lý Vàng"
        })

    # 2. Visual Diagnosis Flashcards & Clinical Pearl Flashcards from Slides
    visual_count = 0
    pearl_count = 0
    for s in slides:
        # Check if this slide has clinical alerts ([!TIP], [!WARNING], [!IMPORTANT], [!CAUTION])
        for al in s["alerts"]:
            if len(al["content"]) > 30 and pearl_count < 8:
                pearl_count += 1
                cards.append({
                    "id": f"fc-{lec_id}-pearl-{pearl_count}",
                    "lectureId": lec_id,
                    "lectureTitle": lec_short,
                    "category": "pearl",
                    "categoryLabel": "💡 Kinh nghiệm & Cảnh báo Đỏ",
                    "badge": f"{al['type']} • {s['slideLabel']}",
                    "frontTitle": s["title"],
                    "frontPrompt": f"Điểm lưu ý lâm sàng đặc biệt (**{al['type']}**) tại **{s['title']}** là gì?",
                    "frontImage": s["images"][0]["src"] if s["images"] else None,
                    "backTitle": f"Kinh nghiệm BSCKII ({s['slideLabel']})",
                    "backContent": al["content"],
                    "slideId": s["id"],
                    "slideRef": s["slideLabel"]
                })

        # Check if this slide has clinical images and substantial explanation
        source_md = s["clinicalExplanationMarkdown"] or s["slideOriginalMarkdown"] or s["rawMarkdown"]
        if s["images"] and len(source_md) > 100 and visual_count < 12:
            # Skip title slide 1
            if s["index"] == 1:
                continue
            visual_count += 1
            img_obj = s["images"][0]
            exp_lines = [
                ln.strip() for ln in source_md.splitlines()
                if ln.strip() and not ln.strip().startswith("#") and not ln.strip().startswith("> [!") and not ln.strip().startswith("![")
            ]
            back_summary = "\n".join(exp_lines[:6])
            cards.append({
                "id": f"fc-{lec_id}-visual-{visual_count}",
                "lectureId": lec_id,
                "lectureTitle": lec_short,
                "category": "visual",
                "categoryLabel": "📸 Nhận diện Hình thái Lâm sàng",
                "badge": f"Hình thái • {s['slideLabel']}",
                "frontTitle": f"Quan sát hình ảnh ({s['slideLabel']})",
                "frontPrompt": f"**{img_obj['alt']}** — Hãy phân tích đặc điểm thương tổn, cơ chế hoặc ý nghĩa chẩn đoán trên hình ảnh này?",
                "frontImage": img_obj["src"],
                "backTitle": s["title"],
                "backContent": back_summary,
                "slideId": s["id"],
                "slideRef": s["slideLabel"]
            })

    # 3. Clinical Mini-Case Flashcards
    for idx, mc in enumerate(mini_cases):
        cards.append({
            "id": f"fc-{lec_id}-case-{idx+1}",
            "lectureId": lec_id,
            "lectureTitle": lec_short,
            "category": "case",
            "categoryLabel": "🩺 Tình huống Lâm sàng Thực chiến",
            "badge": f"Ca lâm sàng #{idx+1}",
            "frontTitle": mc["title"],
            "frontPrompt": mc["scenarioMarkdown"],
            "frontImage": None,
            "backTitle": f"Phân tích & Xử trí của BSCKII ({mc['title']})",
            "backContent": mc["analysisMarkdown"],
            "slideRef": f"Mini-Case #{idx+1}"
        })

    return cards

def parse_lecture(filepath, raw_text_override=None):
    fname = os.path.basename(filepath)
    meta = LECTURE_META[fname].copy()
    if raw_text_override is not None:
        raw_text = raw_text_override
    else:
        with open(filepath, 'r', encoding='utf-8') as fp:
            raw_text = fp.read()

    normalized_text = fix_asset_paths(raw_text)
    all_images = extract_images(normalized_text)
    meta["imageCount"] = len(all_images)

    intro_match = re.search(
        r'##\s+LỜI MỞ ĐẦU CỦA GIẢNG VIÊN LÂM SÀNG[^\n]*\n+(.*?)(?=\n---\n|\n##\s+)',
        normalized_text, re.S | re.I
    )
    intro_quote = ""
    if intro_match:
        intro_quote = intro_match.group(1).strip()
        intro_quote = re.sub(r'^\s*>\s?', '', intro_quote, flags=re.M).strip()
    elif "defaultIntro" in meta:
        intro_quote = meta.pop("defaultIntro")

    lines = normalized_text.splitlines()
    current_part = "Phần Mở Đầu"
    slides = []
    golden_principles_raw = []
    mini_cases_raw = []

    mode = "slides"
    current_slide = None

    def flush_slide(s):
        if not s:
            return
        body = "\n".join(s["lines"]).strip()
        body = re.sub(r'(\n---\s*)+$', '', body).strip()
        
        orig_md = ""
        exp_md = ""
        m_split = re.split(
            r'^#{3,4}\s+([1-9])\.\s+([^\n]+)\n',
            body, flags=re.M
        )
        pre_content = m_split[0].strip()
        pre_non_img = "\n".join([
            ln for ln in pre_content.splitlines()
            if not re.match(r'^\s*\!\[[^\]]*\]\([^)]+\)\s*$', ln)
        ]).strip()

        if len(m_split) >= 4:
            sections = []
            idx = 1
            while idx + 2 < len(m_split):
                sec_num = m_split[idx]
                sec_title = m_split[idx+1].strip()
                sec_body = m_split[idx+2].strip()
                sections.append((sec_num, sec_title, sec_body))
                idx += 3

            if len(sections) == 1:
                # Single numbered section (e.g. "1. Phân tích chi tiết của BSCKII:")
                s_num, s_title, s_body = sections[0]
                if "BSCKII" in s_title.upper() or "PHÂN TÍCH" in s_title.upper() or "GIẢNG GIẢI" in s_title.upper():
                    orig_md = pre_non_img if pre_non_img else f"**{s_title}**"
                    exp_md = f"#### {s_title}\n\n{s_body}"
                else:
                    orig_md = (pre_non_img + "\n\n" if pre_non_img else "") + f"#### {s_title}\n\n{s_body}"
                    exp_md = ""
            else:
                # Multiple sections: 1 is Slide content, 2+ are Clinical Explanation
                s1_title, s1_body = sections[0][1], sections[0][2]
                orig_md = (pre_non_img + "\n\n" + s1_body).strip() if pre_non_img else s1_body
                exp_parts = []
                for _, st, sb in sections[1:]:
                    if not re.match(r'^(Giảng giải|Phân tích).*BSCKII', st, re.I):
                        exp_parts.append(f"#### {st}\n\n{sb}")
                    else:
                        exp_parts.append(sb)
                exp_md = "\n\n".join(exp_parts).strip()
        else:
            orig_md = pre_non_img
            exp_md = ""

        s_imgs = extract_images(body)
        s_alerts = extract_alerts(body)
        fox = build_dr_fox_speech(s["title"], orig_md, exp_md, s_alerts, s["partTitle"])

        m_num = re.search(r'SLIDE\s+([0-9]+(?:\s*(?:[-–,&]|ĐẾN)\s*[0-9]+)*)', s["title"], re.I)
        slide_label = f"Slide {m_num.group(1)}" if m_num else "Chuyên đề"

        slides.append({
            "id": f"{meta['id']}-slide-{len(slides)+1}",
            "index": len(slides) + 1,
            "partTitle": s["partTitle"],
            "title": s["title"],
            "slideLabel": slide_label,
            "images": s_imgs,
            "slideOriginalMarkdown": orig_md,
            "clinicalExplanationMarkdown": exp_md,
            "rawMarkdown": body,
            "alerts": s_alerts,
            "drFox": fox
        })

    for line in lines:
        if re.match(r'^#{2,3}\s+.*10 NGUYÊN LÝ\s+"?VÀNG"?', line, re.I):
            flush_slide(current_slide)
            current_slide = None
            mode = "golden"
            continue

        if re.match(r'^#{2,3}\s+.*(TÌNH HUỐNG.*THỰC TẾ|MINI-CASES|BỘ CÂU HỎI LƯỢNG GIÁ)', line, re.I):
            flush_slide(current_slide)
            current_slide = None
            mode = "cases"
            continue

        if re.match(r'^#{1,2}\s+PHẦN\s+(MỞ ĐẦU|[0-9IVX]+)\b', line, re.I):
            flush_slide(current_slide)
            current_slide = None
            current_part = re.sub(r'^#{1,2}\s+', '', line).strip()
            mode = "slides"
            continue

        if re.match(r'^#{2}\s+PHẦN\s+(III:\s+TỔNG KẾT|MỞ RỘNG ĐÀO TẠO)', line, re.I):
            flush_slide(current_slide)
            current_slide = None
            continue

        if mode == "slides":
            is_slide_hdr = False
            if re.match(r'^#{2,3}\s+SLIDE\s+', line, re.I):
                is_slide_hdr = True
            elif re.match(r'^#{3}\s+[1-7]\.\s+.*\(SLIDE\s+', line, re.I):
                is_slide_hdr = True
            elif fname == "04_Benh_Giang_Mai_Syphilis.md" and re.match(r'^##\s+[1-4]\.\s+(HAI NHÓM|SO SÁNH|GIẢI MÃ|HAI THUẬT TOÁN)', line, re.I):
                is_slide_hdr = True
            elif fname == "02_Trung_Doc_Da_Do_Thuoc_SCARs.md" and re.match(r'^##\s+TỔNG KẾT BÀI GIẢNG:\s+BẢNG SO SÁNH', line, re.I):
                is_slide_hdr = True

            if is_slide_hdr:
                flush_slide(current_slide)
                clean_title = re.sub(r'^#{2,3}\s+', '', line).strip()
                current_slide = {
                    "partTitle": current_part,
                    "title": clean_title,
                    "lines": []
                }
            else:
                if current_slide is not None:
                    current_slide["lines"].append(line)

        elif mode == "golden":
            golden_principles_raw.append(line)

        elif mode == "cases":
            mini_cases_raw.append(line)

    flush_slide(current_slide)

    gp_text = "\n".join(golden_principles_raw).strip()
    gp_text = re.sub(r'(\n---\s*)+$', '', gp_text).strip()
    golden_list = []
    for m in re.finditer(r'(?:^|\n)\s*>?\s*([0-9]{1,2})\.\s+\*\*([^*]+)\*\*[:\s]*(.*?)(?=(?:\n\s*>?\s*[0-9]{1,2}\.\s+\*\*)|\Z)', gp_text, re.S):
        num = int(m.group(1))
        gtitle = m.group(2).strip().rstrip(':')
        gbody = re.sub(r'\n\s*>\s?', ' ', m.group(3)).strip()
        golden_list.append({
            "number": num,
            "title": gtitle,
            "content": gbody
        })

    cases_text = "\n".join(mini_cases_raw).strip()
    cases_text = re.sub(r'\n\*\(Hết giáo trình.*?\)\*\s*$', '', cases_text, flags=re.S).strip()
    cases_text = re.sub(r'(\n---\s*)+$', '', cases_text).strip()
    case_splits = re.split(r'^#{3,4}\s+(Tình huống lâm sàng\s+[0-9]+[^\n]*)\n', cases_text, flags=re.M | re.I)
    mini_cases = []
    if len(case_splits) >= 3:
        idx = 1
        while idx + 1 < len(case_splits):
            ctitle = case_splits[idx].strip().rstrip(':')
            cbody = case_splits[idx+1].strip()
            cbody = re.sub(r'(\n---\s*)+$', '', cbody).strip()
            clean_cbody = re.sub(r'^\s*>\s?', '', cbody, flags=re.M).strip()
            parts_ca = re.split(r'\*\*Phân tích\s*&\s*Hướng dẫn xử trí[^*]*\*\*[:\s]*', clean_cbody, flags=re.I)
            scenario_md = parts_ca[0].strip()
            analysis_md = parts_ca[1].strip() if len(parts_ca) > 1 else ""

            mini_cases.append({
                "id": f"{meta['id']}-case-{len(mini_cases)+1}",
                "title": ctitle,
                "scenarioMarkdown": scenario_md,
                "analysisMarkdown": analysis_md
            })
            idx += 2

    flashcards = build_flashcards_for_lecture(meta, slides, golden_list, mini_cases)

    return {
        **meta,
        "introQuote": intro_quote,
        "slides": slides,
        "goldenPrinciples": golden_list,
        "miniCases": mini_cases,
        "flashcards": flashcards,
        "allImages": all_images,
        "fullMarkdown": normalized_text
    }

def load_lecture_sources():
    indiv_files = sorted(glob.glob("markdown/[0-9][0-9]_*.md"))
    if indiv_files:
        return [(f, None) for f in indiv_files]
    combined_path = os.path.join("markdown", "GIAO_TRINH_TOAN_TAP.md")
    if os.path.exists(combined_path):
        with open(combined_path, "r", encoding="utf-8") as fp:
            full_txt = fp.read()
        splits = re.split(r'<!--\s*===\s*VIRTUAL_FILE:\s*([^\s=]+)\s*===\s*-->', full_txt)
        sources = []
        idx = 1
        while idx + 1 < len(splits):
            vname = splits[idx].strip()
            vbody = splits[idx + 1].strip()
            if vname in LECTURE_META:
                sources.append((os.path.join("markdown", vname), vbody))
            idx += 2
        return sources
    return []

def main():
    os.makedirs("js", exist_ok=True)
    sources = load_lecture_sources()
    lectures = []
    total_slides = 0
    total_fc = 0
    total_imgs = 0
    missing_imgs = 0

    for f, raw_override in sources:
        data = parse_lecture(f, raw_override)
        lectures.append(data)
        total_slides += len(data["slides"])
        total_fc += len(data["flashcards"])
        total_imgs += len(data["allImages"])
        for im in data["allImages"]:
            if not asset_exists(im["src"]):
                missing_imgs += 1
                print("  STILL MISSING:", im["src"])
        print(f"[{data['id']}] {data['shortTitle']}: {len(data['slides'])} units | {len(data['goldenPrinciples'])} golden | {len(data['miniCases'])} cases | {len(data['flashcards'])} flashcards | {len(data['allImages'])} imgs")

    bundle = {
        "generatedAt": "2026-11-06",
        "courseTitle": "BỘ GIÁO TRÌNH LÂM SÀNG DA LIỄU TOÀN DIỆN (Y5 & SAU ĐẠI HỌC)",
        "institution": "Bộ môn Da liễu – Đại học Khoa học Sức khỏe, ĐHQG-HCM & Bệnh viện Da Liễu TP.HCM",
        "stats": {
            "totalLectures": len(lectures),
            "totalOriginalSlides": 411,
            "totalTeachingUnits": total_slides,
            "totalFlashcards": total_fc,
            "totalGoldenPrinciples": len(lectures) * 10,
            "totalMiniCases": len(lectures) * 3,
            "totalClinicalImages": total_imgs
        },
        "lectures": lectures
    }

    js_path = os.path.join("js", "lectures-data.js")
    with open(js_path, "w", encoding="utf-8") as out:
        out.write("// AUTO-GENERATED BY scripts/build_data.py - DO NOT EDIT MANUALLY\n")
        out.write("window.DALIEU_DATA = ")
        json.dump(bundle, out, ensure_ascii=False, indent=2)
        out.write(";\n")

    print(f"\nSUCCESS! Wrote {js_path} ({os.path.getsize(js_path)/1024:.1f} KB)")
    print(f"Total Teaching Units: {total_slides} | Total Flashcards: {total_fc} | Total Verified Images: {total_imgs} (Missing: {missing_imgs})")

if __name__ == "__main__":
    main()
