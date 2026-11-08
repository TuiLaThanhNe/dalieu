# -*- coding: utf-8 -*-
"""
DALIEU-EDU: PHASE 2 QUESTION BANK COMPILER (scripts/build_quiz_bank.py)
Generates js/quiz-data.js containing 270 high-yield clinical MCQs across all 9 lectures:
  - 108 Curated Expert Board MCQs (12 per lecture)
  - 90 Golden Principle Clinical Application MCQs (10 per lecture)
  - 27 Clinical Vignette Mini-Case MCQs (3 per lecture)
  - 45 Visual Clinical Image Diagnosis MCQs (5 per lecture)
"""

import json
import os
import re
import sys

sys.dont_write_bytecode = True
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from quiz_curated_part1 import CURATED_PART1
from quiz_curated_part2 import CURATED_PART2


ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LECTURES_JS_PATH = os.path.join(ROOT_DIR, "js", "lectures-data.js")
OUTPUT_QUIZ_JS_PATH = os.path.join(ROOT_DIR, "js", "quiz-data.js")


def load_lectures_data():
    with open(LECTURES_JS_PATH, "r", encoding="utf-8") as f:
        text = f.read()
    prefix = "window.DALIEU_DATA = "
    idx = text.find(prefix)
    if idx == -1:
        raise RuntimeError("Could not parse window.DALIEU_DATA from js/lectures-data.js")
    json_str = text[idx + len(prefix) :].rstrip(";\n\r\t ")
    return json.loads(json_str)


def strip_md(s):
    s = re.sub(r"\*\*([^*]+)\*\*", r"\1", str(s or ""))
    s = re.sub(r"\*([^*]+)\*", r"\1", s)
    s = re.sub(r"`([^`]+)`", r"\1", s)
    return s.strip()


def first_sentences(text, max_chars=240):
    clean = strip_md(text)
    clean = re.sub(r"\s+", " ", clean).strip()
    if len(clean) <= max_chars:
        return clean
    cut = clean[:max_chars]
    last_dot = max(cut.rfind(". "), cut.rfind("; "), cut.rfind(", "))
    if last_dot > 90:
        return cut[: last_dot + 1]
    return cut + "..."


