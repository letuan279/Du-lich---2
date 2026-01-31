import { addDays, format } from 'date-fns';
import type { Trip, Day, Activity } from '@/types';

/**
 * Creates a sample Ha Long Bay 3 days 2 nights trip for 8 people
 * Starting from tomorrow for demo purposes
 * 
 * Prices researched Jan 2026:
 * - Limousine 11 seats HN-HL: 3,800,000 VND/chiều (thuê cả xe)
 * - Ambassador Cruise 2D1N: ~4,500,000 VND/người (bao gồm ăn uống)
 * - Vé Sửng Sốt + Titop: 250,000 VND/người
 * - Kayak Vung Viêng: 100,000 VND/người
 * - Vinpearl Resort: ~1,500,000 VND/phòng/đêm (cần 4 phòng)
 * - Buffet hải sản Ga Hải Sản: 420,000 VND/người
 */
export function createSampleHaLongTrip(): Trip {
  const startDate = addDays(new Date(), 1);
  const tripId = 'sample-halong-trip';
  
  const day1Activities: Omit<Activity, 'dayId'>[] = [
    {
      id: 'a1-1',
      title: 'Xuất phát từ Hà Nội',
      timeStart: '06:00',
      timeEnd: '06:30',
      locationText: 'Điểm đón khách - Hà Nội',
      category: 'transport',
      costEstimate: 0,
      notes: 'Xe đón tại khách sạn hoặc điểm hẹn',
      orderIndex: 0,
    },
    {
      id: 'a1-2',
      title: 'Di chuyển Hà Nội - Hạ Long',
      timeStart: '06:30',
      timeEnd: '10:00',
      locationText: 'Cao tốc Hà Nội - Hạ Long (153km)',
      category: 'transport',
      costEstimate: 3800000, // Thuê xe limousine 11 chỗ cả chiều
      notes: 'Xe limousine 11 chỗ VIP, có wifi, nước uống',
      orderIndex: 1,
    },
    {
      id: 'a1-3',
      title: 'Check-in du thuyền Ambassador',
      timeStart: '11:00',
      timeEnd: '11:30',
      locationText: 'Cảng tàu quốc tế Tuần Châu',
      category: 'other',
      costEstimate: 0,
      orderIndex: 2,
    },
    {
      id: 'a1-4',
      title: 'Ăn trưa trên du thuyền',
      timeStart: '12:00',
      timeEnd: '13:30',
      locationText: 'Du thuyền Ambassador',
      category: 'food',
      costEstimate: 0, // Đã bao gồm trong giá cruise
      notes: 'Buffet hải sản cao cấp (đã bao gồm trong giá cruise)',
      orderIndex: 3,
    },
    {
      id: 'a1-5',
      title: 'Tham quan hang Sửng Sốt',
      timeStart: '14:00',
      timeEnd: '15:30',
      locationText: 'Hang Sửng Sốt, Vịnh Hạ Long',
      category: 'tickets',
      costEstimate: 2000000, // 250,000 x 8 người
      notes: 'Hang động đẹp nhất Vịnh Hạ Long. Vé 250k/người',
      orderIndex: 4,
    },
    {
      id: 'a1-6',
      title: 'Chèo kayak khám phá',
      timeStart: '16:00',
      timeEnd: '17:30',
      locationText: 'Làng chài Vung Viêng',
      category: 'tickets',
      costEstimate: 800000, // 100,000 x 8 người
      notes: 'Chèo kayak 1 giờ quanh làng chài. 100k/người',
      orderIndex: 5,
    },
    {
      id: 'a1-7',
      title: 'Ăn tối & tiệc BBQ',
      timeStart: '19:00',
      timeEnd: '21:00',
      locationText: 'Du thuyền Ambassador',
      category: 'food',
      costEstimate: 0, // Đã bao gồm trong giá cruise
      notes: 'BBQ hải sản trên boong tàu (đã bao gồm)',
      orderIndex: 6,
    },
    {
      id: 'a1-8',
      title: 'Nghỉ đêm trên du thuyền',
      timeStart: '21:00',
      locationText: 'Du thuyền Ambassador - Vịnh Lan Hạ',
      category: 'stay',
      costEstimate: 36000000, // 4,500,000 x 8 người (2D1N cruise package)
      notes: '4 phòng Deluxe view biển, 2 người/phòng. Giá 4.5tr/người bao gồm ăn uống',
      orderIndex: 7,
    },
  ];

  const day2Activities: Omit<Activity, 'dayId'>[] = [
    {
      id: 'a2-1',
      title: 'Tập Tai Chi buổi sáng',
      timeStart: '06:00',
      timeEnd: '06:45',
      locationText: 'Boong tàu',
      category: 'other',
      costEstimate: 0,
      notes: 'Ngắm bình minh trên vịnh',
      orderIndex: 0,
    },
    {
      id: 'a2-2',
      title: 'Ăn sáng buffet',
      timeStart: '07:00',
      timeEnd: '08:00',
      locationText: 'Du thuyền Ambassador',
      category: 'food',
      costEstimate: 0, // Đã bao gồm
      notes: 'Buffet sáng cao cấp (đã bao gồm)',
      orderIndex: 1,
    },
    {
      id: 'a2-3',
      title: 'Tham quan đảo Titop',
      timeStart: '08:30',
      timeEnd: '10:30',
      locationText: 'Đảo Titop, Vịnh Hạ Long',
      category: 'tickets',
      costEstimate: 0, // Đã bao gồm trong vé tuyến VHL2
      notes: 'Leo 400 bậc thang lên đỉnh, view toàn cảnh vịnh (đã bao gồm trong vé)',
      orderIndex: 2,
    },
    {
      id: 'a2-4',
      title: 'Tắm biển đảo Titop',
      timeStart: '10:30',
      timeEnd: '11:30',
      locationText: 'Bãi biển Titop',
      category: 'other',
      costEstimate: 0,
      notes: 'Nước biển trong xanh, cát trắng mịn',
      orderIndex: 3,
    },
    {
      id: 'a2-5',
      title: 'Ăn trưa & trả phòng cruise',
      timeStart: '12:00',
      timeEnd: '13:00',
      locationText: 'Du thuyền Ambassador',
      category: 'food',
      costEstimate: 0,
      notes: 'Brunch trước khi rời tàu',
      orderIndex: 4,
    },
    {
      id: 'a2-6',
      title: 'Di chuyển về Tuần Châu',
      timeStart: '13:00',
      timeEnd: '14:00',
      locationText: 'Cảng Tuần Châu',
      category: 'transport',
      costEstimate: 0, // Tender boat của cruise
      notes: 'Thuyền đưa khách về cảng',
      orderIndex: 5,
    },
    {
      id: 'a2-7',
      title: 'Check-in Vinpearl Resort',
      timeStart: '14:30',
      timeEnd: '15:00',
      locationText: 'Vinpearl Resort & Spa Hạ Long',
      category: 'stay',
      costEstimate: 6000000, // 1,500,000 x 4 phòng
      notes: '4 phòng Deluxe Ocean View, ~1.5tr/phòng',
      orderIndex: 6,
    },
    {
      id: 'a2-8',
      title: 'Tự do khám phá Vinpearl',
      timeStart: '15:00',
      timeEnd: '18:00',
      locationText: 'Vinpearl Hạ Long',
      category: 'tickets',
      costEstimate: 0, // Miễn phí cho khách resort
      notes: 'Công viên nước, vườn thú, aquarium - miễn phí cho khách resort',
      orderIndex: 7,
    },
    {
      id: 'a2-9',
      title: 'Ăn tối buffet hải sản',
      timeStart: '19:00',
      timeEnd: '21:00',
      locationText: 'Nhà hàng Ga Hải Sản, Bãi Cháy',
      category: 'food',
      costEstimate: 3360000, // 420,000 x 8 người
      notes: 'Buffet 100+ món hải sản. Giá 420k/người',
      orderIndex: 8,
    },
  ];

  const day3Activities: Omit<Activity, 'dayId'>[] = [
    {
      id: 'a3-1',
      title: 'Ăn sáng tại khách sạn',
      timeStart: '07:00',
      timeEnd: '08:30',
      locationText: 'Vinpearl Resort',
      category: 'food',
      costEstimate: 0, // Bao gồm trong giá phòng
      notes: 'Buffet sáng tại resort (đã bao gồm)',
      orderIndex: 0,
    },
    {
      id: 'a3-2',
      title: 'Tắm biển & nghỉ ngơi',
      timeStart: '08:30',
      timeEnd: '10:00',
      locationText: 'Bãi biển Vinpearl',
      category: 'other',
      costEstimate: 0,
      notes: 'Tận hưởng bãi biển riêng của resort',
      orderIndex: 1,
    },
    {
      id: 'a3-3',
      title: 'Check-out khách sạn',
      timeStart: '10:00',
      timeEnd: '10:30',
      locationText: 'Vinpearl Resort',
      category: 'other',
      costEstimate: 0,
      orderIndex: 2,
    },
    {
      id: 'a3-4',
      title: 'Mua đặc sản & quà',
      timeStart: '10:30',
      timeEnd: '12:00',
      locationText: 'Chợ Hạ Long 1',
      category: 'other',
      costEstimate: 1600000, // ~200k/người cho quà
      notes: 'Mực khô, chả mực, bánh gai... ~200k/người',
      orderIndex: 3,
    },
    {
      id: 'a3-5',
      title: 'Ăn trưa trước khi về',
      timeStart: '12:00',
      timeEnd: '13:00',
      locationText: 'Nhà hàng Linh Đan, Bãi Cháy',
      category: 'food',
      costEstimate: 2400000, // ~300k/người x 8
      notes: 'Bún chả mực, bánh cuốn chả mực. ~300k/người',
      orderIndex: 4,
    },
    {
      id: 'a3-6',
      title: 'Di chuyển Hạ Long - Hà Nội',
      timeStart: '13:30',
      timeEnd: '17:00',
      locationText: 'Cao tốc Hạ Long - Hà Nội',
      category: 'transport',
      costEstimate: 3800000, // Thuê xe limousine 11 chỗ về
      notes: 'Xe limousine 11 chỗ VIP về Hà Nội',
      orderIndex: 5,
    },
    {
      id: 'a3-7',
      title: 'Về đến Hà Nội',
      timeStart: '17:00',
      locationText: 'Hà Nội',
      category: 'transport',
      costEstimate: 0,
      notes: 'Kết thúc chuyến đi, hẹn gặp lại!',
      orderIndex: 6,
    },
  ];

  const days: Day[] = [
    {
      id: 'day-1',
      tripId,
      date: format(startDate, 'yyyy-MM-dd'),
      orderIndex: 0,
      activities: day1Activities.map((a) => ({ ...a, dayId: 'day-1' })),
    },
    {
      id: 'day-2',
      tripId,
      date: format(addDays(startDate, 1), 'yyyy-MM-dd'),
      orderIndex: 1,
      activities: day2Activities.map((a) => ({ ...a, dayId: 'day-2' })),
    },
    {
      id: 'day-3',
      tripId,
      date: format(addDays(startDate, 2), 'yyyy-MM-dd'),
      orderIndex: 2,
      activities: day3Activities.map((a) => ({ ...a, dayId: 'day-3' })),
    },
  ];

  const now = new Date().toISOString();

  return {
    id: tripId,
    title: 'Du lịch Hạ Long 3N2Đ',
    startDate: format(startDate, 'yyyy-MM-dd'),
    endDate: format(addDays(startDate, 2), 'yyyy-MM-dd'),
    timezone: 'Asia/Ho_Chi_Minh',
    currency: 'VND',
    numberOfPeople: 8,
    days,
    costSettings: { splitMode: 'equal' },
    createdAt: now,
    updatedAt: now,
  };
}
