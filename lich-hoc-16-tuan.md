# LỊCH HỌC 16 TUẦN - CHƯƠNG TRÌNH BỔ TÚC KỸ NĂNG NCKH

**Thời lượng:** 16 tuần × 1 buổi/tuần (khoảng 2-3 tiếng/buổi)
**Phương pháp:** Demo-first, Show-and-tell, Learn-by-doing
**Nguyên tắc:** Mỗi buổi phải có sản phẩm cụ thể sinh viên mang về

---

## TỔNG QUAN PHÂN BỔ

```
┌─────────────────────────────────────────────────────────────┐
│  Tuần 1-2:   Khởi động + Môi trường                         │
│  Tuần 3-6:   Python cơ bản + Thư viện (Nhóm 2)              │
│  Tuần 7-10:  Toán ứng dụng qua code (Nhóm 3)                │
│  Tuần 11-13: Công cụ nghiên cứu (Nhóm 4)                    │
│  Tuần 14-15: Ứng dụng + Mini-project (Nhóm 5)               │
│  Tuần 16:    Trình bày & Tổng kết (Nhóm 6)                  │
│                                                             │
│  * Nhóm 1 & 6: Tích hợp xuyên suốt vào mỗi buổi học         │
└─────────────────────────────────────────────────────────────┘
```

---

## CHI TIẾT TỪNG TUẦN

---

### TUẦN 1: KHAI MẠC + LÀM QUEN MÔI TRƯỜNG

**Chủ đề:** "Từ ý tưởng đến code chạy được"

| Thời gian | Nội dung | Hình thức |
|-----------|----------|-----------|
| 15 phút | Giới thiệu chương trình, mục tiêu 16 tuần | Nói chuyện |
| 20 phút | **DEMO:** Giảng viên show 1 project hoàn chỉnh | Live demo |
| 20 phút | **So sánh MATLAB vs Python:** Cú pháp, khi nào dùng cái nào | Demo song song |
| 45 phút | **Giới thiệu các môi trường làm việc** (Local + Cloud) | Demo + Cài đặt |
| 30 phút | Chạy code đầu tiên trên các môi trường | Thực hành |

---

#### CHI TIẾT TỪNG PHẦN:

**1. GIỚI THIỆU CHƯƠNG TRÌNH (15 phút)**

Nội dung cần nói:
- **Tại sao sinh viên Toán-Tin cần khóa này?**
  - Toán học hiện đại không chỉ giấy bút → cần code để kiểm chứng, mô phỏng, visualize
  - Nghiên cứu khoa học yêu cầu reproducibility → code + data công khai
  - CV xin việc/học bổng cần GitHub, không chỉ bảng điểm

- **Khóa học này KHÔNG phải:** Học lập trình chuyên sâu như dân CNTT

- **Khóa học này LÀ:**
  - Dùng code như công cụ để giải quyết bài toán Toán học
  - Mỗi buổi có sản phẩm cụ thể mang về
  - Cuối khóa có portfolio GitHub cá nhân

- **Lộ trình 16 tuần:** Show sơ đồ tổng quan

- **"Hợp đồng" với sinh viên:** Cam kết đi học đủ, làm bài tập, dám hỏi khi không hiểu

---

**2. DEMO PROJECT HOÀN CHỈNH (20 phút)**

> Mục tiêu: "Hook" sinh viên ngay từ đầu, cho thấy điểm đến sau 16 tuần

**Tiêu chí chọn demo:**
- Liên quan đến môn Toán sinh viên đang/sẽ học
- Có visualization đẹp, ấn tượng
- Kết quả bất ngờ hoặc "wow"
- Sinh viên thấy "16 tuần sau mình cũng làm được"

**GỢI Ý DEMO THEO MÔN TOÁN:**

