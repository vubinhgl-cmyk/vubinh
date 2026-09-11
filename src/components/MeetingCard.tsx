import React from 'react';
import { Meeting } from '../types';
import { Calendar, Clock, MapPin, Users, MessageSquare, Paperclip, Printer, Sparkles, ChevronRight, CheckCircle2, UserCheck, Trash2 } from 'lucide-react';

interface MeetingCardProps {
  meeting: Meeting;
  onViewDetail: (meeting: Meeting) => void;
  onPrint: (meeting: Meeting) => void;
  onDelete: (id: string) => void;
  onQuickAiAction: (meeting: Meeting, actionType: 'summary' | 'tasks') => void;
}

export const MeetingCard: React.FC<MeetingCardProps> = ({
  meeting,
  onViewDetail,
  onPrint,
  onDelete,
  onQuickAiAction,
}) => {
  const getCategoryBadge = () => {
    switch (meeting.category) {
      case 'monthly':
        return {
          label: meeting.periodLabel || '📌 Sinh hoạt tháng 9/2026',
          bg: 'bg-teal-50 text-teal-800 border-teal-200',
          dot: 'bg-teal-600',
        };
      case 'weekly':
        return {
          label: meeting.periodLabel || '📌 Sinh hoạt tuần 1',
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          dot: 'bg-blue-600',
        };
      case 'thematic':
        return {
          label: meeting.periodLabel || '📌 Sinh hoạt chuyên đề',
          bg: 'bg-purple-50 text-purple-800 border-purple-200',
          dot: 'bg-purple-600',
        };
      default:
        return {
          label: '📌 Sinh hoạt chuyên môn',
          bg: 'bg-slate-50 text-slate-800 border-slate-200',
          dot: 'bg-slate-600',
        };
    }
  };

  const badge = getCategoryBadge();

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      {/* Top Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${badge.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
            {badge.label}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" /> Biên bản hoàn chỉnh
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Bạn có chắc muốn xóa buổi sinh hoạt này khỏi sổ?')) {
                  onDelete(meeting.id);
                }
              }}
              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
              title="Xóa buổi sinh hoạt"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onViewDetail(meeting)}
          className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-teal-700 transition-colors cursor-pointer line-clamp-2"
        >
          {meeting.title}
        </h3>

        {/* Time, Date, Location Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-4 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-700">Ngày: {meeting.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{meeting.timeStart} - {meeting.timeEnd}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:col-span-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{meeting.location}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:col-span-2 text-slate-700 font-medium">
            <Users className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="truncate">Chủ trì: {meeting.attendees.host}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">Quân số: {meeting.attendees.presentCount}/{meeting.attendees.totalCount}</span>
          </div>
        </div>

        {/* Excerpt Content */}
        <div className="mt-3.5 bg-slate-50 rounded-lg p-3 text-xs text-slate-700 line-clamp-3 leading-relaxed border border-slate-100">
          <strong className="text-slate-900 font-semibold">Nội dung chính: </strong>
          {meeting.content}
        </div>

        {/* Opinion & Proof Counter Badges */}
        <div className="flex items-center gap-2 mt-3 flex-wrap text-xs">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
            <MessageSquare className="w-3 h-3 text-amber-600" />
            <strong>{meeting.teacherOpinions?.length || 0}</strong> ý kiến giáo viên
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-sky-50 text-sky-800 border border-sky-200">
            <Paperclip className="w-3 h-3 text-sky-600" />
            <strong>{meeting.proofFiles?.length || 0}</strong> file minh chứng
          </span>

          {meeting.aiSummary && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-200">
              <Sparkles className="w-3 h-3 text-emerald-600" /> AI Tóm tắt sẵn
            </span>
          )}

          {meeting.aiSuggestedTasks && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 text-[11px] font-medium border border-indigo-200">
              <Sparkles className="w-3 h-3 text-indigo-600" /> Kế hoạch tháng sau
            </span>
          )}
        </div>
      </div>

      {/* Footer Action Strip */}
      <div className="bg-slate-50/70 border-t border-slate-100 px-5 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPrint(meeting)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 hover:text-slate-900 rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            title="In biên bản chuẩn thể thức Nghị định 30"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>In biên bản</span>
          </button>

          <button
            onClick={() => onQuickAiAction(meeting, 'summary')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors cursor-pointer"
            title="AI Tóm tắt ý kiến giáo viên"
          >
            <Sparkles className="w-3 h-3 text-teal-600" />
            <span>Tóm tắt</span>
          </button>
        </div>

        <button
          onClick={() => onViewDetail(meeting)}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-teal-700 hover:text-teal-900 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer group/btn"
        >
          <span>Chi tiết & Biên bản</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
