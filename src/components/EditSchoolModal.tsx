import React, { useState } from 'react';
import { X, School, Users, Check } from 'lucide-react';

interface EditSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSchool: string;
  currentDepartment: string;
  onSave: (school: string, dept: string) => void;
}

export const EditSchoolModal: React.FC<EditSchoolModalProps> = ({
  isOpen,
  onClose,
  currentSchool,
  currentDepartment,
  onSave,
}) => {
  const [school, setSchool] = useState(currentSchool);
  const [dept, setDept] = useState(currentDepartment);

  if (!isOpen) return null;

  const popularDepts = [
    'Tổ Toán - Tin học',
    'Tổ Ngữ văn',
    'Tổ Khoa học Tự nhiên (Lý - Hóa - Sinh)',
    'Tổ Ngoại ngữ (Tiếng Anh)',
    'Tổ Lịch sử - Địa lý - GDCD',
    'Tổ Nghệ thuật - Thể dục',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!school.trim() || !dept.trim()) return;
    onSave(school.trim(), dept.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <School className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">Đổi đơn vị & Tổ chuyên môn</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-md cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Tên trường học:</label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              required
              className="w-full bg-white border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800"
              placeholder="VD: Trường THCS Yết Kiêu"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Tên tổ chuyên môn:</label>
            <input
              type="text"
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              required
              className="w-full bg-white border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800"
              placeholder="VD: Tổ Toán - Tin học"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-500 font-medium block mb-1.5">
              Hoặc chọn nhanh tổ bộ môn phổ biến:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {popularDepts.map((d, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setDept(d)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
                    dept === d
                      ? 'bg-teal-50 border-teal-600 text-teal-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors cursor-pointer"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
