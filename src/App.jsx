import React, { useMemo, useState } from "react";
import {
  LayoutDashboard,
  Home,
  Users,
  DollarSign,
  Wrench,
  ClipboardList,
  Settings,
  Banknote,
  DoorOpen,
  UserCheck,
  Menu,
  Plus,
  Save,
  AlertCircle,
  Building2,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { HashRouter, Routes, Route, Link, Navigate, useParams, useSearchParams, useLocation, useNavigate } from "react-router-dom";

// ===== Helpers =====
const currency = (n) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
const fdate = (s) => (s ? new Date(s).toLocaleDateString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit" }) : "");

const Card = ({ className = "", children }) => (
  <div className={`bg-white rounded-lg shadow-md border ${className}`}>{children}</div>
);
const Badge = ({ color = "gray", children }) => {
  const map = {
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-800",
    blue: "bg-blue-100 text-blue-800",
    gray: "bg-gray-100 text-gray-800",
  };
  return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${map[color]}`}>{children}</span>;
};
const Button = ({ variant = "primary", className = "", children, ...props }) => {
  const map = {
    primary: "bg-indigo-500 hover:bg-indigo-600 text-white",
    green: "bg-green-500 hover:bg-green-600 text-white",
    outline: "border border-gray-300 hover:bg-gray-50",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  };
  return (
    <button className={`px-3 py-2 rounded-md inline-flex items-center text-sm ${map[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
const Input = (props) => (
  <input
    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    {...props}
  />
);
const Label = ({ children }) => (
  <label className="block text-sm font-medium text-gray-700">{children}</label>
);

// ===== Demo data =====
const propertiesSeed = [
  { id: 1, name: "Khu trọ An Phú", address: "123/45 Đường ABC, P. An Phú" },
  { id: 2, name: "Khu trọ Bình Hòa", address: "45/67 Đường XYZ, P. Bình Hòa" },
  { id: 3, name: "Khu trọ Lái Thiêu", address: "89/90 Đường KLM, P. Lái Thiêu" },
];
const tenants = [
  { id: 1, name: "Nguyễn Văn An", phone: "0901234567", dob: "1995-08-15", idCard: "038095000111", hometown: "Cà Mau", files: ["cccd-an-1.jpg", "cccd-an-2.jpg"] },
  { id: 2, name: "Trần Thị Bích", phone: "0912345678", dob: "1998-04-20", idCard: "038098000222", hometown: "Bình Định", files: ["cccd-bich-1.jpg"] },
  { id: 3, name: "Lê Minh Cường", phone: "0987654321", dob: "1992-11-30", idCard: "055092000333", hometown: "Hà Nội", files: [] },
  { id: 4, name: "Phạm Thị Diễm", phone: "0934567890", dob: "2000-01-25", idCard: "062100000444", hometown: "Đà Nẵng", files: ["cccd-diem-1.jpg"] },
  { id: 5, name: "Võ Thành Trung", phone: "0945678901", dob: "1996-06-10", idCard: "079096000555", hometown: "TP.HCM", files: [] },
  { id: 6, name: "Đỗ Mỹ Linh", phone: "0956789012", dob: "1997-02-14", idCard: "082097000666", hometown: "Hải Phòng", files: ["cccd-linh-1.jpg", "cccd-linh-2.jpg"] },
  { id: 7, name: "Hoàng Văn Hùng", phone: "0967890123", dob: "1993-09-05", idCard: "022093000777", hometown: "Nghệ An", files: [] },
  { id: 8, name: "Ngô Thị Kim", phone: "0978901234", dob: "1999-07-22", idCard: "045099000888", hometown: "Thanh Hóa", files: ["cccd-kim-1.jpg"] },
  { id: 9, name: "Bùi Anh Tuấn", phone: "0989012345", dob: "1991-03-18", idCard: "011091000999", hometown: "Hà Tây", files: [] },
  { id: 10, name: "Đặng Thu Thảo", phone: "0990123456", dob: "1994-12-01", idCard: "092094001010", hometown: "Cần Thơ", files: ["cccd-thao-1.jpg"] },
];
const rooms = [
  { id: 101, propertyId: 1, name: "A101", status: "Đang thuê", tenantId: 1, price: 3500000, area: 25, deposit: 3500000, equipment: ["Điều hòa", "Tủ lạnh", "Giường", "Tủ quần áo"] },
  { id: 102, propertyId: 1, name: "A102", status: "Đang thuê", tenantId: 2, price: 3500000, area: 25, deposit: 3500000, equipment: ["Điều hòa", "Bình nóng lạnh"] },
  { id: 103, propertyId: 1, name: "A103", status: "Trống", tenantId: null, price: 3500000, area: 25, deposit: 3500000, equipment: [] },
  { id: 104, propertyId: 1, name: "A104", status: "Sửa chữa", tenantId: null, price: 3800000, area: 28, deposit: 3800000, equipment: ["Điều hòa", "Tủ lạnh"] },
  { id: 201, propertyId: 2, name: "B201", status: "Đang thuê", tenantId: 3, price: 4000000, area: 30, deposit: 4000000, equipment: ["Điều hòa", "Tủ lạnh", "Giường"] },
  { id: 202, propertyId: 2, name: "B202", status: "Đang thuê", tenantId: 4, price: 4000000, area: 30, deposit: 4000000, equipment: ["Điều hòa", "Tủ lạnh"] },
  { id: 203, propertyId: 2, name: "B203", status: "Đang thuê", tenantId: 5, price: 4200000, area: 32, deposit: 4200000, equipment: ["Điều hòa", "Tủ lạnh", "Bình nóng lạnh"] },
  { id: 301, propertyId: 3, name: "C301", status: "Đang thuê", tenantId: 6, price: 3200000, area: 22, deposit: 3000000, equipment: ["Quạt trần"] },
  { id: 302, propertyId: 3, name: "C302", status: "Trống", tenantId: null, price: 3200000, area: 22, deposit: 3000000, equipment: [] },
  { id: 303, propertyId: 3, name: "C303", status: "Đang thuê", tenantId: 7, price: 3300000, area: 23, deposit: 3300000, equipment: ["Điều hòa"] },
  { id: 304, propertyId: 3, name: "C304", status: "Đang thuê", tenantId: 8, price: 3300000, area: 23, deposit: 3300000, equipment: ["Điều hòa"] },
  { id: 105, propertyId: 1, name: "A105", status: "Đang thuê", tenantId: 9, price: 3800000, area: 28, deposit: 3800000, equipment: ["Điều hòa", "Tủ lạnh", "Giường", "Tủ quần áo"] },
  { id: 204, propertyId: 2, name: "B204", status: "Đang thuê", tenantId: 10, price: 4000000, area: 30, deposit: 4000000, equipment: ["Điều hòa", "Tủ lạnh"] },
];
const contracts = [
  { id: 1, roomId: 101, tenantId: 1, startDate: "2025-07-01", endDate: "2026-07-01", residenceStatus: "Đã đăng ký" },
  { id: 2, roomId: 102, tenantId: 2, startDate: "2024-10-29", endDate: "2025-10-29", residenceStatus: "Đã đăng ký" },
  { id: 3, roomId: 201, tenantId: 3, startDate: "2025-09-15", endDate: "2026-09-15", residenceStatus: "Chưa đăng ký" },
  { id: 4, roomId: 202, tenantId: 4, startDate: "2025-03-28", endDate: "2026-03-28", residenceStatus: "Đã đăng ký" },
  { id: 5, roomId: 203, tenantId: 5, startDate: "2025-01-10", endDate: "2026-01-10", residenceStatus: "Đã đăng ký" },
  { id: 6, roomId: 301, tenantId: 6, startDate: "2025-08-15", endDate: "2026-08-15", residenceStatus: "Chưa đăng ký" },
  { id: 7, roomId: 303, tenantId: 7, startDate: "2024-11-20", endDate: "2025-11-20", residenceStatus: "Đã đăng ký" },
  { id: 8, roomId: 304, tenantId: 8, startDate: "2025-05-01", endDate: "2026-05-01", residenceStatus: "Đã đăng ký" },
  { id: 9, roomId: 105, tenantId: 9, startDate: "2025-04-12", endDate: "2026-04-12", residenceStatus: "Đã đăng ký" },
  { id: 10, roomId: 204, tenantId: 10, startDate: "2025-02-22", endDate: "2026-02-22", residenceStatus: "Chưa đăng ký" },
];
const invoices = [
  { id: 1, roomId: 101, total: 3950000, status: "Đã thanh toán", date: "2025-09-28" },
  { id: 2, roomId: 102, total: 3925000, status: "Đã thanh toán", date: "2025-09-29" },
  { id: 3, roomId: 201, total: 4500000, status: "Quá hạn", date: null },
  { id: 4, roomId: 202, total: 4480000, status: "Chưa thanh toán", date: null },
  { id: 5, roomId: 203, total: 4650000, status: "Đã thanh toán", date: "2025-09-25" },
  { id: 6, roomId: 301, total: 3610000, status: "Chưa thanh toán", date: null },
  { id: 7, roomId: 303, total: 3750000, status: "Đã thanh toán", date: "2025-09-28" },
  { id: 8, roomId: 101, total: 3920000, status: "Đã thanh toán", date: "2025-08-28" },
];
const maints = [
  { id: 1, roomId: 104, request: "Cửa sổ bị kẹt", status: "Yêu cầu mới", priority: "Trung bình" },
  { id: 2, propertyId: 2, request: "Mạng wifi chập chờn", status: "Yêu cầu mới", priority: "Gấp" },
  { id: 3, roomId: 102, request: "Lắp thêm quạt treo tường", status: "Đang xử lý", priority: "Thấp" },
  { id: 4, propertyId: 2, request: "Thay bóng đèn hành lang", status: "Đã hoàn thành", priority: "Trung bình", cost: 75000 },
  { id: 5, roomId: 201, request: "Hỏng vòi nước lavabo", status: "Đã hoàn thành", priority: "Trung bình", cost: 50000 },
  { id: 6, roomId: 101, request: "Thay bóng đèn nhà tắm", status: "Đã hoàn thành", priority: "Thấp", cost: 50000 },
];

// ===== Generic Modal =====
function Modal({ open, title, children, onClose, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="text-lg font-semibold">{title}</h4>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100"><X className="h-5 w-5"/></button>
        </div>
        <div className="p-4 max-h-[70vh] overflow-y-auto">{children}</div>
        {footer && <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

// ===== Views =====
function DashboardView() {
  const rented = rooms.filter((r) => r.status === "Đang thuê").length;
  const total = rooms.length;
  const revenue = invoices
    .filter((i) => i.date && new Date(i.date).getMonth() === 8) // Tháng 9 (0-index)
    .reduce((s, i) => s + i.total, 0);
  const reminders = [
    ...invoices
      .filter((i) => i.status === "Quá hạn" || i.status === "Chưa thanh toán")
      .map((i) => {
        const room = rooms.find((r) => r.id === i.roomId);
        const t = tenants.find((x) => x.id === room?.tenantId);
        return {
          type: i.status === "Quá hạn" ? "late" : "due",
          text: `Phòng ${room?.name} (${t?.name}) - Số tiền: ${currency(i.total)}`,
        };
      }),
    ...contracts
      .filter((c) => c.residenceStatus === "Chưa đăng ký")
      .map((c) => {
        const room = rooms.find((r) => r.id === c.roomId);
        const t = tenants.find((x) => x.id === c.tenantId);
        return { type: "res", text: `Cần đăng ký tạm trú cho khách ${t?.name} (Phòng ${room?.name}).` };
      }),
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 flex items-center">
          <div className="bg-indigo-100 p-3 rounded-full"><Home className="h-6 w-6 text-indigo-600" /></div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Tổng số phòng</p>
            <p className="text-2xl font-bold">{total}</p>
          </div>
        </Card>
        <Card className="p-6 flex items-center">
          <div className="bg-green-100 p-3 rounded-full"><UserCheck className="h-6 w-6 text-green-600" /></div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Phòng đang thuê</p>
            <p className="text-2xl font-bold">{rented}</p>
          </div>
        </Card>
        <Card className="p-6 flex items-center">
          <div className="bg-blue-100 p-3 rounded-full"><DoorOpen className="h-6 w-6 text-blue-600" /></div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Phòng trống</p>
            <p className="text-2xl font-bold">{total - rented}</p>
          </div>
        </Card>
        <Card className="p-6 flex items-center">
          <div className="bg-yellow-100 p-3 rounded-full"><Banknote className="h-6 w-6 text-yellow-600" /></div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Doanh thu tháng này</p>
            <p className="text-2xl font-bold">{currency(revenue)}</p>
          </div>
        </Card>
      </div>

      {/* Reminders */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">🔔 Nhắc việc & Cảnh báo quan trọng</h3>
        <div className="space-y-3">
          {reminders.map((r, idx) => (
            <div key={idx} className={`flex items-start p-3 border-l-4 bg-gray-50 rounded-r-lg ${
              r.type === "late" ? "border-red-500" : r.type === "due" ? "border-yellow-500" : "border-blue-500"
            }`}>
              <div className={`p-2 rounded-full mr-3 ${
                r.type === "late" ? "bg-red-100" : r.type === "due" ? "bg-yellow-100" : "bg-blue-100"
              }`}>
                <AlertCircle className={`h-5 w-5 ${
                  r.type === "late" ? "text-red-600" : r.type === "due" ? "text-yellow-600" : "text-blue-600"
                }`} />
              </div>
              <div>
                <p className="font-semibold">{r.type === "res" ? "[TẠM TRÚ]" : "[THANH TOÁN]"}</p>
                <p className="text-sm text-gray-600">{r.text}</p>
              </div>
            </div>
          ))}
          {reminders.length === 0 && <div className="text-sm text-gray-500">Không có nhắc việc.</div>}
        </div>
      </Card>
    </div>
  );
}

// ===== Property detail selectors (shared) =====
const selectPropertyRooms = (pid) => rooms.filter((r) => r.propertyId === pid);
const selectPropertyTenants = (pid) => {
  const rms = selectPropertyRooms(pid).map((r) => r.id);
  const cons = contracts.filter((c) => rms.includes(c.roomId));
  const list = cons.map((c) => ({
    tenant: tenants.find((t) => t.id === c.tenantId),
    room: rooms.find((r) => r.id === c.roomId),
    contract: c,
  }));
  const seen = new Set();
  return list.filter((x) => (x.tenant && !seen.has(x.tenant.id) && seen.add(x.tenant.id)) || (!x.tenant && true));
};
const selectPropertyInvoices = (pid) => {
  const rms = selectPropertyRooms(pid).map((r) => r.id);
  return invoices
    .filter((i) => rms.includes(i.roomId))
    .map((inv) => ({ inv, room: rooms.find((r) => r.id === inv.roomId), tenant: tenants.find((t) => t.id === (rooms.find((r) => r.id === inv.roomId)?.tenantId || -1)) }));
};

// ===== Property Detail Page (URL: #/properties/:id?tab=rooms|tenants|invoices) =====
function PropertyDetailPage() {
  const { id } = useParams();
  const pid = Number(id);
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "rooms";
  const navigate = useNavigate();

  const roomsOf = selectPropertyRooms(pid);
  const tenantsOf = selectPropertyTenants(pid);
  const invoicesOf = selectPropertyInvoices(pid);
  const property = propertiesSeed.find((p) => p.id === pid);

  const totalRooms = roomsOf.length;
  const occupied = roomsOf.filter((r) => r.status === "Đang thuê").length;
  const revenueThisMonth = invoicesOf
    .filter((x) => x.inv.date && new Date(x.inv.date).getMonth() === 8)
    .reduce((s, x) => s + x.inv.total, 0);

  // Compatibility: setSearchParams with object
  const setTab = (t) => setSearchParams({ tab: t }, { replace: true });

  if (!property) {
    return (
      <Card className="p-6">
        <div className="text-sm">Không tìm thấy nhà trọ. <Link className="text-indigo-600 underline" to="/properties">Quay lại danh sách</Link></div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500"><Link className="text-indigo-600" to="/properties">Nhà trọ</Link> / Chi tiết</div>
          <h3 className="text-xl font-semibold mt-1">{property.name}</h3>
          <div className="text-sm text-gray-600">{property.address}</div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>Quay lại</Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="p-4"><div className="text-sm text-gray-500">Tổng số phòng</div><div className="text-xl font-semibold">{totalRooms}</div></Card>
        <Card className="p-4"><div className="text-sm text-gray-500">Đang thuê</div><div className="text-xl font-semibold">{occupied}</div></Card>
        <Card className="p-4"><div className="text-sm text-gray-500">Doanh thu tháng này</div><div className="text-xl font-semibold">{currency(revenueThisMonth)}</div></Card>
      </div>

      {/* Tabs */}
      <div className="border-b mb-3">
        <nav className="-mb-px flex gap-6">
          {[
            { key: "rooms", label: "Phòng" },
            { key: "tenants", label: "Khách" },
            { key: "invoices", label: "Hóa đơn" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`whitespace-nowrap border-b-2 px-1 py-2 text-sm font-medium ${
                tab === t.key ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {tab === "rooms" && (
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Mã phòng</th>
                  <th className="px-6 py-3">Trạng thái</th>
                  <th className="px-6 py-3">Khách thuê</th>
                  <th className="px-6 py-3">Giá</th>
                  <th className="px-6 py-3">Cọc</th>
                  <th className="px-6 py-3">Diện tích</th>
                </tr>
              </thead>
              <tbody>
                {roomsOf.map((r) => {
                  const tenant = r.tenantId ? tenants.find((t) => t.id === r.tenantId) : null;
                  const st = r.status === "Đang thuê" ? <Badge color="green">Đang thuê</Badge> : r.status === "Trống" ? <Badge color="blue">Trống</Badge> : <Badge color="yellow">Sửa chữa</Badge>;
                  return (
                    <tr key={r.id} className="bg-white border-b">
                      <td className="px-6 py-3 font-medium">{r.name}</td>
                      <td className="px-6 py-3">{st}</td>
                      <td className="px-6 py-3">{tenant ? tenant.name : "(Trống)"}</td>
                      <td className="px-6 py-3">{currency(r.price)}</td>
                      <td className="px-6 py-3">{currency(r.deposit)}</td>
                      <td className="px-6 py-3">{r.area} m²</td>
                    </tr>
                  );
                })}
                {roomsOf.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-6 text-center text-gray-500">Chưa có phòng.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === "tenants" && (
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Khách thuê</th>
                  <th className="px-6 py-3">Phòng</th>
                  <th className="px-6 py-3">Kết thúc HĐ</th>
                  <th className="px-6 py-3">Tạm trú</th>
                </tr>
              </thead>
              <tbody>
                {tenantsOf.map(({ tenant, room, contract }) => (
                  <tr key={tenant?.id || Math.random()} className="bg-white border-b">
                    <td className="px-6 py-3 font-medium">{tenant?.name || "(Chưa có)"}<div className="text-xs text-gray-500">{tenant?.phone}</div></td>
                    <td className="px-6 py-3">{room?.name}</td>
                    <td className="px-6 py-3">{fdate(contract?.endDate)}</td>
                    <td className="px-6 py-3">{contract?.residenceStatus === "Đã đăng ký" ? <Badge color="green">Đã đăng ký</Badge> : <Badge color="red">Chưa đăng ký</Badge>}</td>
                  </tr>
                ))}
                {tenantsOf.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-6 text-center text-gray-500">Chưa có khách thuê.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === "invoices" && (
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Phòng</th>
                  <th className="px-6 py-3">Khách thuê</th>
                  <th className="px-6 py-3">Tổng tiền</th>
                  <th className="px-6 py-3">Trạng thái</th>
                  <th className="px-6 py-3">Ngày thanh toán</th>
                </tr>
              </thead>
              <tbody>
                {invoicesOf.map(({ inv, room, tenant }) => (
                  <tr key={inv.id} className="bg-white border-b">
                    <td className="px-6 py-3 font-medium">{room?.name}</td>
                    <td className="px-6 py-3">{tenant?.name || "(Trống)"}</td>
                    <td className="px-6 py-3 font-semibold">{currency(inv.total)}</td>
                    <td className="px-6 py-3">{inv.status === "Đã thanh toán" ? <Badge color="green">Đã thanh toán</Badge> : inv.status === "Chưa thanh toán" ? <Badge color="yellow">Chưa thanh toán</Badge> : <Badge color="red">Quá hạn</Badge>}</td>
                    <td className="px-6 py-3">{inv.date ? fdate(inv.date) : "—"}</td>
                  </tr>
                ))}
                {invoicesOf.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-6 text-center text-gray-500">Chưa có hóa đơn.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

function PropertiesView() {
  const [items, setItems] = useState(propertiesSeed);
  const [modal, setModal] = useState({ open: false, mode: "add", current: null });
  const [confirm, setConfirm] = useState({ open: false, target: null });
  const [detail, setDetail] = useState({ open: false, prop: null, tab: "rooms" });

  const openAdd = () => setModal({ open: true, mode: "add", current: { name: "", address: "" } });
  const openEdit = (p) => setModal({ open: true, mode: "edit", current: { ...p } });
  const onClose = () => setModal({ open: false, mode: "add", current: null });

  const openDetail = (p) => setDetail({ open: true, prop: p, tab: "rooms" });
  const closeDetail = () => setDetail({ open: false, prop: null, tab: "rooms" });

  const save = () => {
    if (!modal.current?.name?.trim()) return;
    if (modal.mode === "add") {
      const nextId = Math.max(0, ...items.map((x) => x.id)) + 1;
      setItems([...items, { id: nextId, ...modal.current }]);
    } else {
      setItems(items.map((x) => (x.id === modal.current.id ? modal.current : x)));
    }
    onClose();
  };

  const askDelete = (p) => setConfirm({ open: true, target: p });
  const doDelete = () => {
    setItems(items.filter((x) => x.id !== confirm.target.id));
    setConfirm({ open: false, target: null });
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2"><Building2 className="h-5 w-5"/> Danh sách Nhà trọ</h3>
          <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2"/> Thêm nhà trọ</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Tên nhà trọ</th>
                <th className="px-6 py-3">Địa chỉ</th>
                <th className="px-6 py-3">Số phòng</th>
                <th className="px-6 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => {
                const roomCount = rooms.filter((r) => r.propertyId === p.id).length;
                return (
                  <tr key={p.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{p.name}</td>
                    <td className="px-6 py-4">{p.address}</td>
                    <td className="px-6 py-4">{roomCount}</td>
                    <td className="px-6 py-4 flex gap-2 flex-wrap">
                      <Button variant="outline" onClick={() => openDetail(p)}>Xem nhanh</Button>
                      <Link className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50" to={`/properties/${p.id}?tab=rooms`}>Mở trang chi tiết</Link>
                      <Button variant="outline" onClick={() => openEdit(p)}><Pencil className="h-4 w-4 mr-1"/>Sửa</Button>
                      <Button variant="danger" onClick={() => askDelete(p)}><Trash2 className="h-4 w-4 mr-1"/>Xóa</Button>
                    </td>
                  </tr>
                );
              })}
              {items.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-6 text-center text-gray-500">Chưa có nhà trọ nào. Bấm "Thêm nhà trọ" để tạo mới.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal add/edit */}
      <Modal
        open={modal.open}
        title={modal.mode === "add" ? "Thêm nhà trọ" : "Sửa nhà trọ"}
        onClose={onClose}
        footer={
          <>
            <Button variant="outline" onClick={onClose}>Hủy</Button>
            <Button onClick={save}>Lưu</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <Label>Tên nhà trọ</Label>
            <Input
              value={modal.current?.name || ""}
              onChange={(e) => setModal((m) => ({ ...m, current: { ...m.current, name: e.target.value } }))}
              placeholder="VD: Khu trọ Minh Phát"
            />
          </div>
          <div>
            <Label>Địa chỉ</Label>
            <Input
              value={modal.current?.address || ""}
              onChange={(e) => setModal((m) => ({ ...m, current: { ...m.current, address: e.target.value } }))}
              placeholder="Số nhà/đường, phường/xã, quận/huyện"
            />
          </div>
        </div>
      </Modal>

      {/* Confirm delete */}
      <Modal
        open={confirm.open}
        title="Xóa nhà trọ?"
        onClose={() => setConfirm({ open: false, target: null })}
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirm({ open: false, target: null })}>Hủy</Button>
            <Button variant="danger" onClick={doDelete}>Xóa</Button>
          </>
        }
      >
        <p>Bạn chắc chắn muốn xóa <strong>{confirm.target?.name}</strong>? Hành động này không thể hoàn tác.</p>
      </Modal>

      {/* Detail modal with tabs (Xem nhanh) */}
      <Modal
        open={detail.open}
        title={detail.prop ? `Chi tiết: ${detail.prop.name}` : "Chi tiết nhà trọ"}
        onClose={closeDetail}
        footer={<Button variant="outline" onClick={closeDetail}>Đóng</Button>}
      >
        {detail.prop && (
          <PropertyDetailInline pid={detail.prop.id} />
        )}
      </Modal>
    </div>
  );
}

// Reuse the same content as page, but inline for modal "Xem nhanh"
function PropertyDetailInline({ pid }) {
  const roomsOf = selectPropertyRooms(pid);
  const tenantsOf = selectPropertyTenants(pid);
  const invoicesOf = selectPropertyInvoices(pid);
  const [tab, setTab] = useState("rooms");
  const totalRooms = roomsOf.length;
  const occupied = roomsOf.filter((r) => r.status === "Đang thuê").length;
  const revenueThisMonth = invoicesOf
    .filter((x) => x.inv.date && new Date(x.inv.date).getMonth() === 8)
    .reduce((s, x) => s + x.inv.total, 0);
  return (
    <div>
      {/* Header summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <Card className="p-4"><div className="text-sm text-gray-500">Tổng số phòng</div><div className="text-xl font-semibold">{totalRooms}</div></Card>
        <Card className="p-4"><div className="text-sm text-gray-500">Đang thuê</div><div className="text-xl font-semibold">{occupied}</div></Card>
        <Card className="p-4"><div className="text-sm text-gray-500">Doanh thu tháng này</div><div className="text-xl font-semibold">{currency(revenueThisMonth)}</div></Card>
      </div>
      {/* Tabs */}
      <div className="border-b mb-3">
        <nav className="-mb-px flex gap-6">
          {[
            { key: "rooms", label: "Phòng" },
            { key: "tenants", label: "Khách" },
            { key: "invoices", label: "Hóa đơn" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`whitespace-nowrap border-b-2 px-1 py-2 text-sm font-medium ${
                tab === t.key ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>
      {/* Contents */}
      {tab === "rooms" && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Mã phòng</th>
                <th className="px-6 py-3">Trạng thái</th>
                <th className="px-6 py-3">Khách thuê</th>
                <th className="px-6 py-3">Giá</th>
                <th className="px-6 py-3">Cọc</th>
                <th className="px-6 py-3">Diện tích</th>
              </tr>
            </thead>
            <tbody>
              {roomsOf.map((r) => {
                const tenant = r.tenantId ? tenants.find((t) => t.id === r.tenantId) : null;
                const st = r.status === "Đang thuê" ? <Badge color="green">Đang thuê</Badge> : r.status === "Trống" ? <Badge color="blue">Trống</Badge> : <Badge color="yellow">Sửa chữa</Badge>;
                return (
                  <tr key={r.id} className="bg-white border-b">
                    <td className="px-6 py-3 font-medium">{r.name}</td>
                    <td className="px-6 py-3">{st}</td>
                    <td className="px-6 py-3">{tenant ? tenant.name : "(Trống)"}</td>
                    <td className="px-6 py-3">{currency(r.price)}</td>
                    <td className="px-6 py-3">{currency(r.deposit)}</td>
                    <td className="px-6 py-3">{r.area} m²</td>
                  </tr>
                );
              })}
              {roomsOf.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-6 text-center text-gray-500">Chưa có phòng.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {tab === "tenants" && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Khách thuê</th>
                <th className="px-6 py-3">Phòng</th>
                <th className="px-6 py-3">Kết thúc HĐ</th>
                <th className="px-6 py-3">Tạm trú</th>
              </tr>
            </thead>
            <tbody>
              {tenantsOf.map(({ tenant, room, contract }) => (
                <tr key={tenant?.id || Math.random()} className="bg-white border-b">
                  <td className="px-6 py-3 font-medium">{tenant?.name || "(Chưa có)"}<div className="text-xs text-gray-500">{tenant?.phone}</div></td>
                  <td className="px-6 py-3">{room?.name}</td>
                  <td className="px-6 py-3">{fdate(contract?.endDate)}</td>
                  <td className="px-6 py-3">{contract?.residenceStatus === "Đã đăng ký" ? <Badge color="green">Đã đăng ký</Badge> : <Badge color="red">Chưa đăng ký</Badge>}</td>
                </tr>
              ))}
              {tenantsOf.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-6 text-center text-gray-500">Chưa có khách thuê.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {tab === "invoices" && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Phòng</th>
                <th className="px-6 py-3">Khách thuê</th>
                <th className="px-6 py-3">Tổng tiền</th>
                <th className="px-6 py-3">Trạng thái</th>
                <th className="px-6 py-3">Ngày thanh toán</th>
              </tr>
            </thead>
            <tbody>
              {invoicesOf.map(({ inv, room, tenant }) => (
                <tr key={inv.id} className="bg-white border-b">
                  <td className="px-6 py-3 font-medium">{room?.name}</td>
                  <td className="px-6 py-3">{tenant?.name || "(Trống)"}</td>
                  <td className="px-6 py-3 font-semibold">{currency(inv.total)}</td>
                  <td className="px-6 py-3">{inv.status === "Đã thanh toán" ? <Badge color="green">Đã thanh toán</Badge> : inv.status === "Chưa thanh toán" ? <Badge color="yellow">Chưa thanh toán</Badge> : <Badge color="red">Quá hạn</Badge>}</td>
                  <td className="px-6 py-3">{inv.date ? fdate(inv.date) : "—"}</td>
                </tr>
              ))}
              {invoicesOf.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-6 text-center text-gray-500">Chưa có hóa đơn.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function RoomsView() {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Danh sách phòng trọ</h3>
        <div className="flex gap-2">
          <Link to="/properties" className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50 flex items-center"><Building2 className="h-4 w-4 mr-2"/> Quản lý Nhà trọ</Link>
          <Button><Plus className="h-5 w-5 mr-2" /> Thêm phòng mới</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Mã phòng</th>
              <th className="px-6 py-3">Khu trọ</th>
              <th className="px-6 py-3">Trạng thái</th>
              <th className="px-6 py-3">Khách thuê</th>
              <th className="px-6 py-3">Giá thuê</th>
              <th className="px-6 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => {
              const property = propertiesSeed.find((p) => p.id === room.propertyId);
              const tenant = room.tenantId ? tenants.find((t) => t.id === room.tenantId) : null;
              const status = room.status === "Đang thuê" ? <Badge color="green">Đang thuê</Badge> : room.status === "Trống" ? <Badge color="blue">Trống</Badge> : <Badge color="yellow">Sửa chữa</Badge>;
              return (
                <tr key={room.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{room.name}</td>
                  <td className="px-6 py-4">{property?.name}</td>
                  <td className="px-6 py-4">{status}</td>
                  <td className="px-6 py-4">{tenant ? tenant.name : "(Trống)"}</td>
                  <td className="px-6 py-4">{currency(room.price)}</td>
                  <td className="px-6 py-4">
                    <a className="font-medium text-indigo-600 hover:underline" href="#">Xem chi tiết</a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function TenantsView() {
  const rows = contracts.map((c) => {
    const t = tenants.find((x) => x.id === c.tenantId);
    const r = rooms.find((x) => x.id === c.roomId);
    const p = propertiesSeed.find((x) => x.id === r?.propertyId);
    return { tenant: t, room: r, property: p, contract: c };
  });
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Danh sách khách thuê</h3>
        <Button><Plus className="h-5 w-5 mr-2" /> Thêm khách thuê</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Khách thuê</th>
              <th className="px-6 py-3">Phòng đang ở</th>
              <th className="px-6 py-3">Ngày kết thúc HĐ</th>
              <th className="px-6 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ tenant, room, property, contract }) => (
              <tr key={tenant?.id || Math.random()} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {tenant?.name}
                  <br />
                  <span className="text-xs text-gray-500">{tenant?.phone}</span>
                </td>
                <td className="px-6 py-4">{room?.name} - {property?.name}</td>
                <td className="px-6 py-4">{fdate(contract.endDate)}</td>
                <td className="px-6 py-4">
                  <a className="font-medium text-indigo-600 hover:underline" href="#">Xem hồ sơ</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function FinanceView() {
  const rows = invoices.map((inv) => {
    const room = rooms.find((r) => r.id === inv.roomId);
    const tenant = room?.tenantId ? tenants.find((t) => t.id === room.tenantId) : null;
    return { inv, room, tenant };
  });
  const badge = (st) => st === "Đã thanh toán" ? <Badge color="green">Đã thanh toán</Badge> : st === "Chưa thanh toán" ? <Badge color="yellow">Chưa thanh toán</Badge> : <Badge color="red">Quá hạn</Badge>;
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Quản lý thu chi - Tháng 9/2025</h3>
        <Button variant="green">Xuất Excel</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Phòng</th>
              <th className="px-6 py-3">Khách thuê</th>
              <th className="px-6 py-3">Tổng tiền</th>
              <th className="px-6 py-3">Trạng thái</th>
              <th className="px-6 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {rows.filter((r) => r.room && r.tenant).map(({ inv, room, tenant }) => (
              <tr key={inv.id + "-f"} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{room?.name}</td>
                <td className="px-6 py-4">{tenant?.name}</td>
                <td className="px-6 py-4 font-semibold">{currency(inv.total)}</td>
                <td className="px-6 py-4">{badge(inv.status)}</td>
                <td className="px-6 py-4">
                  <a className="font-medium text-indigo-600 hover:underline" href="#">Xem hóa đơn</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function MaintenanceView() {
  const col = (title, cls, items) => (
    <div>
      <h4 className={`font-semibold mb-2 p-2 rounded-md ${cls}`}>{title}</h4>
      <div className="space-y-3">
        {items.map((req) => {
          const room = req.roomId ? rooms.find((r) => r.id === req.roomId) : null;
          const property = req.propertyId ? propertiesSeed.find((p) => p.id === req.propertyId) : null;
          const location = room ? `Phòng ${room.name}` : `Khu ${property?.name}`;
          const prBadge = req.priority === "Gấp" ? <Badge color="red">Gấp</Badge> : req.priority === "Trung bình" ? <Badge color="yellow">Trung bình</Badge> : <Badge color="blue">Thấp</Badge>;
          return (
            <Card key={req.id} className="p-4 shadow-sm">
              <p className="font-semibold text-gray-800">{req.request}</p>
              <p className="text-sm text-gray-500 mt-1">{location}</p>
              <div className="mt-3 flex justify-between items-center">
                {prBadge}
                {req.cost ? <span className="text-sm font-semibold">{currency(req.cost)}</span> : <span />}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Theo dõi yêu cầu & sửa chữa</h3>
        <Button><Plus className="h-5 w-5 mr-2" /> Tạo yêu cầu mới</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {col("Yêu cầu mới", "bg-red-100 text-red-800", maints.filter((m) => m.status === "Yêu cầu mới"))}
        {col("Đang xử lý", "bg-yellow-100 text-yellow-800", maints.filter((m) => m.status === "Đang xử lý"))}
        {col("Đã hoàn thành", "bg-green-100 text-green-800", maints.filter((m) => m.status === "Đã hoàn thành"))}
      </div>
    </Card>
  );
}

function ResidenceView() {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Quản lý Đăng ký Tạm trú</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Khách thuê</th>
              <th className="px-6 py-3">Phòng đang ở</th>
              <th className="px-6 py-3">Ngày kết thúc HĐ</th>
              <th className="px-6 py-3">Trạng thái Tạm trú</th>
              <th className="px-6 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((c) => {
              const t = tenants.find((x) => x.id === c.tenantId);
              const r = rooms.find((x) => x.id === c.roomId);
              const p = propertiesSeed.find((x) => x.id === r?.propertyId);
              const badge = c.residenceStatus === "Đã đăng ký" ? <Badge color="green">Đã đăng ký</Badge> : <Badge color="red">Chưa đăng ký</Badge>;
              const action = c.residenceStatus === "Đã đăng ký" ? (
                <a className="font-medium text-red-600 hover:underline" href="#">Xóa đăng ký</a>
              ) : (
                <a className="font-medium text-green-600 hover:underline" href="#">Đánh dấu đã ĐK</a>
              );
              return (
                <tr key={c.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {t?.name}
                    <br />
                    <span className="text-xs text-gray-500">{t?.phone}</span>
                  </td>
                  <td className="px-6 py-4">{r?.name} - {p?.name}</td>
                  <td className="px-6 py-4">{fdate(c.endDate)}</td>
                  <td className="px-6 py-4">{badge}</td>
                  <td className="px-6 py-4">{action}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ===== Settings (placeholder) =====
function SettingsView() {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Cài đặt</h3>
      <p className="text-sm text-gray-600">Trang cài đặt đang được phát triển.</p>
    </Card>
  );
}

// ===== Shell with Router =====
function Shell() {
  const location = useLocation();
  const today = new Date().toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const nav = [
    { path: "/dashboard", label: "Bảng điều khiển", icon: LayoutDashboard },
    { path: "/properties", label: "Quản lý Nhà trọ", icon: Building2 },
    { path: "/rooms", label: "Quản lý Phòng trọ", icon: Home },
    { path: "/tenants", label: "Quản lý Khách thuê", icon: Users },
    { path: "/finance", label: "Quản lý Tài chính", icon: DollarSign },
    { path: "/maintenance", label: "Yêu cầu & Sửa chữa", icon: Wrench },
    { path: "/residence", label: "Quản lý Tạm trú", icon: ClipboardList },
    { path: "/settings", label: "Cài đặt", icon: Settings },
  ];

  const activePath = location.pathname || "/dashboard";
  const activeLabel = nav.find((n) => activePath.startsWith(n.path))?.label || "Bảng điều khiển";

  return (
    <div className="bg-gray-100 font-sans min-h-screen">
      <div className="flex h-screen bg-gray-200">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 bg-white shadow-lg">
          <div className="flex items-center justify-center h-20 border-b">
            <h1 className="text-2xl font-bold text-indigo-600">Trọ Tốt</h1>
          </div>
          <nav className="mt-5 px-2">
            {nav.map((item) => {
              const Icon = item.icon;
              const activeCls = activePath.startsWith(item.path) ? "bg-indigo-500 text-white" : "text-gray-700 hover:bg-indigo-500 hover:text-white";
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center w-full text-left px-4 py-3 rounded-md ${activeCls}`}
                >
                  <Icon className="mr-3 h-5 w-5" /> {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="flex justify-between items-center p-4 bg-white border-b">
            <div className="flex items-center">
              <button className="text-gray-500 focus:outline-none md:hidden mr-2">
                <Menu className="h-6 w-6" />
              </button>
              <h2 className="text-2xl font-semibold text-gray-800">{activeLabel}</h2>
            </div>
            <div className="text-sm text-gray-600">Hôm nay: <span>{today}</span></div>
          </header>

          {/* Views */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardView />} />
              <Route path="/properties" element={<PropertiesView />} />
              <Route path="/properties/:id" element={<PropertyDetailPage />} />
              <Route path="/rooms" element={<RoomsView />} />
              <Route path="/tenants" element={<TenantsView />} />
              <Route path="/finance" element={<FinanceView />} />
              <Route path="/maintenance" element={<MaintenanceView />} />
              <Route path="/residence" element={<ResidenceView />} />
              <Route path="/settings" element={<SettingsView />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

// ===== App (HashRouter wrapper) =====
export default function MotelConsoleApp() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  );
}
