import React, { useState } from 'react';
import { Meeting, MeetingCategory } from '../types';
import { X, Plus, Calendar, Clock, MapPin, Users, FileText, CheckCircle2 } from 'lucide-react';

interface NewMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMeeting: (meeting: Meeting) => void;
  schoolName: string;
  departmentName: string;
}

export const NewMeetingModal: React.FC<NewMeetingModalProps> = ({
  isOpen,
  onClose,
  onAddMeeting,
  schoolName,
  departmentName,
}) => {
  const [category, setCategory] = useState<MeetingCategory>('monthly');
  const [title, setTitle] = useState('Sinh hoạt định kỳ tháng 09/2026: Đổi mới PPDH và kiểm tra đánh giá');
  const [periodLabel, setPeriodLabel] = useState('Sinh hoạt tháng 9/2026');
  const [date, setDate] = useState('2026-09-11');
  const [timeStart, setTimeStart] = useState('14:00');
  const [timeEnd, setTimeEnd] = useState('16:30');
  const [location, setLocation] = useState('Phòng Hội đồng Sư phạm');
  const [host, setHost] = useState('Thầy ThS. Lê Hoàng Nam (Tổ trưởng)');
  const [secretary, setSecretary] = useState('Cô Trần Thị Mai Lan (Thư ký)');
  const [presentCount, setPresentCount] = useState(9);
  const [totalCount, setTotalCount] = useState(9);
  const [absentNames, setAbsentNames] = useState('0 (Đủ)');
  const [content, setContent] = useState(`1. Đánh giá công tác chuyên môn thời gian qua:
- Thực hiện nghiêm túc phân phối chương trình, hồ sơ giáo án đầy đủ.
- 100% giáo viên tham gia sinh hoạt chuyên môn đúng giờ.

2. Triển khai kế hoạch tuần/tháng tới:
- Tổ chức dự giờ, thao giảng theo kế hoạch năm học.
- Đẩy mạnh ứng dụng CNTT và phương pháp dạy học tích cực.`);
  const [conclusion, setConclusion] = useState(
    'Nhất trí 100% các nội dung triển khai. Toàn thể giáo viên nghiêm túc thực hiện theo phân công.'
  );

  if (!isOpen) return null;

  const handleCategoryChange = (newCat: MeetingCategory) => {
    setCategory(newCat);
    if (newCat === 'monthly') {
      setPeriodLabel('Sinh hoạt tháng 9/2026');
      setTitle('Sinh hoạt định kỳ tháng 09/2026: Đổi mới PPDH và kiểm tra đánh giá');
    } else if (newCat === 'weekly') {
      setPeriodLabel('Sinh hoạt tuần 1');
      setTitle('Sinh hoạt chuyên môn tuần 1: Duyệt giáo án và ổn định nền nếp chuyên môn');
    } else {
      setPeriodLabel('Sinh hoạt chuyên đề');
      setTitle('Sinh hoạt chuyên đề: Ứng dụng AI và phương pháp dạy học tích cực GDPT 2018');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newMeeting: Meeting = {
      id: 'meeting-' + Date.now(),
      title: title.trim(),
      category,
      periodLabel: periodLabel.trim(),
      academicYear: '2026-2027',
      date,
      timeStart,
      timeEnd,
      location,
      schoolName,
      departmentName,
      attendees: {
        host,
        secretary,
        presentCount: Number(presentCount) || 9,
        totalCount: Number(totalCount) || 9,
        absentNames,
        members: [
          host.replace(/\(.*\)/, '').trim(),
          secretary.replace(/\(.*\)/, '').trim(),
          'Vũ Đình Hưng',
          'Nguyễn Thành Long',
          'Phạm Quỳnh Chi',
          'Hoàng Quốc Việt',
          'Lê Thu Trang',
          'Đỗ Quang Huy',
          'Bùi Thị Hồng Hạnh'
        ],
      },
      content,
      teacherOpinions: [
        {
          id: 'op-init-1',
          teacherName: 'Thầy Nguyễn Thành Long',
          subject: 'Toán',
          opinion: 'Nhất trí với phương hướng kế hoạch của tổ đề ra.',
          type: 'consensus',
        },
      ],
      conclusion,
      proofFiles: [],
      status: 'completed',
    };

    onAddMeeting(newMeeting);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-teal-400" />
            <h3 className="text-base font-bold text-white">Thêm buổi sinh hoạt chuyên môn mới</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          {/* Category Selector */}
          <div>
            <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Chọn phân loại buổi họp:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleCategoryChange('monthly')}
                className={`py-2 px-3 rounded-lg font-bold border transition-all text-center cursor-pointer ${
                  category === 'monthly'
                    ? 'bg-teal-50 border-teal-600 text-teal-900 ring-2 ring-teal-500/20'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                📌 Sinh hoạt tháng 9/2026
              </button>
              <button
                type="button"
                onClick={() => handleCategoryChange('weekly')}
                className={`py-2 px-3 rounded-lg font-bold border transition-all text-center cursor-pointer ${
                  category === 'weekly'
                    ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                📌 Sinh hoạt tuần 1
              </button>
              <button
                type="button"
                onClick={() => handleCategoryChange('thematic')}
                className={`py-2 px-3 rounded-lg font-bold border transition-all text-center cursor-pointer ${
                  category === 'thematic'
                    ? 'bg-purple-50 border-purple-600 text-purple-900 ring-2 ring-purple-500/20'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                📌 Sinh hoạt chuyên đề
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Tiêu đề buổi họp:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-white border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>

          {/* Date, Time, Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-600 font-medium block mb-1">Ngày diễn ra:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-white border border-slate-200 rounded-lg p-2 font-medium text-slate-800"
              />
            </div>
            <div>
              <label className="text-slate-600 font-medium block mb-1">Giờ bắt đầu:</label>
              <input
                type="time"
                value={timeStart}
                onChange={(e) => setTimeStart(e.target.value)}
                required
                className="w-full bg-white border border-slate-200 rounded-lg p-2 font-medium text-slate-800"
              />
            </div>
            <div>
              <label className="text-slate-600 font-medium block mb-1">Giờ kết thúc:</label>
              <input
                type="time"
                value={timeEnd}
                onChange={(e) => setTimeEnd(e.target.value)}
                required
                className="w-full bg-white border border-slate-200 rounded-lg p-2 font-medium text-slate-800"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="text-slate-600 font-medium block mb-1">Địa điểm:</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full bg-white border border-slate-200 rounded-lg p-2 font-medium text-slate-800"
              />
            </div>
          </div>

          {/* Host & Secretary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-600 font-medium block mb-1">Chủ trì (Tổ trưởng):</label>
              <input
                type="text"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                required
                className="w-full bg-white border border-slate-200 rounded-lg p-2 font-medium text-slate-800"
              />
            </div>
            <div>
              <label className="text-slate-600 font-medium block mb-1">Thư ký:</label>
              <input
                type="text"
                value={secretary}
                onChange={(e) => setSecretary(e.target.value)}
                required
                className="w-full bg-white border border-slate-200 rounded-lg p-2 font-medium text-slate-800"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Nội dung triển khai:</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 leading-relaxed font-mono"
            />
          </div>

          {/* Conclusion */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Kết luận của Tổ trưởng:</label>
            <textarea
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
              rows={2}
              className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Tạo buổi sinh hoạt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
