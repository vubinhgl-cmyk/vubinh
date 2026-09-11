import React from 'react';
import { BookOpen, Mic, Plus, Sparkles, School, Users, CheckCircle2, FileText, ArrowDownToLine, RefreshCw } from 'lucide-react';
import { MeetingCategory } from '../types';

interface HeaderProps {
  activeCategory: MeetingCategory | 'all';
  onSelectCategory: (cat: MeetingCategory | 'all') => void;
  onOpenAudioRecorder: () => void;
  onOpenNewMeeting: () => void;
  onResetSampleData: () => void;
  onExportAllData: () => void;
  schoolName: string;
  departmentName: string;
  onEditSchoolInfo: () => void;
  totalMeetings: number;
  completedMeetings: number;
  totalProofs: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  onOpenAudioRecorder,
  onOpenNewMeeting,
  onResetSampleData,
  onExportAllData,
  schoolName,
  departmentName,
  onEditSchoolInfo,
  totalMeetings,
  completedMeetings,
  totalProofs,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
      {/* Top Banner with School Identity */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-sm ring-4 ring-teal-50">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  SỔ SINH HOẠT TỔ CHUYÊN MÔN ĐIỆN TỬ
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" /> Thay thế sổ giấy 100%
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                  Năm học 2026 - 2027
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 mt-1 flex-wrap">
                <button
                  onClick={onEditSchoolInfo}
                  className="inline-flex items-center gap-1.5 font-medium hover:text-teal-700 transition-colors cursor-pointer group"
                  title="Nhấp để thay đổi tên trường và tổ chuyên môn"
                >
                  <School className="w-3.5 h-3.5 text-teal-600" />
                  <span className="group-hover:underline">{schoolName}</span>
                  <span className="text-slate-300">•</span>
                  <Users className="w-3.5 h-3.5 text-teal-600" />
                  <span className="group-hover:underline text-teal-800 font-semibold">{departmentName}</span>
                  <span className="text-[11px] text-slate-400 font-normal ml-0.5">(Đổi tổ)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={onOpenAudioRecorder}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer ring-2 ring-teal-600/20"
              id="btn-ai-audio-minutes"
            >
              <Mic className="w-4 h-4 text-emerald-200 animate-pulse" />
              <span>Ghi âm & AI Lập biên bản</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            </button>

            <button
              onClick={onOpenNewMeeting}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
              id="btn-new-meeting"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm buổi họp</span>
            </button>

            <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
              <button
                onClick={onExportAllData}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Sao lưu / Xuất toàn bộ sổ điện tử (JSON)"
              >
                <ArrowDownToLine className="w-4 h-4" />
              </button>
              <button
                onClick={onResetSampleData}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Khôi phục dữ liệu mẫu chuẩn"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <FileText className="w-4 h-4 text-teal-600" />
            <span>Tổng buổi họp: <strong className="text-slate-900">{totalMeetings}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Đã hoàn thành: <strong className="text-slate-900">{completedMeetings}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>AI Đã xử lý: <strong className="text-slate-900">{completedMeetings} biên bản</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Minh chứng lưu trữ: <strong className="text-slate-900">{totalProofs} tệp</strong></span>
          </div>
        </div>
      </div>

      {/* Navigation Categories Strip (Directly addressing prompt requirements) */}
      <div className="bg-slate-50/80 border-t border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap mr-1">
            Danh mục:
          </span>

          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200'
            }`}
          >
            📋 Tất cả ({totalMeetings})
          </button>

          <button
            onClick={() => onSelectCategory('monthly')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeCategory === 'monthly'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-teal-800 hover:bg-teal-50 border border-teal-200'
            }`}
          >
            <span>📌</span> Sinh hoạt tháng 9/2026
          </button>

          <button
            onClick={() => onSelectCategory('weekly')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeCategory === 'weekly'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-white text-blue-800 hover:bg-blue-50 border border-blue-200'
            }`}
          >
            <span>📌</span> Sinh hoạt tuần 1
          </button>

          <button
            onClick={() => onSelectCategory('thematic')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeCategory === 'thematic'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-white text-purple-800 hover:bg-purple-50 border border-purple-200'
            }`}
          >
            <span>📌</span> Sinh hoạt chuyên đề
          </button>
        </div>
      </div>
    </header>
  );
};
