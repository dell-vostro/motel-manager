# Trọ Tốt — Quản lý nhà trọ (React + Vite + Tailwind)

Dự án mẫu giúp bạn quản lý **nhà trọ, phòng, khách thuê, tạm trú, hóa đơn**… với giao diện web.

## Yêu cầu
- Node.js **>= 18** (khuyến nghị LTS 18 hoặc 20)
- npm (hoặc pnpm/yarn nếu bạn quen dùng)

## Cách chạy trên máy tính
```bash
# 1) Cài thư viện
npm install

# 2) Chạy dev server
npm run dev
# → Mở trình duyệt vào địa chỉ (hiện trên Terminal), thường là http://localhost:5173

# 3) Build bản deploy (tuỳ chọn)
npm run build
npm run preview
```

## Ghi chú
- Dùng **HashRouter** nên không cần cấu hình máy chủ đặc biệt, URL sẽ dạng `#/properties/1?tab=rooms`.
- Dữ liệu trong file là **demo trong bộ nhớ** (chưa có backend). Khi tắt trang sẽ reset.
- Đã tích hợp **TailwindCSS**, **lucide-react**, **react-router-dom**.

## Cấu trúc thư mục
```
tro-tot-webapp/
├─ index.html
├─ package.json
├─ postcss.config.js
├─ tailwind.config.js
├─ vite.config.js
└─ src/
   ├─ index.css
   ├─ main.jsx
   └─ App.jsx
```

## Tuỳ biến tiếp
- Thêm API/Backend: đổi nguồn dữ liệu trong `App.jsx` (hiện là mảng demo).
- Đổi logo/branding: sửa trong component **Shell**.
- Triển khai lên hosting tĩnh (Netlify/Vercel): dùng `npm run build` rồi deploy thư mục `dist`.


## Triển khai bằng Docker (Raspberry Pi/ARM)
> Yêu cầu: cài Docker (và docker-compose nếu dùng compose). Ảnh `node:20-alpine` và `nginx:alpine` đều có **multi-arch** nên chạy trên ARM/ARM64.

### Cách 1: Build trực tiếp trên Raspberry Pi
```bash
# trong thư mục tro-tot-webapp
docker build -t tro-tot-webapp:latest .
docker run -d --name tro-tot-webapp -p 8080:80 --restart unless-stopped tro-tot-webapp:latest
# Mở trình duyệt tại: http://<IP_RASPBERRY_PI>:8080
```

### Cách 2: Dùng docker-compose
```bash
docker compose up -d --build
# hoặc: docker-compose up -d --build (tùy hệ thống)
```

### Cách 3: Build trên máy PC cho Raspberry Pi (Cross-build)
```bash
# tạo builder hỗ trợ multi-arch (chỉ cần làm 1 lần)
docker buildx create --use

# build cho ARMv7 (Pi 3 trở xuống) và đẩy lên registry của bạn
docker buildx build --platform linux/arm/v7 -t <your-dockerhub>/tro-tot-webapp:pi-v7 --push .

# build cho ARM64 (Pi 4/5)
docker buildx build --platform linux/arm64 -t <your-dockerhub>/tro-tot-webapp:pi-arm64 --push .

# trên Raspberry Pi: kéo image về và chạy
docker run -d --name tro-tot-webapp -p 8080:80 --restart unless-stopped <your-dockerhub>/tro-tot-webapp:pi-arm64
```
