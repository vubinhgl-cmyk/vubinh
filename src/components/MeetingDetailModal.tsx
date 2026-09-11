import React, { useState } from 'react';
import { Meeting, TeacherOpinion, ProofFile } from '../types';
import { 
  X, Calendar, Clock, MapPin, Users, FileText, MessageSquare, 
  CheckCircle2, Paperclip, Sparkles, Printer, Plus, Trash2, 
  Download, Loader2, ArrowRight, Lightbulb, AlertTriangle, 
  ThumbsUp, Check, ExternalLink, Image as ImageIcon, File, Save
} from 'lucide-react';

interface MeetingDetailModalProps {
  meeting: Meeting | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateMeeting: (updated: Meeting) => void;
  onPrint: (meeting: Meeting) => void;
}

export const MeetingDetailModal: React.FC<MeetingDetailModalProps> = ({
  meeting,
  isOpen,
  onClose,
  onUpdateMeeting,
  onPrint,
}) => {
  if (!isOpen || !meeting) return null;

  const [activeTab, setActiveTab] = useState<'info' | 'content' | 'opinions' | 'conclusion' | 'proofs' | 'minutes'>('info');

  // Local editable copy
  const [editedMeeting, setEditedMeeting] = useState<Meeting>(meeting);
  const [isSaved, setIsSaved] = useState(false);

  // New opinion form state
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newOpinionText, setNewOpinionText] = useState('');
  const [newOpinionType, setNewOpinionType] = useState<'consensus' | 'challenge' | 'proposal' | 'general'>('general');

  // New proof file form state
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<'image' | 'pdf' | 'doc' | 'audio' | 'link'>('pdf');
  const [newFileDesc, setNewFileDesc] = useState('');

  // AI Loading States
  const [isSummarizingOpinions, setIsSummarizingOpinions] = useState(false);
  const [isSuggestingTasks, setIsSuggestingTasks] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleSave = () => {
    onUpdateMeeting(editedMeeting);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // 1. AI Summarize opinions
  const handleAiSummarizeOpinions = async () => {
    setIsSummarizingOpinions(true);
    setAiError(null);
    try {
      const res = await fetch('/api/ai/summarize-opinions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetingTitle: editedMeeting.title,
          teacherOpinions: editedMeeting.teacherOpinions,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Không thể tóm tắt ý kiến.');
      }
      const updated = {
        ...editedMeeting,
        aiSummary: data.data,
      };
      setEditedMeeting(updated);
      onUpdateMeeting(updated);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Lỗi khi gọi AI tóm tắt ý kiến.');
    } finally {
      setIsSummarizingOpinions(false);
    }
  };

  // 2. AI Suggest next month's tasks
  const handleAiSuggestNextMonthTasks = async () => {
    setIsSuggestingTasks(true);
    setAiError(null);
    try {
      const res = await fetch('/api/ai/suggest-next-month-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentMeeting: editedMeeting,
          month: '10/2026',
          subject: editedMeeting.departmentName,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Không thể đề xuất nhiệm vụ tháng sau.');
      }
      const updated = {
        ...editedMeeting,
        aiSuggestedTasks: data.data,
      };
      setEditedMeeting(updated);
      onUpdateMeeting(updated);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Lỗi khi gọi AI đề xuất nhiệm vụ tháng sau.');
    } finally {
      setIsSuggestingTasks(false);
    }
  };

  // Add opinion
  const handleAddOpinion = () => {
    if (!newTeacherName.trim() || !newOpinionText.trim()) return;
    const newOp: TeacherOpinion = {
      id: 'op-' + Date.now(),
      teacherName: newTeacherName.trim(),
      subject: newSubject.trim() || undefined,
      opinion: newOpinionText.trim(),
      type: newOpinionType,
    };
    const updated = {
      ...editedMeeting,
      teacherOpinions: [...editedMeeting.teacherOpinions, newOp],
    };
    setEditedMeeting(updated);
    onUpdateMeeting(updated);
    setNewTeacherName('');
    setNewSubject('');
    setNewOpinionText('');
  };

  // Delete opinion
  const handleDeleteOpinion = (opId: string) => {
    const updated = {
      ...editedMeeting,
      teacherOpinions: editedMeeting.teacherOpinions.filter((o) => o.id !== opId),
    };
    setEditedMeeting(updated);
    onUpdateMeeting(updated);
  };

  // Add proof file
  const handleAddProofFile = () => {
    if (!newFileName.trim()) return;
    const newProof: ProofFile = {
      id: 'pf-' + Date.now(),
      name: newFileName.trim(),
      type: newFileType,
      size: '1.5 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      description: newFileDesc.trim() || 'Minh chứng lưu trữ điện tử',
    };
    const updated = {
      ...editedMeeting,
      proofFiles: [...editedMeeting.proofFiles, newProof],
    };
    setEditedMeeting(updated);
    onUpdateMeeting(updated);
    setNewFileName('');
    setNewFileDesc('');
  };

  // Delete proof file
  const handleDeleteProof = (pfId: string) => {
    const updated = {
      ...editedMeeting,
      proofFiles: editedMeeting.proofFiles.filter((p) => p.id !== pfId),
    };
    setEditedMeeting(updated);
    onUpdateMeeting(updated);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-teal-600 text-white">
              {editedMeeting.periodLabel || 'Sổ sinh hoạt'}
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight line-clamp-1">
                {editedMeeting.title}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {editedMeeting.schoolName} • {editedMeeting.departmentName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrint(editedMeeting)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
              title="Xem và In biên bản chuẩn thể thức Nghị định 30"
            >
              <Printer className="w-3.5 h-3.5 text-teal-300" />
              <span>In biên bản</span>
            </button>

            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Đã lưu</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu thay đổi</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-100 px-6 border-b border-slate-200 flex gap-1 overflow-x-auto text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 px-3.5 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'info'
                ? 'border-teal-600 text-teal-800 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Thời gian & Thành phần
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`py-3 px-3.5 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'content'
                ? 'border-teal-600 text-teal-800 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Nội dung sinh hoạt
          </button>
          <button
            onClick={() => setActiveTab('opinions')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'opinions'
                ? 'border-teal-600 text-teal-800 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>3. Ý kiến giáo viên</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-900">
              {editedMeeting.teacherOpinions?.length || 0}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('conclusion')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'conclusion'
                ? 'border-teal-600 text-teal-800 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>4. Kết luận & Nhiệm vụ</span>
            <Sparkles className="w-3 h-3 text-amber-500" />
          </button>
          <button
            onClick={() => setActiveTab('proofs')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'proofs'
                ? 'border-teal-600 text-teal-800 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>5. File minh chứng</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-100 text-sky-900">
              {editedMeeting.proofFiles?.length || 0}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('minutes')}
            className={`py-3 px-3.5 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'minutes'
                ? 'border-teal-600 text-teal-800 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            6. Toàn văn biên bản
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* TAB 1: THỜI GIAN & THÀNH PHẦN */}
          {activeTab === 'info' && (
            <div className="space-y-5">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  Thời gian & Địa điểm tổ chức
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-slate-500 font-medium">Ngày họp:</label>
                    <input
                      type="date"
                      value={editedMeeting.date}
                      onChange={(e) => setEditedMeeting({ ...editedMeeting, date: e.target.value })}
                      className="mt-1 w-full bg-white border border-slate-200 rounded-lg p-2 font-medium text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium">Giờ bắt đầu:</label>
                    <input
                      type="time"
                      value={editedMeeting.timeStart}
                      onChange={(e) => setEditedMeeting({ ...editedMeeting, timeStart: e.target.value })}
                      className="mt-1 w-full bg-white border border-slate-200 rounded-lg p-2 font-medium text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium">Giờ kết thúc:</label>
                    <input
                      type="time"
                      value={editedMeeting.timeEnd}
                      onChange={(e) => setEditedMeeting({ ...editedMeeting, timeEnd: e.target.value })}
                      className="mt-1 w-full bg-white border border-slate-200 rounded-lg p-2 font-medium text-slate-800"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="text-slate-500 font-medium">Địa điểm:</label>
                    <input
                      type="text"
                      value={editedMeeting.location}
                      onChange={(e) => setEditedMeeting({ ...editedMeeting, location: e.target.value })}
                      className="mt-1 w-full bg-white border border-slate-200 rounded-lg p-2 font-medium text-slate-800"
                      placeholder="Phòng Hội đồng Sư phạm..."
                    />
                  </div>
                </div>
              </div>

              {/* Thành phần tham dự */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-600" />
                  Thành phần tham dự
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-500 font-medium">Chủ trì (Tổ trưởng):</label>
                    <input
                      type="text"
                      value={editedMeeting.attendees.host}
                      onChange={(e) =>
                        setEditedMeeting({
                          ...editedMeeting,
                          attendees: { ...editedMeeting.attendees, host: e.target.value },
                        })
                      }
                      className="mt-1 w-full bg-white border border-slate-200 rounded-lg p-2 font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium">Thư ký ghi biên bản:</label>
                    <input
                      type="text"
                      value={editedMeeting.attendees.secretary}
                      onChange={(e) =>
                        setEditedMeeting({
                          ...editedMeeting,
                          attendees: { ...editedMeeting.attendees, secretary: e.target.value },
                        })
                      }
                      className="mt-1 w-full bg-white border border-slate-200 rounded-lg p-2 font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium">Quân số có mặt / Tổng số:</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number"
                        value={editedMeeting.attendees.presentCount}
                        onChange={(e) =>
                          setEditedMeeting({
                            ...editedMeeting,
                            attendees: { ...editedMeeting.attendees, presentCount: parseInt(e.target.value) || 0 },
                          })
                        }
                        className="w-20 bg-white border border-slate-200 rounded-lg p-2 font-medium text-slate-800 text-center"
                      />
                      <span className="text-slate-400">/</span>
                      <input
                        type="number"
                        value={editedMeeting.attendees.totalCount}
                        onChange={(e) =>
                          setEditedMeeting({
                            ...editedMeeting,
                            attendees: { ...editedMeeting.attendees, totalCount: parseInt(e.target.value) || 0 },
                          })
                        }
                        className="w-20 bg-white border border-slate-200 rounded-lg p-2 font-medium text-slate-800 text-center"
                      />
                      <span className="text-slate-500 text-xs">đồng chí</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium">Vắng mặt (Lý do):</label>
                    <input
                      type="text"
                      value={editedMeeting.attendees.absentNames}
                      onChange={(e) =>
                        setEditedMeeting({
                          ...editedMeeting,
                          attendees: { ...editedMeeting.attendees, absentNames: e.target.value },
                        })
                      }
                      className="mt-1 w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800"
                      placeholder="0 (Đủ thành phần) hoặc nêu lý do nghỉ"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-slate-500 font-medium">Danh sách thành viên trong tổ:</label>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {editedMeeting.attendees.members.map((mem, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-white text-slate-800 border border-slate-200 shadow-2xs"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                          {mem}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NỘI DUNG */}
          {activeTab === 'content' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-600" />
                  Nội dung triển khai cuộc họp
                </h3>
                <span className="text-xs text-slate-500">
                  Soạn thảo chi tiết các phần việc, thông báo, chuyên đề
                </span>
              </div>
              <textarea
                value={editedMeeting.content}
                onChange={(e) => setEditedMeeting({ ...editedMeeting, content: e.target.value })}
                rows={14}
                className="w-full bg-white border border-slate-200 rounded-xl p-4 text-xs sm:text-sm text-slate-800 font-mono leading-relaxed focus:ring-2 focus:ring-teal-500 focus:outline-hidden shadow-2xs"
                placeholder="Nhập nội dung các vấn đề triển khai trong buổi họp..."
              />
            </div>
          )}

          {/* TAB 3: Ý KIẾN GIÁO VIÊN & AI TÓM TẮT */}
          {activeTab === 'opinions' && (
            <div className="space-y-5">
              {/* Header with AI Summarize Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-amber-50/60 border border-amber-200/80 p-4 rounded-xl">
                <div>
                  <h3 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-600" />
                    Ý kiến đóng góp của giáo viên trong tổ
                  </h3>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Ghi nhận đầy đủ phát biểu, phản ánh thuận lợi, khó khăn và sáng kiến đề xuất
                  </p>
                </div>
                <button
                  onClick={handleAiSummarizeOpinions}
                  disabled={isSummarizingOpinions || editedMeeting.teacherOpinions.length === 0}
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-600 to-teal-600 hover:from-amber-700 hover:to-teal-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition-all cursor-pointer shrink-0"
                  id="btn-ai-summarize-opinions"
                >
                  {isSummarizingOpinions ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>AI đang tóm tắt...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-200" />
                      <span>AI Tóm tắt ý kiến giáo viên</span>
                    </>
                  )}
                </button>
              </div>

              {/* AI Summary Display Panel (if available) */}
              {editedMeeting.aiSummary && (
                <div className="bg-white border-2 border-amber-200 rounded-xl p-5 shadow-xs space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 pb-2 border-b border-amber-100">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      Bản Tóm tắt & Phân tích Ý kiến do AI thực hiện
                    </h4>
                  </div>

                  {/* Executive summary */}
                  <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-100 text-xs text-slate-800 leading-relaxed">
                    <strong className="text-amber-900 font-semibold">Tóm lược diễn biến: </strong>
                    {editedMeeting.aiSummary.executiveSummary}
                  </div>

                  {/* 3 Categories Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    {/* Consensus */}
                    <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-2">
                        <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Điểm đồng thuận cao</span>
                      </div>
                      <ul className="space-y-1.5 list-disc list-inside text-emerald-800 text-[11px] leading-relaxed">
                        {editedMeeting.aiSummary.consensusPoints?.map((pt, i) => (
                          <li key={i}>{pt}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Challenges */}
                    <div className="bg-rose-50/60 border border-rose-200 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 font-bold text-rose-900 mb-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Khó khăn / Vướng mắc</span>
                      </div>
                      <ul className="space-y-1.5 list-disc list-inside text-rose-800 text-[11px] leading-relaxed">
                        {editedMeeting.aiSummary.challengesRaised?.map((pt, i) => (
                          <li key={i}>{pt}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Suggestions */}
                    <div className="bg-sky-50/60 border border-sky-200 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 font-bold text-sky-900 mb-2">
                        <Lightbulb className="w-3.5 h-3.5 text-sky-600" />
                        <span>Sáng kiến & Đề xuất</span>
                      </div>
                      <ul className="space-y-1.5 list-disc list-inside text-sky-800 text-[11px] leading-relaxed">
                        {editedMeeting.aiSummary.innovativeSuggestions?.map((pt, i) => (
                          <li key={i}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Key takeaway */}
                  {editedMeeting.aiSummary.keyTakeawayForLeader && (
                    <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 text-xs text-teal-900">
                      <strong>Lời khuyên điều hành cho Tổ trưởng: </strong>
                      {editedMeeting.aiSummary.keyTakeawayForLeader}
                    </div>
                  )}
                </div>
              )}

              {/* List of opinions */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Danh sách ý kiến ({editedMeeting.teacherOpinions.length}):
                </h4>
                {editedMeeting.teacherOpinions.map((op) => (
                  <div
                    key={op.id}
                    className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-start justify-between gap-3 text-xs hover:border-slate-300 transition-colors shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 font-bold">{op.teacherName}</strong>
                        {op.subject && (
                          <span className="px-2 py-0.2 rounded-md bg-slate-100 text-slate-600 text-[11px]">
                            {op.subject}
                          </span>
                        )}
                        {op.type === 'proposal' && (
                          <span className="px-1.5 py-0.2 rounded-md bg-sky-50 text-sky-700 text-[10px] font-medium border border-sky-200">
                            Đề xuất
                          </span>
                        )}
                        {op.type === 'challenge' && (
                          <span className="px-1.5 py-0.2 rounded-md bg-rose-50 text-rose-700 text-[10px] font-medium border border-rose-200">
                            Khó khăn
                          </span>
                        )}
                        {op.type === 'consensus' && (
                          <span className="px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-medium border border-emerald-200">
                            Nhất trí
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 leading-relaxed">{op.opinion}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteOpinion(op.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                      title="Xóa ý kiến"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Form to add new opinion */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-teal-600" />
                  Thêm ý kiến phát biểu mới
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Họ và tên giáo viên (VD: Thầy Nguyễn Văn A)"
                    value={newTeacherName}
                    onChange={(e) => setNewTeacherName(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                  <input
                    type="text"
                    placeholder="Môn dạy / Khối (VD: Toán 10)"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                  <select
                    value={newOpinionType}
                    onChange={(e: any) => setNewOpinionType(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg p-2 text-slate-800"
                  >
                    <option value="general">Phát biểu chung</option>
                    <option value="proposal">Đề xuất / Sáng kiến</option>
                    <option value="challenge">Khó khăn / Vướng mắc</option>
                    <option value="consensus">Đồng thuận / Nhất trí</option>
                  </select>
                  <textarea
                    placeholder="Nội dung ý kiến phát biểu cụ thể..."
                    value={newOpinionText}
                    onChange={(e) => setNewOpinionText(e.target.value)}
                    rows={2}
                    className="sm:col-span-3 bg-white border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleAddOpinion}
                    disabled={!newTeacherName.trim() || !newOpinionText.trim()}
                    className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Thêm vào biên bản
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: KẾT LUẬN TỔ TRƯỞNG & ĐỀ XUẤT NHIỆM VỤ THÁNG SAU */}
          {activeTab === 'conclusion' && (
            <div className="space-y-5">
              {/* Leader conclusion */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Kết luận & Chỉ đạo của Tổ trưởng chuyên môn
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    (Phân công rõ việc, rõ người, rõ thời hạn)
                  </span>
                </div>
                <textarea
                  value={editedMeeting.conclusion}
                  onChange={(e) => setEditedMeeting({ ...editedMeeting, conclusion: e.target.value })}
                  rows={6}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-xs sm:text-sm text-slate-800 leading-relaxed focus:ring-2 focus:ring-teal-500 focus:outline-hidden shadow-2xs"
                  placeholder="Ghi nhận các kết luận, nghị quyết thông qua 100%, phân công nhiệm vụ cụ thể..."
                />
              </div>

              {/* AI Suggest Next Month Tasks Button */}
              <div className="bg-gradient-to-r from-teal-50 to-indigo-50 border border-teal-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-teal-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    AI Đề xuất nhiệm vụ trọng tâm tháng sau (Tháng 10/2026)
                  </h4>
                  <p className="text-xs text-teal-800 mt-0.5">
                    Tự động lập kế hoạch hành động 4 nhóm chuyên môn bám sát năm học 2026 - 2027
                  </p>
                </div>
                <button
                  onClick={handleAiSuggestNextMonthTasks}
                  disabled={isSuggestingTasks}
                  className="px-4 py-2 bg-gradient-to-r from-teal-700 to-indigo-700 hover:from-teal-800 hover:to-indigo-800 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition-all cursor-pointer shrink-0"
                  id="btn-ai-suggest-tasks"
                >
                  {isSuggestingTasks ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>AI đang xây dựng kế hoạch...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Đề xuất nhiệm vụ tháng sau</span>
                    </>
                  )}
                </button>
              </div>

              {/* AI Suggested Plan Card */}
              {editedMeeting.aiSuggestedTasks && (
                <div className="bg-white border-2 border-indigo-200 rounded-xl p-5 shadow-xs space-y-4 animate-in fade-in duration-200">
                  <div className="border-b border-indigo-100 pb-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase tracking-wide">
                      Kế hoạch đề xuất tháng {editedMeeting.aiSuggestedTasks.targetMonth}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">
                      Chủ điểm: {editedMeeting.aiSuggestedTasks.theme}
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-1.5 text-xs text-slate-700">
                      <strong className="text-indigo-900">Mục tiêu:</strong>
                      {editedMeeting.aiSuggestedTasks.objectives?.map((obj, idx) => (
                        <span key={idx} className="bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                          • {obj}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Task groups */}
                  <div className="space-y-3">
                    {editedMeeting.aiSuggestedTasks.taskGroups?.map((grp, gIdx) => (
                      <div key={gIdx} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs">
                        <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-indigo-600" />
                          {grp.category}
                        </h5>
                        <div className="space-y-2">
                          {grp.tasks?.map((tsk, tIdx) => (
                            <div key={tIdx} className="bg-white p-2.5 rounded-md border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <strong className="text-slate-900 font-semibold">{tsk.name}</strong>
                                <p className="text-slate-600 text-[11px] mt-0.5">{tsk.description}</p>
                              </div>
                              <div className="flex items-center gap-2 text-[11px] shrink-0 text-slate-500">
                                <span className="bg-teal-50 text-teal-800 px-2 py-0.5 rounded-md font-medium border border-teal-200">
                                  {tsk.assignee}
                                </span>
                                <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md font-medium border border-amber-200">
                                  Hạn: {tsk.deadline}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {editedMeeting.aiSuggestedTasks.recommendationsForPrincipal && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
                      <strong>Kiến nghị lên Ban Giám hiệu: </strong>
                      {editedMeeting.aiSuggestedTasks.recommendationsForPrincipal}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: FILE MINH CHỨNG */}
          {activeTab === 'proofs' && (
            <div className="space-y-5">
              <div className="bg-sky-50/60 border border-sky-200/80 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-sky-950 flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-sky-600" />
                    Hồ sơ & File minh chứng buổi sinh hoạt
                  </h3>
                  <p className="text-xs text-sky-800 mt-0.5">
                    Lưu trữ giáo án mẫu, bảng phân công, biên bản có chữ ký, hình ảnh buổi họp số hóa
                  </p>
                </div>
              </div>

              {/* Proof list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {editedMeeting.proofFiles.map((file) => (
                  <div
                    key={file.id}
                    className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-start justify-between gap-3 text-xs shadow-2xs hover:border-sky-300 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-100">
                        {file.type === 'image' ? (
                          <ImageIcon className="w-4 h-4" />
                        ) : (
                          <File className="w-4 h-4" />
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-900 line-clamp-1">{file.name}</p>
                        <p className="text-slate-500 text-[11px]">{file.description}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span>{file.size || '1.2 MB'}</span>
                          <span>•</span>
                          <span>{file.uploadDate}</span>
                          <span className="text-emerald-600 font-semibold">• Đã số hóa</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteProof(file.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                      title="Xóa tệp minh chứng"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Form add proof file */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-teal-600" />
                  Đính kèm tệp minh chứng mới
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Tên tệp (VD: Ke_hoach_bai_day_mau.pdf)"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                  <select
                    value={newFileType}
                    onChange={(e: any) => setNewFileType(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg p-2 text-slate-800"
                  >
                    <option value="pdf">Tệp PDF (.pdf)</option>
                    <option value="doc">Tài liệu Word / Excel</option>
                    <option value="image">Hình ảnh / Ảnh chụp chữ ký (.jpg, .png)</option>
                    <option value="audio">Ghi âm cuộc họp (.mp3, .webm)</option>
                    <option value="link">Liên kết Drive / Web</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Mô tả minh chứng (VD: Kế hoạch đã ký duyệt)"
                    value={newFileDesc}
                    onChange={(e) => setNewFileDesc(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleAddProofFile}
                    disabled={!newFileName.trim()}
                    className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Lưu minh chứng
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: TOÀN VĂN BIÊN BẢN (CHUẨN NGHỊ ĐỊNH 30) */}
          {activeTab === 'minutes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Toàn văn biên bản sinh hoạt tổ chuyên môn (Chuẩn thể thức NĐ 30/2020/NĐ-CP)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Được đồng bộ tự động từ các mục thông tin, sẵn sàng in ấn hoặc xuất văn bản
                  </p>
                </div>
                <button
                  onClick={() => onPrint(editedMeeting)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-teal-300" />
                  <span>Xem bản in A4</span>
                </button>
              </div>

              <textarea
                value={
                  editedMeeting.officialMinutesText ||
                  `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n-------------------------\n${editedMeeting.schoolName.toUpperCase()}\n${editedMeeting.departmentName.toUpperCase()}\n\nBIÊN BẢN SINH HOẠT TỔ CHUYÊN MÔN\n(${editedMeeting.periodLabel})\n\nI. THỜI GIAN, ĐỊA ĐIỂM:\n- Thời gian: Bắt đầu từ ${editedMeeting.timeStart} đến ${editedMeeting.timeEnd}, ngày ${editedMeeting.date}.\n- Địa điểm: ${editedMeeting.location}\n\nII. THÀNH PHẦN THAM DỰ:\n- Chủ trì: ${editedMeeting.attendees.host}\n- Thư ký: ${editedMeeting.attendees.secretary}\n- Tổng số: ${editedMeeting.attendees.presentCount}/${editedMeeting.attendees.totalCount} đồng chí có mặt. Vắng: ${editedMeeting.attendees.absentNames}\n\nIII. NỘI DUNG SINH HOẠT:\n${editedMeeting.content}\n\nIV. Ý KIẾN THẢO LUẬN CỦA GIÁO VIÊN:\n${editedMeeting.teacherOpinions.map((o) => `- ${o.teacherName}: ${o.opinion}`).join('\n')}\n\nV. KẾT LUẬN CỦA TỔ TRƯỞNG:\n${editedMeeting.conclusion}\n\nCuộc họp kết thúc hồi ${editedMeeting.timeEnd} cùng ngày. Biên bản được thông qua 100% các thành viên trong tổ.\n\n      THƯ KÝ CUỘC HỌP                                TỔ TRƯỞNG CHUYÊN MÔN\n      (Đã ký điện tử)                                   (Đã ký điện tử)\n    ${editedMeeting.attendees.secretary.replace(/Cô |Thầy /g, '')}                                    ${editedMeeting.attendees.host.replace(/Cô |Thầy |ThS. /g, '')}`
                }
                onChange={(e) =>
                  setEditedMeeting({ ...editedMeeting, officialMinutesText: e.target.value })
                }
                rows={16}
                className="w-full bg-white border border-slate-200 rounded-xl p-5 font-serif text-xs sm:text-sm text-slate-900 leading-relaxed focus:ring-2 focus:ring-teal-500 focus:outline-hidden shadow-2xs whitespace-pre-wrap"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