GOLDEN_DISTRACTORS_BY_LECTURE = {
    "01": [
        "Sử dụng Corticosteroid đường uống (Prednisolone, Dexamethasone) hoặc tiêm K-cort thường quy làm phác đồ đầu tay cho mọi thể vảy nến mảng.",
        "Bắt buộc cạo tróc toàn bộ lớp vảy trắng bằng bàn chải cứng mỗi ngày kết hợp bôi cồn Iod nồng độ cao để diệt vi khuẩn gây vảy nến.",
        "Chỉ định thuốc sinh học ngay lập tức mà không cần tầm soát lao tiềm ẩn (IGRA/X-quang) hay viêm gan siêu vi B, C.",
        "Ngưng toàn bộ thuốc dưỡng ẩm ngay khi mảng đỏ vừa giảm vảy vì dưỡng ẩm làm tăng sinh tế bào sừng."
    ],
    "02": [
        "Tiếp tục duy trì thuốc nghi ngờ thêm 7 ngày kết hợp uống kháng Histamin liều thấp để xem cơ thể có tự thích nghi hay không.",
        "Thực hiện nghiệm pháp thử thách thuốc đường uống (Oral provocation test) ngay trong giai đoạn cấp của hội chứng SJS/TEN để tìm thủ phạm.",
        "Lột bỏ hoàn toàn toàn bộ các mảng thượng bì đang bong tróc bằng gạc khô tại giường bệnh để da nhanh lên mô hạt.",
        "Ngưng đột ngột Corticosteroid toàn thân chỉ sau 3 ngày điều trị đối với bệnh nhân hội chứng DRESS có viêm gan cấp."
    ],
    "03": [
        "Ngưng hoàn toàn việc thoa kem dưỡng ẩm ngay khi da trẻ vừa hết đỏ và tắm hàng ngày bằng nước lá đun sôi thật nóng pha muối đặc.",
        "Bôi Corticosteroid nhóm siêu mạnh (Clobetasol propionate 0,05%) liên tục dài ngày lên vùng mặt và mí mắt của trẻ nhũ nhi.",
        "Tuyệt đối không điều trị cho các thành viên khác trong gia đình khi trẻ có mụn nước ở kẽ ngón tay và ngứa dữ dội về đêm.",
        "Chỉ định uống Corticosteroid toàn thân kéo dài liên tục nhiều tháng làm phác đồ duy trì thường quy cho mọi mức độ Viêm da cơ địa."
    ],
    "04": [
        "Sử dụng chỉ số hiệu giá TPHA/TPPA định lượng mỗi tháng để theo dõi đáp ứng điều trị vì TPHA sẽ âm tính ngay sau 4 tuần tiêm thuốc.",
        "Tiêm tĩnh mạch trực tiếp Benzathine Penicillin G 2,4 triệu đơn vị thay vì tiêm bắp sâu để thuốc phát huy tác dụng nhanh hơn.",
        "Chuyển sang kê đơn Doxycycline uống 14 ngày cho phụ nữ đang mang thai dị ứng Penicillin mà không cần giải mẫn cảm Penicillin.",
        "Kết luận loại trừ hoàn toàn bệnh Giang mai thời kỳ II ngay khi thấy xét nghiệm RPR huyết thanh nguyên chất âm tính mà không cần pha loãng kiểm tra hiện tượng Prozone."
    ],
    "05": [
        "Chỉ định Ciprofloxacin 500mg hoặc Penicillin uống đơn trị liệu làm thuốc đầu tay điều trị lậu cấp tính hiện nay.",
        "Chỉ điều trị cho riêng bệnh nhân có triệu chứng chảy mủ niệu đạo, không cần khám hay điều trị cho bạn tình nếu bạn tình không có triệu chứng.",
        "Sử dụng nhuộm Gram dịch cổ tử cung nữ giới hoặc dịch hầu họng làm tiêu chuẩn vàng duy nhất để loại trừ hoàn toàn nhiễm Lậu cầu.",
        "Cho phép bệnh nhân quan hệ tình dục trở lại ngay trong ngày đầu tiên vừa tiêm Ceftriaxone khi vẫn còn dịch tiết niệu đạo."
    ],
    "06": [
        "Kê đơn dung dịch Podophyllin hoặc Podophyllotoxin 0,5% cho phụ nữ đang mang thai tự bôi tại nhà để làm rụng sùi mào gà nhanh.",
        "Chỉ định đốt Laser CO2 đồng loạt cho mọi trường hợp chuỗi hạt ngọc dương vật (PPP) và gai sinh học tiền đình âm hộ (Vestibular papillomatosis).",
        "Khẳng định sau một lần đốt Laser CO2 duy nhất đã tiêu diệt 100% virus HPV trong cơ thể nên không cần hẹn tái khám theo dõi.",
        "Sử dụng vắc-xin HPV để tiêm điều trị làm rụng tức thì các khối sùi mào gà khổng lồ mà không cần can thiệp thủ thuật tại chỗ."
    ],
    "07": [
        "Phối hợp cùng lúc 3 loại kháng Histamin H1 thế hệ 1 gây buồn ngủ (Chlorpheniramine + Promethazine + Hydroxyzine) làm phác đồ đầu tay cho mày đay mạn tính.",
        "Duy trì uống Prednisolone hoặc Dexamethasone hàng ngày liên tục suốt 6–12 tháng để dự phòng tái phát mày đay mạn tính tự phát.",
        "Chỉ định chụp CT-scan toàn thân và làm xét nghiệm 100 dị nguyên thức ăn thường quy cho tất cả bệnh nhân mới nổi mày đay cấp ngày đầu tiên.",
        "Chỉ dùng kháng Histamin H1 đơn thuần mà trì hoãn tiêm bắp Adrenalin khi bệnh nhân mày đay cấp có kèm khàn tiếng, thở rít và tụt huyết áp."
    ],
    "08": [
        "Tiến hành rạch rộng tháo mủ ngoại khoa và khâu kín ngay lập tức đối với mọi khối sưng mủ tầng ong mật Kerion de Celse ở da đầu trẻ em.",
        "Chỉ định bôi đơn thuần kem kháng nấm tại chỗ trong 1 tuần để điều trị dứt điểm Nấm da đầu (Tinea capitis) và Nấm móng (Tinea unguium).",
        "Phối hợp trộn chung kem Corticosteroid mạnh (Clobetasol/Betamethasone) để bôi dài ngày lên vùng nấm bẹn giúp hết ngứa vĩnh viễn.",
        "Lấy bệnh phẩm soi tươi KOH ở ngay vùng da trung tâm đã lành nhạt màu và ngưng bôi thuốc kháng nấm ngay trong ngày đầu tiên vừa giảm ngứa."
    ],
    "09": [
        "Sử dụng kháng sinh bôi (Clindamycin) hoặc kháng sinh uống (Doxycycline) đơn trị liệu kéo dài liên tục trên 6 tháng không kèm Benzoyl Peroxide.",
        "Phối hợp đồng thời Isotretinoin đường uống với kháng sinh Doxycycline hoặc Minocycline để tăng gấp đôi tốc độ gom cồi mụn nang.",
        "Khởi trị ngay Isotretinoin liều cao 1–2 mg/kg/ngày đơn độc mà không dùng Corticosteroid trước cho bệnh nhân Trứng cá tối cấp (Acne fulminans) đang sốt cao loét hoại tử.",
        "Kê đơn Isotretinoin uống hoặc Tazarotene bôi cho phụ nữ đang mang thai để điều trị mụn trứng cá."
    ],
}


