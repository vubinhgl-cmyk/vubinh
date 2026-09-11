import React, { useState, useEffect } from 'react';
import { Meeting, MeetingCategory } from './types';
import { INITIAL_MEETINGS } from './data/initialMeetings';
import { Header } from './components/Header';
import { MeetingCard } from './components/MeetingCard';
import { MeetingDetailModal } from './components/MeetingDetailModal';
import { AudioToMinutesModal } from './components/AudioToMinutesModal';
import { PrintModal } from './components/PrintModal';
import { NewMeetingModal } from './components/NewMeetingModal';
import { EditSchoolModal } from './components/EditSchoolModal';
import { 
  Search, Filter, Plus, Mic, Sparkles, BookOpen, 
  CheckCircle2, FileText, ArrowRight, ShieldCheck, 
  CalendarDays, Download, HelpCircle
} from 'lucide-react';

const STORAGE_KEY = 'so_sinh_hoat_to_chuyen_mon_v1';
const SCHOOL_STORAGE_KEY = 'school_info_v1';

export default function App() {
  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((m: Meeting) => ({
            ...m,
            schoolName:
              !m.schoolName ||
              m.schoolName.includes('Quang Trung') ||
              m.schoolName.includes('Kiêiu')
                ? 'Trường THCS Yết Kiêu'
                : m.schoolName,
          }));
        }
      }
    } catch (e) {
      console.error('Error reading localStorage:', e);
    }
    return INITIAL_MEETINGS;
  });

  const [schoolName, setSchoolName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(SCHOOL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed.schoolName &&
          !parsed.schoolName.includes('Quang Trung') &&
          !parsed.schoolName.includes('Kiêiu')
        ) {
          return parsed.schoolName;
        }
      }
    } catch {}
    return 'Trường THCS Yết Kiêu';
  });

  const [departmentName, setDepartmentName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(SCHOOL_STORAGE_KEY);
      if (saved) return JSON.parse(saved).departmentName;
    } catch {}
    return 'Tổ Toán - Tin học';
  });

  const [activeCategory, setActiveCategory] = useState<MeetingCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [printMeeting, setPrintMeeting] = useState<Meeting | null>(null);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isNewMeetingOpen, setIsNewMeetingOpen] = useState(false);
  const [isEditSchoolOpen, setIsEditSchoolOpen] = useState(false);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
    } catch (e) {
      console.error('Failed to save meetings:', e);
    }
  }, [meetings]);

  useEffect(() => {
    try {
      localStorage.setItem(
        SCHOOL_STORAGE_KEY,
        JSON.stringify({ schoolName, departmentName })
      );
    } catch (e) {
      console.error('Failed to save school info:', e);
    }
  }, [schoolName, departmentName]);

  // Handlers
  const handleUpdateMeeting = (updated: Meeting) => {
    setMeetings((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    if (selectedMeeting?.id === updated.id) {
      setSelectedMeeting(updated);
    }
  };

  const handleAddMeeting = (newM: Meeting) => {
    setMeetings((prev) => [newM, ...prev]);
    setSelectedMeeting(newM);
  };

  const handleDeleteMeeting = (id: string) => {
    setMeetings((prev) => prev.filter((m) => m.id !== id));
    if (selectedMeeting?.id === id) {
      setSelectedMeeting(null);
    }
  };

  const handleResetSampleData = () => {
    if (confirm('Khôi phục toàn bộ dữ liệu mẫu ban đầu của Sổ sinh hoạt chuyên môn?')) {
      setMeetings(INITIAL_MEETINGS);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleExportAllData = () => {
    const dataStr = JSON.stringify(meetings, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `So_Sinh_Hoat_To_Chuyen_Mon_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleQuickAiAction = (meeting: Meeting, actionType: 'summary' | 'tasks') => {
    setSelectedMeeting(meeting);
  };

  // Filter meetings
  const filteredMeetings = meetings.filter((m) => {
    const matchesCategory = activeCategory === 'all' || m.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      m.title.toLowerCase().includes(query) ||
      m.content.toLowerCase().includes(query) ||
      m.periodLabel.toLowerCase().includes(query) ||
      m.attendees.host.toLowerCase().includes(query) ||
      m.teacherOpinions.some((o) =>
        o.teacherName.toLowerCase().includes(query) || o.opinion.toLowerCase().includes(query)
      );

    return matchesCategory && matchesQuery;
  });

  const totalProofsCount = meetings.reduce((acc, m) => acc + (m.proofFiles?.length || 0), 0);
  const completedCount = meetings.filter((m) => m.status === 'completed').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* App Header */}
      <Header
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onOpenAudioRecorder={() => setIsAudioModalOpen(true)}
        onOpenNewMeeting={() => setIsNewMeetingOpen(true)}
        onResetSampleData={handleResetSampleData}
        onExportAllData={handleExportAllData}
        schoolName={schoolName}
        departmentName={departmentName}
        onEditSchoolInfo={() => setIsEditSchoolOpen(true)}
        totalMeetings={meetings.length}
        completedMeetings={completedCount}
        totalProofs={totalProofsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Banner Section: Pedagogical Digital Transformation */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-2xl p-5 sm:p-7 shadow-sm border border-slate-800 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-400/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Giải pháp chuyển đổi số giáo dục • Thay thế sổ ghi chép giấy</span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-tight">
              Sổ Sinh Hoạt Tổ Chuyên Môn Điện Tử
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Hệ thống quản lý biên bản sinh hoạt tổ chuyên môn số hóa toàn diện theo chuẩn Bộ Giáo dục & Đào tạo. 
              Tích hợp trí tuệ nhân tạo Gemini giúp tự động chuyển đổi ghi âm cuộc họp thành biên bản hoàn chỉnh, 
              tổng hợp nhanh ý kiến giáo viên và hoạch định nhiệm vụ trọng tâm cho tháng tiếp theo.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
              <div 
                onClick={() => setActiveCategory('monthly')}
                className="bg-white/10 hover:bg-white/15 backdrop-blur-xs p-3 rounded-xl border border-white/10 cursor-pointer transition-colors"
              >
                <span className="font-bold text-teal-300 block mb-0.5">📌 Sinh hoạt tháng 9/2026</span>
                <span className="text-slate-300 text-[11px]">Định kỳ triển khai nhiệm vụ trọng tâm năm học</span>
              </div>

              <div 
                onClick={() => setActiveCategory('weekly')}
                className="bg-white/10 hover:bg-white/15 backdrop-blur-xs p-3 rounded-xl border border-white/10 cursor-pointer transition-colors"
              >
                <span className="font-bold text-blue-300 block mb-0.5">📌 Sinh hoạt tuần 1</span>
                <span className="text-slate-300 text-[11px]">Kiểm tra kế hoạch bài dạy & nền nếp dạy học</span>
              </div>

              <div 
                onClick={() => setActiveCategory('thematic')}
                className="bg-white/10 hover:bg-white/15 backdrop-blur-xs p-3 rounded-xl border border-white/10 cursor-pointer transition-colors"
              >
                <span className="font-bold text-purple-300 block mb-0.5">📌 Sinh hoạt chuyên đề</span>
                <span className="text-slate-300 text-[11px]">Đổi mới PPDH, nghiên cứu bài học, ứng dụng AI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm buổi sinh hoạt, nội dung, ý kiến giáo viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">
              Hiển thị: <strong>{filteredMeetings.length}</strong> / {meetings.length} buổi họp
            </span>
            <button
              onClick={() => setIsAudioModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-lg border border-teal-200 transition-colors cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5 text-teal-600" />
              <span>Ghi âm AI</span>
            </button>
            <button
              onClick={() => setIsNewMeetingOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm buổi họp</span>
            </button>
          </div>
        </div>

        {/* Meeting Cards Grid */}
        {filteredMeetings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMeetings.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                onViewDetail={(m) => setSelectedMeeting(m)}
                onPrint={(m) => setPrintMeeting(m)}
                onDelete={handleDeleteMeeting}
                onQuickAiAction={handleQuickAiAction}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-2xs">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Không tìm thấy buổi sinh hoạt nào
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Không có kết quả phù hợp với danh mục hoặc từ khóa tìm kiếm của bạn.
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Xem tất cả
              </button>
              <button
                onClick={() => setIsNewMeetingOpen(true)}
                className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                + Thêm buổi họp mới
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="font-semibold text-slate-800">
              SỔ SINH HOẠT TỔ CHUYÊN MÔN ĐIỆN TỬ • NĂM HỌC 2026 - 2027
            </p>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Chuẩn hóa theo Điều lệ trường phổ thông và Nghị định số 30/2020/NĐ-CP về công tác văn thư
            </p>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Ký số điện tử
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Trợ lý AI Gemini
            </span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Meeting Detail & Comprehensive Editor Modal */}
      <MeetingDetailModal
        meeting={selectedMeeting}
        isOpen={Boolean(selectedMeeting)}
        onClose={() => setSelectedMeeting(null)}
        onUpdateMeeting={handleUpdateMeeting}
        onPrint={(m) => setPrintMeeting(m)}
      />

      {/* 2. AI Audio To Minutes Modal */}
      <AudioToMinutesModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
        onSaveMeeting={handleAddMeeting}
        defaultSchoolName={schoolName}
        defaultDepartmentName={departmentName}
      />

      {/* 3. Official Administrative Print Modal (Nghị định 30) */}
      <PrintModal
        meeting={printMeeting}
        isOpen={Boolean(printMeeting)}
        onClose={() => setPrintMeeting(null)}
      />

      {/* 4. New Meeting Modal */}
      <NewMeetingModal
        isOpen={isNewMeetingOpen}
        onClose={() => setIsNewMeetingOpen(false)}
        onAddMeeting={handleAddMeeting}
        schoolName={schoolName}
        departmentName={departmentName}
      />

      {/* 5. Edit School & Department Modal */}
      <EditSchoolModal
        isOpen={isEditSchoolOpen}
        onClose={() => setIsEditSchoolOpen(false)}
        currentSchool={schoolName}
        currentDepartment={departmentName}
        onSave={(s, d) => {
          setSchoolName(s);
          setDepartmentName(d);
          setMeetings((prev) =>
            prev.map((m) => ({
              ...m,
              schoolName: s,
              departmentName: d,
            }))
          );
        }}
      />
    </div>
  );
}