| Môn học | Demo | Mô tả | Wow factor |
|---------|------|-------|------------|
| **Xác suất** | Monty Hall Problem | Mô phỏng 10,000 lần gameshow "chọn cửa" | Đổi cửa thắng 66.7% - phản trực giác! |
| **Xác suất** | Birthday Paradox | Cần bao nhiêu người để trùng sinh nhật? | Chỉ cần 23 người → 50% |
| **Xác suất** | Monte Carlo tính π | Ném điểm ngẫu nhiên vào hình vuông | Tính được π từ random! |
| **Đại số tuyến tính** | Image Compression (SVD) | Nén ảnh bằng ma trận | Ảnh 1MB → 100KB vẫn rõ |
| **Giải tích/Vi phân** | Double Pendulum | Con lắc kép - chaos theory | Khác 0.001° → kết quả hoàn toàn khác |
| **Giải tích/Vi phân** | SIR Model (dịch bệnh) | Mô phỏng COVID lan truyền | Thời sự, giải thích "flatten the curve" |
| **Giải tích/Vi phân** | Lorenz Attractor | Hiệu ứng cánh bướm | Hình 3D cực đẹp |
| **Lý thuyết số** | Collatz Conjecture | Dãy số đơn giản chưa ai chứng minh | Bài toán mở, bí ẩn |
| **Lý thuyết số** | Ulam Spiral | Số nguyên tố xếp xoắn ốc | Pattern ẩn trong số nguyên tố |
| **Tối ưu hóa** | TSP Animation | Tìm đường đi ngắn nhất qua N thành phố | Xem thuật toán "học" |
| **Tối ưu hóa** | Gradient Descent | Animation "lăn xuống đáy hũ" | Trực quan hóa đạo hàm |
| **Đồ thị/Thuật toán** | Maze Solver (BFS) | Tìm đường trong mê cung | Animation sóng lan ra |
| **Số phức** | Mandelbrot/Julia Set | Fractal từ công thức z = z² + c | Zoom vô hạn, đẹp vô hạn |
| **Thuật toán** | Sorting Visualization | So sánh tốc độ các thuật toán sắp xếp | Trực quan O(n²) vs O(n log n) |
| **Cellular Automata** | Game of Life | 4 quy tắc đơn giản → "sự sống" | Pattern tự di chuyển, tự nhân bản |

**ĐỀ XUẤT TOP 3:**
1. **Monty Hall** - Dễ hiểu nhất, xác suất, phản trực giác
2. **Mandelbrot** - Hình ảnh ấn tượng nhất, số phức
3. **SIR Model** - Thời sự, liên hệ COVID, vi phân

---

**3. SO SÁNH MATLAB VS PYTHON (20 phút)**

| Tiêu chí | MATLAB | Python |
|----------|--------|--------|
| Giá | Trả phí (đắt) | Miễn phí |
| Cộng đồng | Học thuật | Rộng lớn (AI, Web, Data...) |
| Cú pháp | Gần Toán hơn | Đa dụng hơn |
| Thư viện ML/AI | Có nhưng hạn chế | Rất mạnh (TensorFlow, PyTorch) |

> "Khóa này focus Python, nhưng kỹ năng tư duy chuyển sang MATLAB dễ dàng"

---

**4. GIỚI THIỆU CÁC MÔI TRƯỜNG LÀM VIỆC (45 phút)**

```
┌─────────────────────────────────────────────────────────────┐
│  MÔI TRƯỜNG LẬP TRÌNH PYTHON                                │
├─────────────────────────────────────────────────────────────┤
│  LOCAL (máy cá nhân)              │  CLOUD (trên mạng)      │
│  ─────────────────────            │  ──────────────────     │
│  • VS Code + Python extension     │  • Google Colab         │
│  • Jupyter Notebook               │  • Kaggle Notebooks     │
│                                   │  • Deepnote             │
└─────────────────────────────────────────────────────────────┘
```

**So sánh các môi trường:**

| Môi trường | Ưu điểm | Nhược điểm | Khi nào dùng |
|------------|---------|------------|--------------|
| **VS Code + Python** | Mạnh mẽ, nhiều extension, debug tốt | Cần cài đặt, cấu hình | Project lớn, code dài |
| **Jupyter Notebook** | Chạy từng cell, kết hợp code + text + hình | Khó debug, khó quản lý code lớn | Thí nghiệm, báo cáo, học tập |
| **Google Colab** | Không cần cài, có GPU miễn phí, chia sẻ dễ | Cần internet, session timeout | Máy yếu, cần GPU, chia sẻ nhanh |

