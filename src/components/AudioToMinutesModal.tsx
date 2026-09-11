import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Upload, Sparkles, Loader2, FileAudio, Check, AlertCircle, RefreshCw, X, ArrowRight } from 'lucide-react';
import { Meeting } from '../types';

interface AudioToMinutesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveMeeting: (newMeeting: Meeting) => void;
  defaultSchoolName: string;
  defaultDepartmentName: string;
}

export const AudioToMinutesModal: React.FC<AudioToMinutesModalProps> = ({
  isOpen,
  onClose,
  onSaveMeeting,
  defaultSchoolName,
  defaultDepartmentName,
}) => {
  const [activeTab, setActiveTab] = useState<'record' | 'upload' | 'sample'>('record');
  
  // Microphone recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  // File upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  // Sample transcript text
  const [sampleTranscript, setSampleTranscript] = useState<string>(
    `[Ghi âm cuộc họp Tổ Toán - Tin học ngày 11/09/2026]
Thầy Lê Hoàng Nam (Tổ trưởng): "Chào tất cả các đồng chí trong tổ. Hôm nay chúng ta họp chuyên đề về ứng dụng trí tuệ nhân tạo và chuyển đổi số trong dạy học năm học 2026-2027. Quân số có mặt đủ 9/9 đồng chí, thư ký là cô Mai Lan. Về nội dung, tôi xin báo cáo các mô hình AI như Gemini trong hỗ trợ soạn kế hoạch bài dạy theo Công văn 5512 và tạo ngân hàng câu hỏi phân hóa 4 mức độ."
Thầy Nguyễn Thành Long: "Tôi thấy việc dùng prompt chuẩn để tạo ma trận đề thi và bài tập thực tiễn môn Toán cấp THCS năm học 2026-2027 rất nhanh, chỉ mất 30 phút thay vì nửa ngày như trước. Tuy nhiên cần kiểm duyệt đáp án cẩn thận."
Cô Bùi Thị Hồng Hạnh: "Tôi đề nghị tổ lập một kho prompt sư phạm dùng chung để các thầy cô cùng chia sẻ kinh nghiệm giảng dạy môn Toán và Tin học THCS."
Cô Phạm Quỳnh Chi: "Học sinh khối 6 và khối 9 năm nay rất hào hứng học tập nếu có hình ảnh mô phỏng trực quan sinh động từ AI."
Thầy Lê Hoàng Nam (Kết luận): "Tổ nhất trí xếp loại chuyên đề Xuất sắc. Toàn thể giáo viên đăng ký ít nhất 1 tiết thao giảng có ứng dụng AI trong tháng 10. Giao cô Mai Lan tổng hợp kỷ yếu chuyên đề báo cáo Ban Giám hiệu Trường THCS Yết Kiêu trước 18/9."`
  );

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processedResult, setProcessedResult] = useState<any | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset state
      stopRecordingCleanup();
      setProcessedResult(null);
      setError(null);
    }
  }, [isOpen]);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone access error:', err);
      setError('Không thể truy cập microphone. Vui lòng cấp quyền hoặc sử dụng tùy chọn Tải tệp / Dùng bản ghi mẫu.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const stopRecordingCleanup = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setUploadedFileName(file.name);
      setAudioUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const convertBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Strip data:audio/xxx;base64,
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleProcessAi = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      let payload: any = {
        meetingContext: `Trường: ${defaultSchoolName}, Tổ chuyên môn: ${defaultDepartmentName}, Thời điểm: Tháng 09/2026`,
      };

      if (activeTab === 'record' && audioBlob) {
        const base64 = await convertBlobToBase64(audioBlob);
        payload.audioBase64 = base64;
        payload.mimeType = audioBlob.type || 'audio/webm';
      } else if (activeTab === 'upload' && uploadedFile) {
        const base64 = await convertBlobToBase64(uploadedFile);
        payload.audioBase64 = base64;
        payload.mimeType = uploadedFile.type || 'audio/mp3';
      } else {
        // Sample or raw text transcript
        payload.rawTranscript = sampleTranscript;
      }

      const res = await fetch('/api/ai/audio-to-minutes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Có lỗi xảy ra khi phân tích cuộc họp.');
      }

      setProcessedResult(json.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi khi gọi AI xử lý biên bản. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveToMeetingList = () => {
    if (!processedResult) return;

    const newMeeting: Meeting = {
      id: 'meeting-' + Date.now(),
      title: processedResult.title || 'Biên bản sinh hoạt tổ chuyên môn điện tử',
      category: processedResult.category || 'thematic',
      periodLabel:
        processedResult.category === 'monthly'
          ? 'Sinh hoạt tháng 9/2026'
          : processedResult.category === 'weekly'
          ? 'Sinh hoạt tuần 1'
          : 'Sinh hoạt chuyên đề',
      academicYear: '2026-2027',
      date: '2026-09-11',
      timeStart: '14:00',
      timeEnd: '16:30',
      location: processedResult.location || 'Phòng Hội đồng Sư phạm',
      schoolName: defaultSchoolName,
      departmentName: defaultDepartmentName,
      attendees: {
        host: processedResult.attendees?.host || 'Thầy ThS. Lê Hoàng Nam (Tổ trưởng)',
        secretary: processedResult.attendees?.secretary || 'Cô Trần Thị Mai Lan (Thư ký)',
        presentCount: processedResult.attendees?.presentCount || 9,
        totalCount: processedResult.attendees?.totalCount || 9,
        absentNames: processedResult.attendees?.absent || '0',
        members: processedResult.attendees?.members || ['Lê Hoàng Nam', 'Trần Thị Mai Lan', 'Vũ Đình Hưng'],
      },
      content: processedResult.content || '',
      teacherOpinions: (processedResult.teacherOpinions || []).map((op: any, index: number) => ({
        id: `op-ai-${index + 1}`,
        teacherName: op.teacherName || `Giáo viên ${index + 1}`,
        opinion: op.opinion || '',
        type: 'proposal',
      })),
      conclusion: processedResult.conclusion || '',
      proofFiles: [
        {
          id: 'pf-ai-audio',
          name: uploadedFileName || `Ghi_am_cuoc_hop_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '_')}.webm`,
          type: 'audio',
          size: '3.2 MB',
          uploadDate: '2026-09-11',
          description: 'Bản ghi âm gốc đã được AI phân tích',
        },
      ],
      status: 'completed',
      officialMinutesText: processedResult.fullMinutesFormatted,
    };

    onSaveMeeting(newMeeting);
    onClose();
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-800 to-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-emerald-300 flex items-center justify-center ring-2 ring-emerald-400/30">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                Chuyển ghi âm cuộc họp → Biên bản hoàn chỉnh (AI)
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              </h2>
              <p className="text-xs text-teal-200">
                Tự động bóc tách âm thanh, trích xuất ý kiến giáo viên và kết luận tổ trưởng chuẩn thể thức sư phạm
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {/* Method Selector Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-6 text-xs sm:text-sm font-semibold">
            <button
              onClick={() => {
                setActiveTab('record');
                setError(null);
              }}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'record'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mic className="w-4 h-4 text-red-500" />
              <span>Ghi âm trực tiếp qua Micro</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('upload');
                setError(null);
              }}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-4 h-4 text-blue-500" />
              <span>Tải file âm thanh (.mp3, .wav, .m4a)</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('sample');
                setError(null);
              }}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'sample'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Mẫu ghi âm cuộc họp có sẵn</span>
            </button>
          </div>

          {/* Tab 1: Live Record */}
          {activeTab === 'record' && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
              <div className="max-w-md mx-auto">
                <div className="text-3xl font-mono font-bold text-slate-800 mb-4 tracking-wider">
                  {formatSeconds(recordingTime)}
                </div>

                {/* Animated Pulsing Mic Visualizer */}
                <div className="relative inline-flex items-center justify-center mb-6">
                  {isRecording && (
                    <>
                      <div className="absolute w-24 h-24 rounded-full bg-red-500/20 animate-ping" />
                      <div className="absolute w-20 h-20 rounded-full bg-red-500/30 animate-pulse" />
                    </>
                  )}
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 cursor-pointer ${
                      isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-teal-600 hover:bg-teal-700'
                    }`}
                  >
                    {isRecording ? <Square className="w-6 h-6 fill-current" /> : <Mic className="w-7 h-7" />}
                  </button>
                </div>

                <div className="text-sm font-medium text-slate-700 mb-2">
                  {isRecording ? (
                    <span className="text-red-600 font-semibold flex items-center justify-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                      Đang thu âm buổi họp... Nhấn dừng khi hoàn tất
                    </span>
                  ) : audioBlob ? (
                    <span className="text-emerald-700 font-semibold flex items-center justify-center gap-1.5">
                      <Check className="w-4 h-4" /> Đã thu âm thành công ({formatSeconds(recordingTime)})
                    </span>
                  ) : (
                    'Nhấn nút để bắt đầu ghi âm buổi sinh hoạt tổ chuyên môn'
                  )}
                </div>

                {audioUrl && !isRecording && (
                  <div className="mt-4 p-3 bg-white rounded-lg border border-slate-200">
                    <audio src={audioUrl} controls className="w-full h-10" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Upload File */}
          {activeTab === 'upload' && (
            <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-6 text-center">
              <input
                type="file"
                id="audio-file-input"
                accept="audio/*,.mp3,.wav,.m4a,.webm"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="audio-file-input"
                className="cursor-pointer flex flex-col items-center justify-center gap-3"
              >
                <div className="w-14 h-14 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center">
                  <FileAudio className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {uploadedFileName ? uploadedFileName : 'Nhấp để chọn tệp âm thanh cuộc họp từ máy tính'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Hỗ trợ tệp: .mp3, .wav, .m4a, .webm (Dung lượng tối đa 50MB)
                  </p>
                </div>
                <span className="px-4 py-2 bg-white border border-slate-300 text-xs font-semibold text-slate-700 rounded-lg hover:bg-slate-100 shadow-2xs">
                  {uploadedFileName ? 'Chọn tệp khác' : 'Duyệt tệp...'}
                </span>
              </label>

              {audioUrl && (
                <div className="mt-4 p-3 bg-white rounded-lg border border-slate-200 max-w-md mx-auto">
                  <audio src={audioUrl} controls className="w-full h-10" />
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Sample Transcript */}
          {activeTab === 'sample' && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Nội dung ghi chú / Bản ghi âm mô phỏng thực tế:
                </label>
                <span className="text-xs text-slate-500 italic">
                  (Có thể chỉnh sửa văn bản này để thử nghiệm)
                </span>
              </div>
              <textarea
                value={sampleTranscript}
                onChange={(e) => setSampleTranscript(e.target.value)}
                rows={7}
                className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs font-mono text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div>
                <strong>Lỗi: </strong> {error}
              </div>
            </div>
          )}

          {/* Action Button to trigger AI */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleProcessAi}
              disabled={isProcessing || isRecording || (activeTab === 'record' && !audioBlob && recordingTime === 0) || (activeTab === 'upload' && !uploadedFile)}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-md flex items-center gap-2.5 transition-all cursor-pointer text-sm"
              id="btn-trigger-ai-process"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>AI đang lắng nghe và lập biên bản hoàn chỉnh...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Bắt đầu AI phân tích & Lập biên bản hoàn chỉnh</span>
                </>
              )}
            </button>
          </div>

          {/* Processed Results Section */}
          {processedResult && (
            <div className="mt-8 border-t border-slate-200 pt-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    ✓
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Kết quả Biên bản hoàn chỉnh do AI thiết lập
                    </h3>
                    <p className="text-xs text-slate-500">
                      Đã bóc tách đầy đủ tiêu đề, thành phần, nội dung, ý kiến giáo viên và kết luận
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleSaveToMeetingList}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                  id="btn-save-ai-minutes"
                >
                  <span>Lưu vào Sổ sinh hoạt</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Preview Cards */}
              <div className="space-y-4 text-xs">
                {/* General Info */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500">Tiêu đề buổi họp:</span>
                      <p className="font-bold text-slate-900 mt-0.5">{processedResult.title}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Chủ trì & Thư ký:</span>
                      <p className="font-semibold text-slate-800 mt-0.5">
                        {processedResult.attendees?.host} | {processedResult.attendees?.secretary}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <h4 className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-600" />
                    Nội dung triển khai:
                  </h4>
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                    {processedResult.content}
                  </p>
                </div>

                {/* Teacher opinions extracted */}
                {processedResult.teacherOpinions && processedResult.teacherOpinions.length > 0 && (
                  <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4">
                    <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-600" />
                      Ý kiến giáo viên bóc tách được ({processedResult.teacherOpinions.length} ý kiến):
                    </h4>
                    <div className="space-y-2">
                      {processedResult.teacherOpinions.map((item: any, idx: number) => (
                        <div key={idx} className="bg-white p-2.5 rounded-lg border border-amber-100">
                          <strong className="text-slate-900">{item.teacherName}: </strong>
                          <span className="text-slate-700">{item.opinion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conclusion */}
                <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4">
                  <h4 className="font-bold text-emerald-900 mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    Kết luận & Phân công nhiệm vụ của Tổ trưởng:
                  </h4>
                  <p className="text-slate-800 whitespace-pre-line leading-relaxed font-medium">
                    {processedResult.conclusion}
                  </p>
                </div>

                {/* Full Minutes Text */}
                {processedResult.fullMinutesFormatted && (
                  <details className="bg-slate-100 rounded-xl p-4 border border-slate-200">
                    <summary className="font-bold text-slate-800 cursor-pointer hover:text-teal-700">
                      Xem toàn văn biên bản hoàn chỉnh (Chuẩn thể thức Nghị định 30)
                    </summary>
                    <pre className="mt-3 p-4 bg-white rounded-lg border border-slate-200 font-serif text-xs text-slate-900 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                      {processedResult.fullMinutesFormatted}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
