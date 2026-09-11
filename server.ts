import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Lazy get Google GenAI client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY not found in environment. Gemini features will return fallback suggestions or require key configuration.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || 'dummy-key',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// 1. Convert audio / raw notes to a complete official meeting minutes
app.post('/api/ai/audio-to-minutes', async (req, res) => {
  try {
    const { audioBase64, mimeType = 'audio/webm', rawTranscript, meetingContext } = req.body;
    const ai = getGenAI();

    const systemInstruction = `Bạn là Thư ký chuyên môn xuất sắc của trường phổ thông Việt Nam, am hiểu Điều lệ trường THCS, THPT và Thông tư 32/2018/TT-BGDĐT, Công văn 5512/BGDĐT.
Nhiệm vụ của bạn là chuyển bản ghi âm hoặc bản nháp/bản thô cuộc họp tổ chuyên môn thành một BIÊN BẢN SINH HOẠT TỔ CHUYÊN MÔN HOÀN CHỈNH, CHUẨN MỰC SƯ PHẠM.

Yêu cầu xuất ra định dạng JSON chính xác với cấu trúc sau:
{
  "title": "Tên buổi sinh hoạt ngắn gọn và trang trọng",
  "category": "monthly" (sinh hoạt tháng) | "weekly" (sinh hoạt tuần) | "thematic" (chuyên đề),
  "time": "Ngày giờ diễn ra",
  "location": "Địa điểm (VD: Phòng Hội đồng sư phạm / Phòng bộ môn)",
  "attendees": {
    "host": "Họ và tên Tổ trưởng (chủ trì)",
    "secretary": "Họ và tên Thư ký",
    "presentCount": 8,
    "totalCount": 8,
    "absent": "Không / hoặc nêu tên và lý do",
    "members": ["Tên giáo viên 1", "Tên giáo viên 2", ...]
  },
  "content": "Nội dung triển khai chi tiết các vấn đề trọng tâm (đánh giá công tác đã qua, kế hoạch chuyên môn, đổi mới PPDH, kiểm tra nội bộ)",
  "teacherOpinions": [
    { "teacherName": "Thầy/Cô Nguyễn Văn A", "opinion": "Ý kiến chi tiết về chương trình, học sinh hoặc giải pháp" }
  ],
  "conclusion": "Kết luận cụ thể của Tổ trưởng chuyên môn, phân công rõ người, rõ việc, rõ tiến độ",
  "fullMinutesFormatted": "Toàn bộ văn bản biên bản đầy đủ chuẩn hành chính Việt Nam (có Quốc hiệu, Tiêu ngữ, Tên đơn vị, Diễn biến cuộc họp, Biểu quyết thông qua 100%, chữ ký Thư ký và Tổ trưởng)"
}`;

    let contentsPayload: any;

    if (audioBase64) {
      contentsPayload = {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || 'audio/webm',
              data: audioBase64,
            },
          },
          {
            text: `Đây là bản ghi âm buổi sinh hoạt tổ chuyên môn trường phổ thông. Bối cảnh bổ sung: ${meetingContext || 'Buổi sinh hoạt chuyên môn đầu năm học 2026-2027'}. Hãy phân tích kỹ âm thanh/lời nói và lập biên bản sinh hoạt tổ chuyên môn hoàn chỉnh chuẩn sư phạm bằng tiếng Việt theo cấu trúc JSON.`,
          },
        ],
      };
    } else {
      contentsPayload = `Dưới đây là nội dung ghi chép thô / bản ghi âm ghi chú cuộc họp:\n\n${rawTranscript}\n\nBối cảnh: ${meetingContext || 'Sinh hoạt tổ chuyên môn'}.\nHãy xử lý và trả về biên bản sinh hoạt tổ chuyên môn chuẩn mực theo cấu trúc JSON quy định.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contentsPayload,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Error in /api/ai/audio-to-minutes:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Lỗi khi xử lý chuyển ghi âm thành biên bản',
    });
  }
});

// 2. Summarize teacher opinions
app.post('/api/ai/summarize-opinions', async (req, res) => {
  try {
    const { teacherOpinions, meetingTitle } = req.body;
    const ai = getGenAI();

    const prompt = `Phân tích và tóm tắt có hệ thống các ý kiến đóng góp của giáo viên trong buổi sinh hoạt: "${meetingTitle || 'Sinh hoạt chuyên môn'}".

Dữ liệu ý kiến:
${typeof teacherOpinions === 'string' ? teacherOpinions : JSON.stringify(teacherOpinions, null, 2)}

Hãy phân loại và tóm tắt theo cấu trúc JSON:
{
  "consensusPoints": ["Các điểm thống nhất cao trong tổ (VD: ma trận đề, thời lượng tiết dạy)"],
  "challengesRaised": ["Những khó khăn, vướng mắc giáo viên phản ánh (VD: học sinh yếu môn, thiếu thiết bị, tài liệu GDPT 2018)"],
  "innovativeSuggestions": ["Các sáng kiến, giải pháp cải tiến sư phạm được nêu ra"],
  "executiveSummary": "Đoạn văn tóm tắt cô đọng (3-4 câu) diễn biến tâm tư và định hướng chung của các thành viên trong tổ",
  "keyTakeawayForLeader": "Lời khuyên chiến lược cho Tổ trưởng chuyên môn để tháo gỡ vướng mắc"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    res.json({ success: true, data: JSON.parse(text) });
  } catch (error: any) {
    console.error('Error in /api/ai/summarize-opinions:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Lỗi khi tóm tắt ý kiến giáo viên',
    });
  }
});