**Thực hành cài đặt:**
- [ ] Cài VS Code + Python extension
- [ ] Cài Jupyter Notebook (qua pip hoặc Anaconda)
- [ ] Đăng nhập Google Colab

---

**5. CHẠY CODE ĐẦU TIÊN (30 phút)**

Chạy cùng 1 đoạn code trên cả 3 môi trường:

```python
# Hello World cho Toán-Tin
import numpy as np

print("Hello NCKH!")
print(f"Số pi = {np.pi}")
print(f"Căn 2 = {np.sqrt(2)}")
```

---

**Output buổi học:**
- [ ] Hiểu mục tiêu khóa học 16 tuần
- [ ] Thấy được 1 demo project hoàn chỉnh (có hứng thú!)
- [ ] Máy đã cài Python + Jupyter (hoặc biết dùng Colab)
- [ ] Chạy được code đầu tiên trên ít nhất 1 môi trường

**Bài tập về nhà:**
- Tạo 1 notebook trên Colab hoặc Jupyter
- Viết 5-10 dòng code Python bất kỳ (copy từ internet được)
- Thử chạy trên môi trường khác (nếu đã dùng Colab → thử local, và ngược lại)

---

### TUẦN 2: PYTHON CƠ BẢN (1) - BIẾN VÀ DỮ LIỆU

**Chủ đề:** "Máy tính lưu trữ và xử lý dữ liệu như thế nào?"

| Thời gian | Nội dung | Hình thức |
|-----------|----------|-----------|
| 10 phút | **Show-and-tell:** 2-3 sinh viên show notebook tuần trước | Sinh viên trình bày |
| 20 phút | **DEMO:** Tính điểm trung bình môn học bằng Python | Live coding |
| 40 phút | Thực hành: Biến, kiểu dữ liệu (int, float, string, list) | Code along |
| 30 phút | **Bài tập tại lớp:** Viết chương trình tính BMI | Làm cá nhân |
| 20 phút | Debug cơ bản: Đọc lỗi, sửa lỗi | Demo + thực hành |

**Output buổi học:**
- [ ] Hiểu biến, kiểu dữ liệu
- [ ] Viết được chương trình tính BMI

**Bài tập về nhà:**
- Viết chương trình tính tiền điện (nhập số kWh, xuất số tiền theo bậc thang)

---

### TUẦN 3: PYTHON CƠ BẢN (2) - ĐIỀU KHIỂN LUỒNG

**Chủ đề:** "Dạy máy tính ra quyết định"

| Thời gian | Nội dung | Hình thức |
|-----------|----------|-----------|
| 10 phút | **Show-and-tell:** Chữa bài tính tiền điện | Sinh viên trình bày |
| 15 phút | **PHÂN TÍCH BÀI TOÁN (Nhóm 1):** Cho đề bài "Phân loại sinh viên theo điểm" - cùng phân tích input/output | Thảo luận nhóm |
| 30 phút | If-else, vòng lặp for, while | Live coding |
| 40 phút | **Bài tập tại lớp:** Viết chương trình phân loại sinh viên (Xuất sắc/Giỏi/Khá/TB) | Làm cá nhân |
| 20 phút | Giới thiệu hàm (function) - tại sao cần chia nhỏ code | Demo |

**Output buổi học:**
- [ ] Viết được if-else, vòng lặp
- [ ] Hiểu cách chia nhỏ bài toán

**Bài tập về nhà:**
- Viết chương trình tìm số nguyên tố từ 1 đến N (dùng hàm)

---

### TUẦN 4: LÀM VIỆC VỚI DỮ LIỆU - NUMPY & PANDAS

**Chủ đề:** "Xử lý 1000 dòng dữ liệu trong 1 giây"

| Thời gian | Nội dung | Hình thức |
|-----------|----------|-----------|
| 10 phút | **Show-and-tell:** Code tìm số nguyên tố | Sinh viên trình bày |
| 20 phút | **DEMO WOW:** So sánh tốc độ vòng lặp vs NumPy (tính tổng 1 triệu số) | Live demo |
| 30 phút | NumPy cơ bản: array, các phép tính | Code along |
| 30 phút | Pandas cơ bản: đọc CSV, xem dữ liệu, lọc dữ liệu | Code along |
| 25 phút | **Bài tập:** Đọc file điểm sinh viên, tính trung bình, tìm top 10 | Thực hành |

