import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from "react";
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
  AlertTriangle,
  Building2,
  FileText,
  BarChart3,
  ClipboardPaste,
  FileDown,
  CalendarDays,
  Zap,
  Droplet,
  Paperclip,
  UserPlus,
  ChevronRight,
  ShieldCheck,
  Pencil,
  Trash2,
  X,
  Wifi,
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
const Input = ({ className = "", ...props }) => (
  <input
    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${className}`}
    {...props}
  />
);
const Label = ({ children }) => (
  <label className="block text-sm font-medium text-gray-700">{children}</label>
);

const ActionLogContext = createContext({ logs: [], appendLog: () => {}, clearLogs: () => {} });

function ActionLogProvider({ children }) {
  const [logs, setLogs] = useState([]);

  const appendLog = (entry) => {
    if (!entry || !entry.message) return;
    setLogs((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        timestamp: new Date().toISOString(),
        type: entry.type || "general",
        message: entry.message,
        meta: entry.meta || {},
      },
      ...prev,
    ]);
  };

  const clearLogs = () => setLogs([]);

  return (
    <ActionLogContext.Provider value={{ logs, appendLog, clearLogs }}>
      {children}
    </ActionLogContext.Provider>
  );
}

const useActionLog = () => useContext(ActionLogContext);

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
  {
    id: 1,
    code: "HD-AP-2025-01",
    roomId: 101,
    tenantId: 1,
    status: "ACTIVE",
    createdAt: "2025-06-20",
    startDate: "2025-07-01",
    endDate: "2026-07-01",
    billingCycle: "Hàng tháng",
    rent: 3500000,
    deposit: 3500000,
    electricityRate: 3500,
    waterRate: 18000,
    serviceFees: [
      { label: "Phí vệ sinh chung", amount: 50000 },
      { label: "Wifi", amount: 120000 },
    ],
    meterBaseline: { electricity: 235, water: 68 },
    checkinChecklist: { deposit: true, meter: true, documents: true },
    dependents: [
      { name: "Lê Thị Mai", relation: "Vợ", idCard: "038095000112" },
    ],
    attachments: 3,
    notes: "Khách đã ký phụ lục số 1 ngày 25/6.",
    residenceStatus: "Đã đăng ký",
  },
  {
    id: 2,
    code: "HD-AP-2024-11",
    roomId: 102,
    tenantId: 2,
    status: "ENDING",
    createdAt: "2024-10-15",
    startDate: "2024-10-29",
    endDate: "2025-10-29",
    billingCycle: "Hàng tháng",
    rent: 3500000,
    deposit: 3500000,
    electricityRate: 3600,
    waterRate: 19000,
    serviceFees: [{ label: "Phí rác", amount: 50000 }],
    meterBaseline: { electricity: 410, water: 92 },
    checkinChecklist: { deposit: true, meter: true, documents: false },
    dependents: [],
    attachments: 2,
    notes: "Chuẩn bị gia hạn trước 45 ngày.",
    residenceStatus: "Đã đăng ký",
  },
  {
    id: 3,
    code: "HD-BH-2025-09",
    roomId: 201,
    tenantId: 3,
    status: "ACTIVE",
    createdAt: "2025-08-20",
    startDate: "2025-09-15",
    endDate: "2026-09-15",
    billingCycle: "Hàng tháng",
    rent: 4000000,
    deposit: 4000000,
    electricityRate: 3400,
    waterRate: 17000,
    serviceFees: [
      { label: "Giữ xe", amount: 150000 },
      { label: "Wifi", amount: 100000 },
    ],
    meterBaseline: { electricity: 128, water: 45 },
    checkinChecklist: { deposit: true, meter: false, documents: false },
    dependents: [
      { name: "Phạm Văn Đông", relation: "Bạn cùng phòng", idCard: "055092000555" },
    ],
    attachments: 1,
    notes: "Cần thu hồ sơ tạm trú trong tuần đầu tiên.",
    residenceStatus: "Chưa đăng ký",
  },
  {
    id: 4,
    code: "HD-BH-2025-03",
    roomId: 202,
    tenantId: 4,
    status: "ACTIVE",
    createdAt: "2025-03-10",
    startDate: "2025-03-28",
    endDate: "2026-03-28",
    billingCycle: "Hàng tháng",
    rent: 4000000,
    deposit: 4000000,
    electricityRate: 3400,
    waterRate: 17000,
    serviceFees: [{ label: "Phí vệ sinh", amount: 50000 }],
    meterBaseline: { electricity: 215, water: 70 },
    checkinChecklist: { deposit: true, meter: true, documents: true },
    dependents: [],
    attachments: 4,
    notes: "Hợp đồng kèm điều khoản nuôi thú cưng.",
    residenceStatus: "Đã đăng ký",
  },
  {
    id: 5,
    code: "HD-BH-2025-01",
    roomId: 203,
    tenantId: 5,
    status: "ACTIVE",
    createdAt: "2024-12-20",
    startDate: "2025-01-10",
    endDate: "2026-01-10",
    billingCycle: "Hàng tháng",
    rent: 4200000,
    deposit: 4200000,
    electricityRate: 3500,
    waterRate: 18500,
    serviceFees: [
      { label: "Giữ xe", amount: 200000 },
      { label: "Vệ sinh", amount: 60000 },
    ],
    meterBaseline: { electricity: 512, water: 98 },
    checkinChecklist: { deposit: true, meter: true, documents: true },
    dependents: [
      { name: "Nguyễn Cao Kỳ", relation: "Đồng cư", idCard: "079096000556" },
    ],
    attachments: 5,
    notes: "Khách yêu cầu nhắc trước 5 ngày khi thu tiền điện.",
    residenceStatus: "Đã đăng ký",
  },
  {
    id: 6,
    code: "HD-LT-2025-08",
    roomId: 301,
    tenantId: 6,
    status: "DRAFT",
    createdAt: "2025-08-01",
    startDate: "2025-08-15",
    endDate: "2026-08-15",
    billingCycle: "Hàng tháng",
    rent: 3200000,
    deposit: 3000000,
    electricityRate: 3200,
    waterRate: 16000,
    serviceFees: [{ label: "Wifi", amount: 100000 }],
    meterBaseline: { electricity: 60, water: 22 },
    checkinChecklist: { deposit: false, meter: false, documents: false },
    dependents: [],
    attachments: 0,
    notes: "Chờ khách chuyển cọc và xác minh CCCD.",
    residenceStatus: "Chưa đăng ký",
  },
  {
    id: 7,
    code: "HD-LT-2024-12",
    roomId: 303,
    tenantId: 7,
    status: "TERMINATED",
    createdAt: "2024-11-01",
    startDate: "2024-11-20",
    endDate: "2025-06-30",
    billingCycle: "Hàng tháng",
    rent: 3300000,
    deposit: 3300000,
    electricityRate: 3300,
    waterRate: 16500,
    serviceFees: [],
    meterBaseline: { electricity: 95, water: 30 },
    checkinChecklist: { deposit: true, meter: true, documents: true },
    dependents: [],
    attachments: 2,
    notes: "Khách trả phòng sớm do chuyển công tác.",
    residenceStatus: "Đã đăng ký",
  },
  {
    id: 8,
    code: "HD-LT-2025-05",
    roomId: 304,
    tenantId: 8,
    status: "ACTIVE",
    createdAt: "2025-04-15",
    startDate: "2025-05-01",
    endDate: "2026-05-01",
    billingCycle: "Hàng tháng",
    rent: 3300000,
    deposit: 3300000,
    electricityRate: 3300,
    waterRate: 16500,
    serviceFees: [{ label: "Giữ xe", amount: 150000 }],
    meterBaseline: { electricity: 180, water: 55 },
    checkinChecklist: { deposit: true, meter: true, documents: true },
    dependents: [
      { name: "Trịnh Văn Sơn", relation: "Bạn cùng phòng", idCard: "045099000889" },
    ],
    attachments: 1,
    notes: "Gia hạn đăng ký tạm trú vào tháng 5.",
    residenceStatus: "Đã đăng ký",
  },
  {
    id: 9,
    code: "HD-AP-2025-04",
    roomId: 105,
    tenantId: 9,
    status: "ACTIVE",
    createdAt: "2025-03-25",
    startDate: "2025-04-12",
    endDate: "2026-04-12",
    billingCycle: "Hàng tháng",
    rent: 3800000,
    deposit: 3800000,
    electricityRate: 3500,
    waterRate: 18000,
    serviceFees: [{ label: "Phí vệ sinh", amount: 60000 }],
    meterBaseline: { electricity: 305, water: 80 },
    checkinChecklist: { deposit: true, meter: true, documents: false },
    dependents: [],
    attachments: 3,
    notes: "Chờ khách bổ sung giấy xác nhận tạm trú online.",
    residenceStatus: "Đã đăng ký",
  },
  {
    id: 10,
    code: "HD-BH-2025-02",
    roomId: 204,
    tenantId: 10,
    status: "DRAFT",
    createdAt: "2025-02-05",
    startDate: "2025-02-22",
    endDate: "2026-02-22",
    billingCycle: "Hàng tháng",
    rent: 4000000,
    deposit: 4000000,
    electricityRate: 3400,
    waterRate: 17000,
    serviceFees: [{ label: "Wifi", amount: 120000 }],
    meterBaseline: { electricity: 142, water: 40 },
    checkinChecklist: { deposit: false, meter: false, documents: false },
    dependents: [],
    attachments: 0,
    notes: "Chờ khách ký nháy từng trang và chuyển khoản đặt cọc.",
    residenceStatus: "Chưa đăng ký",
  },
];

const contractPartiesSeed = [
  { id: "CP-1", contractId: 1, personId: 1, role: "PRIMARY", joinDate: "2025-07-01", status: "ACTIVE" },
  { id: "CP-2", contractId: 2, personId: 2, role: "PRIMARY", joinDate: "2024-10-29", status: "ACTIVE" },
  { id: "CP-3", contractId: 3, personId: 3, role: "PRIMARY", joinDate: "2025-09-15", status: "ACTIVE" },
  { id: "CP-4", contractId: 4, personId: 4, role: "PRIMARY", joinDate: "2025-03-28", status: "ACTIVE" },
  { id: "CP-5", contractId: 5, personId: 5, role: "PRIMARY", joinDate: "2025-01-10", status: "ACTIVE" },
  { id: "CP-6", contractId: 6, personId: 6, role: "PRIMARY", joinDate: "2025-08-15", status: "PENDING" },
  { id: "CP-7", contractId: 7, personId: 7, role: "PRIMARY", joinDate: "2024-11-20", status: "LEFT", endDate: "2025-06-30" },
  { id: "CP-8", contractId: 8, personId: 8, role: "PRIMARY", joinDate: "2025-05-01", status: "ACTIVE" },
  { id: "CP-9", contractId: 9, personId: 9, role: "PRIMARY", joinDate: "2025-04-12", status: "ACTIVE" },
  { id: "CP-10", contractId: 10, personId: 10, role: "PRIMARY", joinDate: "2025-02-22", status: "PENDING" },
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

const serviceCatalogSeed = [
  { id: "electricity", name: "Điện", unitPrice: 3500, method: "meter", unit: "kWh", locked: true },
  { id: "water", name: "Nước", unitPrice: 18000, method: "meter", unit: "m³", locked: true },
  { id: "wifi", name: "Wifi", unitPrice: 65000, method: "per-room" },
  { id: "trash", name: "Rác sinh hoạt", unitPrice: 30000, method: "per-room" },
  { id: "security", name: "An ninh", unitPrice: 50000, method: "per-person" },
];

const serviceUsageSeedMonths = ["2025-08", "2025-09"];
const serviceUsageSeed = contracts.flatMap((contract) => {
  if (!["ACTIVE", "ENDING", "DRAFT"].includes(contract.status)) return [];
  const hasWifiFee = (contract.serviceFees || []).some((fee) => fee.label?.toLowerCase().includes("wifi"));
  const hasTrashFee = (contract.serviceFees || []).some((fee) => fee.label?.toLowerCase().includes("rác"));
  const baseElectric = contract.meterBaseline?.electricity ?? 0;
  const baseWater = contract.meterBaseline?.water ?? 0;

  return serviceUsageSeedMonths.map((month, index) => {
    const monthFactor = index + 1;
    return {
      id: `${contract.id}-${month}`,
      contractId: contract.id,
      month,
      electricity: {
        current: baseElectric ? baseElectric + 18 * monthFactor : null,
      },
      water: {
        current: baseWater ? baseWater + 6 * monthFactor : null,
      },
      wifiDevices: hasWifiFee ? 2 + index : 0,
      trashIncluded: hasTrashFee,
      otherAdjustments: { amount: 0, note: "" },
    };
  });
});

const ServiceContext = createContext({
  serviceCatalog: [],
  addService: () => {},
  updateService: () => {},
  removeService: () => {},
  serviceUsage: [],
  upsertUsageRecord: () => {},
  ensureMonthRecords: () => {},
  previousMonth: () => null,
  nextMonth: () => null,
});

const useServices = () => useContext(ServiceContext);

const previousMonth = (month) => {
  if (!month) return null;
  const [year, rawMonth] = month.split("-").map(Number);
  if (!year || !rawMonth) return null;
  const date = new Date(Date.UTC(year, rawMonth - 1, 1));
  date.setUTCMonth(date.getUTCMonth() - 1);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
};

const nextMonth = (month) => {
  if (!month) return null;
  const [year, rawMonth] = month.split("-").map(Number);
  if (!year || !rawMonth) return null;
  const date = new Date(Date.UTC(year, rawMonth - 1, 1));
  date.setUTCMonth(date.getUTCMonth() + 1);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
};

function ServiceProvider({ children }) {
  const [serviceCatalog, setServiceCatalog] = useState(serviceCatalogSeed);
  const [serviceUsage, setServiceUsage] = useState(serviceUsageSeed);

  const addService = (service) => {
    if (!service?.name?.trim()) return;
    const name = service.name.trim();
    const baseId = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const uniqueId = baseId && !serviceCatalog.some((item) => item.id === baseId)
      ? baseId
      : `${baseId || "service"}-${Date.now().toString(16)}`;
    const payload = {
      id: uniqueId,
      name,
      unitPrice: Number(service.unitPrice) || 0,
      method: service.method || "per-room",
      unit: service.unit || "",
    };
    setServiceCatalog((prev) => [...prev, payload]);
  };

  const updateService = (id, patch) => {
    setServiceCatalog((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const removeService = (id) => {
    const target = serviceCatalog.find((item) => item.id === id);
    if (target?.locked) return;
    setServiceCatalog((prev) => prev.filter((item) => item.id !== id));
  };

  const upsertUsageRecord = (contractId, month, patch) => {
    if (!contractId || !month) return;
    setServiceUsage((prev) => {
      const idx = prev.findIndex((item) => item.contractId === contractId && item.month === month);
      if (idx === -1) {
        return [
          ...prev,
          {
            id: `${contractId}-${month}`,
            contractId,
            month,
            electricity: { current: null },
            water: { current: null },
            wifiDevices: 0,
            trashIncluded: false,
            otherAdjustments: { amount: 0, note: "" },
            ...patch,
          },
        ];
      }
      const next = [...prev];
      next[idx] = {
        ...next[idx],
        ...patch,
        electricity: patch?.electricity
          ? { ...next[idx].electricity, ...patch.electricity }
          : next[idx].electricity,
        water: patch?.water ? { ...next[idx].water, ...patch.water } : next[idx].water,
        otherAdjustments: patch?.otherAdjustments
          ? { ...next[idx].otherAdjustments, ...patch.otherAdjustments }
          : next[idx].otherAdjustments,
      };
      return next;
    });
  };

  const ensureMonthRecords = (month, contractList) => {
    if (!month || !Array.isArray(contractList) || contractList.length === 0) return;
    setServiceUsage((prev) => {
      const exists = prev.some((item) => item.month === month);
      if (exists) return prev;
      const additions = contractList.map((contract) => {
        const previous = [...prev]
          .filter((item) => item.contractId === contract.id)
          .sort((a, b) => a.month.localeCompare(b.month))
          .slice(-1)[0];
        const electricCurrent = previous?.electricity?.current ?? contract.meterBaseline?.electricity ?? null;
        const waterCurrent = previous?.water?.current ?? contract.meterBaseline?.water ?? null;
        const wifiDevices = contract.status === "TERMINATED"
          ? 0
          : previous?.wifiDevices ?? ((contract.serviceFees || []).some((fee) => fee.label?.toLowerCase().includes("wifi")) ? 1 : 0);
        const trashIncluded = previous?.trashIncluded ?? ((contract.serviceFees || []).some((fee) => fee.label?.toLowerCase().includes("rác")));

        return {
          id: `${contract.id}-${month}`,
          contractId: contract.id,
          month,
          electricity: { current: electricCurrent },
          water: { current: waterCurrent },
          wifiDevices,
          trashIncluded,
          otherAdjustments: previous?.otherAdjustments ? { ...previous.otherAdjustments } : { amount: 0, note: "" },
        };
      });
      return [...prev, ...additions];
    });
  };

  const value = useMemo(
    () => ({
      serviceCatalog,
      addService,
      updateService,
      removeService,
      serviceUsage,
      upsertUsageRecord,
      ensureMonthRecords,
      previousMonth,
      nextMonth,
    }),
    [serviceCatalog, serviceUsage]
  );

  return <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>;
}

const getServiceMonths = (usage) => {
  const distinct = new Set((usage || []).map((item) => item.month));
  return Array.from(distinct).sort((a, b) => a.localeCompare(b));
};

const findServiceRecord = (usage, contractId, month) => {
  if (!month) return null;
  return (usage || []).find((item) => item.contractId === contractId && item.month === month) || null;
};

const getPreviousMeterValue = (contract, usage, month, key, previousMonthFn) => {
  if (!contract) return null;
  if (!month) {
    return contract.meterBaseline?.[key] ?? null;
  }
  let cursor = previousMonthFn(month);
  const startMonth = contract.startDate ? contract.startDate.slice(0, 7) : null;
  const maxLookback = 60;
  let steps = 0;
  while (cursor && steps < maxLookback) {
    if (startMonth && cursor < startMonth) break;
    const record = findServiceRecord(usage, contract.id, cursor);
    const value = record?.[key]?.current;
    if (value != null) return value;
    cursor = previousMonthFn(cursor);
    steps += 1;
  }
  return contract.meterBaseline?.[key] ?? null;
};

const computeMeterConsumptionValue = (contract, usage, month, key, previousMonthFn) => {
  if (!contract || !month) return null;
  const record = findServiceRecord(usage, contract.id, month);
  const current = record?.[key]?.current;
  if (current == null) return null;
  const previousValue = getPreviousMeterValue(contract, usage, month, key, previousMonthFn);
  if (previousValue == null) return null;
  return current - previousValue;
};

const summarizeContractServices = (contract, usage, catalog, month, previousMonthFn, overrides = null) => {
  if (!contract || !month) return null;
  const electricityCatalog = catalog.find((item) => item.id === "electricity") || null;
  const waterCatalog = catalog.find((item) => item.id === "water") || null;
  const wifiCatalog = catalog.find((item) => item.id === "wifi") || null;
  const trashCatalog = catalog.find((item) => item.id === "trash") || null;
  const securityCatalog = catalog.find((item) => item.id === "security") || null;

  const overrideEntry = overrides?.[contract.id];
  const override = overrideEntry && overrideEntry.month === month ? overrideEntry : null;

  const baseRecord = findServiceRecord(usage, contract.id, month);
  let record = baseRecord || {
    id: `${contract.id}-${month}`,
    contractId: contract.id,
    month,
    electricity: { current: null },
    water: { current: null },
    wifiDevices: 0,
    trashIncluded: false,
    otherAdjustments: { amount: 0, note: "" },
  };

  if (override) {
    if (override.electricCurrent !== undefined) {
      record = {
        ...record,
        electricity: {
          ...(record.electricity || {}),
          current: override.electricCurrent,
        },
      };
    }
    if (override.waterCurrent !== undefined) {
      record = {
        ...record,
        water: {
          ...(record.water || {}),
          current: override.waterCurrent,
        },
      };
    }
    if (override.wifiDevices !== undefined) {
      record = {
        ...record,
        wifiDevices: override.wifiDevices,
      };
    }
    if (override.trashIncluded !== undefined) {
      record = {
        ...record,
        trashIncluded: override.trashIncluded,
      };
    }
    if (override.otherAmount !== undefined || override.note !== undefined) {
      const baseAdj = record.otherAdjustments || { amount: 0, note: "" };
      record = {
        ...record,
        otherAdjustments: {
          amount: override.otherAmount !== undefined ? override.otherAmount : baseAdj.amount,
          note: override.note !== undefined ? override.note : baseAdj.note,
        },
      };
    }
  }

  const electricityPrev = getPreviousMeterValue(contract, usage, month, "electricity", previousMonthFn);
  const waterPrev = getPreviousMeterValue(contract, usage, month, "water", previousMonthFn);
  const electricityCurrent = record?.electricity?.current ?? null;
  const waterCurrent = record?.water?.current ?? null;
  const electricityConsumption = computeMeterConsumptionValue(contract, usage, month, "electricity", previousMonthFn);
  const waterConsumption = computeMeterConsumptionValue(contract, usage, month, "water", previousMonthFn);
  const prevMonthKey = previousMonthFn(month);
  const prevElectricityConsumption = computeMeterConsumptionValue(contract, usage, prevMonthKey, "electricity", previousMonthFn);
  const prevWaterConsumption = computeMeterConsumptionValue(contract, usage, prevMonthKey, "water", previousMonthFn);

  const electricityRate = contract.electricityRate || electricityCatalog?.unitPrice || 0;
  const waterRate = contract.waterRate || waterCatalog?.unitPrice || 0;
  const electricityAmount = electricityConsumption && electricityConsumption > 0 ? electricityConsumption * electricityRate : 0;
  const waterAmount = waterConsumption && waterConsumption > 0 ? waterConsumption * waterRate : 0;

  const wifiDevices = contract.status === "TERMINATED" ? 0 : record?.wifiDevices ?? 0;
  const wifiAmount = wifiDevices * (wifiCatalog?.unitPrice || 0);
  const trashIncluded = !!record?.trashIncluded;
  const trashAmount = trashIncluded ? trashCatalog?.unitPrice || 0 : 0;
  const occupants = ["ACTIVE", "ENDING"].includes(contract.status)
    ? 1 + (contract.dependents?.length || 0)
    : 0;
  const securityAmount = occupants * (securityCatalog?.unitPrice || 0);
  const otherNote = record?.otherAdjustments?.note || "";
  const otherAmount = Number(record?.otherAdjustments?.amount || 0);
  const totalAmount = electricityAmount + waterAmount + wifiAmount + trashAmount + securityAmount + otherAmount;

  const electricityDelta =
    electricityConsumption != null && prevElectricityConsumption != null
      ? electricityConsumption - prevElectricityConsumption
      : null;
  const waterDelta =
    waterConsumption != null && prevWaterConsumption != null
      ? waterConsumption - prevWaterConsumption
      : null;

  const alerts = [];
  if (electricityConsumption != null && electricityConsumption < 0) {
    alerts.push("Chỉ số điện âm – cần kiểm tra lại.");
  }
  if (waterConsumption != null && waterConsumption < 0) {
    alerts.push("Chỉ số nước âm – cần kiểm tra lại.");
  }
  if (prevElectricityConsumption != null && electricityConsumption != null && prevElectricityConsumption > 0 && electricityConsumption >= prevElectricityConsumption * 1.5) {
    alerts.push("Điện tăng trên 50% so với kỳ trước.");
  }
  if (prevWaterConsumption != null && waterConsumption != null && prevWaterConsumption > 0 && waterConsumption >= prevWaterConsumption * 1.5) {
    alerts.push("Nước tăng trên 50% so với kỳ trước.");
  }

  return {
    month,
    record,
    electricity: {
      prev: electricityPrev,
      current: electricityCurrent,
      consumption: electricityConsumption,
      previousConsumption: prevElectricityConsumption,
      delta: electricityDelta,
      rate: electricityRate,
      amount: electricityAmount,
    },
    water: {
      prev: waterPrev,
      current: waterCurrent,
      consumption: waterConsumption,
      previousConsumption: prevWaterConsumption,
      delta: waterDelta,
      rate: waterRate,
      amount: waterAmount,
    },
    wifi: {
      devices: wifiDevices,
      amount: wifiAmount,
    },
    trash: {
      included: trashIncluded,
      amount: trashAmount,
    },
    security: {
      occupants,
      amount: securityAmount,
    },
    other: {
      amount: otherAmount,
      note: otherNote,
    },
    total: totalAmount,
    alerts,
  };
};

const formatBillingMonth = (month) => {
  if (!month) return "—";
  const [year, monthPart] = month.split("-").map(Number);
  if (!year || !monthPart) return month;
  const date = new Date(year, monthPart - 1, 1);
  return date.toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" });
};

const guessBuildingCode = (room) => {
  if (!room?.name) return "Khác";
  const match = room.name.match(/^[A-Za-z]+/);
  return (match ? match[0] : room.name.charAt(0) || "Khác").toUpperCase();
};

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
  const [selectedPropertyId, setSelectedPropertyId] = useState(() => propertiesSeed[0]?.id ?? null);
  const [editMode, setEditMode] = useState(false);
  const [roomModal, setRoomModal] = useState({ open: false, room: null });
  const [roomForm, setRoomForm] = useState({ open: false, mode: "add", current: null });
  const [roomEditMode, setRoomEditMode] = useState(false);
  const { serviceUsage, serviceCatalog, previousMonth } = useServices();
  const serviceMonths = useMemo(() => getServiceMonths(serviceUsage), [serviceUsage]);
  const activeServiceMonth = serviceMonths.length ? serviceMonths[serviceMonths.length - 1] : null;

  useEffect(() => {
    if (items.length === 0) {
      if (selectedPropertyId !== null) setSelectedPropertyId(null);
      return;
    }
    if (!selectedPropertyId || !items.some((p) => p.id === selectedPropertyId)) {
      setSelectedPropertyId(items[0].id);
    }
  }, [items, selectedPropertyId]);

  const [roomItems, setRoomItems] = useState(() => rooms.map((r) => ({ ...r })));

  const selectedProperty = selectedPropertyId ? items.find((p) => p.id === selectedPropertyId) : null;
  const roomsOfSelected = selectedProperty ? roomItems.filter((r) => r.propertyId === selectedProperty.id) : [];
  const currentRoom = roomModal.room;
  const currentRoomProperty = currentRoom ? items.find((p) => p.id === currentRoom.propertyId) || propertiesSeed.find((p) => p.id === currentRoom.propertyId) : null;
  const currentRoomTenant = currentRoom?.tenantId ? tenants.find((t) => t.id === currentRoom.tenantId) : null;
  const currentRoomContract = currentRoom ? contracts.find((c) => c.roomId === currentRoom.id) : null;
  const { appendLog } = useActionLog();

  const currentRoomServiceSummary = useMemo(() => {
    if (!currentRoomContract || !activeServiceMonth) return null;
    return summarizeContractServices(currentRoomContract, serviceUsage, serviceCatalog, activeServiceMonth, previousMonth);
  }, [currentRoomContract, activeServiceMonth, serviceUsage, serviceCatalog, previousMonth]);

  const propertyServiceOverview = useMemo(() => {
    if (!selectedPropertyId || !activeServiceMonth) return null;
    const relatedContracts = contracts.filter((contract) => {
      const room = rooms.find((r) => r.id === contract.roomId);
      if (!room) return false;
      return room.propertyId === selectedPropertyId && ["ACTIVE", "ENDING"].includes(contract.status);
    });
    if (relatedContracts.length === 0) return null;
    const summary = relatedContracts.reduce(
      (acc, contract) => {
        const evalSummary = summarizeContractServices(contract, serviceUsage, serviceCatalog, activeServiceMonth, previousMonth);
        if (!evalSummary) return acc;
        acc.contracts += 1;
        if (evalSummary.electricity.consumption != null && evalSummary.electricity.consumption > 0) {
          acc.electricityConsumption += evalSummary.electricity.consumption;
        }
        acc.electricityAmount += evalSummary.electricity.amount;
        if (evalSummary.water.consumption != null && evalSummary.water.consumption > 0) {
          acc.waterConsumption += evalSummary.water.consumption;
        }
        acc.waterAmount += evalSummary.water.amount;
        acc.wifiDevices += evalSummary.wifi.devices;
        acc.wifiAmount += evalSummary.wifi.amount;
        if (evalSummary.trash.included) {
          acc.trashContracts += 1;
        }
        acc.trashAmount += evalSummary.trash.amount;
        acc.securityPeople += evalSummary.security.occupants;
        acc.securityAmount += evalSummary.security.amount;
        acc.otherAmount += evalSummary.other.amount;
        acc.totalAmount += evalSummary.total;
        return acc;
      },
      {
        contracts: 0,
        electricityConsumption: 0,
        electricityAmount: 0,
        waterConsumption: 0,
        waterAmount: 0,
        wifiDevices: 0,
        wifiAmount: 0,
        trashContracts: 0,
        trashAmount: 0,
        securityPeople: 0,
        securityAmount: 0,
        otherAmount: 0,
        totalAmount: 0,
      }
    );
    return summary.contracts > 0 ? summary : null;
  }, [selectedPropertyId, activeServiceMonth, serviceUsage, serviceCatalog, previousMonth]);

  const openAdd = () => setModal({ open: true, mode: "add", current: { name: "", address: "", businessOwner: "" } });
  const openEdit = (p) => setModal({ open: true, mode: "edit", current: { ...p, businessOwner: p.businessOwner || "" } });
  const onClose = () => setModal({ open: false, mode: "add", current: null });

  const openDetail = (p) => setDetail({ open: true, prop: p, tab: "rooms" });
  const closeDetail = () => setDetail({ open: false, prop: null, tab: "rooms" });

  const save = () => {
    if (!modal.current?.name?.trim()) return;
    if (modal.mode === "add") {
      const nextId = Math.max(0, ...items.map((x) => x.id)) + 1;
      const created = { id: nextId, ...modal.current };
      setItems([...items, created]);
      setSelectedPropertyId(created.id);
      appendLog({
        type: "property:create",
        message: `Thêm nhà trọ ${created.name}`,
        meta: {
          "Địa chỉ": created.address || "—",
          "Người phụ trách": created.businessOwner || "—",
        },
      });
    } else {
      setItems(items.map((x) => (x.id === modal.current.id ? modal.current : x)));
      appendLog({
        type: "property:update",
        message: `Cập nhật nhà trọ ${modal.current.name}`,
        meta: {
          "Địa chỉ": modal.current.address || "—",
          "Người phụ trách": modal.current.businessOwner || "—",
        },
      });
    }
    onClose();
  };

  const askDelete = (p) => setConfirm({ open: true, target: p });
  const doDelete = () => {
    if (confirm.target) {
      appendLog({
        type: "property:delete",
        message: `Xóa nhà trọ ${confirm.target.name}`,
        meta: {
          "Địa chỉ": confirm.target.address || "—",
        },
      });
    }
    setItems(items.filter((x) => x.id !== confirm.target.id));
    setConfirm({ open: false, target: null });
  };

  const roomStatusOptions = ["Đang thuê", "Trống", "Sửa chữa"];

  const updateRoomForm = (patch) =>
    setRoomForm((prev) => (prev.current ? { ...prev, current: { ...prev.current, ...patch } } : prev));

  const openRoomAdd = () => {
    if (!items.length) return;
    const defaultPropertyId = selectedPropertyId || items[0]?.id || null;
    setRoomForm({
      open: true,
      mode: "add",
      current: {
        id: null,
        propertyId: defaultPropertyId,
        name: "",
        status: "Trống",
        tenantId: "",
        price: 0,
        deposit: 0,
        area: 20,
        equipmentText: "",
      },
    });
  };

  const openRoomEditForm = (room) => {
    setRoomForm({
      open: true,
      mode: "edit",
      current: {
        id: room.id,
        propertyId: room.propertyId,
        name: room.name,
        status: room.status,
        tenantId: room.tenantId != null ? String(room.tenantId) : "",
        price: room.price,
        deposit: room.deposit,
        area: room.area,
        equipmentText: (room.equipment || []).join(", "),
      },
    });
  };

  const closeRoomForm = () => setRoomForm({ open: false, mode: "add", current: null });

  const saveRoomForm = () => {
    if (!roomForm.current?.name?.trim()) return;
    const eqList = roomForm.current.equipmentText
      ? roomForm.current.equipmentText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const propertyId = Number(roomForm.current.propertyId) || null;
    if (!propertyId) return;
    const rawTenantId = roomForm.current.tenantId === "" ? null : Number(roomForm.current.tenantId);
    const statusValue = roomForm.current.status;
    const finalTenantId = statusValue === "Đang thuê" ? rawTenantId : null;
    const payload = {
      id:
        roomForm.mode === "edit"
          ? roomForm.current.id
          : (roomItems.length ? Math.max(...roomItems.map((r) => r.id)) : 99) + 1,
      propertyId,
      name: roomForm.current.name.trim(),
      status: statusValue,
      tenantId: finalTenantId,
      price: Number(roomForm.current.price) || 0,
      deposit: Number(roomForm.current.deposit) || 0,
      area: Number(roomForm.current.area) || 0,
      equipment: eqList,
    };

    let nextRooms;
    if (roomForm.mode === "edit") {
      nextRooms = roomItems.map((r) => (r.id === payload.id ? { ...r, ...payload } : r));
    } else {
      nextRooms = [...roomItems, payload];
    }
    setRoomItems(nextRooms);

    if (roomModal.open && roomModal.room?.id === payload.id) {
      const updatedRoom = nextRooms.find((r) => r.id === payload.id) || null;
      setRoomModal({ open: !!updatedRoom, room: updatedRoom });
    }

    if (roomForm.mode === "add" && payload.propertyId) {
      setSelectedPropertyId(payload.propertyId);
    }

    const property = items.find((p) => p.id === payload.propertyId);
    const tenantName = payload.tenantId ? tenants.find((t) => t.id === payload.tenantId)?.name || "(Không rõ)" : "(Trống)";
    if (roomForm.mode === "edit") {
      appendLog({
        type: "room:update",
        message: `Cập nhật phòng ${payload.name}`,
        meta: {
          "Nhà trọ": property?.name || "—",
          "Khách thuê": tenantName,
        },
      });
    } else {
      appendLog({
        type: "room:create",
        message: `Thêm phòng ${payload.name}`,
        meta: {
          "Nhà trọ": property?.name || "—",
          "Khách thuê": tenantName,
        },
      });
    }

    closeRoomForm();
  };

  const deleteRoom = (roomId) => {
    const target = roomItems.find((r) => r.id === roomId);
    setRoomItems((prev) => prev.filter((r) => r.id !== roomId));
    if (roomModal.open && roomModal.room?.id === roomId) {
      setRoomModal({ open: false, room: null });
    }
    if (roomForm.open && roomForm.current?.id === roomId) {
      closeRoomForm();
    }
    if (target) {
      const property = items.find((p) => p.id === target.propertyId);
      appendLog({
        type: "room:delete",
        message: `Xóa phòng ${target.name}`,
        meta: {
          "Nhà trọ": property?.name || "—",
        },
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2"><Building2 className="h-5 w-5"/> Nhà trọ</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setEditMode((prev) => !prev)}
              disabled={items.length === 0}
              className={editMode ? "border-indigo-500 text-indigo-600" : ""}
            >
              {editMode ? "Hoàn tất" : "Chỉnh sửa"}
            </Button>
            <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2"/> Thêm nhà trọ</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Tên nhà trọ</th>
                <th className="px-6 py-3">Địa chỉ</th>
                <th className="px-6 py-3">Số phòng / Trống</th>
                <th className="px-6 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => {
                const roomCount = roomItems.filter((r) => r.propertyId === p.id).length;
                const vacantCount = roomItems.filter((r) => r.propertyId === p.id && r.status === "Trống").length;
                const isSelected = selectedPropertyId === p.id;
                return (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedPropertyId(p.id)}
                    className={`border-b cursor-pointer transition ${
                      isSelected ? "bg-indigo-50" : "bg-white hover:bg-indigo-100"
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{p.name}</td>
                    <td className="px-6 py-4">{p.address}</td>
                    <td className="px-6 py-4">
                      <div>{roomCount} phòng</div>
                      <div className="text-xs text-gray-500">Trống: {vacantCount}</div>
                    </td>
                    <td className="px-6 py-4 flex gap-2 flex-wrap">
                      <Link
                        className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50"
                        to={`/properties/${p.id}?tab=rooms`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Chi tiết
                      </Link>
                      {editMode && (
                        <>
                          <Button
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEdit(p);
                            }}
                          >
                            <Pencil className="h-4 w-4 mr-1"/>Sửa
                          </Button>
                          <Button
                            variant="danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              askDelete(p);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-1"/>Xóa
                          </Button>
                        </>
                      )}
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

      {selectedProperty && propertyServiceOverview && activeServiceMonth && (
        <Card className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Dịch vụ tại {selectedProperty.name}</h3>
              <p className="text-sm text-gray-600">Kỳ ghi nhận {formatBillingMonth(activeServiceMonth)} trên {propertyServiceOverview.contracts} hợp đồng đang hoạt động.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 text-sm text-gray-600">
            <div>
              <p className="text-xs uppercase text-gray-500">Điện</p>
              <p className="text-lg font-semibold text-gray-800">{propertyServiceOverview.electricityConsumption.toLocaleString("vi-VN") || 0} kWh</p>
              <p className="text-xs text-gray-500">{currency(propertyServiceOverview.electricityAmount)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Nước</p>
              <p className="text-lg font-semibold text-gray-800">{propertyServiceOverview.waterConsumption.toLocaleString("vi-VN") || 0} m³</p>
              <p className="text-xs text-gray-500">{currency(propertyServiceOverview.waterAmount)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Wifi</p>
              <p className="text-lg font-semibold text-gray-800">{propertyServiceOverview.wifiDevices} thiết bị</p>
              <p className="text-xs text-gray-500">{currency(propertyServiceOverview.wifiAmount)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Phòng tính phí rác</p>
              <p className="text-lg font-semibold text-gray-800">{propertyServiceOverview.trashContracts}</p>
              <p className="text-xs text-gray-500">{currency(propertyServiceOverview.trashAmount)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Nhân khẩu an ninh</p>
              <p className="text-lg font-semibold text-gray-800">{propertyServiceOverview.securityPeople}</p>
              <p className="text-xs text-gray-500">{currency(propertyServiceOverview.securityAmount)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Điều chỉnh khác</p>
              <p className="text-lg font-semibold text-gray-800">{currency(propertyServiceOverview.otherAmount)}</p>
              <p className="text-xs text-gray-500">Tổng cộng: {currency(propertyServiceOverview.totalAmount)}</p>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-semibold">Phòng trọ</h3>
            <p className="text-sm text-gray-500">
              {selectedProperty ? `Thuộc ${selectedProperty.name}` : "Chưa có nhà trọ nào để hiển thị."}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setRoomEditMode((prev) => !prev)}
              disabled={roomsOfSelected.length === 0}
              className={roomEditMode ? "border-indigo-500 text-indigo-600" : ""}
            >
              {roomEditMode ? "Hoàn tất" : "Chỉnh sửa"}
            </Button>
            <Button onClick={openRoomAdd} disabled={!selectedProperty}>
              <Plus className="h-5 w-5 mr-2" /> Thêm phòng mới
            </Button>
          </div>
        </div>
        {selectedProperty ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Mã phòng</th>
                  <th className="px-6 py-3">Trạng thái</th>
                  <th className="px-6 py-3">Khách thuê</th>
                  <th className="px-6 py-3">Giá thuê</th>
                  <th className="px-6 py-3">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {roomsOfSelected.map((room) => {
                  const tenant = room.tenantId ? tenants.find((t) => t.id === room.tenantId) : null;
                  const status = room.status === "Đang thuê" ? <Badge color="green">Đang thuê</Badge> : room.status === "Trống" ? <Badge color="blue">Trống</Badge> : <Badge color="yellow">Sửa chữa</Badge>;
                  return (
                    <tr key={room.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{room.name}</td>
                      <td className="px-6 py-4">{status}</td>
                      <td className="px-6 py-4">{tenant ? tenant.name : "(Trống)"}</td>
                      <td className="px-6 py-4">{currency(room.price)}</td>
                      <td className="px-6 py-4 flex gap-2 flex-wrap">
                        <Button
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRoomModal({ open: true, room });
                          }}
                        >
                          Xem chi tiết
                        </Button>
                        {roomEditMode && (
                          <>
                            <Button
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                openRoomEditForm(room);
                              }}
                            >
                              <Pencil className="h-4 w-4 mr-1"/>Sửa
                            </Button>
                            <Button
                              variant="danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteRoom(room.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-1"/>Xóa
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {roomsOfSelected.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-6 text-center text-gray-500">Nhà trọ này chưa có phòng nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-sm text-gray-500">Vui lòng thêm và chọn một nhà trọ để xem danh sách phòng.</div>
        )}
      </Card>

      <Modal
        open={roomModal.open}
        title={currentRoom ? `Chi tiết phòng ${currentRoom.name}` : "Chi tiết phòng"}
        onClose={() => setRoomModal({ open: false, room: null })}
        footer={<Button variant="outline" onClick={() => setRoomModal({ open: false, room: null })}>Đóng</Button>}
      >
        {currentRoom ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Nhà trọ</div>
                <div className="text-base font-medium text-gray-900">{currentRoomProperty?.name || "—"}</div>
                <div className="text-xs text-gray-500">{currentRoomProperty?.address}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Trạng thái</div>
                <div className="mt-1">
                  {currentRoom.status === "Đang thuê"
                    ? <Badge color="green">Đang thuê</Badge>
                    : currentRoom.status === "Trống"
                      ? <Badge color="blue">Trống</Badge>
                      : <Badge color="yellow">Sửa chữa</Badge>}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Giá thuê</div>
                <div className="text-base font-medium text-gray-900">{currency(currentRoom.price)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Tiền cọc</div>
                <div className="text-base font-medium text-gray-900">{currency(currentRoom.deposit)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Diện tích</div>
                <div className="text-base font-medium text-gray-900">{currentRoom.area} m²</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Khách thuê</div>
                {currentRoomTenant ? (
                  <div className="mt-1">
                    <div className="font-medium text-gray-900">{currentRoomTenant.name}</div>
                    <div className="text-sm text-gray-500">{currentRoomTenant.phone}</div>
                  </div>
                ) : (
                  <div className="mt-1 text-sm text-gray-500">(Trống)</div>
                )}
              </div>
            </div>

            {currentRoomContract && (
              <Card className="p-4 bg-gray-50 border-dashed">
                <h4 className="font-semibold text-gray-800 mb-2">Thông tin hợp đồng</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="text-gray-500">Ngày bắt đầu:</span>
                    <span className="ml-2 font-medium text-gray-800">{fdate(currentRoomContract.startDate)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Ngày kết thúc:</span>
                    <span className="ml-2 font-medium text-gray-800">{fdate(currentRoomContract.endDate)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Trạng thái tạm trú:</span>
                    <span className="ml-2 font-medium text-gray-800">{currentRoomContract.residenceStatus}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Ghi chú:</span>
                    <span className="ml-2 font-medium text-gray-800">{currentRoomContract.note || "—"}</span>
                  </div>
                </div>
              </Card>
            )}

            {currentRoomServiceSummary && (
              <Card className="p-4 bg-white border border-indigo-100 shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-indigo-500" /> Dịch vụ kỳ {formatBillingMonth(currentRoomServiceSummary.month)}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p className="text-xs uppercase text-gray-500">Điện</p>
                    <p>Tiêu thụ: {currentRoomServiceSummary.electricity.consumption != null ? `${currentRoomServiceSummary.electricity.consumption} kWh` : "—"}</p>
                    <p>Thành tiền: {currency(currentRoomServiceSummary.electricity.amount)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500">Nước</p>
                    <p>Tiêu thụ: {currentRoomServiceSummary.water.consumption != null ? `${currentRoomServiceSummary.water.consumption} m³` : "—"}</p>
                    <p>Thành tiền: {currency(currentRoomServiceSummary.water.amount)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500">Wifi</p>
                    <p>Thiết bị: {currentRoomServiceSummary.wifi.devices}</p>
                    <p>Thành tiền: {currency(currentRoomServiceSummary.wifi.amount)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500">Phí rác & an ninh</p>
                    <p>Rác: {currentRoomServiceSummary.trash.included ? currency(currentRoomServiceSummary.trash.amount) : "Không tính"}</p>
                    <p>An ninh: {currency(currentRoomServiceSummary.security.amount)} ({currentRoomServiceSummary.security.occupants} người)</p>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600 border-t pt-3">
                  <div className="flex justify-between">
                    <span>Điều chỉnh khác</span>
                    <span className="font-medium text-gray-800">{currency(currentRoomServiceSummary.other.amount)}</span>
                  </div>
                  {currentRoomServiceSummary.other.note && (
                    <p className="text-xs text-gray-500 mt-1">Ghi chú: {currentRoomServiceSummary.other.note}</p>
                  )}
                  <div className="flex justify-between items-center mt-3 pt-3 border-t">
                    <span className="text-sm text-gray-600">Tổng dịch vụ</span>
                    <span className="text-lg font-semibold text-indigo-600">{currency(currentRoomServiceSummary.total)}</span>
                  </div>
                </div>
              </Card>
            )}

            <div>
              <div className="text-sm text-gray-500">Trang bị</div>
              {currentRoom.equipment.length > 0 ? (
                <ul className="mt-2 list-disc list-inside text-sm text-gray-700 space-y-1">
                  {currentRoom.equipment.map((eq) => (
                    <li key={eq}>{eq}</li>
                  ))}
                </ul>
              ) : (
                <div className="mt-1 text-sm text-gray-500">Chưa có thiết bị ghi nhận.</div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">Không tìm thấy thông tin phòng.</div>
        )}
      </Modal>

      <Modal
        open={roomForm.open}
        title={roomForm.mode === "add" ? "Thêm phòng mới" : "Sửa phòng trọ"}
        onClose={closeRoomForm}
        footer={
          <>
            <Button variant="outline" onClick={closeRoomForm}>Hủy</Button>
            <Button onClick={saveRoomForm}>Lưu</Button>
          </>
        }
      >
        {roomForm.current && (
          <div className="space-y-4">
            <div>
              <Label>Nhà trọ</Label>
              <select
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={roomForm.current.propertyId ?? ""}
                onChange={(e) => updateRoomForm({ propertyId: Number(e.target.value) })}
              >
                {items.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Mã phòng</Label>
              <Input
                value={roomForm.current.name}
                onChange={(e) => updateRoomForm({ name: e.target.value })}
                placeholder="Ví dụ: A101"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Giá thuê (VND)</Label>
                <Input
                  type="number"
                  value={roomForm.current.price}
                  onChange={(e) => updateRoomForm({ price: e.target.value })}
                  min={0}
                />
              </div>
              <div>
                <Label>Tiền cọc (VND)</Label>
                <Input
                  type="number"
                  value={roomForm.current.deposit}
                  onChange={(e) => updateRoomForm({ deposit: e.target.value })}
                  min={0}
                />
              </div>
              <div>
                <Label>Diện tích (m²)</Label>
                <Input
                  type="number"
                  value={roomForm.current.area}
                  onChange={(e) => updateRoomForm({ area: e.target.value })}
                  min={0}
                />
              </div>
              <div>
                <Label>Trạng thái</Label>
                <select
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={roomForm.current.status}
                  onChange={(e) => updateRoomForm({ status: e.target.value })}
                >
                  {roomStatusOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <Label>Khách thuê</Label>
              <select
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={roomForm.current.tenantId ?? ""}
                onChange={(e) => updateRoomForm({ tenantId: e.target.value })}
              >
                <option value="">(Chưa có)</option>
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Trang bị (cách nhau bằng dấu phẩy)</Label>
              <textarea
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                rows={3}
                value={roomForm.current.equipmentText}
                onChange={(e) => updateRoomForm({ equipmentText: e.target.value })}
                placeholder="Ví dụ: Điều hòa, Tủ lạnh"
              />
            </div>
          </div>
        )}
      </Modal>

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
          <div>
            <Label>Người đứng tên Giấy phép kinh doanh</Label>
            <Input
              value={modal.current?.businessOwner || ""}
              onChange={(e) => setModal((m) => ({ ...m, current: { ...m.current, businessOwner: e.target.value } }))}
              placeholder="VD: Nguyễn Văn A"
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

function TenantsView() {
  const { appendLog } = useActionLog();
  const [tenantItems, setTenantItems] = useState(() => tenants.map((t) => ({ ...t })));
  const [contractParties, setContractParties] = useState(() => contractPartiesSeed.map((p) => ({ ...p })));
  const [editMode, setEditMode] = useState(false);

  const getPropertyIdFromContract = (contract) => {
    const room = rooms.find((r) => r.id === contract.roomId);
    return room ? String(room.propertyId) : "";
  };

  const makeEmptyTenantForm = () => {
    const nextId = tenantItems.length ? Math.max(...tenantItems.map((t) => t.id)) + 1 : 1;
    const firstContract = contracts[0] || null;
    const firstPropertyId = firstContract ? getPropertyIdFromContract(firstContract) : "";
    const firstContractId = firstContract ? String(firstContract.id) : "";
    return {
      id: nextId,
      propertyId: firstPropertyId,
      contractId: firstContractId,
      role: "PRIMARY",
      name: "",
      gender: "",
      dob: "",
      idCard: "",
      idCardIssueDate: "",
      idCardIssuePlace: "",
      phone: "",
      zalo: "",
      job: "",
      notes: "",
    };
  };

  const [addModal, setAddModal] = useState(() => ({ open: false, data: makeEmptyTenantForm(), files: [] }));
  const [profile, setProfile] = useState({ open: false, tenant: null, room: null, property: null, contract: null, party: null, timeline: [], editing: false });
  const [profileForm, setProfileForm] = useState(null);
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [statsMonthFilter, setStatsMonthFilter] = useState("current");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const statusLabels = {
    DRAFT: "Nháp",
    ACTIVE: "Đang hiệu lực",
    ENDING: "Sắp kết thúc",
    TERMINATED: "Đã chấm dứt",
  };

  const propertyOptions = useMemo(
    () => [{ value: "all", label: "Tất cả nhà trọ" }, ...propertiesSeed.map((p) => ({ value: String(p.id), label: p.name }))],
    []
  );

  const statusOptions = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "party:ACTIVE", label: "Đang cư trú" },
    { value: "party:PENDING", label: "Chờ kích hoạt" },
    { value: "party:LEFT", label: "Đã rời" },
    { value: "contract:ACTIVE", label: statusLabels.ACTIVE },
    { value: "contract:DRAFT", label: statusLabels.DRAFT },
    { value: "contract:ENDING", label: statusLabels.ENDING },
    { value: "contract:TERMINATED", label: statusLabels.TERMINATED },
    { value: "no-contract", label: "Chưa có hợp đồng" },
  ];

  const partyStatusMeta = {
    PENDING: { color: "yellow", label: "Chờ kích hoạt" },
    ACTIVE: { color: "green", label: "Đang cư trú" },
    LEFT: { color: "gray", label: "Đã rời" },
  };

  const partyStatusOptions = [
    { value: "PENDING", label: partyStatusMeta.PENDING.label },
    { value: "ACTIVE", label: partyStatusMeta.ACTIVE.label },
    { value: "LEFT", label: partyStatusMeta.LEFT.label },
  ];

  const residenceStatusMeta = {
    "Đã đăng ký": { color: "green", label: "Đã đăng ký" },
    "Chưa đăng ký": { color: "yellow", label: "Chưa đăng ký" },
    "Đang cập nhật": { color: "blue", label: "Đang cập nhật" },
  };

  const rows = useMemo(() => {
    return tenantItems.map((tenant) => {
      const parties = contractParties.filter((party) => party.personId === tenant.id);
      const activeParty = parties.find((party) => party.status === "ACTIVE") || null;
      const sortedParties = parties
        .slice()
        .sort((a, b) => new Date(b.joinDate || 0).getTime() - new Date(a.joinDate || 0).getTime());
      const currentParty = activeParty || sortedParties[0] || null;
      const contract = currentParty ? contracts.find((c) => c.id === currentParty.contractId) || null : null;
      const room = contract ? rooms.find((r) => r.id === contract.roomId) || null : null;
      const property = room ? propertiesSeed.find((p) => p.id === room.propertyId) || null : null;
      return { tenant, party: currentParty, parties, contract, room, property };
    });
  }, [tenantItems, contractParties]);

  const filteredRows = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return rows.filter((row) => {
      if (propertyFilter !== "all") {
        if (!row.property || String(row.property.id) !== propertyFilter) return false;
      }

      if (statusFilter !== "all") {
        if (statusFilter.startsWith("party:")) {
          const target = statusFilter.split(":")[1];
          if (!row.party || row.party.status !== target) return false;
        } else if (statusFilter.startsWith("contract:")) {
          const target = statusFilter.split(":")[1];
          if (!row.contract || row.contract.status !== target) return false;
        } else if (statusFilter === "no-contract") {
          if (row.party && row.contract) return false;
        }
      }

      if (!keyword) return true;

      const haystack = [
        row.tenant?.name,
        row.tenant?.phone,
        row.tenant?.idCard,
        row.room?.name,
        row.property?.name,
        row.party?.role,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [rows, propertyFilter, statusFilter, searchTerm]);

  const todayIso = () => new Date().toISOString().slice(0, 10);

  const composePartyMeta = (party, contract) => {
    if (!party) return null;
    const meta = partyStatusMeta[party.status] || partyStatusMeta.PENDING;
    const roleLabel = party.role === "PRIMARY" ? "Người đứng tên" : "Đồng cư";
    const contractLabel = contract ? contract.code : "—";
    return { ...meta, roleLabel, contractLabel };
  };

  const changePartyStatus = ({ party, tenant, contract, room, property, nextStatus, silent = false, extraPatch = {} }) => {
    if (!party || !nextStatus) return;
    const now = todayIso();
    const buildUpdatedParty = (current) => {
      let updated = { ...current, status: nextStatus };
      if (nextStatus === "ACTIVE") {
        updated = { ...updated, joinDate: current.joinDate || now, endDate: null, activatedAt: now };
      } else if (nextStatus === "LEFT") {
        updated = { ...updated, endDate: current.endDate || now };
      } else if (nextStatus === "PENDING") {
        updated = { ...updated, endDate: null };
      }
      updated = { ...updated, ...extraPatch };
      return updated;
    };

    setContractParties((prev) => prev.map((item) => (item.id === party.id ? buildUpdatedParty(item) : item)));

    setProfile((prev) => {
      if (!prev.open || !prev.party || prev.party.id !== party.id) return prev;
      const updatedParty = buildUpdatedParty(prev.party);
      return {
        ...prev,
        contract: contract || prev.contract,
        room: room || prev.room,
        property: property || prev.property,
        party: updatedParty,
        timeline: prev.timeline.map((entry) => (entry.id === party.id ? buildUpdatedParty(entry) : entry)),
      };
    });

    if (!silent) {
      const statusMeta = partyStatusMeta[nextStatus] || partyStatusMeta.PENDING;
      appendLog({
        type: nextStatus === "LEFT" ? "tenant:left" : nextStatus === "ACTIVE" ? "tenant:activate" : "tenant:status",
        message:
          nextStatus === "LEFT"
            ? `Đánh dấu ${tenant?.name || "khách thuê"} rời phòng`
            : nextStatus === "ACTIVE"
            ? `Kích hoạt cư trú cho ${tenant?.name || "khách thuê"}`
            : `Cập nhật trạng thái cư trú của ${tenant?.name || "khách thuê"}`,
        meta: {
          "Trạng thái": statusMeta.label,
          "Hợp đồng": contract?.code || "—",
          "Phòng": room?.name || "—",
          "Nhà trọ": property?.name || "—",
        },
      });
    }
  };

  const activateParty = (row) => {
    if (!row.party) return;
    changePartyStatus({
      party: row.party,
      tenant: row.tenant,
      contract: row.contract,
      room: row.room,
      property: row.property,
      nextStatus: "ACTIVE",
    });
  };

  const createContractParty = ({ contractId, personId, role = "CO", status = "PENDING", joinDate }) => ({
    id: `CP-${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 6)}`,
    contractId,
    personId,
    role,
    status,
    joinDate: joinDate || todayIso(),
  });

  const toggleEditMode = () => setEditMode((prev) => !prev);

  const handleDeleteTenant = (row) => {
    if (!row.tenant) return;
    if (profile.tenant?.id === row.tenant.id) {
      closeProfile();
    }
    setTenantItems((prev) => prev.filter((item) => item.id !== row.tenant.id));
    setContractParties((prev) => prev.filter((party) => party.personId !== row.tenant.id));
    appendLog({
      type: "tenant:delete",
      message: `Xóa khách thuê ${row.tenant.name} khỏi danh sách`,
      meta: {
        "Hợp đồng": row.contract?.code || "—",
        "Phòng": row.room?.name || "—",
      },
    });
  };

  const openAddTenant = () => setAddModal({ open: true, data: makeEmptyTenantForm(), files: [] });
  const closeAddTenant = () => setAddModal({ open: false, data: makeEmptyTenantForm(), files: [] });

  const updateAddForm = (patch) => {
    setAddModal((prev) => {
      const nextData = { ...prev.data, ...patch };
      if (patch.propertyId !== undefined) {
        const propertyContracts = contracts.filter((c) => getPropertyIdFromContract(c) === patch.propertyId);
        nextData.contractId = propertyContracts[0] ? String(propertyContracts[0].id) : "";
      }
      if (patch.contractId !== undefined && patch.contractId) {
        nextData.contractId = patch.contractId;
      }
      if (patch.phone !== undefined && (!prev.data.zalo || prev.data.zalo === prev.data.phone)) {
        nextData.zalo = patch.phone;
      }
      return { ...prev, data: nextData };
    });
  };

  const handleUploadFiles = (event) => {
    const fileList = event.target.files;
    if (!fileList) return;
    const files = Array.from(fileList);
    setAddModal((prev) => ({ ...prev, files: [...prev.files, ...files] }));
    event.target.value = "";
  };

  const removeUploadFile = (name) => {
    setAddModal((prev) => ({ ...prev, files: prev.files.filter((f) => f.name !== name) }));
  };

  const submitAddTenant = () => {
    const form = addModal.data;
    if (!form.name.trim()) return;
    if (!form.contractId) return;
    const contract = contracts.find((c) => String(c.id) === form.contractId);
    if (!contract) return;
    const newTenant = {
      id: form.id,
      name: form.name.trim(),
      gender: form.gender,
      phone: form.phone.trim(),
      zalo: form.zalo.trim(),
      dob: form.dob || null,
      idCard: form.idCard.trim(),
      idCardIssueDate: form.idCardIssueDate || null,
      idCardIssuePlace: form.idCardIssuePlace.trim(),
      job: form.job.trim(),
      notes: form.notes.trim(),
      files: addModal.files.map((file) => file.name),
    };
    setTenantItems((prev) => [...prev, newTenant]);
    setContractParties((prev) => [
      ...prev,
      createContractParty({
        contractId: contract.id,
        personId: newTenant.id,
        role: form.role || "PRIMARY",
        status: "PENDING",
        joinDate: contract.startDate,
      }),
    ]);
    const room = rooms.find((r) => r.id === contract.roomId);
    const property = room ? propertiesSeed.find((p) => p.id === room.propertyId) : null;
    appendLog({
      type: "tenant:create",
      message: `Thêm khách thuê ${newTenant.name}`,
      meta: {
        "Số điện thoại": newTenant.phone || "—",
        "CCCD": newTenant.idCard || "—",
        "Hợp đồng": contract.code,
        "Phòng": room?.name || "—",
        "Nhà trọ": property?.name || "—",
      },
    });
    closeAddTenant();
  };

  const openProfile = ({ tenant, room, property, contract, party, parties }) => {
    const sortedTimeline = parties
      ? parties
          .slice()
          .sort((a, b) => new Date(a.joinDate || 0).getTime() - new Date(b.joinDate || 0).getTime())
      : [];
    setProfile({ open: true, tenant, room, property, contract, party, timeline: sortedTimeline, editing: false });
    setProfileForm(null);
    if (tenant) {
      appendLog({
        type: "tenant:view",
        message: `Xem hồ sơ khách ${tenant.name}`,
        meta: {
          "Phòng": room?.name || "—",
          "Nhà trọ": property?.name || "—",
        },
      });
    }
  };

  const closeProfile = () => {
    setProfile({ open: false, tenant: null, room: null, property: null, contract: null, party: null, timeline: [], editing: false });
    setProfileForm(null);
  };

  const startProfileEdit = () => {
    if (!profile.tenant) return;
    setProfileForm({
      name: profile.tenant.name || "",
      gender: profile.tenant.gender || "",
      dob: profile.tenant.dob || "",
      idCard: profile.tenant.idCard || "",
      idCardIssueDate: profile.tenant.idCardIssueDate || "",
      idCardIssuePlace: profile.tenant.idCardIssuePlace || "",
      phone: profile.tenant.phone || "",
      zalo: profile.tenant.zalo || profile.tenant.phone || "",
      job: profile.tenant.job || "",
      notes: profile.tenant.notes || "",
      role: profile.party?.role || "PRIMARY",
      status: profile.party?.status || "PENDING",
    });
    setProfile((prev) => ({ ...prev, editing: true }));
  };

  const cancelProfileEdit = () => {
    setProfile((prev) => ({ ...prev, editing: false }));
    setProfileForm(null);
  };

  const updateProfileForm = (patch) => {
    setProfileForm((prev) => (prev ? { ...prev, ...patch } : { ...patch }));
  };

  const saveProfileEdit = () => {
    if (!profile.tenant || !profileForm) return;
    const roleValue = profileForm.role || "PRIMARY";
    const statusValue = profileForm.status || profile.party?.status || "PENDING";
    const sanitized = {
      name: profileForm.name.trim(),
      gender: profileForm.gender,
      dob: profileForm.dob || null,
      idCard: profileForm.idCard.trim(),
      idCardIssueDate: profileForm.idCardIssueDate || null,
      idCardIssuePlace: profileForm.idCardIssuePlace.trim(),
      phone: profileForm.phone.trim(),
      zalo: profileForm.zalo.trim() || profileForm.phone.trim(),
      job: profileForm.job.trim(),
      notes: profileForm.notes.trim(),
    };

    setTenantItems((prev) =>
      prev.map((tenant) =>
        tenant.id === profile.tenant.id
          ? {
              ...tenant,
              ...sanitized,
            }
          : tenant
      )
    );

    if (profile.party) {
      changePartyStatus({
        party: profile.party,
        tenant: profile.tenant,
        contract: profile.contract,
        room: profile.room,
        property: profile.property,
        nextStatus: statusValue,
        silent: statusValue === profile.party.status,
        extraPatch: { role: roleValue },
      });
    }

    const updatedTenant = {
      ...profile.tenant,
      ...sanitized,
    };

    setProfile((prev) => ({
      ...prev,
      tenant: updatedTenant,
      editing: false,
    }));

    appendLog({
      type: "tenant:update",
      message: `Cập nhật hồ sơ ${sanitized.name || profile.tenant.name}`,
      meta: {
        "Số điện thoại": sanitized.phone || "—",
        "Hợp đồng": profile.contract?.code || "—",
        "Phòng": profile.room?.name || "—",
        "Trạng thái cư trú": profile.party ? (partyStatusMeta[statusValue]?.label || statusValue) : "—",
      },
    });

    setProfileForm(null);
  };

  const handleProfileStatusChange = (nextStatus) => {
    if (!nextStatus || !profile.party) return;
    if (profile.party.status === nextStatus) return;
    changePartyStatus({
      party: profile.party,
      tenant: profile.tenant,
      contract: profile.contract,
      room: profile.room,
      property: profile.property,
      nextStatus,
    });
  };

  const tenantAge = (dob) => {
    if (!dob) return "—";
    const birthday = new Date(dob);
    if (Number.isNaN(birthday.getTime())) return "—";
    const diff = Date.now() - birthday.getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  const profileTenantId = profile.tenant ? profile.tenant.id : null;

  useEffect(() => {
    if (!profile.open || !profileTenantId) return;
    const updatedRow = rows.find((row) => row.tenant.id === profileTenantId);
    if (!updatedRow) return;
    const sortedTimeline = updatedRow.parties
      .slice()
      .sort((a, b) => new Date(a.joinDate || 0).getTime() - new Date(b.joinDate || 0).getTime());
    setProfile((prev) => ({
      ...prev,
      room: updatedRow.room,
      property: updatedRow.property,
      contract: updatedRow.contract,
      party: updatedRow.party,
      timeline: sortedTimeline,
    }));
  }, [rows, profile.open, profileTenantId]);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-semibold">Danh sách khách thuê</h3>
          <p className="text-xs text-gray-500">Quản lý thông tin cư dân hiện tại và khách mới.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={toggleEditMode}
            className={editMode ? "border-indigo-500 text-indigo-600" : ""}
          >
            {editMode ? "Hoàn tất" : "Chỉnh sửa"}
          </Button>
          <Button onClick={openAddTenant}><Plus className="h-5 w-5 mr-2" /> Thêm khách thuê</Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3 mb-4">
        <div>
          <Label>Nhà trọ</Label>
          <select
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={propertyFilter}
            onChange={(event) => setPropertyFilter(event.target.value)}
          >
            {propertyOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Trạng thái</Label>
          <select
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Tìm kiếm</Label>
          <Input
            placeholder="Nhập tên, SĐT, phòng hoặc CCCD"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Khách thuê</th>
              <th className="px-6 py-3">Phòng đang ở</th>
              <th className="px-6 py-3">Trạng thái cư trú</th>
              <th className="px-6 py-3">Trạng thái tạm trú</th>
              <th className="px-6 py-3">Ngày vào ở/Rời đi</th>
              <th className="px-6 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => {
              const partyMeta = composePartyMeta(row.party, row.contract);
              const residenceMeta = row.contract?.residenceStatus
                ? residenceStatusMeta[row.contract.residenceStatus] || { color: "gray", label: row.contract.residenceStatus }
                : null;
              return (
              <tr key={row.tenant?.id || Math.random()} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {row.tenant?.name || "(Chưa có)"}
                  <div className="text-xs text-gray-500">{row.tenant?.phone}</div>
                </td>
                <td className="px-6 py-4">
                  {row.room ? `${row.room.name} - ${row.property?.name}` : "(Chưa xếp phòng)"}
                </td>
                <td className="px-6 py-4">
                  {partyMeta ? (
                    <div className="space-y-1">
                      <Badge color={partyMeta.color}>{partyMeta.label}</Badge>
                      <div className="text-xs text-gray-500">{partyMeta.roleLabel}</div>
                      <div className="text-xs text-gray-400">HĐ: {partyMeta.contractLabel}</div>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">Chưa liên kết hợp đồng</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {residenceMeta ? (
                    <Link to="/residence" className="inline-flex items-center gap-2 text-xs text-indigo-600 hover:underline">
                      <Badge color={residenceMeta.color}>{residenceMeta.label}</Badge>
                      <ChevronRight className="h-3 w-3" />
                      <span>Xem</span>
                    </Link>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {row.party
                    ? row.party.status === "LEFT"
                      ? row.party.endDate
                        ? fdate(row.party.endDate)
                        : "Đang cập nhật"
                      : row.party.joinDate
                        ? fdate(row.party.joinDate)
                        : "—"
                    : "—"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => openProfile(row)}>Xem hồ sơ</Button>
                    {row.party?.status === "PENDING" && (
                      <Button variant="green" onClick={() => activateParty(row)}>Kích hoạt</Button>
                    )}
                    {editMode && (
                      <Button variant="danger" onClick={() => handleDeleteTenant(row)}>Xóa</Button>
                    )}
                  </div>
                </td>
              </tr>
              );
            })}
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Không tìm thấy khách thuê phù hợp với điều kiện lọc.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={addModal.open}
        title="Thêm khách thuê mới"
        onClose={closeAddTenant}
        footer={
          <>
            <Button variant="outline" onClick={closeAddTenant}>Hủy</Button>
            <Button onClick={submitAddTenant}>Lưu</Button>
          </>
        }
      >
        <div className="space-y-4" ref={(node) => {
          if (node && addModal.open) {
            const firstInput = node.querySelector("input, select");
            firstInput?.focus();
          }
        }}>
          <div>
            <Label>Chọn nhà trọ</Label>
            <select
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={addModal.data.propertyId}
              onChange={(e) => updateAddForm({ propertyId: e.target.value })}
            >
              <option value="">— Chọn nhà trọ —</option>
              {propertiesSeed.map((property) => (
                <option key={property.id} value={property.id}>{property.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Liên kết hợp đồng</Label>
            <select
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={addModal.data.contractId}
              onChange={(e) => updateAddForm({ contractId: e.target.value })}
            >
              <option value="">— Chọn hợp đồng —</option>
              {contracts
                .filter((contract) => !addModal.data.propertyId || getPropertyIdFromContract(contract) === addModal.data.propertyId)
                .map((contract) => {
                const room = rooms.find((r) => r.id === contract.roomId);
                const property = room ? propertiesSeed.find((p) => p.id === room.propertyId) : null;
                const label = `${contract.code} · ${room?.name || "(Phòng?)"} · ${property?.name || "—"}`;
                return (
                  <option key={contract.id} value={contract.id}>{label}</option>
                );
              })}
            </select>
            <p className="text-xs text-gray-500 mt-1">Chỉ những hợp đồng đã tạo mới có thể thêm khách thuê.</p>
          </div>
          <div>
            <Label>Vai trò trong hợp đồng</Label>
            <select
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={addModal.data.role}
              onChange={(e) => updateAddForm({ role: e.target.value })}
            >
              <option value="PRIMARY">Người đứng tên hợp đồng</option>
              <option value="CO">Người ở cùng</option>
            </select>
          </div>
          <div>
            <Label>Họ tên</Label>
            <Input value={addModal.data.name} onChange={(e) => updateAddForm({ name: e.target.value })} placeholder="Nguyễn Văn A" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Giới tính</Label>
              <select
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={addModal.data.gender}
                onChange={(e) => updateAddForm({ gender: e.target.value })}
              >
                <option value="">—</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div>
              <Label>Ngày sinh</Label>
              <Input type="date" value={addModal.data.dob} onChange={(e) => updateAddForm({ dob: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Số CCCD/CMND</Label>
              <Input value={addModal.data.idCard} onChange={(e) => updateAddForm({ idCard: e.target.value })} placeholder="012345678901" />
            </div>
            <div>
              <Label>Ngày cấp</Label>
              <Input type="date" value={addModal.data.idCardIssueDate} onChange={(e) => updateAddForm({ idCardIssueDate: e.target.value })} />
            </div>
            <div>
              <Label>Nơi cấp</Label>
              <Input value={addModal.data.idCardIssuePlace} onChange={(e) => updateAddForm({ idCardIssuePlace: e.target.value })} placeholder="Công an ..." />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Số điện thoại</Label>
              <Input value={addModal.data.phone} onChange={(e) => updateAddForm({ phone: e.target.value })} placeholder="0901234567" />
            </div>
            <div>
              <Label>Số Zalo</Label>
              <Input value={addModal.data.zalo} onChange={(e) => updateAddForm({ zalo: e.target.value })} placeholder="Tự động điền theo SDT" />
              <p className="text-xs text-gray-500 mt-1">Nếu để trống, hệ thống sẽ dùng số điện thoại làm số Zalo.</p>
            </div>
          </div>
          <div>
            <Label>Nghề nghiệp</Label>
            <Input value={addModal.data.job} onChange={(e) => updateAddForm({ job: e.target.value })} placeholder="Ví dụ: Nhân viên văn phòng" />
          </div>
          <div>
            <Label>Ghi chú</Label>
            <textarea
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={3}
              value={addModal.data.notes}
              onChange={(e) => updateAddForm({ notes: e.target.value })}
              placeholder="Thông tin thêm, yêu cầu đặc biệt..."
            />
          </div>
          <div>
            <Label>Tệp đính kèm</Label>
            <input
              type="file"
              multiple
              className="mt-1 block w-full text-sm text-gray-600"
              onChange={handleUploadFiles}
            />
            {addModal.files.length > 0 ? (
              <ul className="mt-2 text-xs text-gray-600 space-y-1">
                {addModal.files.map((file) => (
                  <li key={file.name} className="flex items-center justify-between">
                    <span>{file.name}</span>
                    <button className="text-red-500 text-xs" onClick={() => removeUploadFile(file.name)}>Xóa</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-gray-500">Chưa có tệp được chọn.</p>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        open={profile.open}
        title={profile.tenant ? `Hồ sơ khách thuê: ${profile.tenant.name}` : "Hồ sơ khách thuê"}
        onClose={closeProfile}
        footer={profile.editing ? (
          <>
            <Button variant="outline" onClick={cancelProfileEdit}>Hủy</Button>
            <Button onClick={saveProfileEdit}>Lưu</Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={closeProfile}>Đóng</Button>
            <Button onClick={startProfileEdit}>Sửa</Button>
          </>
        )}
      >
        {profile.tenant ? (
          <div className="space-y-4 text-sm text-gray-700">
            {profile.editing ? (
              <>
                <section>
                  <h4 className="text-sm font-semibold text-gray-800 uppercase">Thông tin cá nhân</h4>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Họ tên</Label>
                      <Input value={profileForm?.name || ""} onChange={(e) => updateProfileForm({ name: e.target.value })} />
                    </div>
                    <div>
                      <Label>Giới tính</Label>
                      <select
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={profileForm?.gender || ""}
                        onChange={(e) => updateProfileForm({ gender: e.target.value })}
                      >
                        <option value="">—</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                    <div>
                      <Label>Ngày sinh</Label>
                      <Input type="date" value={profileForm?.dob || ""} onChange={(e) => updateProfileForm({ dob: e.target.value })} />
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="text-sm font-semibold text-gray-800 uppercase">Giấy tờ & liên hệ</h4>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Số CCCD/CMND</Label>
                      <Input value={profileForm?.idCard || ""} onChange={(e) => updateProfileForm({ idCard: e.target.value })} />
                    </div>
                    <div>
                      <Label>Ngày cấp</Label>
                      <Input type="date" value={profileForm?.idCardIssueDate || ""} onChange={(e) => updateProfileForm({ idCardIssueDate: e.target.value })} />
                    </div>
                    <div>
                      <Label>Nơi cấp</Label>
                      <Input value={profileForm?.idCardIssuePlace || ""} onChange={(e) => updateProfileForm({ idCardIssuePlace: e.target.value })} />
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Số điện thoại</Label>
                      <Input value={profileForm?.phone || ""} onChange={(e) => updateProfileForm({ phone: e.target.value })} />
                    </div>
                    <div>
                      <Label>Số Zalo</Label>
                      <Input value={profileForm?.zalo || ""} onChange={(e) => updateProfileForm({ zalo: e.target.value })} />
                      <p className="text-xs text-gray-500 mt-1">Nếu để trống, hệ thống sẽ dùng số điện thoại làm số Zalo.</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="text-sm font-semibold text-gray-800 uppercase">Cư trú & vai trò</h4>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label>Hợp đồng liên kết</Label>
                      <p className="mt-2 text-gray-700">
                        {profile.contract
                          ? `${profile.contract.code} · ${profile.room?.name || "(Chưa gán phòng)"}`
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <Label>Vai trò</Label>
                      <select
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={profileForm?.role || "PRIMARY"}
                        onChange={(e) => updateProfileForm({ role: e.target.value })}
                      >
                        <option value="PRIMARY">Người đứng tên hợp đồng</option>
                        <option value="CO">Người ở cùng</option>
                      </select>
                    </div>
                    <div>
                      <Label>Trạng thái cư trú</Label>
                      {profile.party ? (
                        <select
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={profileForm?.status || profile.party?.status || "PENDING"}
                          onChange={(e) => updateProfileForm({ status: e.target.value })}
                        >
                          {partyStatusOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      ) : (
                        <p className="mt-2 text-gray-500">Chưa liên kết hợp đồng</p>
                      )}
                    </div>
                    <div>
                      <Label>Ngày vào ở</Label>
                      <p className="mt-2 text-gray-700">{profile.party?.joinDate ? fdate(profile.party.joinDate) : "—"}</p>
                    </div>
                    <div>
                      <Label>Ngày rời</Label>
                      <p className="mt-2 text-gray-700">{profile.party?.endDate ? fdate(profile.party.endDate) : profile.party?.status === "LEFT" ? "Đang cập nhật" : "—"}</p>
                    </div>
                    <div>
                      <Label>Ngày bắt đầu HĐ</Label>
                      <p className="mt-2 text-gray-700">{profile.contract?.startDate ? fdate(profile.contract.startDate) : "—"}</p>
                    </div>
                    <div>
                      <Label>Ngày kết thúc HĐ</Label>
                      <p className="mt-2 text-gray-700">{profile.contract?.endDate ? fdate(profile.contract.endDate) : "—"}</p>
                    </div>
                    <div className="md:col-span-2">
                      <Label>Trạng thái tạm trú</Label>
                      <p className="mt-2 text-gray-700">{profile.contract?.residenceStatus || "—"}</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="text-sm font-semibold text-gray-800 uppercase">Thông tin bổ sung</h4>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Nghề nghiệp</Label>
                      <Input value={profileForm?.job || ""} onChange={(e) => updateProfileForm({ job: e.target.value })} />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Ghi chú</Label>
                      <textarea
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        rows={3}
                        value={profileForm?.notes || ""}
                        onChange={(e) => updateProfileForm({ notes: e.target.value })}
                      />
                    </div>
                  </div>
                </section>
              </>
            ) : (
              <>
                <section>
                  <h4 className="text-sm font-semibold text-gray-800 uppercase">Thông tin cá nhân</h4>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div><span className="text-gray-500">Họ tên:</span> <strong>{profile.tenant.name}</strong></div>
                    <div><span className="text-gray-500">Giới tính:</span> {profile.tenant.gender || "—"}</div>
                    <div><span className="text-gray-500">Ngày sinh:</span> {profile.tenant.dob ? fdate(profile.tenant.dob) : "—"}</div>
                    <div><span className="text-gray-500">Tuổi:</span> {tenantAge(profile.tenant.dob)}</div>
                    <div><span className="text-gray-500">CCCD/CMND:</span> {profile.tenant.idCard || "—"}</div>
                    <div><span className="text-gray-500">Ngày cấp:</span> {profile.tenant.idCardIssueDate ? fdate(profile.tenant.idCardIssueDate) : "—"}</div>
                    <div><span className="text-gray-500">Nơi cấp:</span> {profile.tenant.idCardIssuePlace || "—"}</div>
                    <div><span className="text-gray-500">Số điện thoại:</span> {profile.tenant.phone || "—"}</div>
                    <div><span className="text-gray-500">Zalo:</span> {profile.tenant.zalo || profile.tenant.phone || "—"}</div>
                    <div><span className="text-gray-500">Nghề nghiệp:</span> {profile.tenant.job || "—"}</div>
                    <div className="md:col-span-2"><span className="text-gray-500">Ghi chú:</span> {profile.tenant.notes || "—"}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-sm font-semibold text-gray-800 uppercase">Thông tin cư trú</h4>
                  <div className="mt-2 space-y-1">
                    <div>
                      Hợp đồng: {profile.contract ? `${profile.contract.code} · ${profile.room?.name || "(Chưa gán phòng)"}` : "—"}
                    </div>
                    <div>Nhà trọ: {profile.property?.name || "(Chưa gán)"}</div>
                    <div>Phòng: {profile.room?.name || "(Chưa gán)"}</div>
                    <div>Vai trò: {profile.party ? (profile.party.role === "PRIMARY" ? "Người đứng tên hợp đồng" : "Đồng cư") : "—"}</div>
                    <div>
                      Trạng thái cư trú: {profile.party ? (composePartyMeta(profile.party, profile.contract)?.label || "—") : "—"}
                    </div>
                    <div>Ngày vào ở: {profile.party?.joinDate ? fdate(profile.party.joinDate) : "—"}</div>
                    <div>
                      Ngày rời: {profile.party?.endDate ? fdate(profile.party.endDate) : profile.party?.status === "LEFT" ? "Đang cập nhật" : "—"}
                    </div>
                    <div>Ngày bắt đầu HĐ: {profile.contract?.startDate ? fdate(profile.contract.startDate) : "—"}</div>
                    <div>Ngày kết thúc HĐ: {profile.contract?.endDate ? fdate(profile.contract.endDate) : "—"}</div>
                <div>Trạng thái tạm trú: {profile.contract?.residenceStatus || "—"}</div>
                {profile.party && (
                  <div className="flex flex-wrap gap-2 pt-3">
                    {profile.party.status === "PENDING" && (
                      <Button variant="green" onClick={() => handleProfileStatusChange("ACTIVE")}>Kích hoạt cư trú</Button>
                    )}
                    {profile.party.status === "ACTIVE" && (
                      <>
                        <Button
                          variant="outline"
                          className="border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                          onClick={() => handleProfileStatusChange("PENDING")}
                        >
                          Chuyển tạm chờ
                        </Button>
                        <Button
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                          onClick={() => handleProfileStatusChange("LEFT")}
                        >
                          Đánh dấu rời
                        </Button>
                      </>
                    )}
                    {profile.party.status === "LEFT" && (
                      <Button variant="green" onClick={() => handleProfileStatusChange("ACTIVE")}>Cho ở lại</Button>
                    )}
                  </div>
                )}
              </div>
            </section>
              </>
            )}

            {profile.timeline.length > 0 && (
              <section>
                <h4 className="text-sm font-semibold text-gray-800 uppercase">Lịch sử tham gia hợp đồng</h4>
                <div className="mt-2 space-y-2">
                  {profile.timeline.map((entry) => {
                    const entryContract = contracts.find((c) => c.id === entry.contractId);
                    const meta = partyStatusMeta[entry.status] || partyStatusMeta.PENDING;
                    return (
                      <div key={entry.id} className="border border-gray-200 rounded-md p-3 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">{entry.role === "PRIMARY" ? "Người đứng tên" : "Đồng cư"}</span>
                          <Badge color={meta.color}>{meta.label}</Badge>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {entry.joinDate ? fdate(entry.joinDate) : "—"} → {entry.endDate ? fdate(entry.endDate) : entry.status === "LEFT" ? "Đang cập nhật" : "Hiện tại"}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">Hợp đồng: {entryContract?.code || "—"}</div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            <section>
              <h4 className="text-sm font-semibold text-gray-800 uppercase">Tệp đính kèm</h4>
              {profile.tenant.files && profile.tenant.files.length > 0 ? (
                <ul className="mt-2 list-disc list-inside space-y-1">
                  {profile.tenant.files.map((file) => (
                    <li key={file}>{file}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-xs text-gray-500">Chưa có tệp đính kèm.</p>
              )}
            </section>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Không tìm thấy thông tin khách thuê.</p>
        )}
      </Modal>
    </Card>
  );
}

function ContractsView() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState({ open: false, record: null });
  const [contractEditMode, setContractEditMode] = useState(false);
  const [contractItems, setContractItems] = useState(() => contracts.map((c) => ({ ...c })));
  const [contractForm, setContractForm] = useState(() => ({ open: false, step: 0, mode: "add", contractId: null, data: createEmptyContractForm() }));
  const [contractDelete, setContractDelete] = useState({ open: false, record: null });
  const [contractTerminate, setContractTerminate] = useState({ open: false, record: null, endDate: new Date().toISOString().slice(0, 10), note: "" });
  const { appendLog } = useActionLog();
  const { serviceUsage, serviceCatalog, previousMonth } = useServices();
  const serviceMonths = useMemo(() => getServiceMonths(serviceUsage), [serviceUsage]);
  const activeServiceMonth = serviceMonths.length ? serviceMonths[serviceMonths.length - 1] : null;

  function getAvailableRooms(propertyId, currentRoomId = null) {
    const pid = Number(propertyId);
    if (!pid) return [];
    return rooms.filter((room) => {
      if (room.propertyId !== pid) return false;
      const activeContract = contractItems.find(
        (c) => c.roomId === room.id && c.id !== currentRoomId && c.status !== "TERMINATED"
      );
      return !activeContract;
    });
  }

  function createEmptyContractForm() {
    const defaultPropertyId = propertiesSeed[0]?.id ? String(propertiesSeed[0].id) : "";
    const firstAvailableRoom = getAvailableRooms(defaultPropertyId)[0];
    const defaultRoomId = firstAvailableRoom ? String(firstAvailableRoom.id) : "";
    const defaultTenantId = tenants[0]?.id ? String(tenants[0].id) : "";
    const today = new Date();
    const start = today.toISOString().slice(0, 10);
    const end = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()).toISOString().slice(0, 10);

    return {
      propertyId: defaultPropertyId,
      roomId: defaultRoomId,
      tenantId: defaultTenantId,
      status: "DRAFT",
      residenceStatus: "Chưa đăng ký",
      billingCycle: "Hàng tháng",
      startDate: start,
      endDate: end,
      rent: "",
      deposit: "",
      electricityRate: "",
      waterRate: "",
      meterElectric: "",
      meterWater: "",
      serviceFeesText: "",
      dependentsText: "",
      attachments: "0",
      notes: "",
      checklist: { deposit: false, meter: false, documents: false },
    };
  }

  const openContractForm = () => {
    setContractForm({ open: true, step: 0, mode: "add", contractId: null, data: createEmptyContractForm() });
  };

  const closeContractForm = () => {
    setContractForm((prev) => ({ ...prev, open: false }));
  };

  const updateContractForm = (patch) => {
    setContractForm((prev) => ({ ...prev, data: { ...prev.data, ...patch } }));
  };

  const toggleChecklistItem = (key) => {
    setContractForm((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        checklist: {
          ...prev.data.checklist,
          [key]: !prev.data.checklist[key],
        },
      },
    }));
  };

  const contractRecords = useMemo(() => {
    return contractItems.map((contract) => {
      const room = rooms.find((r) => r.id === contract.roomId) || null;
      const property = room ? propertiesSeed.find((p) => p.id === room.propertyId) || null : null;
      const tenant = tenants.find((t) => t.id === contract.tenantId) || null;
      const serviceFees = contract.serviceFees || [];
      const monthlyExtras = serviceFees.reduce((sum, fee) => sum + fee.amount, 0);
      const totalMonthly = (contract.rent || 0) + monthlyExtras;
      const coResidents = contract.dependents || [];
      const meterBaseline = contract.meterBaseline || { electricity: null, water: null };
      const invoicesOf = invoices.filter((inv) => inv.roomId === contract.roomId);
      const orderedInvoices = [...invoicesOf].sort((a, b) => {
        const da = a.date ? new Date(a.date).getTime() : 0;
        const db = b.date ? new Date(b.date).getTime() : 0;
        return db - da;
      });
      const lastInvoice = orderedInvoices[0] || null;
      const serviceSummary = activeServiceMonth
        ? summarizeContractServices(contract, serviceUsage, serviceCatalog, activeServiceMonth, previousMonth)
        : null;

      return {
        contract,
        room,
        property,
        tenant,
        coResidents,
        serviceFees,
        totalMonthly,
        meterBaseline,
        invoices: invoicesOf,
        lastInvoice,
        serviceSummary,
      };
    });
  }, [contractItems, activeServiceMonth, serviceUsage, serviceCatalog, previousMonth]);

  const serviceOverview = useMemo(() => {
    if (!activeServiceMonth) return null;
    return contractRecords.reduce(
      (acc, record) => {
        const summary = record.serviceSummary;
        if (!summary) return acc;
        acc.contracts += 1;
        if (summary.electricity.consumption != null && summary.electricity.consumption > 0) {
          acc.electricityConsumption += summary.electricity.consumption;
        }
        acc.electricityAmount += summary.electricity.amount;
        if (summary.water.consumption != null && summary.water.consumption > 0) {
          acc.waterConsumption += summary.water.consumption;
        }
        acc.waterAmount += summary.water.amount;
        acc.wifiDevices += summary.wifi.devices;
        acc.wifiAmount += summary.wifi.amount;
        if (summary.trash.included) {
          acc.trashContracts += 1;
        }
        acc.trashAmount += summary.trash.amount;
        acc.securityPeople += summary.security.occupants;
        acc.securityAmount += summary.security.amount;
        acc.otherAmount += summary.other.amount;
        acc.totalAmount += summary.total;
        return acc;
      },
      {
        contracts: 0,
        electricityConsumption: 0,
        electricityAmount: 0,
        waterConsumption: 0,
        waterAmount: 0,
        wifiDevices: 0,
        wifiAmount: 0,
        trashContracts: 0,
        trashAmount: 0,
        securityPeople: 0,
        securityAmount: 0,
        otherAmount: 0,
        totalAmount: 0,
      }
    );
  }, [contractRecords, activeServiceMonth]);

  const now = useMemo(() => new Date(), []);
  const soonThreshold = useMemo(
    () => new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
    [now]
  );

  const stageCounts = useMemo(() => {
    return contractRecords.reduce(
      (acc, rec) => {
        acc[rec.contract.status] = (acc[rec.contract.status] || 0) + 1;
        return acc;
      },
      { DRAFT: 0, ACTIVE: 0, ENDING: 0, TERMINATED: 0 }
    );
  }, [contractRecords]);

  const expiringSoonCount = useMemo(() => {
    return contractRecords.filter((rec) => {
      const end = rec.contract.endDate ? new Date(rec.contract.endDate) : null;
      if (!end) return false;
      return end >= now && end <= soonThreshold;
    }).length;
  }, [contractRecords, now, soonThreshold]);

  const pendingResidenceCount = useMemo(() => {
    return contractRecords.filter(
      (rec) => rec.contract.residenceStatus !== "Đã đăng ký"
    ).length;
  }, [contractRecords]);

  const statusOptions = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "DRAFT", label: "Nháp" },
    { value: "ACTIVE", label: "Đang hiệu lực" },
    { value: "ENDING", label: "Sắp kết thúc" },
    { value: "TERMINATED", label: "Đã chấm dứt" },
  ];

  const propertyOptions = [{ value: "all", label: "Tất cả nhà trọ" }, ...propertiesSeed.map((p) => ({ value: String(p.id), label: p.name }))];

  const filteredRecords = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return contractRecords
      .filter((rec) => {
        if (statusFilter !== "all" && rec.contract.status !== statusFilter) return false;
        if (propertyFilter !== "all" && String(rec.property?.id || "") !== propertyFilter) return false;
        if (!keyword) return true;
        const haystack = [
          rec.contract.code,
          rec.room?.name,
          rec.property?.name,
          rec.tenant?.name,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(keyword);
      })
      .sort((a, b) => {
        const da = a.contract.createdAt ? new Date(a.contract.createdAt).getTime() : 0;
        const db = b.contract.createdAt ? new Date(b.contract.createdAt).getTime() : 0;
        return db - da;
      });
  }, [contractRecords, statusFilter, propertyFilter, search]);

  const statusBadges = {
    DRAFT: { color: "yellow", label: "Nháp" },
    ACTIVE: { color: "green", label: "Đang hiệu lực" },
    ENDING: { color: "blue", label: "Sắp kết thúc" },
    TERMINATED: { color: "red", label: "Đã chấm dứt" },
  };

  const residenceBadge = (st) =>
    st === "Đã đăng ký" ? <Badge color="green">Đã đăng ký tạm trú</Badge> : <Badge color="yellow">Chưa đăng ký</Badge>;

  const openDetail = (rec) => setDetail({ open: true, record: rec });
  const closeDetail = () => setDetail({ open: false, record: null });

  const detailRecord = detail.record;
  const detailServiceSummary = detailRecord?.serviceSummary || null;
  const isEditingContract = contractForm.mode === "edit";
  const editingContract = isEditingContract && contractForm.contractId
    ? contractItems.find((item) => item.id === contractForm.contractId)
    : null;
  const editingStatusBadge = editingContract ? (statusBadges[editingContract.status] || statusBadges.ACTIVE) : null;
  const currentFormData = contractForm.data;
  const availableRooms = getAvailableRooms(currentFormData.propertyId, currentFormData.roomId ? Number(currentFormData.roomId) : null);
  const roomOptionsEmpty = currentFormData.propertyId && availableRooms.length === 0;

  const steps = [
    { title: "Chọn phòng & hiệu lực" },
    { title: "Người thuê & hồ sơ" },
    { title: "Giá & chỉ số" },
    { title: "Xác nhận" },
  ];

  const goToStep = (step) => setContractForm((prev) => ({ ...prev, step }));

  const nextStep = () => {
    if (contractForm.step < steps.length - 1) {
      goToStep(contractForm.step + 1);
    }
  };

  const prevStep = () => {
    if (contractForm.step > 0) {
      goToStep(contractForm.step - 1);
    }
  };

  const handlePropertyChange = (value) => {
    const roomsForProperty = getAvailableRooms(value);
    updateContractForm({
      propertyId: value,
      roomId: roomsForProperty[0] ? String(roomsForProperty[0].id) : "",
    });
  };

  const canProceedStep0 = currentFormData.propertyId && currentFormData.roomId && currentFormData.startDate && currentFormData.endDate;
  const canProceedStep1 = currentFormData.tenantId;
  const canProceedStep2 = currentFormData.rent !== "" && currentFormData.deposit !== "";

  const parseDependents = (text) => {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, relation, idCard] = line.split("-").map((part) => part.trim());
        return {
          name,
          relation: relation || "Đồng cư",
          idCard: idCard || "",
        };
      });
  };

  const parseServiceFees = (text) => {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [label, amount] = line.split(":").map((part) => part.trim());
        return {
          label,
          amount: Number(amount) || 0,
        };
      })
      .filter((fee) => fee.label);
  };

  const generateContractCode = (property, room, startDate, id) => {
    const propertySlug = property?.name ? property.name.split(" ")[0].toUpperCase() : "HD";
    const year = startDate ? new Date(startDate).getFullYear() : new Date().getFullYear();
    return `HD-${propertySlug}-${year}-${String(id).padStart(2, "0")}`;
  };

  const buildFormDataFromContract = (contract) => {
    const property = rooms.find((r) => r.id === contract.roomId)?.propertyId;
    return {
      propertyId: property ? String(property) : propertiesSeed[0]?.id ? String(propertiesSeed[0].id) : "",
      roomId: contract.roomId ? String(contract.roomId) : "",
      tenantId: contract.tenantId ? String(contract.tenantId) : tenants[0]?.id ? String(tenants[0].id) : "",
      status: contract.status,
      residenceStatus: contract.residenceStatus || "Chưa đăng ký",
      billingCycle: contract.billingCycle || "Hàng tháng",
      startDate: contract.startDate || new Date().toISOString().slice(0, 10),
      endDate: contract.endDate || new Date().toISOString().slice(0, 10),
      rent: contract.rent?.toString() || "",
      deposit: contract.deposit?.toString() || "",
      electricityRate: contract.electricityRate?.toString() || "",
      waterRate: contract.waterRate?.toString() || "",
      meterElectric: contract.meterBaseline?.electricity?.toString() || "",
      meterWater: contract.meterBaseline?.water?.toString() || "",
      serviceFeesText: (contract.serviceFees || []).map((fee) => `${fee.label}: ${fee.amount}`).join("\n"),
      dependentsText: (contract.dependents || [])
        .map((item) => `${item.name}${item.relation ? ` - ${item.relation}` : ""}${item.idCard ? ` - ${item.idCard}` : ""}`)
        .join("\n"),
      attachments: contract.attachments?.toString() || "0",
      notes: contract.notes || "",
      checklist: {
        deposit: !!contract.checkinChecklist?.deposit,
        meter: !!contract.checkinChecklist?.meter,
        documents: !!contract.checkinChecklist?.documents,
      },
    };
  };

  const openContractEditForm = (contract) => {
    const formData = buildFormDataFromContract(contract);
    setContractForm({ open: true, step: 0, mode: "edit", contractId: contract.id, data: formData });
  };

  const confirmDeleteContract = (contract) => {
    if (["ACTIVE", "ENDING"].includes(contract.status)) return;
    setContractDelete({ open: true, record: contract });
  };

  const closeDeleteContract = () => setContractDelete({ open: false, record: null });

  const performDeleteContract = () => {
    if (!contractDelete.record) return;
    const record = contractDelete.record;
    const id = record.id;
    setContractItems((prev) => prev.filter((item) => item.id !== id));
    const room = rooms.find((r) => r.id === record.roomId);
    const property = room ? propertiesSeed.find((p) => p.id === room.propertyId) : null;
    const tenant = tenants.find((t) => t.id === record.tenantId);
    appendLog({
      type: "contract:delete",
      message: `Xóa hợp đồng ${record.code}`,
      meta: {
        "Phòng": room?.name || "—",
        "Nhà trọ": property?.name || "—",
        "Khách": tenant?.name || "(Chưa có)",
      },
    });
    closeDeleteContract();
  };

  const openTerminateModal = (contract) => {
    if (!contract) return;
    const defaultEnd = contract.endDate || new Date().toISOString().slice(0, 10);
    setContractTerminate({ open: true, record: contract, endDate: defaultEnd, note: "" });
  };

  const closeTerminateModal = () => setContractTerminate({ open: false, record: null, endDate: new Date().toISOString().slice(0, 10), note: "" });

  const performTerminateContract = () => {
    if (!contractTerminate.record) return;
    const { record, endDate, note } = contractTerminate;
    const appendedNote = note
      ? `${record.notes ? `${record.notes}\n` : ""}[THANH LÝ ${endDate}] ${note}`
      : record.notes || "";

    setContractItems((prev) =>
      prev.map((item) =>
        item.id === record.id
          ? {
              ...item,
              status: "TERMINATED",
              endDate,
              notes: appendedNote,
            }
          : item
      )
    );
    const room = rooms.find((r) => r.id === record.roomId);
    const property = room ? propertiesSeed.find((p) => p.id === room.propertyId) : null;
    const tenant = tenants.find((t) => t.id === record.tenantId);
    appendLog({
      type: "contract:terminate",
      message: `Chấm dứt hợp đồng ${record.code}`,
      meta: {
        "Ngày kết thúc": fdate(endDate),
        "Phòng": room?.name || "—",
        "Nhà trọ": property?.name || "—",
        "Khách": tenant?.name || "(Chưa có)",
        "Ghi chú": note || "—",
      },
    });
    closeTerminateModal();
  };

  const submitContractForm = () => {
    if (!canProceedStep2) return;
    const property = propertiesSeed.find((p) => String(p.id) === currentFormData.propertyId);
    const room = rooms.find((r) => String(r.id) === currentFormData.roomId);
    const tenant = tenants.find((t) => String(t.id) === currentFormData.tenantId);
    const dependents = parseDependents(currentFormData.dependentsText);
    const serviceFees = parseServiceFees(currentFormData.serviceFeesText);
    const checklist = currentFormData.checklist || { deposit: false, meter: false, documents: false };

    const nextId = contractItems.length ? Math.max(...contractItems.map((c) => c.id)) + 1 : 1;
    const contractId = contractForm.mode === "edit" && contractForm.contractId ? contractForm.contractId : nextId;
    const baseCode = contractForm.mode === "edit"
      ? (contractItems.find((c) => c.id === contractId)?.code || generateContractCode(property, room, currentFormData.startDate, contractId))
      : generateContractCode(property, room, currentFormData.startDate, contractId);

    const payload = {
      id: contractId,
      code: baseCode,
      roomId: room ? room.id : null,
      tenantId: tenant ? tenant.id : null,
      status: currentFormData.status,
      createdAt:
        contractForm.mode === "edit"
          ? (contractItems.find((c) => c.id === contractId)?.createdAt || new Date().toISOString().slice(0, 10))
          : new Date().toISOString().slice(0, 10),
      startDate: currentFormData.startDate,
      endDate: currentFormData.endDate,
      billingCycle: currentFormData.billingCycle,
      rent: Number(currentFormData.rent) || 0,
      deposit: Number(currentFormData.deposit) || 0,
      electricityRate: Number(currentFormData.electricityRate) || 0,
      waterRate: Number(currentFormData.waterRate) || 0,
      serviceFees,
      meterBaseline: {
        electricity: currentFormData.meterElectric ? Number(currentFormData.meterElectric) : null,
        water: currentFormData.meterWater ? Number(currentFormData.meterWater) : null,
      },
      checkinChecklist: checklist,
      dependents,
      attachments: Number(currentFormData.attachments) || 0,
      notes: currentFormData.notes,
      residenceStatus: currentFormData.residenceStatus,
    };

    setContractItems((prev) => {
      if (contractForm.mode === "edit") {
        return prev.map((item) => (item.id === contractId ? { ...item, ...payload } : item));
      }
      return [...prev, payload];
    });

    const logMeta = {
      "Nhà trọ": property?.name || "—",
      "Phòng": room?.name || "—",
      "Người thuê": tenant?.name || "(Chưa có)",
    };
    if (contractForm.mode === "edit") {
      appendLog({
        type: "contract:update",
        message: `Cập nhật hợp đồng ${payload.code}`,
        meta: logMeta,
      });
    } else {
      appendLog({
        type: "contract:create",
        message: `Tạo hợp đồng ${payload.code}`,
        meta: logMeta,
      });
    }

    setContractForm({ open: false, step: 0, mode: "add", contractId: null, data: createEmptyContractForm() });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">Trung tâm Hợp đồng</h2>
        <p className="text-sm text-gray-600 mt-1">Theo dõi toàn bộ vòng đời hợp đồng thuê phòng trong một màn hình.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="p-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Đang hiệu lực</p>
            <p className="text-3xl font-semibold text-gray-800 mt-2">{stageCounts.ACTIVE}</p>
          </div>
          <div className="bg-green-100 text-green-600 p-3 rounded-full"><ShieldCheck className="h-6 w-6" /></div>
        </Card>
        <Card className="p-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Hợp đồng nháp</p>
            <p className="text-3xl font-semibold text-gray-800 mt-2">{stageCounts.DRAFT}</p>
          </div>
          <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full"><FileText className="h-6 w-6" /></div>
        </Card>
        <Card className="p-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Sắp hết hạn (30 ngày)</p>
            <p className="text-3xl font-semibold text-gray-800 mt-2">{expiringSoonCount}</p>
          </div>
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full"><CalendarDays className="h-6 w-6" /></div>
        </Card>
        <Card className="p-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Chưa đăng ký tạm trú</p>
            <p className="text-3xl font-semibold text-gray-800 mt-2">{pendingResidenceCount}</p>
          </div>
          <div className="bg-red-100 text-red-600 p-3 rounded-full"><AlertCircle className="h-6 w-6" /></div>
        </Card>
      </div>

      {activeServiceMonth && serviceOverview && serviceOverview.contracts > 0 && (
        <Card className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Thống kê dịch vụ đang sử dụng</h3>
              <p className="text-sm text-gray-600">Tổng hợp dữ liệu ghi nhận kỳ {formatBillingMonth(activeServiceMonth)} trên {serviceOverview.contracts} hợp đồng.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 text-sm text-gray-600">
            <div>
              <p className="text-xs uppercase text-gray-500">Điện tiêu thụ</p>
              <p className="text-lg font-semibold text-gray-800">{serviceOverview.electricityConsumption.toLocaleString("vi-VN") || 0} kWh</p>
              <p className="text-xs text-gray-500">{currency(serviceOverview.electricityAmount)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Nước tiêu thụ</p>
              <p className="text-lg font-semibold text-gray-800">{serviceOverview.waterConsumption.toLocaleString("vi-VN") || 0} m³</p>
              <p className="text-xs text-gray-500">{currency(serviceOverview.waterAmount)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Thiết bị Wifi</p>
              <p className="text-lg font-semibold text-gray-800">{serviceOverview.wifiDevices}</p>
              <p className="text-xs text-gray-500">{currency(serviceOverview.wifiAmount)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Phòng tính phí rác</p>
              <p className="text-lg font-semibold text-gray-800">{serviceOverview.trashContracts}</p>
              <p className="text-xs text-gray-500">{currency(serviceOverview.trashAmount)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Nhân khẩu tính an ninh</p>
              <p className="text-lg font-semibold text-gray-800">{serviceOverview.securityPeople}</p>
              <p className="text-xs text-gray-500">{currency(serviceOverview.securityAmount)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Điều chỉnh khác</p>
              <p className="text-lg font-semibold text-gray-800">{currency(serviceOverview.otherAmount)}</p>
              <p className="text-xs text-gray-500">Tổng dịch vụ: {currency(serviceOverview.totalAmount)}</p>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Nhà trọ</Label>
            <select
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
            >
              {propertyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Trạng thái</Label>
            <select
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Tìm kiếm</Label>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Mã hợp đồng, phòng, người thuê"
            />
          </div>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700">Danh sách hợp đồng</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setContractEditMode((prev) => !prev)}
              className={contractEditMode ? "border-indigo-500 text-indigo-600" : ""}
            >
              {contractEditMode ? "Hoàn tất" : "Chỉnh sửa"}
            </Button>
            <Button onClick={openContractForm}>
              <Plus className="h-4 w-4 mr-2" /> Thêm hợp đồng
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Hợp đồng</th>
                <th className="px-6 py-3">Phòng / Nhà trọ</th>
                <th className="px-6 py-3">Người thuê</th>
                <th className="px-6 py-3">Hiệu lực</th>
                <th className="px-6 py-3">Giá trị</th>
                <th className="px-6 py-3">Tạm trú</th>
                <th className="px-6 py-3">Tác vụ</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((rec) => {
                const statusInfo = statusBadges[rec.contract.status] || statusBadges.ACTIVE;
                const monthlyLabel = currency(rec.totalMonthly);
                const residence = residenceBadge(rec.contract.residenceStatus);
                const canTerminate = ["ACTIVE", "ENDING"].includes(rec.contract.status);
                const canDeleteContract = rec.contract.status === "DRAFT" || rec.contract.status === "TERMINATED";
                const deleteHint = canDeleteContract
                  ? "Xóa hợp đồng khỏi danh sách"
                  : "Không thể xóa khi hợp đồng đang hiệu lực hoặc sắp kết thúc";
                return (
                  <tr key={rec.contract.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      <div>{rec.contract.code}</div>
                      <div className="text-xs text-gray-500">Tạo ngày: {fdate(rec.contract.createdAt)}</div>
                      <div className="mt-1"><Badge color={statusInfo.color}>{statusInfo.label}</Badge></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{rec.room?.name}</div>
                      <div className="text-xs text-gray-500">{rec.property?.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{rec.tenant?.name || "(Chưa có)"}</div>
                      <div className="text-xs text-gray-500">{rec.tenant?.phone}</div>
                      {rec.coResidents.length > 0 && (
                        <div className="text-xs text-indigo-600 mt-1 flex items-center gap-1">
                          <UserPlus className="h-3 w-3" /> {rec.coResidents.length} người đồng cư
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>{fdate(rec.contract.startDate)} → {fdate(rec.contract.endDate)}</div>
                      <div className="text-xs text-gray-500">{rec.contract.billingCycle}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-800">{monthlyLabel}/tháng</div>
                      <div className="text-xs text-gray-500">Đặt cọc: {currency(rec.contract.deposit || 0)}</div>
                    </td>
                    <td className="px-6 py-4">{residence}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button variant="primary" onClick={() => openDetail(rec)}>Chi tiết</Button>
                        {contractEditMode && (
                          <>
                            <Button variant="outline" onClick={() => openContractEditForm(rec.contract)}>Sửa</Button>
                            {canTerminate && (
                              <Button variant="outline" onClick={() => openTerminateModal(rec.contract)}>Kết thúc</Button>
                            )}
                            <Button
                              variant="danger"
                              disabled={!canDeleteContract}
                              title={deleteHint}
                              onClick={() => confirmDeleteContract(rec.contract)}
                            >
                              Xóa
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">Không có hợp đồng nào phù hợp bộ lọc.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={detail.open}
        title={detailRecord ? `Hợp đồng ${detailRecord.contract.code}` : "Thông tin hợp đồng"}
        onClose={closeDetail}
        footer={<Button variant="outline" onClick={closeDetail}>Đóng</Button>}
      >
        {detailRecord ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <p className="text-xs uppercase text-gray-500">Trạng thái & thời gian</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge color={(statusBadges[detailRecord.contract.status] || statusBadges.ACTIVE).color}>
                    {(statusBadges[detailRecord.contract.status] || statusBadges.ACTIVE).label}
                  </Badge>
                  {residenceBadge(detailRecord.contract.residenceStatus)}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-3">
                  <CalendarDays className="h-4 w-4" />
                  <span>{fdate(detailRecord.contract.startDate)} → {fdate(detailRecord.contract.endDate)}</span>
                </div>
                <div className="text-sm text-gray-600 mt-2">Chu kỳ: {detailRecord.contract.billingCycle}</div>
                <div className="text-sm text-gray-600">Tạo ngày: {fdate(detailRecord.contract.createdAt)}</div>
              </div>
              <div className="border rounded-lg p-4 bg-gray-50">
                <p className="text-xs uppercase text-gray-500">Phòng & người thuê</p>
                <div className="mt-2">
                  <div className="font-semibold text-gray-800">{detailRecord.room?.name} · {detailRecord.property?.name}</div>
                  <div className="text-sm text-gray-600">Diện tích: {detailRecord.room?.area} m² · Giá niêm yết: {currency(detailRecord.room?.price || 0)}</div>
                </div>
                <div className="mt-3">
                  <div className="font-medium text-gray-800">{detailRecord.tenant?.name}</div>
                  <div className="text-sm text-gray-500">{detailRecord.tenant?.phone}</div>
                  <div className="text-xs text-gray-400">CMND/CCCD: {detailRecord.tenant?.idCard}</div>
                </div>
                {detailRecord.coResidents.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <p className="text-xs uppercase text-gray-500 flex items-center gap-1"><UserPlus className="h-3 w-3" /> Đồng cư ({detailRecord.coResidents.length})</p>
                    {detailRecord.coResidents.map((res) => (
                      <div key={res.idCard} className="text-sm text-gray-600">
                        {res.name} · {res.relation} · {res.idCard}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Card className="p-4 bg-gray-50 border-dashed">
              <h4 className="text-sm font-semibold text-gray-800">Cấu hình giá & phụ phí</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3 text-sm text-gray-600">
                <div>
                  <p className="text-xs uppercase text-gray-500">Giá thuê</p>
                  <p className="font-semibold text-gray-800">{currency(detailRecord.contract.rent || 0)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500 flex items-center gap-1"><Zap className="h-3 w-3" /> Điện</p>
                  <p>{currency(detailRecord.contract.electricityRate || 0)}/kWh</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500 flex items-center gap-1"><Droplet className="h-3 w-3" /> Nước</p>
                  <p>{currency(detailRecord.contract.waterRate || 0)}/m³</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Phí hàng tháng</p>
                  <p className="font-semibold text-gray-800">{currency(detailRecord.totalMonthly)}</p>
                </div>
              </div>
              {detailRecord.serviceFees.length > 0 && (
                <div className="mt-3 text-sm text-gray-600">
                  <p className="text-xs uppercase text-gray-500">Danh sách phụ phí</p>
                  <ul className="mt-1 space-y-1">
                    {detailRecord.serviceFees.map((fee) => (
                      <li key={fee.label} className="flex justify-between">
                        <span>{fee.label}</span>
                        <span>{currency(fee.amount)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>

            {detailServiceSummary && (
              <Card className="p-4 bg-white border border-indigo-100 shadow-sm">
                <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-indigo-500" /> Dịch vụ kỳ {formatBillingMonth(detailServiceSummary.month)}
                </h4>
                {detailServiceSummary.alerts.length > 0 && (
                  <div className="mt-3 bg-orange-50 border border-orange-200 text-orange-700 text-sm rounded-md p-3 space-y-1">
                    {detailServiceSummary.alerts.map((msg, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 mt-0.5" />
                        <span>{msg}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-sm text-gray-600">
                  <div className="border rounded-lg p-3">
                    <p className="text-xs uppercase text-gray-500 flex items-center gap-1"><Zap className="h-3 w-3" /> Điện</p>
                    <p className="mt-1">Chỉ số: {detailServiceSummary.electricity.prev ?? "—"} → {detailServiceSummary.electricity.current ?? "—"}</p>
                    <p>Tiêu thụ: {detailServiceSummary.electricity.consumption != null ? `${detailServiceSummary.electricity.consumption} kWh` : "—"}</p>
                    <p>Đơn giá: {currency(detailServiceSummary.electricity.rate)}/kWh</p>
                    <p className="font-semibold text-gray-800 mt-1">{currency(detailServiceSummary.electricity.amount)}</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-xs uppercase text-gray-500 flex items-center gap-1"><Droplet className="h-3 w-3" /> Nước</p>
                    <p className="mt-1">Chỉ số: {detailServiceSummary.water.prev ?? "—"} → {detailServiceSummary.water.current ?? "—"}</p>
                    <p>Tiêu thụ: {detailServiceSummary.water.consumption != null ? `${detailServiceSummary.water.consumption} m³` : "—"}</p>
                    <p>Đơn giá: {currency(detailServiceSummary.water.rate)}/m³</p>
                    <p className="font-semibold text-gray-800 mt-1">{currency(detailServiceSummary.water.amount)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-sm text-gray-600">
                  <div className="border rounded-lg p-3">
                    <p className="text-xs uppercase text-gray-500">Wifi</p>
                    <p>Thiết bị: {detailServiceSummary.wifi.devices}</p>
                    <p className="font-semibold text-gray-800 mt-1">{currency(detailServiceSummary.wifi.amount)}</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-xs uppercase text-gray-500">Phí rác</p>
                    <p>{detailServiceSummary.trash.included ? "Đang tính" : "Không áp dụng"}</p>
                    <p className="font-semibold text-gray-800 mt-1">{currency(detailServiceSummary.trash.amount)}</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-xs uppercase text-gray-500">An ninh</p>
                    <p>Nhân khẩu: {detailServiceSummary.security.occupants}</p>
                    <p className="font-semibold text-gray-800 mt-1">{currency(detailServiceSummary.security.amount)}</p>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600 border-t pt-3">
                  <div className="flex justify-between">
                    <span>Điều chỉnh khác</span>
                    <span className="font-medium text-gray-800">{currency(detailServiceSummary.other.amount)}</span>
                  </div>
                  {detailServiceSummary.other.note && (
                    <p className="text-xs text-gray-500 mt-1">Ghi chú: {detailServiceSummary.other.note}</p>
                  )}
                  <div className="flex justify-between items-center mt-3 pt-3 border-t">
                    <span className="text-sm text-gray-600">Tổng cộng</span>
                    <span className="text-lg font-semibold text-indigo-600">{currency(detailServiceSummary.total)}</span>
                  </div>
                </div>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="text-sm font-semibold text-gray-800">Checklist nhận phòng</h4>
                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  {[
                    { key: "deposit", label: "Đã nhận đặt cọc" },
                    { key: "meter", label: "Đã ghi chỉ số ban đầu" },
                    { key: "documents", label: "Đã ký & lưu hồ sơ" },
                  ].map((item) => {
                    const done = !!detailRecord.contract.checkinChecklist?.[item.key];
                    return (
                      <div key={item.key} className="flex items-center gap-2">
                        {done ? (
                          <ShieldCheck className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                        )}
                        <span className={done ? "text-gray-700" : "text-gray-500"}>{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
              <Card className="p-4">
                <h4 className="text-sm font-semibold text-gray-800">Chỉ số đầu kỳ</h4>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <div>
                    <p className="text-xs uppercase text-gray-500">Điện</p>
                    <p>{detailRecord.meterBaseline.electricity ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500">Nước</p>
                    <p>{detailRecord.meterBaseline.water ?? "—"}</p>
                  </div>
                  <div className="col-span-2 text-xs text-gray-500">
                    Lần ghi cuối: {detailRecord.lastInvoice?.date ? fdate(detailRecord.lastInvoice.date) : "Chưa có"}
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="text-sm font-semibold text-gray-800">Hóa đơn gần nhất</h4>
                {detailRecord.lastInvoice ? (
                  <div className="mt-3 text-sm text-gray-600">
                    <div>Mã: HD-{detailRecord.lastInvoice.id.toString().padStart(3, "0")}</div>
                    <div>Ngày phát hành: {detailRecord.lastInvoice.date ? fdate(detailRecord.lastInvoice.date) : "Chưa có"}</div>
                    <div>Trạng thái: {detailRecord.lastInvoice.status}</div>
                    <div>Số tiền: {currency(detailRecord.lastInvoice.total)}</div>
                  </div>
                ) : (
                  <div className="mt-3 text-sm text-gray-500">Chưa phát sinh hóa đơn.</div>
                )}
              </Card>
              <Card className="p-4">
                <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2"><Paperclip className="h-4 w-4" /> Hồ sơ & ghi chú</h4>
                <div className="mt-3 text-sm text-gray-600">
                  <div>Số file đính kèm: {detailRecord.contract.attachments}</div>
                  <div className="mt-2 text-gray-700 leading-relaxed">{detailRecord.contract.notes || "Không có ghi chú."}</div>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">Không tìm thấy thông tin hợp đồng.</div>
        )}
      </Modal>

      <Modal
        open={contractForm.open}
        title="Khởi tạo hợp đồng mới"
        onClose={closeContractForm}
        footer={
          <>
            <Button variant="outline" onClick={contractForm.step === 0 ? closeContractForm : prevStep}>
              {contractForm.step === 0 ? "Hủy" : "Quay lại"}
            </Button>
            {contractForm.step < steps.length - 1 ? (
              <Button
                onClick={nextStep}
                disabled={
                  (contractForm.step === 0 && !canProceedStep0) ||
                  (contractForm.step === 1 && !canProceedStep1) ||
                  (contractForm.step === 2 && !canProceedStep2)
                }
              >
                Tiếp tục
              </Button>
            ) : (
              <Button variant="primary" onClick={submitContractForm} disabled={!canProceedStep2}>
                Hoàn tất
              </Button>
            )}
          </>
        }
      >
        {contractForm.open && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {steps.map((step, index) => {
                const active = contractForm.step === index;
                const completed = index < contractForm.step;
                return (
                  <React.Fragment key={step.title}>
                    <div
                      className={`px-3 py-1 rounded-full border text-xs font-medium ${
                        active
                          ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                          : completed
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                      }`}
                    >
                      {index + 1}. {step.title}
                    </div>
                    {index < steps.length - 1 && <ChevronRight className="h-4 w-4 text-gray-300" />}
                  </React.Fragment>
                );
              })}
            </div>

            {isEditingContract && editingContract && (
              <Card className="p-4 bg-indigo-50 border border-indigo-100">
                <p className="text-xs uppercase text-indigo-600 font-semibold">Đang chỉnh sửa hợp đồng hiện hữu</p>
                <div className="mt-2 text-sm text-indigo-700 space-y-1">
                  <div>Mã hợp đồng: <strong>{editingContract.code}</strong></div>
                  <div>Ngày tạo: {fdate(editingContract.createdAt)}</div>
                  <div className="flex items-center gap-2">
                    <span>Trạng thái:</span>
                    {editingStatusBadge && <Badge color={editingStatusBadge.color}>{editingStatusBadge.label}</Badge>}
                    {residenceBadge(editingContract.residenceStatus)}
                  </div>
                </div>
                <p className="mt-2 text-xs text-indigo-600">Lưu ý: các thay đổi sau khi lưu sẽ áp dụng ngay cho hợp đồng này.</p>
              </Card>
            )}

            {contractForm.step === 0 && (
              <div className="space-y-4">
                <div>
                  <Label>Nhà trọ</Label>
                  <select
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={currentFormData.propertyId}
                    onChange={(e) => handlePropertyChange(e.target.value)}
                    disabled={isEditingContract}
                  >
                    {propertiesSeed.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  {isEditingContract && (
                    <p className="text-xs text-gray-500 mt-1">Muốn đổi nhà trọ, vui lòng tạo hợp đồng mới.</p>
                  )}
                </div>
                <div>
                  <Label>Phòng</Label>
                  <select
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={currentFormData.roomId}
                    onChange={(e) => updateContractForm({ roomId: e.target.value })}
                    disabled={roomOptionsEmpty || isEditingContract}
                  >
                    {availableRooms.map((room) => (
                      <option key={room.id} value={room.id}>{`${room.name} · ${currency(room.price)}`}</option>
                    ))}
                  </select>
                  {roomOptionsEmpty && (
                    <p className="text-xs text-red-600 mt-1">Nhà trọ này chưa có phòng trống để lập hợp đồng mới.</p>
                  )}
                  {isEditingContract && (
                    <p className="text-xs text-gray-500 mt-1">Không thể chuyển phòng khi đang chỉnh sửa hợp đồng. Hãy kết thúc hợp đồng cũ và tạo hợp đồng mới cho phòng khác.</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Ngày hiệu lực</Label>
                    <Input type="date" value={currentFormData.startDate} onChange={(e) => updateContractForm({ startDate: e.target.value })} />
                  </div>
                  <div>
                    <Label>Ngày kết thúc</Label>
                    <Input type="date" value={currentFormData.endDate} onChange={(e) => updateContractForm({ endDate: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Trạng thái hợp đồng</Label>
                    <select
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={currentFormData.status}
                      onChange={(e) => updateContractForm({ status: e.target.value })}
                    >
                      <option value="DRAFT">Nháp</option>
                      <option value="ACTIVE">Đang hiệu lực</option>
                      <option value="ENDING">Sắp kết thúc</option>
                      <option value="TERMINATED">Đã chấm dứt</option>
                    </select>
                  </div>
                  <div>
                    <Label>Trạng thái tạm trú</Label>
                    <select
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={currentFormData.residenceStatus}
                      onChange={(e) => updateContractForm({ residenceStatus: e.target.value })}
                    >
                      <option value="Chưa đăng ký">Chưa đăng ký</option>
                      <option value="Đang xử lý">Đang xử lý</option>
                      <option value="Đã đăng ký">Đã đăng ký</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Chu kỳ tính tiền</Label>
                  <select
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={currentFormData.billingCycle}
                    onChange={(e) => updateContractForm({ billingCycle: e.target.value })}
                  >
                    <option value="Hàng tháng">Hàng tháng</option>
                    <option value="Theo quý">Theo quý</option>
                    <option value="Theo năm">Theo năm</option>
                  </select>
                </div>
              </div>
            )}

            {contractForm.step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label>Người thuê chính</Label>
                  <select
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={currentFormData.tenantId}
                    onChange={(e) => updateContractForm({ tenantId: e.target.value })}
                  >
                    {tenants.map((t) => (
                      <option key={t.id} value={t.id}>{`${t.name} · ${t.phone}`}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Người đồng cư (mỗi dòng: Tên - Quan hệ - CCCD)</Label>
                  <textarea
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    rows={3}
                    value={currentFormData.dependentsText}
                    onChange={(e) => updateContractForm({ dependentsText: e.target.value })}
                    placeholder="Nguyễn Văn B - Bạn cùng phòng - 012345678901"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Số lượng hồ sơ đính kèm</Label>
                    <Input
                      type="number"
                      min={0}
                      value={currentFormData.attachments}
                      onChange={(e) => updateContractForm({ attachments: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Ghi chú nội bộ</Label>
                    <textarea
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      rows={3}
                      value={currentFormData.notes}
                      onChange={(e) => updateContractForm({ notes: e.target.value })}
                      placeholder="Nhắc khách bổ sung hồ sơ tạm trú trong 3 ngày đầu..."
                    />
                  </div>
                </div>
              </div>
            )}

            {contractForm.step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Giá thuê</Label>
                    <Input
                      type="number"
                      min={0}
                      value={currentFormData.rent}
                      onChange={(e) => updateContractForm({ rent: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Tiền đặt cọc</Label>
                    <Input
                      type="number"
                      min={0}
                      value={currentFormData.deposit}
                      onChange={(e) => updateContractForm({ deposit: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Đơn giá điện (VND/kWh)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={currentFormData.electricityRate}
                      onChange={(e) => updateContractForm({ electricityRate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Đơn giá nước (VND/m³)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={currentFormData.waterRate}
                      onChange={(e) => updateContractForm({ waterRate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Chỉ số điện ban đầu</Label>
                    <Input
                      type="number"
                      min={0}
                      value={currentFormData.meterElectric}
                      onChange={(e) => updateContractForm({ meterElectric: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Chỉ số nước ban đầu</Label>
                    <Input
                      type="number"
                      min={0}
                      value={currentFormData.meterWater}
                      onChange={(e) => updateContractForm({ meterWater: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Phụ phí hàng tháng (mỗi dòng: Tên phí: Số tiền)</Label>
                  <textarea
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    rows={3}
                    value={currentFormData.serviceFeesText}
                    onChange={(e) => updateContractForm({ serviceFeesText: e.target.value })}
                    placeholder="Wifi: 120000\nPhí rác: 50000"
                  />
                </div>
                <div>
                  <Label>Checklist bàn giao</Label>
                  <div className="mt-2 space-y-2 text-sm text-gray-600">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={currentFormData.checklist.deposit}
                        onChange={() => toggleChecklistItem("deposit")}
                      />
                      Đã nhận đặt cọc
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={currentFormData.checklist.meter}
                        onChange={() => toggleChecklistItem("meter")}
                      />
                      Đã ghi nhận chỉ số điện/nước ban đầu
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={currentFormData.checklist.documents}
                        onChange={() => toggleChecklistItem("documents")}
                      />
                      Đã ký và lưu toàn bộ hồ sơ
                    </label>
                  </div>
                </div>
              </div>
            )}

            {contractForm.step === 3 && (
              <div className="space-y-4">
                <Card className="p-4 bg-gray-50">
                  <p className="text-xs uppercase text-gray-500">Thông tin cơ bản</p>
                  <div className="mt-2 text-sm text-gray-700 space-y-1">
                    <div>Nhà trọ: {propertiesSeed.find((p) => String(p.id) === currentFormData.propertyId)?.name || "—"}</div>
                    <div>Phòng: {rooms.find((r) => String(r.id) === currentFormData.roomId)?.name || "—"}</div>
                    <div>Hiệu lực: {fdate(currentFormData.startDate)} → {fdate(currentFormData.endDate)}</div>
                    <div>Trạng thái: {currentFormData.status}</div>
                    <div>Tạm trú: {currentFormData.residenceStatus}</div>
                  </div>
                </Card>
                <Card className="p-4 bg-gray-50">
                  <p className="text-xs uppercase text-gray-500">Người thuê & hồ sơ</p>
                  <div className="mt-2 text-sm text-gray-700 space-y-1">
                    <div>Người thuê chính: {tenants.find((t) => String(t.id) === currentFormData.tenantId)?.name || "—"}</div>
                    <div>Đồng cư: {parseDependents(currentFormData.dependentsText).length} người</div>
                    <div>Hồ sơ đính kèm: {currentFormData.attachments}</div>
                    <div>Ghi chú: {currentFormData.notes || "Không có"}</div>
                  </div>
                </Card>
                <Card className="p-4 bg-gray-50">
                  <p className="text-xs uppercase text-gray-500">Giá & chỉ số</p>
                  <div className="mt-2 text-sm text-gray-700 space-y-1">
                    <div>Giá thuê: {currency(Number(currentFormData.rent) || 0)}</div>
                    <div>Đặt cọc: {currency(Number(currentFormData.deposit) || 0)}</div>
                    <div>Điện: {currentFormData.electricityRate || 0} VND/kWh · Nước: {currentFormData.waterRate || 0} VND/m³</div>
                    <div>Chỉ số ban đầu: Điện {currentFormData.meterElectric || "—"} · Nước {currentFormData.meterWater || "—"}</div>
                    <div>Phụ phí: {parseServiceFees(currentFormData.serviceFeesText).reduce((sum, fee) => sum + fee.amount, 0)} VND/tháng</div>
                    <div>
                      Checklist: {currentFormData.checklist.deposit ? "Đã nhận cọc" : "Chưa nhận cọc"}, {currentFormData.checklist.meter ? "Đã ghi chỉ số" : "Chưa ghi chỉ số"}, {currentFormData.checklist.documents ? "Đủ hồ sơ" : "Thiếu hồ sơ"}
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

function ServicesView() {
  const { serviceCatalog, serviceUsage, upsertUsageRecord, ensureMonthRecords, previousMonth, nextMonth } = useServices();
  const months = useMemo(() => getServiceMonths(serviceUsage), [serviceUsage]);
  const today = useMemo(() => new Date(), []);
  const fallbackMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

  const [selectedMonth, setSelectedMonth] = useState(() => (months.length ? months[months.length - 1] : fallbackMonth));
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [buildingFilter, setBuildingFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [statsMonthFilter, setStatsMonthFilter] = useState("current");
  const [onlyIssues, setOnlyIssues] = useState(false);
  const [pendingEdits, setPendingEdits] = useState({});
  const [autoSaveStatus, setAutoSaveStatus] = useState("idle");
  const [activeTab, setActiveTab] = useState("meters");

  const tabs = [
    {
      id: "meters",
      label: "Điện & Nước",
      description: "Nhập chỉ số điện nước kỳ hiện tại và so sánh với số kỳ trước để rà soát bất thường.",
    },
    {
      id: "services",
      label: "Dịch vụ",
      description: "Quản lý các dịch vụ ngoài điện nước và điều chỉnh phát sinh theo từng phòng.",
    },
    {
      id: "summary",
      label: "Tổng hợp tính tiền",
      description: "Tổng hợp tiêu thụ và chi phí dịch vụ để chuẩn bị tính tiền.",
    },
  ];

  const activeTabConfig = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  const autoSaveTimerRef = useRef(null);
  const autoSaveStatusTimerRef = useRef(null);
  const fileInputRef = useRef(null);

  const propertyOptions = useMemo(
    () => [
      { value: "all", label: "Tất cả nhà trọ" },
      ...propertiesSeed.map((p) => ({ value: String(p.id), label: p.name })),
    ],
    []
  );

  const buildingOptions = useMemo(() => {
    const uniq = new Set();
    rooms.forEach((room) => uniq.add(guessBuildingCode(room)));
    return [{ value: "all", label: "Tất cả tòa/khu" }, ...Array.from(uniq).sort().map((code) => ({ value: code, label: code }))];
  }, []);

  const statusOptions = useMemo(
    () => [
      { value: "all", label: "Tất cả trạng thái" },
      { value: "ACTIVE", label: "Đang hiệu lực" },
      { value: "ENDING", label: "Sắp kết thúc" },
      { value: "DRAFT", label: "Nháp" },
      { value: "TERMINATED", label: "Đã chấm dứt" },
    ],
    []
  );

  useEffect(() => {
    if (!months.length) return;
    if (!selectedMonth) {
      setSelectedMonth(months[months.length - 1]);
    }
  }, [months, selectedMonth]);

  const managedContracts = useMemo(
    () => contracts.filter((contract) => ["ACTIVE", "ENDING"].includes(contract.status)),
    []
  );

  useEffect(() => {
    if (!selectedMonth || managedContracts.length === 0) return;
    ensureMonthRecords(selectedMonth, managedContracts);
  }, [selectedMonth, managedContracts, ensureMonthRecords]);

  const toNumericOrUndefined = useCallback((value, { allowNull = false } = {}) => {
    if (value === undefined) return undefined;
    if (value === null || value === "") return allowNull ? null : undefined;
    const normalized = typeof value === "number" ? value : Number(String(value).replace(/,/g, ".").trim());
    if (Number.isFinite(normalized)) return normalized;
    return undefined;
  }, []);

  const overrideMap = useMemo(() => {
    if (!Object.keys(pendingEdits).length) return null;
    const map = {};
    Object.entries(pendingEdits).forEach(([id, edits]) => {
      const contractId = Number(id);
      const entry = { month: selectedMonth };
      if (edits.electricCurrent !== undefined) {
        const numeric = toNumericOrUndefined(edits.electricCurrent, { allowNull: true });
        if (numeric !== undefined) entry.electricCurrent = numeric;
      }
      if (edits.waterCurrent !== undefined) {
        const numeric = toNumericOrUndefined(edits.waterCurrent, { allowNull: true });
        if (numeric !== undefined) entry.waterCurrent = numeric;
      }
      if (edits.wifiDevices !== undefined) {
        const numeric = toNumericOrUndefined(edits.wifiDevices, { allowNull: true });
        if (numeric !== undefined) entry.wifiDevices = Math.max(0, numeric ?? 0);
      }
      if (edits.trashIncluded !== undefined) {
        entry.trashIncluded = !!edits.trashIncluded;
      }
      if (edits.otherAmount !== undefined) {
        const numeric = toNumericOrUndefined(edits.otherAmount, { allowNull: true });
        if (numeric !== undefined) entry.otherAmount = numeric ?? 0;
      }
      if (edits.note !== undefined) {
        entry.note = edits.note;
      }
      map[contractId] = entry;
    });
    return map;
  }, [pendingEdits, selectedMonth, toNumericOrUndefined]);

  const statusMeta = {
    ACTIVE: { color: "green", label: "Đang hiệu lực" },
    ENDING: { color: "yellow", label: "Sắp kết thúc" },
    DRAFT: { color: "blue", label: "Nháp" },
    TERMINATED: { color: "red", label: "Đã chấm dứt" },
  };

  const aggregateSummaries = useCallback(
    (items) =>
      items.reduce(
        (acc, item) => {
          const summary = item.summary;
          if (!summary) return acc;
          acc.contracts += 1;
          if (summary.electricity.consumption != null && summary.electricity.consumption > 0) {
            acc.electricityConsumption += summary.electricity.consumption;
          }
          acc.electricityAmount += summary.electricity.amount;
          if (summary.water.consumption != null && summary.water.consumption > 0) {
            acc.waterConsumption += summary.water.consumption;
          }
          acc.waterAmount += summary.water.amount;
          acc.wifiDevices += summary.wifi.devices;
          acc.wifiAmount += summary.wifi.amount;
          if (summary.trash.included) {
            acc.trashContracts += 1;
          }
          acc.trashAmount += summary.trash.amount;
          acc.securityPeople += summary.security.occupants;
          acc.securityAmount += summary.security.amount;
          acc.otherAmount += summary.other.amount;
          acc.totalAmount += summary.total;
          return acc;
        },
        {
          contracts: 0,
          electricityConsumption: 0,
          electricityAmount: 0,
          waterConsumption: 0,
          waterAmount: 0,
          wifiDevices: 0,
          wifiAmount: 0,
          trashContracts: 0,
          trashAmount: 0,
          securityPeople: 0,
          securityAmount: 0,
          otherAmount: 0,
          totalAmount: 0,
        }
      ),
    []
  );

  const serviceSummariesAll = useMemo(
    () =>
      managedContracts.map((contract) => {
        const room = rooms.find((r) => r.id === contract.roomId) || null;
        const property = room ? propertiesSeed.find((p) => p.id === room.propertyId) || null : null;
        const summary = summarizeContractServices(contract, serviceUsage, serviceCatalog, selectedMonth, previousMonth, overrideMap || undefined);
        return {
          contract,
          room,
          property,
          building: guessBuildingCode(room),
          summary,
        };
      }),
    [managedContracts, serviceUsage, serviceCatalog, selectedMonth, previousMonth, overrideMap]
  );

  const totals = useMemo(() => aggregateSummaries(serviceSummariesAll), [aggregateSummaries, serviceSummariesAll]);

  const filteredSummaries = useMemo(() => {
    return serviceSummariesAll.filter((item) => {
      if (!item.summary) return false;
      if (propertyFilter !== "all" && String(item.property?.id) !== propertyFilter) return false;
      if (buildingFilter !== "all" && item.building !== buildingFilter) return false;
      if (statusFilter !== "all" && item.contract.status !== statusFilter) return false;
      return true;
    });
  }, [serviceSummariesAll, propertyFilter, buildingFilter, statusFilter]);

  const statsMonthOptions = useMemo(() => {
    if (!months.length) return [{ value: "current", label: "Kỳ đang chọn" }];
    const monthList = months.slice().reverse();
    return [
      { value: "current", label: "Kỳ đang chọn" },
      ...monthList.map((month) => ({ value: month, label: formatBillingMonth(month) })),
    ];
  }, [months]);

  const statsMonth = statsMonthFilter === "current" ? selectedMonth : statsMonthFilter;

  const statsSummaries = useMemo(() => {
    if (!statsMonth) return [];
    return filteredSummaries
      .map((item) => {
        const summary = summarizeContractServices(
          item.contract,
          serviceUsage,
          serviceCatalog,
          statsMonth,
          previousMonth,
          statsMonthFilter === "current" ? overrideMap || undefined : null
        );
        return summary ? { ...item, summary } : null;
      })
      .filter(Boolean);
  }, [filteredSummaries, serviceUsage, serviceCatalog, statsMonth, statsMonthFilter, previousMonth, overrideMap]);

  const statsAggregates = useMemo(() => aggregateSummaries(statsSummaries), [aggregateSummaries, statsSummaries]);

  const gridSummaries = useMemo(() => {
    if (!selectedMonth) return [];
    return filteredSummaries
      .map((item) => {
        const summary = summarizeContractServices(
          item.contract,
          serviceUsage,
          serviceCatalog,
          selectedMonth,
          previousMonth,
          overrideMap || undefined
        );
        return summary ? { ...item, summary } : null;
      })
      .filter(Boolean);
  }, [filteredSummaries, serviceUsage, serviceCatalog, selectedMonth, previousMonth, overrideMap]);

  const gridRows = useMemo(() => {
    return gridSummaries.map((item, index) => {
      const summary = item.summary;
      const electricity = summary?.electricity || {};
      const water = summary?.water || {};
      const wifi = summary?.wifi || {};
      const trash = summary?.trash || {};
      const security = summary?.security || {};
      const other = summary?.other || {};

      const pending = pendingEdits[item.contract.id] || {};

      const displayElectric = pending.electricCurrent !== undefined ? pending.electricCurrent : electricity.current ?? "";
      const displayWater = pending.waterCurrent !== undefined ? pending.waterCurrent : water.current ?? "";
      const displayWifi = pending.wifiDevices !== undefined ? pending.wifiDevices : wifi.devices ?? 0;
      const displayTrash = pending.trashIncluded !== undefined ? pending.trashIncluded : trash.included ?? false;
      const displayOther = pending.otherAmount !== undefined ? pending.otherAmount : other.amount ?? 0;
      const displayNote = pending.note !== undefined ? pending.note : other.note ?? "";

      const alerts = [...(summary?.alerts || [])];
      if (electricity.prev == null) alerts.push("Chưa có chỉ số điện kỳ trước.");
      if (water.prev == null) alerts.push("Chưa có chỉ số nước kỳ trước.");

      const hasHardError =
        (electricity.consumption != null && electricity.consumption < 0) ||
        (water.consumption != null && water.consumption < 0) ||
        electricity.prev == null ||
        water.prev == null;

      const previousConsumption = electricity.previousConsumption;
      const deltaPercent =
        previousConsumption && previousConsumption !== 0 && electricity.consumption != null
          ? Math.round(((electricity.consumption - previousConsumption) / previousConsumption) * 100)
          : null;

      const electricDeltaLabel = electricity.delta != null
        ? `${electricity.delta >= 0 ? "+" : ""}${electricity.delta} kWh${
            deltaPercent != null ? ` (${deltaPercent >= 0 ? "+" : ""}${deltaPercent}%)` : ""
          }`
        : "—";

      const electricDeltaClass =
        deltaPercent != null && deltaPercent >= 100
          ? "text-amber-600 font-semibold"
          : deltaPercent != null && deltaPercent <= -30
            ? "text-green-600 font-semibold"
            : "text-gray-500";

      const waterPreviousConsumption = water.previousConsumption;
      const waterDeltaPercent =
        waterPreviousConsumption && waterPreviousConsumption !== 0 && water.consumption != null
          ? Math.round(((water.consumption - waterPreviousConsumption) / waterPreviousConsumption) * 100)
          : null;

      const waterDeltaLabel = water.delta != null
        ? `${water.delta >= 0 ? "+" : ""}${water.delta} m³${
            waterDeltaPercent != null ? ` (${waterDeltaPercent >= 0 ? "+" : ""}${waterDeltaPercent}%)` : ""
          }`
        : "—";

      const waterDeltaClass =
        waterDeltaPercent != null && waterDeltaPercent >= 100
          ? "text-amber-600 font-semibold"
          : waterDeltaPercent != null && waterDeltaPercent <= -30
            ? "text-green-600 font-semibold"
            : "text-gray-500";

      const occupantTooltip = item.contract.dependents?.length
        ? item.contract.dependents.map((dep) => `${dep.name} · ${dep.relation}`).join("\n")
        : "Chưa có đồng cư";

      return {
        contractId: item.contract.id,
        contract: item.contract,
        roomName: item.room?.name || "—",
        propertyName: item.property?.name || "—",
        building: item.building,
        status: item.contract.status,
        statusInfo: statusMeta[item.contract.status] || { color: "gray", label: item.contract.status },
        electricPrev: electricity.prev,
        electricConsumption: electricity.consumption,
        electricAmount: electricity.amount || 0,
        electricDisplay: displayElectric === null ? "" : displayElectric,
        waterPrev: water.prev,
        waterConsumption: water.consumption,
        waterAmount: water.amount || 0,
        waterDisplay: displayWater === null ? "" : displayWater,
        electricDeltaLabel,
        electricDeltaClass,
        waterDeltaLabel,
        waterDeltaClass,
        occupants: security.occupants || 0,
        occupantTooltip,
        wifiDevices: displayWifi,
        wifiAmount: wifi.amount || 0,
        trashIncluded: displayTrash,
        trashAmount: trash.amount || 0,
        otherAmountDisplay: displayOther,
        otherAmountNumber: other.amount || 0,
        noteDisplay: displayNote,
        securityAmount: security.amount || 0,
        totalAmount: summary?.total || 0,
        alerts,
        hasHardError,
        hasWarning: !hasHardError && alerts.length > 0,
        rowIndex: index,
      };
    });
  }, [gridSummaries, pendingEdits, statusMeta]);

  const issueCount = useMemo(() => gridRows.filter((row) => row.alerts.length > 0).length, [gridRows]);

  const visibleRows = useMemo(() => (onlyIssues ? gridRows.filter((row) => row.alerts.length > 0) : gridRows), [gridRows, onlyIssues]);
  const visibleIssueCount = useMemo(() => visibleRows.filter((row) => row.alerts.length > 0).length, [visibleRows]);
  const visibleTotals = useMemo(
    () =>
      visibleRows.reduce(
        (acc, row) => {
          acc.totalAmount += row.totalAmount;
          acc.electricity += row.electricAmount;
          acc.water += row.waterAmount;
          acc.wifi += row.wifiAmount;
          acc.trash += row.trashAmount;
          acc.security += row.securityAmount;
          acc.other += row.otherAmountNumber;
          return acc;
        },
        { totalAmount: 0, electricity: 0, water: 0, wifi: 0, trash: 0, security: 0, other: 0 }
      ),
    [visibleRows]
  );

  const buildPayload = useCallback(
    (contractId, edits) => {
      const record = findServiceRecord(serviceUsage, contractId, selectedMonth);
      const payload = {};

      const electricValue = toNumericOrUndefined(edits.electricCurrent, { allowNull: true });
      if (electricValue !== undefined) {
        payload.electricity = { current: electricValue };
      }

      const waterValue = toNumericOrUndefined(edits.waterCurrent, { allowNull: true });
      if (waterValue !== undefined) {
        payload.water = { current: waterValue };
      }

      const wifiValue = toNumericOrUndefined(edits.wifiDevices, { allowNull: true });
      if (wifiValue !== undefined) {
        payload.wifiDevices = Math.max(0, wifiValue ?? 0);
      }

      if (edits.trashIncluded !== undefined) {
        payload.trashIncluded = !!edits.trashIncluded;
      }

      if (edits.otherAmount !== undefined || edits.note !== undefined) {
        const baseAdj = record?.otherAdjustments || { amount: 0, note: "" };
        const amountValue = toNumericOrUndefined(edits.otherAmount, { allowNull: true });
        payload.otherAdjustments = {
          amount: amountValue !== undefined ? (amountValue ?? 0) : baseAdj.amount ?? 0,
          note: edits.note !== undefined ? edits.note : baseAdj.note || "",
        };
      }

      return payload;
    },
    [serviceUsage, selectedMonth, toNumericOrUndefined]
  );

  const commitPending = useCallback(
    (edits) => {
      const entries = Object.entries(edits || {});
      if (!entries.length) return false;
      let committed = false;
      entries.forEach(([id, patch]) => {
        const payload = buildPayload(Number(id), patch);
        if (payload && Object.keys(payload).length) {
          upsertUsageRecord(Number(id), selectedMonth, payload);
          committed = true;
        }
      });
      return committed;
    },
    [buildPayload, selectedMonth, upsertUsageRecord]
  );

  useEffect(() => {
    if (!Object.keys(pendingEdits).length) return;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      setAutoSaveStatus("saving");
      const committed = commitPending(pendingEdits);
      if (committed) {
        setPendingEdits({});
        setAutoSaveStatus("saved");
        if (autoSaveStatusTimerRef.current) clearTimeout(autoSaveStatusTimerRef.current);
        autoSaveStatusTimerRef.current = setTimeout(() => setAutoSaveStatus("idle"), 1500);
      } else {
        setAutoSaveStatus("idle");
      }
    }, 800);
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [pendingEdits, commitPending]);

  useEffect(
    () => () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      if (autoSaveStatusTimerRef.current) clearTimeout(autoSaveStatusTimerRef.current);
    },
    []
  );

  const updatePending = useCallback((contractId, patch) => {
    setPendingEdits((prev) => {
      const key = String(contractId);
      const current = prev[key] || {};
      const merged = { ...current, ...patch };
      const sanitized = Object.fromEntries(Object.entries(merged).filter(([, value]) => value !== undefined));
      const next = { ...prev };
      if (Object.keys(sanitized).length === 0) {
        delete next[key];
      } else {
        next[key] = sanitized;
      }
      return next;
    });
    setAutoSaveStatus("editing");
  }, []);

  const handleNumberChange = (contractId, field) => (event) => {
    const raw = event.target.value;
    updatePending(contractId, { [field]: raw });
  };

  const handleCheckboxChange = (contractId) => (event) => {
    updatePending(contractId, { trashIncluded: event.target.checked });
  };

  const handleNoteChange = (contractId) => (event) => {
    updatePending(contractId, { note: event.target.value });
  };

  const handlePasteOnCell = (field, rowIndex, event) => {
    if (!visibleRows.length) return;
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    if (!text) return;
    const values = text
      .split(/\r?\n/)
      .map((line) => line.split(/\t|,/)[0]?.trim())
      .filter((line) => line !== undefined);
    if (!values.length) return;

    setPendingEdits((prev) => {
      const next = { ...prev };
      values.forEach((value, offset) => {
        const targetRow = visibleRows[rowIndex + offset];
        if (!targetRow) return;
        const key = String(targetRow.contractId);
        const numeric = toNumericOrUndefined(value, { allowNull: true });
        if (numeric === undefined && value !== "") return;
        const currentPatch = next[key] ? { ...next[key] } : {};
        currentPatch[field] = value === "" ? "" : numeric ?? 0;
        next[key] = currentPatch;
      });
      return next;
    });
    setAutoSaveStatus("editing");
  };

  const handleKeyDown = (contractId, rowIndex, field) => (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === ";" && field === "note") {
      event.preventDefault();
      const todayStr = new Date().toISOString().slice(0, 10);
      const currentNote = pendingEdits[contractId]?.note ?? visibleRows[rowIndex]?.noteDisplay ?? "";
      const nextNote = currentNote ? `${currentNote} ${todayStr}` : todayStr;
      updatePending(contractId, { note: nextNote });
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "d") {
      event.preventDefault();
      const prevRow = visibleRows[rowIndex - 1];
      if (!prevRow) return;
      if (field === "electricCurrent") updatePending(contractId, { electricCurrent: prevRow.electricDisplay });
      if (field === "waterCurrent") updatePending(contractId, { waterCurrent: prevRow.waterDisplay });
      if (field === "wifiDevices") updatePending(contractId, { wifiDevices: prevRow.wifiDevices });
      if (field === "otherAmount") updatePending(contractId, { otherAmount: prevRow.otherAmountDisplay });
      if (field === "note") updatePending(contractId, { note: prevRow.noteDisplay });
    }
  };

  const handlePasteFromExcel = () => {
    window.alert("Đặt con trỏ vào cột Điện/Nước kỳ này rồi nhấn Ctrl+V để dán danh sách chỉ số từ Excel hoặc Google Sheets.");
  };

  const handleImportCsvClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    window.alert("Chức năng import CSV sẽ được triển khai cùng API trong giai đoạn tiếp theo.");
    event.target.value = "";
  };

  const handleCreateNextMonth = () => {
    const monthToCreate = selectedMonth ? nextMonth(selectedMonth) : fallbackMonth;
    if (!monthToCreate) return;
    ensureMonthRecords(monthToCreate, managedContracts);
    setSelectedMonth(monthToCreate);
  };

  const handleSaveMeters = () => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    const committed = commitPending(pendingEdits);
    if (committed) {
      setPendingEdits({});
      setAutoSaveStatus("saved");
      if (autoSaveStatusTimerRef.current) clearTimeout(autoSaveStatusTimerRef.current);
      autoSaveStatusTimerRef.current = setTimeout(() => setAutoSaveStatus("idle"), 1500);
    }
    window.alert(`Đã lưu chỉ số cho ${visibleRows.length} phòng.`);
  };

  const handleIssueInvoices = () => {
    if (gridRows.some((row) => row.hasHardError)) {
      window.alert("Không thể phát hành hóa đơn khi vẫn còn lỗi chỉ số hoặc thiếu kỳ trước.");
      return;
    }
    window.alert(`Giả lập phát hành hóa đơn cho ${gridRows.length} hợp đồng kỳ ${formatBillingMonth(selectedMonth)}.`);
  };

  const getRecentConsumptions = useCallback(
    (contract, startMonth, count = 3) => {
      const history = [];
      let cursor = startMonth;
      let steps = 0;
      while (cursor && steps < count) {
        const consumption = computeMeterConsumptionValue(contract, serviceUsage, cursor, "electricity", previousMonth);
        history.unshift({ month: cursor, value: consumption });
        cursor = previousMonth(cursor);
        steps += 1;
      }
      return history;
    },
    [serviceUsage, previousMonth]
  );

  const statsSummariesWithHistory = useMemo(() => {
    return statsSummaries.map((item) => {
      const summary = item.summary;
      if (!summary) return null;
      const history = getRecentConsumptions(item.contract, statsMonth, 3);
      return {
        contractId: item.contract.id,
        roomName: item.room?.name || "—",
        propertyName: item.property?.name || "—",
        status: item.contract.status,
        totalAmount: summary.total || 0,
        alerts: summary.alerts || [],
        history,
      };
    }).filter(Boolean);
  }, [statsSummaries, statsMonth, getRecentConsumptions]);

  const handleScrollToRow = useCallback((contractId) => {
    const element = document.getElementById(`meter-row-${contractId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const autoSaveLabel = {
    idle: "Đã đồng bộ",
    editing: "Đang nhập...",
    saving: "Đang lưu...",
    saved: "Đã lưu tạm",
  };

  const renderSparkline = (history) => {
    if (!history.length) return <span className="text-xs text-gray-400">Chưa có</span>;
    const width = 72;
    const height = 28;
    const max = Math.max(...history.map((h) => (h.value ?? 0) > 0 ? h.value : 0), 1);
    const points = history
      .map((point, idx) => {
        const x = history.length > 1 ? (idx / (history.length - 1)) * (width - 4) + 2 : width / 2;
        const val = point.value ?? 0;
        const y = height - ((val < 0 ? 0 : val) / max) * (height - 4) - 2;
        return `${x},${y}`;
      })
      .join(" ");
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="text-indigo-500">
        <polyline fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
      </svg>
    );
  };

  const FilterSelectors = () => (
    <div className="flex flex-wrap items-center gap-4">
      <div>
        <Label>Nhà trọ</Label>
        <select
          value={propertyFilter}
          onChange={(e) => setPropertyFilter(e.target.value)}
          className="mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          {propertyOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div>
        <Label>Tòa/Khu</Label>
        <select
          value={buildingFilter}
          onChange={(e) => setBuildingFilter(e.target.value)}
          className="mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          {buildingOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div>
        <Label>Trạng thái HĐ</Label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Dịch vụ & Chỉ số</h2>
          <p className="text-sm text-gray-600">
            {activeTabConfig.description}
            <span className="text-gray-500"> · Kỳ {formatBillingMonth(activeTab === "summary" ? statsMonth : selectedMonth)}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            {months.length === 0 && (
              <option value={selectedMonth}>{formatBillingMonth(selectedMonth)}</option>
            )}
            {months.map((month) => (
              <option key={month} value={month}>
                {formatBillingMonth(month)}
              </option>
            ))}
          </select>
          <Button variant="outline" onClick={handleCreateNextMonth}>
            Tạo kỳ tiếp theo
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 bg-white border border-indigo-100 rounded-md p-1 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition ${
              activeTab === tab.id ? "bg-indigo-500 text-white shadow" : "text-gray-600 hover:bg-indigo-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "meters" && (
        <>
          <Card className="p-0 border border-indigo-100 shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b p-4 flex flex-wrap items-center justify-between gap-3">
              <FilterSelectors />
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" onClick={handlePasteFromExcel} className="flex items-center gap-2">
                  <ClipboardPaste className="h-4 w-4" /> Paste từ Excel
                </Button>
                <Button variant="outline" onClick={handleImportCsvClick} className="flex items-center gap-2">
                  <FileDown className="h-4 w-4" /> Import CSV
                </Button>
                <Button variant="outline" onClick={handleSaveMeters} className="flex items-center gap-2">
                  <Save className="h-4 w-4" /> Lưu chỉ số
                </Button>
                <Button
                  variant={gridRows.some((row) => row.hasHardError) ? "outline" : "green"}
                  onClick={handleIssueInvoices}
                  disabled={gridRows.some((row) => row.hasHardError)}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" /> Phát hành hóa đơn
                </Button>
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
            <div className="overflow-auto max-h-[60vh]">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="sticky top-0 z-10 bg-white shadow text-xs uppercase text-gray-500">
                  <tr>
                    <th rowSpan={2} className="px-3 py-3 text-left align-middle">Tên phòng</th>
                    <th colSpan={2} className="px-3 py-3 text-center align-middle">Điện (kWh)</th>
                    <th colSpan={2} className="px-3 py-3 text-center align-middle">Nước (m³)</th>
                    <th rowSpan={2} className="px-3 py-3 text-left align-middle">Sử dụng &amp; Thành tiền</th>
                    <th rowSpan={2} className="px-3 py-3 text-left align-middle">Ghi chú</th>
                    <th rowSpan={2} className="px-3 py-3 text-left align-middle">Cảnh báo</th>
                  </tr>
                  <tr>
                    <th className="px-3 py-2 text-center align-middle font-medium text-gray-500">Chỉ số cũ</th>
                    <th className="px-3 py-2 text-center align-middle font-medium text-gray-500">Chỉ số mới</th>
                    <th className="px-3 py-2 text-center align-middle font-medium text-gray-500">Chỉ số cũ</th>
                    <th className="px-3 py-2 text-center align-middle font-medium text-gray-500">Chỉ số mới</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {visibleRows.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-3 py-6 text-center text-sm text-gray-500">
                        Không có phòng nào trùng với bộ lọc hiện tại.
                      </td>
                    </tr>
                  )}
                  {visibleRows.map((row, rowIndex) => {
                    const rowHighlight = row.hasHardError ? "bg-red-50" : row.alerts.length ? "bg-amber-50/70" : "bg-white";
                    return (
                      <tr key={row.contractId} id={`meter-row-${row.contractId}`} className={`${rowHighlight} hover:bg-indigo-50 transition`}>
                        <td className="px-3 py-3 align-top whitespace-nowrap">
                          <div className="font-semibold text-gray-800">{row.roomName}</div>
                          <div className="text-xs text-gray-500">{row.propertyName}</div>
                          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                            <Badge color={row.statusInfo.color}>{row.statusInfo.label}</Badge>
                            <span title={row.occupantTooltip}>{row.occupants} người</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 align-top">
                          <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-right text-sm text-gray-700">
                            {row.electricPrev != null ? row.electricPrev : "—"}
                          </div>
                        </td>
                        <td className="px-3 py-3 align-top">
                          <Input
                            type="number"
                            value={row.electricDisplay === null ? "" : row.electricDisplay}
                            onChange={handleNumberChange(row.contractId, "electricCurrent")}
                            onPaste={(event) => handlePasteOnCell("electricCurrent", rowIndex, event)}
                            onKeyDown={handleKeyDown(row.contractId, rowIndex, "electricCurrent")}
                            className="text-right"
                          />
                        </td>
                        <td className="px-3 py-3 align-top">
                          <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-right text-sm text-gray-700">
                            {row.waterPrev != null ? row.waterPrev : "—"}
                          </div>
                        </td>
                        <td className="px-3 py-3 align-top">
                          <Input
                            type="number"
                            value={row.waterDisplay === null ? "" : row.waterDisplay}
                            onChange={handleNumberChange(row.contractId, "waterCurrent")}
                            onPaste={(event) => handlePasteOnCell("waterCurrent", rowIndex, event)}
                            onKeyDown={handleKeyDown(row.contractId, rowIndex, "waterCurrent")}
                            className="text-right"
                          />
                        </td>
                        <td className="px-3 py-3 align-top">
                          <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-indigo-500" />
                                <div>
                                  <p className="text-xs uppercase text-gray-500">Điện</p>
                                  <p className={`text-sm font-semibold ${
                                    row.electricConsumption != null && row.electricConsumption < 0 ? "text-red-600" : "text-gray-800"
                                  }`}>
                                    {row.electricConsumption != null ? `${row.electricConsumption} kWh` : "—"}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500">{currency(row.electricAmount)}</p>
                                <p className={`text-xs ${row.electricDeltaClass}`}>{row.electricDeltaLabel}</p>
                              </div>
                            </div>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <Droplet className="h-4 w-4 text-sky-500" />
                                <div>
                                  <p className="text-xs uppercase text-gray-500">Nước</p>
                                  <p className={`text-sm font-semibold ${
                                    row.waterConsumption != null && row.waterConsumption < 0 ? "text-red-600" : "text-gray-800"
                                  }`}>
                                    {row.waterConsumption != null ? `${row.waterConsumption} m³` : "—"}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500">{currency(row.waterAmount)}</p>
                                <p className={`text-xs ${row.waterDeltaClass}`}>{row.waterDeltaLabel}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs uppercase text-gray-500">Tổng cộng</p>
                              <p className="text-lg font-semibold text-amber-600">{currency(row.totalAmount)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 align-top">
                          <input
                            type="text"
                            value={row.noteDisplay}
                            onChange={handleNoteChange(row.contractId)}
                            onKeyDown={handleKeyDown(row.contractId, rowIndex, "note")}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="Ghi chú nhanh"
                          />
                        </td>
                        <td className="px-3 py-3 align-top">
                          {row.alerts.length === 0 ? (
                            <span className="text-xs text-gray-400">—</span>
                          ) : (
                            <div className="flex items-center gap-1 text-amber-600" title={row.alerts.join("\n")}>
                              <AlertTriangle className="h-4 w-4" />
                              <span className="text-xs font-medium">{row.alerts.length} cảnh báo</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="sticky bottom-0 bg-white border-t px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-sm">
              <div className="flex flex-wrap items-center gap-4 text-gray-700">
                <span>
                  Điện: <strong className="text-indigo-600">{currency(visibleTotals.electricity || 0)}</strong>
                </span>
                <span>
                  Nước: <strong className="text-indigo-600">{currency(visibleTotals.water || 0)}</strong>
                </span>
                <span>
                  Tổng: <strong className="text-indigo-600">{currency(visibleTotals.totalAmount)}</strong>
                </span>
                <span>{visibleRows.length} phòng</span>
                <span>{visibleIssueCount} cảnh báo</span>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                    checked={onlyIssues}
                    onChange={(e) => setOnlyIssues(e.target.checked)}
                  />
                  Chỉ hiển thị lỗi
                </label>
                <span
                  className={`text-xs ${
                    autoSaveStatus === "saving"
                      ? "text-amber-600"
                      : autoSaveStatus === "saved"
                        ? "text-green-600"
                        : autoSaveStatus === "editing"
                          ? "text-sky-600"
                          : "text-gray-500"
                  }`}
                >
                  {autoSaveLabel[autoSaveStatus]}
                </span>
              </div>
            </div>
          </Card>
        </>
      )}

      {activeTab === "services" && (
        <>
          <Card className="p-0 border border-indigo-100 shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b p-4 flex flex-wrap items-center justify-between gap-3">
              <FilterSelectors />
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" onClick={handleSaveMeters} className="flex items-center gap-2">
                  <Save className="h-4 w-4" /> Lưu điều chỉnh
                </Button>
                <Button
                  variant={gridRows.some((row) => row.hasHardError) ? "outline" : "green"}
                  onClick={handleIssueInvoices}
                  disabled={gridRows.some((row) => row.hasHardError)}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" /> Phát hành hóa đơn
                </Button>
              </div>
            </div>
            <div className="overflow-auto max-h-[60vh]">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="sticky top-0 z-10 bg-white shadow text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-3 py-2 align-middle text-left">Phòng</th>
                    <th className="px-3 py-2 align-middle text-center">Thiết bị Wifi</th>
                    <th className="px-3 py-2 align-middle text-right">Tiền Wifi</th>
                    <th className="px-3 py-2 align-middle text-center">Rác</th>
                    <th className="px-3 py-2 align-middle text-right">Tiền Rác</th>
                    <th className="px-3 py-2 align-middle text-right">An ninh</th>
                    <th className="px-3 py-2 align-middle text-right">Phát sinh ±</th>
                    <th className="px-3 py-2 align-middle">Ghi chú</th>
                    <th className="px-3 py-2 align-middle text-right">Thành tiền</th>
                    <th className="px-3 py-2 align-middle">Cảnh báo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {visibleRows.length === 0 && (
                    <tr>
                      <td colSpan={10} className="px-3 py-6 text-center text-sm text-gray-500">
                        Không có phòng nào trùng với bộ lọc hiện tại.
                      </td>
                    </tr>
                  )}
                  {visibleRows.map((row, rowIndex) => {
                    const rowHighlight = row.hasHardError ? "bg-red-50" : row.alerts.length ? "bg-amber-50/70" : "bg-white";
                    return (
                      <tr key={`service-${row.contractId}`} className={`${rowHighlight} hover:bg-indigo-50 transition`}>
                        <td className="px-3 py-2 align-top whitespace-nowrap">
                          <div className="font-semibold text-gray-800">{row.roomName}</div>
                          <div className="text-xs text-gray-500">{row.propertyName}</div>
                          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                            <Badge color={row.statusInfo.color}>{row.statusInfo.label}</Badge>
                            <span title={row.occupantTooltip}>{row.occupants} người</span>
                          </div>
                        </td>
                        <td className="px-3 py-2 align-top text-center">
                          <Input
                            type="number"
                            min={0}
                            value={row.wifiDevices}
                            onChange={handleNumberChange(row.contractId, "wifiDevices")}
                            onKeyDown={handleKeyDown(row.contractId, rowIndex, "wifiDevices")}
                            className="text-right"
                          />
                        </td>
                        <td className="px-3 py-2 align-top text-right text-gray-800 font-medium">
                          {currency(row.wifiAmount)}
                        </td>
                        <td className="px-3 py-2 align-top text-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                            checked={row.trashIncluded}
                            onChange={handleCheckboxChange(row.contractId)}
                          />
                        </td>
                        <td className="px-3 py-2 align-top text-right text-gray-800 font-medium">
                          {currency(row.trashAmount)}
                        </td>
                        <td className="px-3 py-2 align-top text-right text-gray-800 font-medium">
                          {currency(row.securityAmount)}
                        </td>
                        <td className="px-3 py-2 align-top">
                          <Input
                            type="number"
                            value={row.otherAmountDisplay}
                            step="10000"
                            onChange={handleNumberChange(row.contractId, "otherAmount")}
                            onKeyDown={handleKeyDown(row.contractId, rowIndex, "otherAmount")}
                            className="text-right"
                          />
                        </td>
                        <td className="px-3 py-2 align-top">
                          <input
                            type="text"
                            value={row.noteDisplay}
                            onChange={handleNoteChange(row.contractId)}
                            onKeyDown={handleKeyDown(row.contractId, rowIndex, "note")}
                            className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="Ghi chú dịch vụ"
                          />
                        </td>
                        <td className="px-3 py-2 align-top text-right font-semibold text-gray-800">
                          {currency(row.totalAmount)}
                        </td>
                        <td className="px-3 py-2 align-top">
                          {row.alerts.length === 0 ? (
                            <span className="text-xs text-gray-400">—</span>
                          ) : (
                            <div className="flex items-center gap-1 text-amber-600" title={row.alerts.join("\n")}>
                              <AlertTriangle className="h-4 w-4" />
                              <span className="text-xs font-medium">{row.alerts.length} cảnh báo</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="sticky bottom-0 bg-white border-t px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-sm">
              <div className="flex flex-wrap items-center gap-4 text-gray-700">
                <span>
                  Wifi: <strong className="text-indigo-600">{currency(visibleTotals.wifi || 0)}</strong>
                </span>
                <span>
                  Rác: <strong className="text-indigo-600">{currency(visibleTotals.trash || 0)}</strong>
                </span>
                <span>
                  An ninh: <strong className="text-indigo-600">{currency(visibleTotals.security || 0)}</strong>
                </span>
                <span>
                  Khác: <strong className="text-indigo-600">{currency(visibleTotals.other || 0)}</strong>
                </span>
                <span>
                  Tổng: <strong className="text-indigo-600">{currency(visibleTotals.totalAmount)}</strong>
                </span>
                <span>{visibleRows.length} phòng</span>
                <span>{visibleIssueCount} cảnh báo</span>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                    checked={onlyIssues}
                    onChange={(e) => setOnlyIssues(e.target.checked)}
                  />
                  Chỉ hiển thị lỗi
                </label>
                <span
                  className={`text-xs ${
                    autoSaveStatus === "saving"
                      ? "text-amber-600"
                      : autoSaveStatus === "saved"
                        ? "text-green-600"
                        : autoSaveStatus === "editing"
                          ? "text-sky-600"
                          : "text-gray-500"
                  }`}
                >
                  {autoSaveLabel[autoSaveStatus]}
                </span>
              </div>
            </div>
          </Card>
        </>
      )}

      {activeTab === "summary" && (
        <>
          <Card className="p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Tổng hợp chi phí dịch vụ</h3>
                <p className="text-sm text-gray-600">
                  Kỳ {formatBillingMonth(selectedMonth)} · {totals.contracts} hợp đồng đang theo dõi.
                </p>
              </div>
            </div>
            {serviceSummariesAll.length === 0 ? (
              <p className="text-sm text-gray-500">Chưa có hợp đồng cần quản lý dịch vụ.</p>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 text-sm text-gray-600">
                <div>
                  <p className="text-xs uppercase text-gray-500">Điện</p>
                  <p className="text-lg font-semibold text-gray-800">{currency(totals.electricityAmount)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Nước</p>
                  <p className="text-lg font-semibold text-gray-800">{currency(totals.waterAmount)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Wifi</p>
                  <p className="text-lg font-semibold text-gray-800">{currency(totals.wifiAmount)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Rác</p>
                  <p className="text-lg font-semibold text-gray-800">{currency(totals.trashAmount)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">An ninh</p>
                  <p className="text-lg font-semibold text-gray-800">{currency(totals.securityAmount)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Khác</p>
                  <p className="text-lg font-semibold text-gray-800">{currency(totals.otherAmount)}</p>
                </div>
                <div className="lg:col-span-6 border-t pt-3">
                  <p className="text-xs uppercase text-gray-500">Tổng cộng</p>
                  <p className="text-2xl font-semibold text-indigo-600">{currency(totals.totalAmount)}</p>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-indigo-500" /> Bảng tổng hợp dịch vụ
                </h3>
                <p className="text-sm text-gray-600">
                  {[
                    propertyFilter !== "all" ? propertyOptions.find((opt) => opt.value === propertyFilter)?.label : "Tất cả nhà trọ",
                    buildingFilter !== "all" ? `Tòa/Khu ${buildingFilter}` : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Label className="uppercase text-xs text-gray-500">Kỳ tổng hợp</Label>
                <select
                  value={statsMonthFilter}
                  onChange={(e) => setStatsMonthFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  {statsMonthOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="overflow-auto">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-3 py-2 text-left">Phòng</th>
                    <th className="px-3 py-2 text-right">Tổng dịch vụ</th>
                    <th className="px-3 py-2 text-center">Cảnh báo</th>
                    <th className="px-3 py-2 text-center">Xu hướng 3 kỳ</th>
                    <th className="px-3 py-2 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {statsSummariesWithHistory.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-6 text-center text-sm text-gray-500">
                        Chưa có dữ liệu tổng hợp.
                      </td>
                    </tr>
                  ) : (
                    statsSummariesWithHistory.map((item) => (
                      <tr key={`summary-${item.contractId}`} className="hover:bg-indigo-50 transition">
                        <td className="px-3 py-2">
                          <div className="font-medium text-gray-800">{item.roomName}</div>
                          <div className="text-xs text-gray-500">{item.propertyName}</div>
                        </td>
                        <td className="px-3 py-2 text-right font-semibold text-gray-800">{currency(item.totalAmount)}</td>
                        <td className="px-3 py-2 text-center">
                          {item.alerts.length ? (
                            <span className="inline-flex items-center gap-1 text-amber-600 text-xs" title={item.alerts.join("\n")}>
                              <AlertTriangle className="h-4 w-4" /> {item.alerts.length}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-center">{renderSparkline(item.history)}</td>
                        <td className="px-3 py-2 text-right">
                          <Button variant="outline" onClick={() => handleScrollToRow(item.contractId)}>
                            Xem dòng
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
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

// ===== Settings (action log) =====
function SettingsView() {
  const { logs, clearLogs } = useActionLog();
  const { serviceCatalog, addService, updateService, removeService } = useServices();
  const [newService, setNewService] = useState({ name: "", unitPrice: "", method: "per-room" });

  const methodOptions = [
    { value: "per-room", label: "Theo phòng", hint: "Thu một mức cố định cho mỗi phòng." },
    { value: "per-person", label: "Theo đầu người", hint: "Nhân với số người đang cư trú." },
    { value: "meter", label: "Theo chỉ số điện, nước", hint: "Nhân với sản lượng tiêu thụ từng kỳ." },
  ];

  const methodLabel = (value) => methodOptions.find((opt) => opt.value === value)?.label || value;

  const typeLabels = {
    "property:create": { label: "Nhà trọ - Thêm", badge: "green" },
    "property:update": { label: "Nhà trọ - Cập nhật", badge: "blue" },
    "property:delete": { label: "Nhà trọ - Xóa", badge: "red" },
    "room:create": { label: "Phòng - Thêm", badge: "green" },
    "room:update": { label: "Phòng - Cập nhật", badge: "blue" },
    "room:delete": { label: "Phòng - Xóa", badge: "red" },
    "tenant:create": { label: "Khách thuê - Thêm", badge: "green" },
    "tenant:view": { label: "Khách thuê - Xem hồ sơ", badge: "blue" },
    "contract:create": { label: "Hợp đồng - Tạo", badge: "green" },
    "contract:update": { label: "Hợp đồng - Cập nhật", badge: "blue" },
    "contract:terminate": { label: "Hợp đồng - Chấm dứt", badge: "yellow" },
    "contract:delete": { label: "Hợp đồng - Xóa", badge: "red" },
  };

  const formatTimestamp = (ts) =>
    new Date(ts).toLocaleString("vi-VN", {
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const handleAddService = () => {
    if (!newService.name.trim()) return;
    addService({
      name: newService.name,
      unitPrice: Number(newService.unitPrice) || 0,
      method: newService.method,
    });
    setNewService({ name: "", unitPrice: "", method: "per-room" });
  };

  const handleUpdateService = (id, patch) => {
    updateService(id, patch);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold">Cấu hình dịch vụ chung</h3>
            <p className="text-sm text-gray-600">Thiết lập danh mục dịch vụ để áp dụng thống nhất cho việc tính hóa đơn hàng tháng.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-3">Tên dịch vụ</th>
                <th className="px-4 py-3">Cách tính</th>
                <th className="px-4 py-3">Đơn giá</th>
                <th className="px-4 py-3">Ghi chú</th>
                <th className="px-4 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {serviceCatalog.map((service) => (
                <tr key={service.id} className="bg-white border-b">
                  <td className="px-4 py-3">
                    <Input
                      value={service.name}
                      onChange={(e) => handleUpdateService(service.id, { name: e.target.value })}
                      disabled={service.locked}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={service.method}
                      onChange={(e) => handleUpdateService(service.id, { method: e.target.value })}
                      disabled={service.locked && service.method === "meter"}
                    >
                      {methodOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">{methodOptions.find((opt) => opt.value === service.method)?.hint}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      type="number"
                      min="0"
                      step="1000"
                      value={service.unitPrice ?? 0}
                      onChange={(e) => handleUpdateService(service.id, { unitPrice: Number(e.target.value) || 0 })}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {service.locked ? "Dịch vụ mặc định, không thể xóa." : "Có thể xóa khi không còn sử dụng."}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="danger"
                      onClick={() => removeService(service.id)}
                      disabled={service.locked}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Xóa
                    </Button>
                  </td>
                </tr>
              ))}
              {serviceCatalog.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">Chưa có dịch vụ nào được cấu hình.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Thêm dịch vụ mới</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm text-gray-600">
            <div>
              <Label>Tên dịch vụ</Label>
              <Input value={newService.name} onChange={(e) => setNewService((prev) => ({ ...prev, name: e.target.value }))} />
            </div>
            <div>
              <Label>Đơn giá</Label>
              <Input
                type="number"
                min="0"
                step="1000"
                value={newService.unitPrice}
                onChange={(e) => setNewService((prev) => ({ ...prev, unitPrice: e.target.value }))}
              />
            </div>
            <div>
              <Label>Cách tính</Label>
              <select
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={newService.method}
                onChange={(e) => setNewService((prev) => ({ ...prev, method: e.target.value }))}
              >
                {methodOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddService} disabled={!newService.name.trim()}>
                <Plus className="h-4 w-4 mr-2" /> Thêm dịch vụ
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Nhật ký thao tác</h3>
            <p className="text-sm text-gray-600">Theo dõi toàn bộ hành động trên hệ thống và xóa nhật ký khi cần.</p>
          </div>
          <Button variant="outline" onClick={clearLogs} disabled={logs.length === 0}>
            Xóa nhật ký
          </Button>
        </div>

        <div className="border-t pt-4">
          {logs.length === 0 ? (
            <p className="text-sm text-gray-500">Chưa có thao tác nào được ghi nhận.</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {logs.map((log) => {
                const info = typeLabels[log.type] || { label: log.type, badge: "gray" };
                const metaEntries = Object.entries(log.meta || {});
                return (
                  <div key={log.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge color={info.badge}>{info.label}</Badge>
                          <span className="text-xs text-gray-500">{formatTimestamp(log.timestamp)}</span>
                        </div>
                        <p className="text-sm text-gray-800 font-medium">{log.message}</p>
                      </div>
                    </div>
                    {metaEntries.length > 0 && (
                      <ul className="mt-2 text-xs text-gray-600 space-y-1">
                        {metaEntries.map(([key, value]) => (
                          <li key={key}>
                            <span className="uppercase text-gray-400 mr-1">{key}:</span>
                            <span>{value}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// ===== Shell with Router =====
function Shell() {
  const location = useLocation();
  const today = new Date().toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const nav = [
    { path: "/dashboard", label: "Bảng điều khiển", icon: LayoutDashboard },
    { path: "/properties", label: "Nhà trọ & Phòng", icon: Building2 },
    { path: "/tenants", label: "Quản lý Khách thuê", icon: Users },
    { path: "/contracts", label: "Hợp đồng", icon: FileText },
    { path: "/services", label: "Dịch vụ & Chỉ số", icon: Zap },
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
        {/* Sidebar desktop */}
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

        {/* Sidebar mobile */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-200 md:hidden ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <h1 className="text-xl font-bold text-indigo-600">Trọ Tốt</h1>
            <button
              className="text-gray-500 focus:outline-none"
              aria-label="Đóng menu"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="mt-4 px-2">
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

        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="flex justify-between items-center p-4 bg-white border-b">
            <div className="flex items-center">
              <button
                className="text-gray-500 focus:outline-none md:hidden mr-2"
                aria-label="Mở menu"
                onClick={() => setMobileMenuOpen(true)}
              >
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
              <Route path="/rooms" element={<Navigate to="/properties" replace />} />
              <Route path="/tenants" element={<TenantsView />} />
              <Route path="/contracts" element={<ContractsView />} />
              <Route path="/services" element={<ServicesView />} />
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
    <ActionLogProvider>
      <ServiceProvider>
        <HashRouter>
          <Shell />
        </HashRouter>
      </ServiceProvider>
    </ActionLogProvider>
  );
}
