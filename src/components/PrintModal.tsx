import React from 'react';
import { Meeting } from '../types';
import { Printer, Copy, Download, X, Check } from 'lucide-react';

interface PrintModalProps {
  meeting: Meeting | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintModal: React.FC<PrintModalProps> = ({ meeting, isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !meeting) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const text = document.getElementById('printable-document')?.innerText || '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadText = () => {
    const text = document.getElementById('printable-document')?.innerText || '';
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bien_ban_sinh_hoat_${meeting.category}_${meeting.date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[95vh]">
        {/* Actions Bar (Excluded from Print) */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between shrink-0 no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">
              Bản in Biên bản sinh hoạt chuẩn Nghị định 30/2020/NĐ-CP
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
            </button>

            <button
              onClick={handleDownloadText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải file</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
              id="btn-trigger-print"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In ra giấy (Ctrl+P)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Paper Area */}
        <div className="p-6 sm:p-10 overflow-y-auto flex-1 bg-slate-100 flex justify-center">
          <div
            id="printable-document"
            className="w-full max-w-[210mm] min-h-[297mm] bg-white p-8 sm:p-12 shadow-lg border border-slate-200 text-slate-900 font-serif leading-relaxed text-[13pt]"
          >
            {/* National Header */}
            <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-300">
              <div className="text-center font-normal">
                <p className="text-xs uppercase font-bold text-slate-700">SỞ GIÁO DỤC VÀ ĐÀO TẠO</p>
                <p className="text-xs uppercase font-bold text-slate-900 mt-0.5">{meeting.schoolName}</p>
                <p className="text-xs uppercase font-bold text-teal-900 mt-0.5">{meeting.departmentName}</p>
                <div className="w-24 h-0.5 bg-slate-800 mx-auto mt-1.5" />
              </div>

              <div className="text-center font-normal">
                <p className="text-xs uppercase font-bold text-slate-900">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                <p className="text-xs font-bold text-slate-900 underline mt-0.5">Độc lập - Tự do - Hạnh phúc</p>
                <p className="text-[11px] italic text-slate-600 mt-2">
                  Ngày {meeting.date.split('-')[2] || '11'} tháng {meeting.date.split('-')[1] || '09'} năm {meeting.date.split('-')[0] || '2026'}
                </p>
              </div>
            </div>

            {/* Title */}
            <div className="text-center my-6">
              <h1 className="text-base sm:text-lg uppercase font-bold text-slate-950 tracking-wide">
                BIÊN BẢN SINH HOẠT TỔ CHUYÊN MÔN
              </h1>
              <p className="text-xs font-semibold text-slate-700 mt-1 italic">
                ({meeting.periodLabel || 'Năm học 2026 - 2027'})
              </p>
              <p className="text-xs font-bold text-slate-800 mt-1">
                Về việc: {meeting.title}
              </p>
            </div>

            {/* Section I */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-900">
              <div>
                <p className="font-bold uppercase tracking-wider text-slate-950">I. THỜI GIAN, ĐỊA ĐIỂM:</p>
                <ul className="list-disc list-inside ml-2 mt-1 space-y-0.5">
                  <li>Thời gian: Từ {meeting.timeStart} đến {meeting.timeEnd}, ngày {meeting.date}.</li>
                  <li>Địa điểm: {meeting.location}.</li>
                </ul>
              </div>

              {/* Section II */}
              <div>
                <p className="font-bold uppercase tracking-wider text-slate-950">II. THÀNH PHẦN THAM DỰ:</p>
                <ul className="list-disc list-inside ml-2 mt-1 space-y-0.5">
                  <li>Chủ trì: {meeting.attendees.host}.</li>
                  <li>Thư ký: {meeting.attendees.secretary}.</li>
                  <li>
                    Tổng số thành viên: {meeting.attendees.presentCount}/{meeting.attendees.totalCount} đồng chí có mặt.
                  </li>
                  <li>Vắng mặt: {meeting.attendees.absentNames || '0 (Đủ thành phần)'}.</li>
                  <li>
                    Danh sách tham dự: {meeting.attendees.members.join(', ')}.
                  </li>
                </ul>
              </div>

              {/* Section III */}
              <div>
                <p className="font-bold uppercase tracking-wider text-slate-950">III. NỘI DUNG SINH HOẠT:</p>
                <div className="ml-2 mt-1 whitespace-pre-line leading-relaxed text-slate-800">
                  {meeting.content}
                </div>
              </div>

              {/* Section IV */}
              <div>
                <p className="font-bold uppercase tracking-wider text-slate-950">IV. Ý KIẾN THẢO LUẬN CỦA GIÁO VIÊN:</p>
                <div className="ml-2 mt-1 space-y-1.5">
                  {meeting.teacherOpinions.map((op, idx) => (
                    <div key={idx} className="leading-relaxed">
                      <span className="font-bold text-slate-900">- {op.teacherName}: </span>
                      <span className="text-slate-800">{op.opinion}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section V */}
              <div>
                <p className="font-bold uppercase tracking-wider text-slate-950">V. KẾT LUẬN VÀ PHÂN CÔNG NHIỆM VỤ CỦA TỔ TRƯỞNG:</p>
                <div className="ml-2 mt-1 whitespace-pre-line leading-relaxed text-slate-900 font-medium">
                  {meeting.conclusion}
                </div>
              </div>

              <div className="mt-4 pt-2">
                <p className="italic text-slate-700">
                  Cuộc họp kết thúc vào hồi {meeting.timeEnd} cùng ngày. Biên bản đã được thông qua 100% các thành viên nhất trí ký tên và nộp lưu trữ vào Sổ sinh hoạt chuyên môn điện tử của nhà trường.
                </p>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-8 mt-6 text-center text-xs sm:text-sm">
                <div>
                  <p className="font-bold uppercase text-slate-900">THƯ KÝ CUỘC HỌP</p>
                  <p className="text-[11px] italic text-slate-500 mt-0.5">(Ký và ghi rõ họ tên)</p>
                  <div className="h-16 flex items-center justify-center">
                    <span className="px-2 py-1 rounded-md text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-300 font-sans">
                      ✓ Đã xác thực Chữ ký số
                    </span>
                  </div>
                  <p className="font-bold text-slate-900">
                    {meeting.attendees.secretary.replace(/Cô |Thầy /g, '')}
                  </p>
                </div>

                <div>
                  <p className="font-bold uppercase text-slate-900">TỔ TRƯỞNG CHUYÊN MÔN</p>
                  <p className="text-[11px] italic text-slate-500 mt-0.5">(Ký và ghi rõ họ tên)</p>
                  <div className="h-16 flex items-center justify-center">
                    <span className="px-2 py-1 rounded-md text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-300 font-sans">
                      ✓ Đã xác thực Chữ ký số
                    </span>
                  </div>
                  <p className="font-bold text-slate-900">
                    {meeting.attendees.host.replace(/Cô |Thầy |ThS. /g, '')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