**Output buổi học:**
- [ ] Dùng được NumPy để tính toán nhanh
- [ ] Đọc và xử lý file CSV bằng Pandas

**Bài tập về nhà:**
- Tải 1 dataset từ Kaggle, đọc bằng Pandas, trả lời 3 câu hỏi về dữ liệu

---

### TUẦN 5: TRỰC QUAN HÓA - MATPLOTLIB

**Chủ đề:** "Một hình ảnh đáng giá ngàn dòng số"

| Thời gian | Nội dung | Hình thức |
|-----------|----------|-----------|
| 10 phút | **Show-and-tell:** Dataset Kaggle của sinh viên | Sinh viên trình bày |
| 15 phút | **DEMO Gallery:** Show 10 loại biểu đồ khoa học đẹp | Trình chiếu |
| 40 phút | Matplotlib: line plot, scatter, bar chart, histogram | Code along |
| 30 phút | Customize: title, label, legend, colors, style | Code along |
| 20 phút | **Bài tập:** Vẽ 3 biểu đồ từ dataset tuần trước | Thực hành |

**Output buổi học:**
- [ ] Vẽ được 4 loại biểu đồ cơ bản
- [ ] Biết cách làm đẹp biểu đồ

**Bài tập về nhà:**
- Vẽ 1 figure có 4 subplot từ dataset của mình

---

### TUẦN 6: DEBUG & ĐỌC CODE NGƯỜI KHÁC

**Chủ đề:** "Code không chạy? Bình tĩnh, đọc lỗi"

| Thời gian | Nội dung | Hình thức |
|-----------|----------|-----------|
| 10 phút | **Show-and-tell:** Figure 4 subplot | Sinh viên trình bày |
| 20 phút | **DEMO:** Giảng viên cố tình viết code lỗi, debug từng bước | Live demo |
| 25 phút | Các loại lỗi thường gặp: SyntaxError, TypeError, IndexError... | Demo + giải thích |
| 30 phút | **Bài tập:** Phát code có 5 lỗi, sinh viên tìm và sửa | Thực hành |
| 20 phút | Đọc và hiểu code người khác: theo dõi luồng chạy | Demo |
| 15 phút | **Giới thiệu AI hỗ trợ debug:** Dùng ChatGPT/Claude để giải thích lỗi | Demo |

**Output buổi học:**
- [ ] Biết cách đọc thông báo lỗi
- [ ] Sửa được lỗi cơ bản
- [ ] Biết dùng AI hỗ trợ debug

**Bài tập về nhà:**
- Tìm 1 đoạn code trên GitHub, đọc hiểu và giải thích bằng comment

---

### TUẦN 7: ĐẠI SỐ TUYẾN TÍNH QUA CODE

**Chủ đề:** "Ma trận không chỉ ở trong phim"

| Thời gian | Nội dung | Hình thức |
|-----------|----------|-----------|
| 10 phút | **Show-and-tell:** Giải thích code GitHub | Sinh viên trình bày |
| 15 phút | **PHÂN TÍCH BÀI TOÁN (Nhóm 1):** "Giải hệ phương trình" - cần gì để giải bằng máy? | Thảo luận |
| 25 phút | **DEMO:** Giải hệ phương trình bằng NumPy (so với giải tay) | Live demo |
| 30 phút | Vector, ma trận trong NumPy: tạo, nhân, transpose | Code along |
| 25 phút | **Bài tập:** Giải hệ 3 phương trình 3 ẩn | Thực hành |
| 15 phút | Ứng dụng: Least squares fitting đường thẳng qua các điểm | Demo |

**Output buổi học:**
- [ ] Thao tác ma trận bằng NumPy
- [ ] Giải được hệ phương trình bằng code

**Bài tập về nhà:**
- Viết code fit đường thẳng y = ax + b qua 10 điểm dữ liệu

