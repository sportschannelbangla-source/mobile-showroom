import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  return '₹' + amount.toLocaleString('en-IN');
}

export function calculateDiscount(mrp: number, price: number): number {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export function generateWhatsAppUrl(phone: string, message: string): string {
  // Clean phone number: remove spaces, dashes, plus sign if already has 91
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
}

export function generateProductWhatsAppMessage(
  storeName: string,
  productName: string,
  price: number,
  productUrl?: string
): string {
  let msg = `Hello ${storeName},\n\nI am interested in buying:\n*${productName}*\nPrice: ${formatINR(price)}`;
  if (productUrl) {
    msg += `\nLink: ${productUrl}`;
  }
  msg += `\n\nPlease confirm availability and your best offer. Thank you!`;
  return msg;
}

export function generateCustomerOrderWhatsAppMessage(
  storeName: string,
  orderNumber: string,
  customerName: string,
  totalAmount: number,
  deliveryMethod: string
): string {
  const method = deliveryMethod === 'store_pickup' ? 'Store Pickup' : 'Home Delivery';
  return `Hello ${customerName},\n\nThis is regarding your Order *${orderNumber}* (${formatINR(totalAmount)}) at ${storeName}.\nDelivery Method: ${method}.\n\nHow can we help you today?`;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export const CATEGORY_SPECS: Record<string, { label: string; key: string; placeholder: string; options?: string[] }[]> = {
  mobiles: [
    { label: 'RAM', key: 'ram', placeholder: 'e.g. 8GB / 12GB' },
    { label: 'Storage', key: 'storage', placeholder: 'e.g. 128GB / 256GB' },
    { label: 'Network', key: 'network', placeholder: 'e.g. 5G / 4G VoLTE' },
    { label: 'Processor', key: 'processor', placeholder: 'e.g. Snapdragon 8 Gen 3 / Dimensity 7200' },
    { label: 'Display', key: 'display', placeholder: 'e.g. 6.7" 120Hz AMOLED' },
    { label: 'Rear Camera', key: 'rear_camera', placeholder: 'e.g. 50MP + 12MP + 10MP' },
    { label: 'Front Camera', key: 'front_camera', placeholder: 'e.g. 32MP' },
    { label: 'Battery', key: 'battery', placeholder: 'e.g. 5000 mAh (67W Fast Charging)' },
    { label: 'Color', key: 'color', placeholder: 'e.g. Titanium Gray / Midnight Black' },
    { label: 'Operating System', key: 'os', placeholder: 'e.g. Android 14 / iOS 18' },
  ],
  tvs: [
    { label: 'Screen Size', key: 'screen_size', placeholder: 'e.g. 55 Inch / 43 Inch / 65 Inch' },
    { label: 'Display Type', key: 'display_type', placeholder: 'e.g. 4K Ultra HD QLED / OLED / LED' },
    { label: 'Resolution', key: 'resolution', placeholder: 'e.g. 3840 x 2160 Pixels (4K)' },
    { label: 'Refresh Rate', key: 'refresh_rate', placeholder: 'e.g. 60Hz / 120Hz' },
    { label: 'Smart TV OS', key: 'smart_os', placeholder: 'e.g. Google TV / Tizen OS / webOS' },
    { label: 'Audio Output', key: 'sound_output', placeholder: 'e.g. 30W Dolby Atmos' },
    { label: 'HDMI & USB Ports', key: 'ports', placeholder: 'e.g. 3 HDMI, 2 USB' },
  ],
  refrigerators: [
    { label: 'Capacity', key: 'capacity', placeholder: 'e.g. 253 Litres / 345 Litres' },
    { label: 'Type', key: 'door_type', placeholder: 'e.g. Double Door / Frost Free / Side by Side' },
    { label: 'Energy Star Rating', key: 'star_rating', placeholder: 'e.g. 3 Star / 4 Star / 5 Star' },
    { label: 'Compressor', key: 'compressor', placeholder: 'e.g. Digital Inverter Compressor (10 Yr Warranty)' },
    { label: 'Convertible Mode', key: 'convertible', placeholder: 'e.g. 5-in-1 Convertible' },
    { label: 'Color & Finish', key: 'finish', placeholder: 'e.g. Elegant Inox / Floral Blue' },
  ],
  'air-conditioners': [
    { label: 'Tonnage / Capacity', key: 'tonnage', placeholder: 'e.g. 1.5 Ton / 1 Ton / 2 Ton' },
    { label: 'AC Type', key: 'ac_type', placeholder: 'e.g. Split Inverter / Window Inverter' },
    { label: 'Energy Rating', key: 'star_rating', placeholder: 'e.g. 3 Star / 5 Star ISEER' },
    { label: 'Condenser Coil', key: 'condenser', placeholder: 'e.g. 100% Copper Coil' },
    { label: 'Cooling Capacity', key: 'cooling_capacity', placeholder: 'e.g. 5050 Watts' },
    { label: 'Special Features', key: 'features', placeholder: 'e.g. Dual Inverter, PM 2.5 Filter, 4-Way Swing' },
  ],
  'washing-machines': [
    { label: 'Capacity', key: 'capacity', placeholder: 'e.g. 7.0 kg / 8.0 kg' },
    { label: 'Function Type', key: 'function_type', placeholder: 'e.g. Fully Automatic Front Load / Top Load' },
    { label: 'Spin Speed', key: 'spin_speed', placeholder: 'e.g. 1200 RPM / 1400 RPM' },
    { label: 'Energy Rating', key: 'star_rating', placeholder: 'e.g. 5 Star Rating' },
    { label: 'Motor Type', key: 'motor', placeholder: 'e.g. Inverter Direct Drive (10 Yr Warranty)' },
    { label: 'Wash Programs', key: 'wash_programs', placeholder: 'e.g. 14 Wash Programs with Steam' },
  ],
  audio: [
    { label: 'Type', key: 'audio_type', placeholder: 'e.g. TWS Earbuds / Wireless Headphones / Soundbar' },
    { label: 'Driver Size', key: 'driver_size', placeholder: 'e.g. 11mm Bass Boost Drivers' },
    { label: 'Battery Playtime', key: 'battery_life', placeholder: 'e.g. Up to 40 Hours total playback' },
    { label: 'Active Noise Cancellation', key: 'anc', placeholder: 'e.g. Up to 49dB Smart ANC' },
    { label: 'Connectivity', key: 'connectivity', placeholder: 'e.g. Bluetooth 5.4, Fast Pair' },
    { label: 'Water Resistance', key: 'ip_rating', placeholder: 'e.g. IP55 Dust & Water Resistant' },
  ],
  laptops: [
    { label: 'Processor', key: 'processor', placeholder: 'e.g. Intel Core i5 13th Gen / Apple M3' },
    { label: 'RAM', key: 'ram', placeholder: 'e.g. 16GB DDR5' },
    { label: 'SSD Storage', key: 'storage', placeholder: 'e.g. 512GB NVMe M.2 SSD' },
    { label: 'Display', key: 'display', placeholder: 'e.g. 15.6" FHD 144Hz IPS Anti-glare' },
    { label: 'Graphics', key: 'graphics', placeholder: 'e.g. NVIDIA RTX 4050 6GB / Intel Iris Xe' },
    { label: 'Operating System', key: 'os', placeholder: 'e.g. Windows 11 Home + MS Office 2021' },
    { label: 'Weight', key: 'weight', placeholder: 'e.g. 1.65 kg' },
  ],
  'kitchen-appliances': [
    { label: 'Power Wattage', key: 'wattage', placeholder: 'e.g. 750 Watts / 1000 Watts' },
    { label: 'Capacity / Jars', key: 'capacity_jars', placeholder: 'e.g. 3 Stainless Steel Jars + 1 Juicer Jar' },
    { label: 'Speed Settings', key: 'speed_settings', placeholder: 'e.g. 3 Speeds with Pulse' },
    { label: 'Body Material', key: 'material', placeholder: 'e.g. Heavy Duty ABS Body' },
    { label: 'Motor Warranty', key: 'motor_warranty', placeholder: 'e.g. 5 Years Motor Warranty' },
  ],
  electricals: [
    { label: 'Rating / Load', key: 'load_rating', placeholder: 'e.g. 16 Amp / 6 Amp / 250V AC' },
    { label: 'Material', key: 'material', placeholder: 'e.g. Polycarbonate Fire Retardant' },
    { label: 'Certification', key: 'certification', placeholder: 'e.g. ISI Certified' },
    { label: 'Compatibility', key: 'compatibility', placeholder: 'e.g. Compatible with Standard Modular Plates' },
  ],
};
