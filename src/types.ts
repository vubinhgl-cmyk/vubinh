export type MeetingCategory = 'monthly' | 'weekly' | 'thematic';

export interface TeacherOpinion {
  id: string;
  teacherName: string;
  subject?: string;
  opinion: string;
  type?: 'consensus' | 'challenge' | 'proposal' | 'general';
}

export interface ProofFile {
  id: string;
  name: string;
  size?: string;
  type: 'image' | 'pdf' | 'doc' | 'audio' | 'link';
  url?: string;
  uploadDate: string;
  description?: string;
}

export interface MeetingAttendees {
  host: string; // Chủ trì (Tổ trưởng)
  secretary: string; // Thư ký
  presentCount: number;
  totalCount: number;
  absentNames: string; // Vắng mặt
  members: string[]; // Danh sách thành viên tham gia
}

export interface AiSummary {
  consensusPoints: string[];
  challengesRaised: string[];
  innovativeSuggestions: string[];
  executiveSummary: string;
  keyTakeawayForLeader: string;
}

export interface NextMonthTask {
  name: string;
  description: string;
  assignee: string;
  deadline: string;
  expectedOutcome: string;
}

export interface NextMonthTaskGroup {
  category: string;
  tasks: NextMonthTask[];
}

export interface AiNextMonthPlan {
  targetMonth: string;
  theme: string;
  objectives: string[];
  taskGroups: NextMonthTaskGroup[];
  recommendationsForPrincipal?: string;
}

export interface Meeting {
  id: string;
  title: string;
  category: MeetingCategory;
  periodLabel: string; // e.g., "Sinh hoạt tháng 9/2026", "Sinh hoạt tuần 1", "Sinh hoạt chuyên đề"
  academicYear: string; // e.g., "2026-2027"
  date: string; // e.g., "2026-09-11"
  timeStart: string; // "14:00"
  timeEnd: string; // "16:30"
  location: string;
  schoolName: string;
  departmentName: string;
  attendees: MeetingAttendees;
  content: string;
  teacherOpinions: TeacherOpinion[];
  conclusion: string;
  proofFiles: ProofFile[];
  status: 'completed' | 'draft' | 'scheduled';
  aiSummary?: AiSummary;
  aiSuggestedTasks?: AiNextMonthPlan;
  fullMinutesFormatted?: string;
  officialMinutesText?: string;
  audioRecording?: {
    duration?: number;
    fileName?: string;
    transcript?: string;
    recordedAt?: string;
  };
}