---

### TUẦN 8: XÁC SUẤT THỐNG KÊ THỰC NGHIỆM

**Chủ đề:** "Mô phỏng 1 triệu lần tung xúc xắc"

| Thời gian | Nội dung | Hình thức |
|-----------|----------|-----------|
| 10 phút | **Show-and-tell:** Code fit đường thẳng | Sinh viên trình bày |
| 20 phút | **DEMO WOW:** Mô phỏng bài toán Monty Hall - kết quả có đúng lý thuyết? | Live demo |
| 30 phút | Sinh số ngẫu nhiên, random seed (reproducibility!) | Code along |
| 25 phút | Tính mean, std, mô phỏng phân phối | Code along |
| 25 phút | **Bài tập:** Mô phỏng tung đồng xu 10,000 lần, vẽ histogram | Thực hành |
| 10 phút | So sánh kết quả mô phỏng vs lý thuyết | Thảo luận |

**Output buổi học:**
- [ ] Sinh số ngẫu nhiên có kiểm soát
- [ ] Mô phỏng được thí nghiệm xác suất

**Bài tập về nhà:**
- Mô phỏng bài toán sinh nhật (Birthday paradox): Cần bao nhiêu người để xác suất trùng sinh nhật > 50%?

---

### TUẦN 9: TỐI ƯU HÓA CƠ BẢN

**Chủ đề:** "Tìm đáy của hũ - nhiều cách khác nhau"

| Thời gian | Nội dung | Hình thức |
|-----------|----------|-----------|
| 10 phút | **Show-and-tell:** Birthday paradox | Sinh viên trình bày |
| 15 phút | Khái niệm: hàm mục tiêu, biến, ràng buộc | Giải thích + ví dụ |
| 20 phút | **DEMO visual:** So sánh 3 thuật toán tối ưu trên cùng 1 bài toán (animation) | Live demo |

**Phần A: Gradient Descent (20 phút)**
| Thời gian | Nội dung | Hình thức |
|-----------|----------|-----------|
| 5 phút | Ý tưởng: "Đi theo hướng dốc nhất" | Giải thích |
| 15 phút | Code GD đơn giản | Code along |

**Phần B: Genetic Algorithm - GA (25 phút)**
| Thời gian | Nội dung | Hình thức |
|-----------|----------|-----------|
| 10 phút | Ý tưởng: "Tiến hóa tự nhiên - chọn lọc, lai ghép, đột biến" | Giải thích + hình minh họa |
| 15 phút | **DEMO:** GA tìm maximum của hàm, visualize quần thể qua các thế hệ | Live demo |

**Phần C: Particle Swarm Optimization - PSO (25 phút)**
| Thời gian | Nội dung | Hình thức |
|-----------|----------|-----------|
| 10 phút | Ý tưởng: "Đàn chim tìm thức ăn - học từ bản thân và bầy đàn" | Giải thích + animation |
| 15 phút | **DEMO:** PSO animation - xem các particle di chuyển và hội tụ | Live demo |

**So sánh & Tổng kết (15 phút)**
| Thời gian | Nội dung | Hình thức |
|-----------|----------|-----------|
| 10 phút | So sánh GD vs GA vs PSO: Khi nào dùng cái nào? | Thảo luận |
| 5 phút | Giới thiệu thư viện: scipy.optimize, pyswarm, DEAP | Demo nhanh |

**Bảng so sánh 3 phương pháp:**

| Tiêu chí | Gradient Descent | GA | PSO |
|----------|------------------|----|----|
| Cần đạo hàm? | Có | Không | Không |
| Bài toán rời rạc? | Không | Có | Có (biến thể) |
| Dễ hiểu? | Dễ | Trung bình | Dễ |
| Tốc độ | Nhanh | Chậm | Trung bình |
| Thoát local minimum? | Khó | Tốt | Tốt |

**Output buổi học:**
- [ ] Hiểu trực giác 3 phương pháp tối ưu: GD, GA, PSO
- [ ] Biết khi nào nên dùng phương pháp nào
- [ ] Code được GD đơn giản