def resolve_valid_slide(lec, desired_slide_id):
    slides = lec.get("slides", [])
    if not slides:
        return None
    for s in slides:
        if s["id"] == desired_slide_id:
            return s
    # Try matching number
    m = re.search(r"(\d+)$", str(desired_slide_id or ""))
    if m:
        idx = min(len(slides) - 1, max(0, int(m.group(1)) - 1))
        return slides[idx]
    return slides[0]


def build_quiz_bank():
    data = load_lectures_data()
    lectures_by_id = {lec["id"]: lec for lec in data["lectures"]}

    all_questions = []
    q_counter = 1

    # 1. Process 108 Curated High-Yield Board MCQs (12 per lecture)
    curated_raw = CURATED_PART1 + CURATED_PART2
    for item in curated_raw:
        lec = lectures_by_id[item["lectureId"]]
        valid_slide = resolve_valid_slide(lec, item.get("slideId"))
        slide_id = valid_slide["id"] if valid_slide else f"{lec['id']}-slide-1"
        slide_ref = item.get("slideRef") or (valid_slide["title"] if valid_slide else "Slide bài giảng")

        all_questions.append({
            "id": f"quiz-{lec['id']}-{q_counter:03d}",
            "lectureId": lec["id"],
            "lectureTitle": lec["shortTitle"],
            "category": item["category"],
            "difficulty": item["difficulty"],
            "sourceType": "board",
            "slideId": slide_id,
            "slideRef": slide_ref,
            "image": item.get("image", ""),
            "question": item["question"],
            "options": item["options"],
            "correctIndex": item["correctIndex"],
            "explanation": item["explanation"],
        })
        q_counter += 1

    # 2. Generate 90 Golden Principle Application MCQs (10 per lecture)
    for lec in data["lectures"]:
        lec_id = lec["id"]
        distractor_pool = GOLDEN_DISTRACTORS_BY_LECTURE.get(lec_id, GOLDEN_DISTRACTORS_BY_LECTURE["01"])
        slides = lec.get("slides", [])

        for idx, gp in enumerate(lec.get("goldenPrinciples", [])):
            gp_title = strip_md(gp.get("title", f"Nguyên lý vàng số {idx+1}"))
            gp_content = strip_md(gp.get("content", ""))
            concise_correct = first_sentences(gp_content, 235)

            # Pick 3 distinct distractors from the lecture's clinical trap pool
            d1 = distractor_pool[(idx) % len(distractor_pool)]
            d2 = distractor_pool[(idx + 1) % len(distractor_pool)]
            d3 = distractor_pool[(idx + 2) % len(distractor_pool)]

            # Rotate correct option position (0, 1, 2, 3) deterministically so answers are balanced A/B/C/D
            correct_pos = (idx + int(lec_id)) % 4
            opts = [d1, d2, d3]
            opts.insert(correct_pos, concise_correct)

            mapped_slide = slides[min(len(slides) - 1, (idx * max(1, len(slides) // 10)))] if slides else None
            cat = "dieu-tri" if any(w in gp_title.lower() for w in ["điều trị", "thuốc", "phác đồ", "kháng sinh", "corticoid", "bôi", "tiêm", "uống", "dưỡng ẩm"]) else "chan-doan"

            all_questions.append({
                "id": f"quiz-{lec_id}-{q_counter:03d}",
                "lectureId": lec_id,
                "lectureTitle": lec["shortTitle"],
                "category": cat,
                "difficulty": "Trung bình" if idx % 2 == 0 else "Khó",
                "sourceType": "golden",
                "slideId": mapped_slide["id"] if mapped_slide else f"{lec_id}-slide-1",
                "slideRef": f"Nguyên lý Vàng #{gp.get('number', idx+1)}: {gp_title}",
                "image": "",
                "question": f"[Nguyên lý Vàng Lâm sàng – {lec['shortTitle']}] Khi thực hành xử trí và tư vấn về vấn đề «{gp_title}», nguyên tắc nào sau đây là CHUẨN XÁC NHẤT theo hướng dẫn của BSCKII?",
                "options": opts,
                "correctIndex": correct_pos,
                "explanation": f"🌟 **Nguyên lý Vàng #{gp.get('number', idx+1)} ({gp_title}):** {gp.get('content', '')}",
            })
            q_counter += 1

    # 3. Generate 27 Clinical Mini-Case MCQs (3 per lecture)
    for lec in data["lectures"]:
        lec_id = lec["id"]
        distractor_pool = GOLDEN_DISTRACTORS_BY_LECTURE.get(lec_id, GOLDEN_DISTRACTORS_BY_LECTURE["01"])
        slides = lec.get("slides", [])

        for c_idx, mc in enumerate(lec.get("miniCases", [])):
            mc_title = strip_md(mc.get("title", f"Tình huống lâm sàng {c_idx+1}"))
            scenario = first_sentences(mc.get("scenarioMarkdown", ""), 320)
            analysis_raw = mc.get("analysisMarkdown", "")
            correct_summary = first_sentences(analysis_raw, 240)

            d1 = distractor_pool[(c_idx + 1) % len(distractor_pool)]
            d2 = distractor_pool[(c_idx + 2) % len(distractor_pool)]
            d3 = distractor_pool[(c_idx + 3) % len(distractor_pool)]

            correct_pos = (c_idx + 2) % 4
            opts = [d1, d2, d3]
            opts.insert(correct_pos, correct_summary)

            mapped_slide = slides[-1] if slides else None

            all_questions.append({
                "id": f"quiz-{lec_id}-{q_counter:03d}",
                "lectureId": lec_id,
                "lectureTitle": lec["shortTitle"],
                "category": "ca-lam-sang",
                "difficulty": "Khó",
                "sourceType": "case",
                "slideId": mapped_slide["id"] if mapped_slide else f"{lec_id}-slide-1",
                "slideRef": f"Ca lâm sàng: {mc_title}",
                "image": "",
                "question": f"[Tình huống Lâm sàng – {mc_title}] {scenario} Nhận định chẩn đoán và hướng xử trí nào sau đây là ĐÚNG ĐẮN NHẤT?",
                "options": opts,
                "correctIndex": correct_pos,
                "explanation": f"🩺 **Phân tích Ca lâm sàng của BSCKII:**\n\n{analysis_raw}",
            })
            q_counter += 1

    # 4. Generate 45 Visual Clinical Atlas Image Diagnosis MCQs (5 per lecture)
    all_lecture_titles = [
        (l["id"], l["shortTitle"], l["title"]) for l in data["lectures"]
    ]
    for lec in data["lectures"]:
        lec_id = lec["id"]
        # Filter images with descriptive clinical captions (skip slide 1 title/logo images)
        candidate_imgs = [
            im for im in lec.get("allImages", [])
            if not im["src"].endswith("slide_1_img_1.png")
            and not im["src"].endswith("slide_1_img_1.jpeg")
            and not im["src"].endswith("slide_2_img_3.png")
            and len(strip_md(im.get("alt", ""))) >= 12
        ]
        if len(candidate_imgs) < 5:
            candidate_imgs = lec.get("allImages", [])[:5]

        # Pick 5 evenly spaced clinical images across the lecture
        step = max(1, len(candidate_imgs) // 5)
        picked_imgs = [candidate_imgs[min(len(candidate_imgs) - 1, i * step)] for i in range(5)]

        # Collect other captions from other lectures/slides as realistic visual distractors
        other_imgs_in_lec = [im for im in candidate_imgs if im not in picked_imgs]

        for img_i, im in enumerate(picked_imgs):
            caption_clean = strip_md(im.get("alt", "Hình ảnh lâm sàng đặc trưng"))
            correct_label = f"{caption_clean} (thuộc chuyên đề {lec['shortTitle']})"

            # Build 3 plausible visual distractors from other lectures
            other_lecs = [x for x in data["lectures"] if x["id"] != lec_id]
            d_list = []
            for k in range(3):
                oth = other_lecs[(int(lec_id) + img_i + k) % len(other_lecs)]
                oth_imgs = [
                    oim for oim in oth.get("allImages", [])
                    if len(strip_md(oim.get("alt", ""))) >= 12
                    and not oim["src"].endswith("slide_1_img_1.png")
                ]
                oth_alt = strip_md(oth_imgs[img_i % len(oth_imgs)]["alt"]) if oth_imgs else f"Thương tổn đặc trưng của {oth['title']}"
                d_list.append(f"{oth_alt} (thuộc chuyên đề {oth['shortTitle']})")

            correct_pos = (img_i + int(lec_id) + 1) % 4
            opts = list(d_list)
            opts.insert(correct_pos, correct_label)

            # Find matching slide explanation if available
            slide_obj = resolve_valid_slide(lec, im.get("slideId"))
            slide_exp = ""
            if slide_obj:
                slide_exp = first_sentences(
                    slide_obj.get("clinicalExplanationMarkdown") or slide_obj.get("rawMarkdown") or "",
                    300
                )

            all_questions.append({
                "id": f"quiz-{lec_id}-{q_counter:03d}",
                "lectureId": lec_id,
                "lectureTitle": lec["shortTitle"],
                "category": "hinh-anh",
                "difficulty": "Trung bình",
                "sourceType": "atlas",
                "slideId": im.get("slideId") or (slide_obj["id"] if slide_obj else f"{lec_id}-slide-1"),
                "slideRef": im.get("slideTitle") or (slide_obj["title"] if slide_obj else "Hình ảnh lâm sàng"),
                "image": im["src"],
                "question": "Quan sát kỹ hình ảnh lâm sàng / cận lâm sàng dưới đây (bạn có thể bấm vào ảnh để phóng to). Hình ảnh này minh họa cho thương tổn hoặc dấu hiệu đặc trưng nào?",
                "options": opts,
                "correctIndex": correct_pos,
                "explanation": f"📸 **Nhận diện Hình ảnh Lâm sàng:** Hình ảnh trên thể hiện **{caption_clean}** trong bài **{lec['title']}** ({im.get('slideTitle', '')}).\n\n{slide_exp}",
            })
            q_counter += 1

    # Compute summary stats
    by_lecture = {}
    by_category = {}
    for q in all_questions:
        by_lecture[q["lectureId"]] = by_lecture.get(q["lectureId"], 0) + 1
        by_category[q["category"]] = by_category.get(q["category"], 0) + 1

    quiz_bank_payload = {
        "stats": {
            "totalQuestions": len(all_questions),
            "byLecture": by_lecture,
            "byCategory": by_category,
        },
        "categories": [
            {"id": "all", "name": "Tất cả dạng câu hỏi", "icon": "📚"},
            {"id": "nhan-biet", "name": "Nhận biết & Cơ chế bệnh sinh", "icon": "🧠"},
            {"id": "chan-doan", "name": "Chẩn đoán & Cận lâm sàng", "icon": "🔬"},
            {"id": "dieu-tri", "name": "Phác đồ Điều trị & Dược lý", "icon": "💊"},
            {"id": "ca-lam-sang", "name": "Tình huống Lâm sàng & Bẫy Y khoa", "icon": "🩺"},
            {"id": "hinh-anh", "name": "Nhận diện Hình ảnh Lâm sàng", "icon": "📸"},
        ],
        "questions": all_questions,
    }

    with open(OUTPUT_QUIZ_JS_PATH, "w", encoding="utf-8") as f:
        f.write("// AUTO-GENERATED BY scripts/build_quiz_bank.py — DO NOT EDIT MANUALLY\n")
        f.write("window.DALIEU_QUIZ_BANK = ")
        json.dump(quiz_bank_payload, f, ensure_ascii=False, indent=2)
        f.write(";\n")

    size_kb = os.path.getsize(OUTPUT_QUIZ_JS_PATH) / 1024.0
    print(f"Successfully generated {OUTPUT_QUIZ_JS_PATH} ({size_kb:.1f} KB)")
    print(f"Total Questions: {len(all_questions)}")
    print("By Lecture:", by_lecture)
    print("By Category:", by_category)


if __name__ == "__main__":
    build_quiz_bank()