// 3. Suggest next month's tasks / action plans
app.post('/api/ai/suggest-next-month-tasks', async (req, res) => {
  try {
    const { currentMeeting, month = '10/2026', subject = 'Tổ chuyên môn' } = req.body;
    const ai = getGenAI();

    const prompt = `Bạn là chuyên gia tư vấn giáo dục và tổ trưởng chuyên môn trường phổ thông.
Dựa trên biên bản sinh hoạt tổ chuyên môn hiện tại:
Tiêu đề: ${currentMeeting?.title || 'Sinh hoạt tổ'}
Thời gian hiện tại: Tháng 9/2026
Tổ môn: ${subject}
Nội dung: ${currentMeeting?.content || ''}
Ý kiến giáo viên: ${JSON.stringify(currentMeeting?.teacherOpinions || '')}
Kết luận hiện tại: ${currentMeeting?.conclusion || ''}

Hãy xây dựng Kế hoạch hành động & Đề xuất nhiệm vụ trọng tâm cho tháng tiếp theo (${month}) theo đúng tiến độ năm học 2026 - 2027 của Bộ GD&ĐT.

Trả về định dạng JSON:
{
  "targetMonth": "${month}",
  "theme": "Chủ điểm chuyên môn của tháng",
  "objectives": ["Mục tiêu trọng tâm 1", "Mục tiêu 2"],
  "taskGroups": [
    {
      "category": "Công tác chuyên môn & Dạy học",
      "tasks": [
        {
          "name": "Tên nhiệm vụ cụ thể",
          "description": "Chi tiết yêu cầu cần thực hiện",
          "assignee": "Đối tượng/người thực hiện",
          "deadline": "Thời hạn hoàn thành",
          "expectedOutcome": "Sản phẩm đầu ra"
        }
      ]
    },
    {
      "category": "Hoạt động Chuyên đề & Nghiên cứu bài học",
      "tasks": [...]
    },
    {
      "category": "Bồi dưỡng HS Giỏi & Phụ đạo HS Cần hỗ trợ",
      "tasks": [...]
    },
    {
      "category": "Kiểm tra nội bộ & Hồ sơ sổ sách",
      "tasks": [...]
    }
  ],
  "recommendationsForPrincipal": "Đề xuất kiến nghị lên Ban Giám hiệu nhà trường (về cơ sở vật chất, tập huấn, hỗ trợ)"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    res.json({ success: true, data: JSON.parse(text) });
  } catch (error: any) {
    console.error('Error in /api/ai/suggest-next-month-tasks:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Lỗi khi đề xuất nhiệm vụ tháng sau',
    });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'So-Sinh-Hoat-To-Chuyen-Mon-Dien-Tu' });
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