**Bài tập về nhà:**
- Dùng thư viện `pyswarm` để giải bài toán tối ưu với PSO
- Hoặc: Dùng DEAP để chạy GA đơn giản (có template sẵn)

---

### TUẦN 10: ĐỒ THỊ & THUẬT TOÁN

**Chủ đề:** "Google Maps tìm đường như thế nào?"

| Thời gian | Nội dung | Hình thức |
|-----------|----------|-----------|
| 10 phút | **Show-and-tell:** Bài scipy.optimize | Sinh viên trình bày |
| 20 phút | **DEMO:** Visualize thuật toán BFS tìm đường trong mê cung | Live demo (animation) |
| 30 phút | Biểu diễn đồ thị: adjacency matrix, adjacency list | Code along |
| 30 phút | DFS, BFS cơ bản | Code along |
| 25 phút | **Bài tập:** Tìm đường đi ngắn nhất trong đồ thị nhỏ | Thực hành |

**Output buổi học:**
- [ ] Biểu diễn đồ thị bằng code
- [ ] Hiểu và code được BFS/DFS

**Bài tập về nhà:**
- Giải mê cung bằng BFS (input: ma trận 0/1, output: đường đi)

---

### TUẦN 11: GIT & GITHUB

**Chủ đề:** "Không bao giờ mất code nữa"

| Thời gian | Nội dung | Hình thức |
|-----------|----------|-----------|
| 10 phút | **Show-and-tell:** Code giải mê cung | Sinh viên trình bày |
| 15 phút | **DEMO thảm họa:** Show việc mất code vì không dùng Git | Kể chuyện + demo |
| 30 phút | Git cơ bản: init, add, commit, log | Thực hành cùng nhau |
| 25 phút | GitHub: tạo repo, push code | Thực hành |
| 20 phút | **Bài tập:** Đẩy tất cả code đã làm lên GitHub | Thực hành |
| 20 phút | Viết README.md bằng Markdown | Demo + thực hành |

**Output buổi học:**
- [ ] Có GitHub repo cá nhân
- [ ] Push được code lên GitHub
- [ ] Viết được README cơ bản

**Bài tập về nhà:**
- Commit thêm 3 lần với message rõ ràng, viết README hoàn chỉnh cho repo

---

### TUẦN 12: LATEX & BÁO CÁO KHOA HỌC

**Chủ đề:** "Viết công thức đẹp như sách"

| Thời gian | Nội dung | Hình thức |
|-----------|----------|-----------|
| 10 phút | **Show-and-tell:** GitHub repo với README đẹp | Sinh viên trình bày |
| 15 phút | **DEMO:** So sánh báo cáo Word vs LaTeX | Trình chiếu |
| 10 phút | Giới thiệu Overleaf - không cần cài đặt | Demo |
| 35 phút | LaTeX cơ bản: cấu trúc document, công thức toán | Code along trên Overleaf |
| 25 phút | Chèn hình, bảng, trích dẫn | Code along |
| 20 phút | **Bài tập:** Viết 1 trang báo cáo có công thức + hình | Thực hành |

**Output buổi học:**
- [ ] Có tài khoản Overleaf
- [ ] Viết được LaTeX cơ bản

**Bài tập về nhà:**
- Viết báo cáo 2 trang về 1 bài tập đã làm (có công thức, hình, bảng)

---

### TUẦN 13: TẠO DEMO VỚI STREAMLIT

**Chủ đề:** "Biến code thành ứng dụng trong 30 phút"

| Thời gian | Nội dung | Hình thức |
|-----------|----------|-----------|
| 10 phút | **Show-and-tell:** Báo cáo LaTeX | Sinh viên trình bày |
| 20 phút | **DEMO WOW:** Show 3-4 Streamlit app đẹp (image classifier, data explorer...) | Trình chiếu |
| 40 phút | Streamlit cơ bản: text, button, slider, file upload, chart | Code along |
| 30 phút | **Bài tập:** Tạo app tính BMI với giao diện | Thực hành |
| 20 phút | Deploy lên Streamlit Cloud | Demo + thực hành |

**Output buổi học:**
- [ ] Tạo được Streamlit app đơn giản
- [ ] Deploy được lên internet

