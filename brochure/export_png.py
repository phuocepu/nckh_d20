"""
Export brochure.html to PNG using html2image

Cài đặt:
    pip install html2image

Chạy:
    python export_png.py

Lưu ý: Cần có Chrome/Chromium đã cài trên máy
"""

from html2image import Html2Image
import os

# Cấu hình
WIDTH = 1200
HEIGHT = 3300  # Chuẩn, fit 6 nhóm + footer

# Lấy đường dẫn hiện tại
current_dir = os.path.dirname(os.path.abspath(__file__))

# Tạo instance html2image
hti = Html2Image(
    output_path=current_dir,
    size=(WIDTH, HEIGHT)
)

# Danh sách file cần export (file, output, width, height)
files_to_export = [
    ("brochure_vn.html", "brochure_vn.png", 1200, 3300),      # 6 nhóm kỹ năng
    ("schedule_16weeks.html", "schedule_16weeks.png", 1200, 1697),  # Lịch 16 tuần (A4)
]

print("=" * 50)
print("EXPORT BROCHURE TO PNG")
print("=" * 50)

for html_name, png_name, w, h in files_to_export:
    html_file = os.path.join(current_dir, html_name)

    if not os.path.exists(html_file):
        print(f"[SKIP] {html_name} không tồn tại")
        continue

    print(f"\n[EXPORT] {html_name} -> {png_name} ({w}x{h})")

    # Cập nhật size cho từng file
    hti = Html2Image(output_path=current_dir, size=(w, h))

    hti.screenshot(
        html_file=html_file,
        save_as=png_name
    )

    output_path = os.path.join(current_dir, png_name)
    if os.path.exists(output_path):
        size_kb = os.path.getsize(output_path) / 1024
        print(f"[OK] Lưu tại: {output_path}")
        print(f"[OK] Kích thước: {size_kb:.1f} KB")
    else:
        print(f"[ERROR] Không tạo được file")

print("\n" + "=" * 50)
print("HOÀN THÀNH!")
print("File PNG sẵn sàng để gửi qua Zalo")
print("Tip: Gửi dưới dạng FILE (không phải ảnh) để giữ chất lượng")
print("=" * 50)