**Bài tập về nhà:**
- Tạo Streamlit app cho 1 trong các bài đã làm (fit đường thẳng, giải mê cung, v.v.)

---

### TUẦN 14: PHÂN TÍCH DỮ LIỆU & AI/ML NHẬP MÔN

**Chủ đề:** "Từ dữ liệu thô đến mô hình dự đoán"

| Thời gian | Nội dung | Hình thức |
|-----------|----------|-----------|
| 10 phút | **Show-and-tell:** Streamlit app | Sinh viên trình bày |

**Phần A: Phân tích dữ liệu (60 phút)**
| Thời gian | Nội dung | Hình thức |
|-----------|----------|-----------|
| 15 phút | Data cleaning: missing values, outliers | Code along |
| 25 phút | Exploratory Data Analysis (EDA) | Code along |
| 20 phút | Trực quan hóa và rút ra insight | Thực hành |

**Phần B: AI/ML nhập môn (60 phút)**
| Thời gian | Nội dung | Hình thức |
|-----------|----------|-----------|
| 15 phút | **DEMO WOW:** Train model dự đoán trong 5 dòng code | Live demo |
| 15 phút | Ý tưởng học có giám sát: Train/Test, Fit/Predict | Giải thích |
| 20 phút | Thực hành với scikit-learn: Linear Regression, Classification | Code along |
| 10 phút | Đánh giá mô hình: accuracy, MSE | Code along |

**Tổng kết & Giao đề (10 phút)**
| Thời gian | Nội dung | Hình thức |
|-----------|----------|-----------|
| 10 phút | Giới thiệu mini-project tuần sau | Giao đề |

**Output buổi học:**
- [ ] Quy trình phân tích dữ liệu hoàn chỉnh
- [ ] Hiểu ý tưởng ML cơ bản (train/test, fit/predict)
- [ ] Train được model đơn giản với scikit-learn
- [ ] Nhận đề mini-project

**Mini-project (làm trong tuần):**
- Chọn 1 trong các đề tài cho sẵn
- Có thể áp dụng ML hoặc không (tùy đề tài)
- Phân tích, code, viết báo cáo ngắn
- Chuẩn bị trình bày 5 phút

---

### TUẦN 15: HOÀN THIỆN MINI-PROJECT

**Chủ đề:** "Workshop hỗ trợ project"

| Thời gian | Nội dung | Hình thức |
|-----------|----------|-----------|
| 15 phút | Các nhóm báo cáo tiến độ nhanh (1 phút/nhóm) | Stand-up |
| 60 phút | **Office hour:** Giảng viên hỗ trợ từng nhóm | Hỏi đáp |
| 20 phút | Tips viết slide trình bày khoa học | Demo |
| 25 phút | Tips trả lời câu hỏi phản biện | Role-play |

**Output buổi học:**
- [ ] Project gần hoàn thiện
- [ ] Slide trình bày sẵn sàng

**Chuẩn bị cho tuần 16:**
- Hoàn thiện code, báo cáo, slide
- Push tất cả lên GitHub
- Tập trình bày

---

### TUẦN 16: TRÌNH BÀY & TỔNG KẾT

**Chủ đề:** "Demo Day"

| Thời gian | Nội dung | Hình thức |
|-----------|----------|-----------|
| 90 phút | **Trình bày mini-project:** Mỗi nhóm 5 phút + 3 phút hỏi đáp | Sinh viên trình bày |
| 15 phút | Bình chọn project hay nhất | Vote |
| 15 phút | Feedback từ giảng viên cho từng nhóm | Nhận xét |
| 20 phút | Tổng kết khóa học, định hướng tiếp theo | Nói chuyện |

**Output buổi học:**
- [ ] Hoàn thành trình bày project
- [ ] Nhận feedback
- [ ] Có GitHub portfolio với các project đã làm

---

## BẢNG TỔNG HỢP

| Tuần | Chủ đề chính | Nhóm | Output chính |
|------|--------------|------|--------------|
| 1 | Môi trường + Python/MATLAB intro | 2 | Jupyter chạy được |
| 2 | Biến, kiểu dữ liệu | 2 | Code tính BMI |
| 3 | Điều khiển luồng, hàm | 2 | Code phân loại SV |
| 4 | NumPy, Pandas | 2 | Xử lý file CSV |
| 5 | Matplotlib | 2 | Figure 4 subplot |
| 6 | Debug, đọc code, AI hỗ trợ | 2 | Sửa code lỗi |
| 7 | Đại số tuyến tính | 3 | Giải hệ PT |
| 8 | Xác suất thống kê | 3 | Mô phỏng Monte Carlo |
| 9 | Tối ưu hóa (GD, GA, PSO) | 3 | So sánh 3 phương pháp |
| 10 | Đồ thị, thuật toán | 3 | Giải mê cung |
| 11 | Git, GitHub, Markdown | 4 | GitHub repo |
| 12 | LaTeX | 4 | Báo cáo 2 trang |
| 13 | Streamlit | 4 | App deploy được |
| 14 | Phân tích dữ liệu + AI/ML | 5 | EDA + Model ML |
| 15 | Workshop project | 5+6 | Project gần xong |
| 16 | Demo Day | 6 | Trình bày project |

---

## NGUYÊN TẮC DẠY HỌC

### 1. Cấu trúc mỗi buổi (2.5-3 tiếng)

```
┌─────────────────────────────────────────┐
│  10 phút   │ Show-and-tell (SV trình bày bài về nhà)
├─────────────────────────────────────────┤
│  15-20 phút│ DEMO wow (GV show kết quả cuối trước)
├─────────────────────────────────────────┤
│  60-90 phút│ Code along (cùng làm từng bước)
├─────────────────────────────────────────┤
│  30 phút   │ Bài tập tại lớp
├─────────────────────────────────────────┤
│  10 phút   │ Giao bài về nhà + Q&A
└─────────────────────────────────────────┘
```

### 2. Quy tắc Show-and-tell

- Mỗi buổi 2-3 sinh viên trình bày (xoay vòng)
- Trình bày 3-5 phút: show code, giải thích, kết quả
- Không cần hoàn hảo, quan trọng là dám chia sẻ
- Cả lớp cho feedback ngắn

### 3. Tích hợp Nhóm 1 & Nhóm 6

- **Nhóm 1 (Tư duy):** Mỗi tuần có 1 bài toán mới, dành 10-15 phút phân tích trước khi code
- **Nhóm 6 (Kỹ năng NCKH):** Show-and-tell mỗi buổi = tập trình bày, project cuối = tập viết báo cáo

### 4. Reproducibility xuyên suốt

- Tuần 8: Giới thiệu random seed
- Tuần 11: Git để track code
- Tuần 14-15: Project phải có README, có thể reproduce

---

## TÀI NGUYÊN CẦN CHUẨN BỊ

### Cho giảng viên
- [ ] Dataset mẫu cho mỗi buổi
- [ ] Code template/starter cho bài tập
- [ ] Slide demo cho mỗi buổi
- [ ] Đề mini-project (3-4 đề cho SV chọn)

### Cho sinh viên
- [ ] Máy tính cá nhân
- [ ] Tài khoản: Google, GitHub, Overleaf
- [ ] Group chat để hỗ trợ nhau

---

## GỢI Ý ĐỀ MINI-PROJECT

1. **Phân tích dữ liệu COVID-19 Việt Nam**
   - Visualize số ca theo thời gian, theo tỉnh
   - Fit model đơn giản

2. **Dự đoán giá nhà đơn giản**
   - Linear regression
   - So sánh các features

3. **Mô phỏng bài toán xác suất**
   - Chọn 1 bài toán xác suất thú vị
   - Mô phỏng + so sánh lý thuyết

4. **Giải bài toán tối ưu thực tế**
   - VD: Tối ưu lịch học, phân công công việc, Traveling Salesman Problem (TSP) đơn giản
   - So sánh GD vs GA vs PSO trên cùng 1 bài toán
   - Visualize quá trình tối ưu (animation)

5. **Tool hỗ trợ học tập**
   - Streamlit app giải phương trình
   - Visualize thuật toán

---

*Phiên bản: 1.0 – Cập nhật ngày 14/01/2026*
