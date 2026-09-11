import { Meeting } from '../types';

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 'meeting-month-09-2026',
    title: 'Sinh hoạt định kỳ tháng 9/2026: Triển khai nhiệm vụ năm học 2026 - 2027 & Kế hoạch GDPT 2018',
    category: 'monthly',
    periodLabel: 'Sinh hoạt tháng 9/2026',
    academicYear: '2026-2027',
    date: '2026-09-05',
    timeStart: '14:00',
    timeEnd: '16:45',
    location: 'Phòng Hội đồng Sư phạm - Tầng 2, Nhà Hiệu bộ',
    schoolName: 'Trường THCS Yết Kiêu',
    departmentName: 'Tổ Toán - Tin học',
    attendees: {
      host: 'Thầy ThS. Lê Hoàng Nam (Tổ trưởng)',
      secretary: 'Cô Trần Thị Mai Lan (Thư ký)',
      presentCount: 9,
      totalCount: 9,
      absentNames: '0 (Đủ 9/9 đồng chí)',
      members: [
        'Lê Hoàng Nam (Tổ trưởng)',
        'Vũ Đình Hưng (Tổ phó)',
        'Trần Thị Mai Lan',
        'Nguyễn Thành Long',
        'Phạm Quỳnh Chi',
        'Hoàng Quốc Việt',
        'Lê Thu Trang',
        'Đỗ Quang Huy',
        'Bùi Thị Hồng Hạnh'
      ]
    },
    content: `1. Đánh giá công tác chuẩn bị năm học mới và khai giảng:
- 100% giáo viên trong tổ hoàn thành tập huấn SGK mới và quy chế chuyên môn theo hướng dẫn của Phòng GD&ĐT.
- Hoàn thành rà soát thiết bị dạy học, phòng máy tính, màn hình tương tác thông minh phục vụ học sinh THCS.

2. Triển khai kế hoạch dạy học năm học 2026 - 2027:
- Thống nhất khung kế hoạch giáo dục của tổ môn Toán và Tin học các khối 6, 7, 8, 9 bám sát Chương trình GDPT 2018 và Thông tư 22/2021/TT-BGDĐT về đánh giá học sinh THCS.
- Phân công giảng dạy phù hợp năng lực, sở trường của từng đồng chí giáo viên.
- Thống nhất quy định về hồ sơ sổ sách điện tử: 100% giáo án đưa lên hệ thống quản lý học tập điện tử của nhà trường, loại bỏ giáo án giấy.

3. Kế hoạch bồi dưỡng học sinh giỏi và ôn thi vào lớp 10:
- Thành lập đội tuyển HSG cấp trường các khối 8 và 9, lên lịch ôn luyện bắt đầu từ tuần 3 tháng 9.
- Khảo sát chất lượng đầu năm khối 6 để nắm bắt học sinh chuyển cấp từ tiểu học, kịp thời hỗ trợ phương pháp học tập mới.`,
    teacherOpinions: [
      {
        id: 'op-1',
        teacherName: 'Thầy Vũ Đình Hưng (Tổ phó)',
        subject: 'Toán 9',
        opinion: 'Đề nghị nhà trường cấp thêm tài khoản phần mềm trắc nghiệm và mô phỏng hình học Geogebra phục vụ giảng dạy chương trình Toán 9 mới bám sát định dạng cấu trúc đề thi tuyển sinh vào lớp 10 năm 2027.',
        type: 'proposal'
      },
      {
        id: 'op-2',
        teacherName: 'Cô Phạm Quỳnh Chi',
        subject: 'Tin học 6',
        opinion: 'Học sinh lớp 6 mới vào trường kỹ năng sử dụng máy tính và bàn phím còn bỡ ngỡ, đề xuất dành 2 tiết đầu tuần để rèn luyện kỹ năng gõ 10 ngón và an toàn khi sử dụng Internet.',
        type: 'challenge'
      },
      {
        id: 'op-3',
        teacherName: 'Thầy Nguyễn Thành Long',
        subject: 'Toán 11',
        opinion: 'Đồng thuận 100% với việc chuyển sang ký duyệt giáo án số qua chữ ký số. Cần thống nhất định dạng file và thời hạn nộp trước tối thiểu 3 ngày so với tiết dạy.',
        type: 'consensus'
      },
      {
        id: 'op-4',
        teacherName: 'Cô Bùi Thị Hồng Hạnh',
        subject: 'Toán 10',
        opinion: 'Đề xuất tổ chức cho các giáo viên trẻ được dự giờ giáo viên có kinh nghiệm ngay từ tháng 9 để học tập phương pháp tổ chức hoạt động học tích cực cho học sinh.',
        type: 'proposal'
      }
    ],
    conclusion: `1. Nhất trí thông qua 100% Kế hoạch giáo dục tổ môn Toán - Tin học năm học 2026 - 2027.
2. Giao Thầy Hưng lập danh sách và thời khóa biểu bồi dưỡng HSG lớp 12, báo cáo BGH trước ngày 15/09/2026.
3. Giáo viên toàn tổ thực hiện nghiêm túc quy chế chuyên môn, nộp Kế hoạch bài dạy điện tử đúng hạn vào thứ Năm hàng tuần.
4. Đăng ký chỉ tiêu thi đua năm học: 100% giáo viên đạt Lao động tiên tiến, trong đó có 3 CSTĐ cấp cơ sở, tổ phấn đấu danh hiệu Tập thể Lao động Xuất sắc.`,
    proofFiles: [
      {
        id: 'pf-1',
        name: 'Ke_hoach_Giao_duc_To_Toan_Tin_2026_2027.pdf',
        size: '1.8 MB',
        type: 'pdf',
        uploadDate: '2026-09-05',
        description: 'Kế hoạch giáo dục môn học đã ký duyệt'
      },
      {
        id: 'pf-2',
        name: 'Bien_ban_hop_to_co_chu_ky.jpg',
        size: '2.4 MB',
        type: 'image',
        uploadDate: '2026-09-05',
        description: 'Ảnh chụp biên bản chữ ký tay của 9 thành viên'
      },
      {
        id: 'pf-3',
        name: 'Phan_cong_chuyen_mon_hoc_ky_1.xlsx',
        size: '420 KB',
        type: 'doc',
        uploadDate: '2026-09-05',
        description: 'Bảng phân công giảng dạy HK1'
      }
    ],
    status: 'completed',
    aiSummary: {
      consensusPoints: [
        'Nhất trí 100% áp dụng ký số và quản lý hồ sơ bài dạy trên nền tảng điện tử, thay thế hoàn toàn sổ giấy.',
        'Đồng thuận với phân phối chương trình và chỉ tiêu thi đua đề ra cho năm học 2026-2027.'
      ],
      challengesRaised: [
        'Chênh lệch trình độ thực hành tin học đầu vào của học sinh khối 10.',
        'Cần trang bị bổ sung công cụ mô phỏng hình học không gian 3D chất lượng cao cho khối 12.'
      ],
      innovativeSuggestions: [
        'Dành 2 tiết chuyên đề củng cố kỹ năng tin học cơ bản cho học sinh đầu cấp.',
        'Tổ chức dự giờ chéo giữa giáo viên cốt cán và giáo viên trẻ ngay từ đầu tháng 9.'
      ],
      executiveSummary: 'Cuộc họp diễn ra trong không khí phấn khởi đầu năm học mới. Các giáo viên thống nhất cao với kế hoạch chuyên môn, đồng thời đề xuất giải pháp thiết thực hỗ trợ học sinh yếu và ứng dụng công nghệ 3D vào dạy học.',
      keyTakeawayForLeader: 'Tổ trưởng cần làm việc với BGH về việc cài đặt phần mềm toán 3D, đồng thời chỉ đạo khối 10 điều chỉnh linh hoạt 2 tiết đầu để củng cố kỹ năng công nghệ cho học sinh.'
    },
    aiSuggestedTasks: {
      targetMonth: '10/2026',
      theme: 'Thi đua Dạy tốt - Học tốt chào mừng ngày Phụ nữ Việt Nam 20/10 và chuẩn bị Kiểm tra giữa kỳ I',
      objectives: [
        'Tổ chức Hội giảng cấp tổ chào mừng 20/10.',
        'Hoàn thành xây dựng ngân hàng câu hỏi và ma trận đề kiểm tra Giữa học kỳ I theo chuẩn GDPT 2018.',
        'Đánh giá sơ kết đợt 1 bồi dưỡng học sinh giỏi cấp tỉnh.'
      ],
      taskGroups: [
        {
          category: 'Công tác Dạy học & Hội giảng',
          tasks: [
            {
              name: 'Đăng ký tiết dạy tốt - Thao giảng chào mừng 20/10',
              description: 'Mỗi giáo viên đăng ký ít nhất 01 tiết dạy đổi mới PPDH có ứng dụng CNTT/AI',
              assignee: 'Toàn thể giáo viên trong tổ',
              deadline: '18/10/2026',
              expectedOutcome: 'Biên bản đánh giá giờ dạy đạt loại Tốt'
            },
            {
              name: 'Biên soạn Ma trận và Đặc tả đề kiểm tra Giữa kỳ I',
              description: 'Xây dựng ma trận 4 mức độ nhận thức theo định dạng đề thi mới của Bộ',
              assignee: 'Thầy Long (K11), Thầy Hưng (K12), Cô Chi (K10)',
              deadline: '10/10/2026',
              expectedOutcome: 'Bộ đề thi minh họa kèm đáp án chi tiết'
            }
          ]
        },
        {
          category: 'Sinh hoạt Chuyên đề & Nghiên cứu bài học',
          tasks: [
            {
              name: 'Sinh hoạt chuyên đề cấp Cụm trường môn Tin học',
              description: 'Báo cáo chuyên đề: Lập trình Python ứng dụng trong mô hình hóa toán học',
              assignee: 'Cô Mai Lan & Thầy Huy',
              deadline: '24/10/2026',
              expectedOutcome: 'Kỷ yếu chuyên đề và giáo án thực nghiệm'
            }
          ]
        },
        {
          category: 'Kiểm tra nội bộ & Hồ sơ chuyên môn',
          tasks: [
            {
              name: 'Kiểm tra chéo Kế hoạch bài dạy và sổ ghi chép điện tử',
              description: 'Kiểm tra tính kịp thời, chất lượng soạn giảng và tiến độ chương trình',
              assignee: 'Tổ trưởng và Tổ phó',
              deadline: '28/10/2026',
              expectedOutcome: 'Biên bản kiểm tra chuyên môn tháng 10'
            }
          ]
        }
      ],
      recommendationsForPrincipal: 'Đề nghị nhà trường duyệt kinh phí hỗ trợ tài khoản bản quyền phần mềm hỗ trợ dạy học và bố trí thêm 01 buổi tập huấn chuyên sâu về AI trong giáo dục.'
    },
    officialMinutesText: `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
-------------------------
TRƯỜNG THCS YẾT KIÊU
TỔ CHUYÊN MÔN: TOÁN - TIN HỌC

BIÊN BẢN SINH HOẠT TỔ CHUYÊN MÔN
(Tháng 9 năm 2026)

I. THỜI GIAN, ĐỊA ĐIỂM:
- Thời gian: Bắt đầu từ 14h00 đến 16h45, ngày 05 tháng 09 năm 2026.
- Địa điểm: Phòng Hội đồng Sư phạm, Trường THCS Yết Kiêu.

II. THÀNH PHẦN THAM DỰ:
- Chủ trì: Thầy ThS. Lê Hoàng Nam - Tổ trưởng chuyên môn.
- Thư ký: Cô Trần Thị Mai Lan - Giáo viên Tin học.
- Tổng số thành viên: 09/09 đồng chí.
- Có mặt: 09 đồng chí.
- Vắng: 0 đồng chí.

III. NỘI DUNG SINH HOẠT:
1. Triển khai kế hoạch năm học 2026 - 2027 và phân công chuyên môn:
- Tổ trưởng quán triệt văn bản chỉ đạo của Phòng GD&ĐT và Kế hoạch giáo dục nhà trường.
- 100% thành viên cam kết thực hiện nghiêm túc quy chế chuyên môn, đổi mới phương pháp dạy học theo định hướng phát triển phẩm chất và năng lực học sinh THCS.
- Chuyển đổi toàn diện sang hồ sơ chuyên môn điện tử, tích hợp chữ ký số và hệ thống quản lý bài dạy trực tuyến.

2. Ý kiến phát biểu, thảo luận của giáo viên trong tổ:
- Thầy Vũ Đình Hưng: Đề xuất trang bị thêm phần mềm mô phỏng hình học phục vụ học sinh khối 9 ôn thi vào 10.
- Cô Phạm Quỳnh Chi: Phản ánh kỹ năng tin học học sinh lớp 6 mới vào trường cần rèn luyện nền nếp.
- Thầy Nguyễn Thành Long: Thống nhất quy trình nộp kế hoạch bài dạy trước thứ Năm hàng tuần.
- Cô Bùi Thị Hồng Hạnh: Đề xuất tăng cường dự giờ học tập chuyên môn cho giáo viên trẻ.

IV. KẾT LUẬN VÀ PHÂN CÔNG NHIỆM VỤ CỦA TỔ TRƯỞNG:
1. Nhất trí thông qua toàn văn Kế hoạch chuyên môn tổ năm học 2026-2027 với tỉ lệ biểu quyết 100%.
2. Phân công đồng chí Tổ phó phụ trách đôn đốc công tác bồi dưỡng HSG lớp 8, 9 và ôn thi vào 10.
3. Giáo viên khối 6 chủ động điều chỉnh 2 tiết đầu để rèn kỹ năng thao tác cho học sinh.
4. Cuộc họp kết thúc hồi 16h45 cùng ngày, biên bản được đọc lại cho toàn tổ nghe và cùng nhất trí ký tên.

      THƯ KÝ CUỘC HỌP                              TỔ TRƯỞNG CHUYÊN MÔN
      (Đã ký điện tử)                                 (Đã ký điện tử)
    Trần Thị Mai Lan                                  Lê Hoàng Nam`
  },
  {
    id: 'meeting-week-1',
    title: 'Sinh hoạt chuyên môn tuần 1: Duyệt Kế hoạch bài dạy & Ổn định nền nếp dạy học',
    category: 'weekly',
    periodLabel: 'Sinh hoạt tuần 1',
    academicYear: '2026-2027',
    date: '2026-09-08',
    timeStart: '15:30',
    timeEnd: '17:15',
    location: 'Phòng học Bộ môn Tin học số 1',
    schoolName: 'Trường THCS Yết Kiêu',
    departmentName: 'Tổ Toán - Tin học',
    attendees: {
      host: 'Thầy ThS. Lê Hoàng Nam (Tổ trưởng)',
      secretary: 'Cô Trần Thị Mai Lan (Thư ký)',
      presentCount: 9,
      totalCount: 9,
      absentNames: '0 (Đủ)',
      members: [
        'Lê Hoàng Nam',
        'Vũ Đình Hưng',
        'Trần Thị Mai Lan',
        'Nguyễn Thành Long',
        'Phạm Quỳnh Chi',
        'Hoàng Quốc Việt',
        'Lê Thu Trang',
        'Đỗ Quang Huy',
        'Bùi Thị Hồng Hạnh'
      ]
    },
    content: `1. Kiểm tra duyệt Kế hoạch bài dạy (Giáo án) tuần 1:
- Đã kiểm tra 100% giáo án tuần 1 của giáo viên trên cổng thông tin điện tử. Tất cả giáo án đều thiết kế theo cấu trúc 4 hoạt động của Công văn 5512/BGDĐT.
- Mục tiêu kiến thức, năng lực và phẩm chất được xác định rõ ràng, có phân hóa nhiệm vụ cho học sinh.

2. Nền nếp chuyên môn và quản lý phòng máy, phòng bộ môn:
- Kiểm tra lại toàn bộ 45 máy tính phòng máy 1 và phòng máy 2, cài đặt phần mềm lập trình Python 3.12 và Dev C++.
- Thống nhất sổ theo dõi thiết bị phòng máy điện tử (quét mã QR khi bàn giao ca học).

3. Thống nhất quy định kiểm tra thường xuyên:
- Mỗi học sinh có tối thiểu 02 đầu điểm kiểm tra thường xuyên/học kỳ theo đúng Thông tư 22.
- Đa dạng hóa hình thức đánh giá: hỏi đáp, bài viết ngắn, báo cáo sản phẩm dự án nhỏ.`,
    teacherOpinions: [
      {
        id: 'op-w1-1',
        teacherName: 'Cô Lê Thu Trang',
        subject: 'Toán 10',
        opinion: 'Tiết 1 bài Mệnh đề Toán học khối 10 học sinh tiếp thu hào hứng khi giáo viên sử dụng slide tương tác Canva và Quizizz khởi động.',
        type: 'consensus'
      },
      {
        id: 'op-w1-2',
        teacherName: 'Thầy Hoàng Quốc Việt',
        subject: 'Tin học 11',
        opinion: 'Phòng máy số 2 có 3 chuột máy tính bị liệt nút cuộn, đề nghị bộ phận thiết bị thay thế trước buổi học chiều thứ Năm.',
        type: 'challenge'
      }
    ],
    conclusion: `1. Đánh giá tuần 1: Tổ triển khai dạy học đúng thời khóa biểu, tác phong mẫu mực, hồ sơ bài dạy đạt yêu cầu 100%.
2. Giao Thầy Huy báo cáo ngay phụ trách phòng thực hành thay thế 3 chuột máy tính hỏng.
3. Giáo viên chuẩn bị Kế hoạch bài dạy tuần 2 nộp trước 17h thứ Năm ngày 10/09/2026.`,
    proofFiles: [
      {
        id: 'pf-w1-1',
        name: 'Bien_ban_kiem_tra_giao_an_tuan_1.pdf',
        size: '850 KB',
        type: 'pdf',
        uploadDate: '2026-09-08',
        description: 'Biên bản kiểm tra giáo án điện tử tuần 1'
      },
      {
        id: 'pf-w1-2',
        name: 'Hinh_anh_kiem_tra_phong_may.jpg',
        size: '3.1 MB',
        type: 'image',
        uploadDate: '2026-09-08',
        description: 'Ảnh kiểm tra thiết bị phòng máy tính'
      }
    ],
    status: 'completed',
    officialMinutesText: `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
-------------------------
TRƯỜNG THCS YẾT KIÊU
TỔ TOÁN - TIN HỌC

BIÊN BẢN SINH HOẠT CHUYÊN MÔN TUẦN 1
NĂM HỌC 2026 - 2027

Thời gian: 15h30 ngày 08/09/2026
Địa điểm: Phòng Bộ môn Tin học số 1
Thành phần: 09/09 giáo viên, Chủ trì: Thầy Lê Hoàng Nam, Thư ký: Cô Trần Thị Mai Lan.

NỘI DUNG:
1. Duyệt Kế hoạch bài dạy tuần 1 theo chuẩn Công văn 5512: 100% đạt yêu cầu.
2. Kiểm tra phòng máy thực hành Tin học và quy chế an toàn thiết bị.
3. Thống nhất hình thức đánh giá thường xuyên theo Thông tư 22/2021/TT-BGDĐT.

KẾT LUẬN:
- Biểu dương tinh thần nghiêm túc của giáo viên trong tuần dạy đầu tiên.
- Hoàn thành nộp giáo án tuần 2 đúng thời hạn quy định.

      THƯ KÝ                                           TỔ TRƯỞNG
  Trần Thị Mai Lan                                    Lê Hoàng Nam`
  },
  {
    id: 'meeting-thematic-ai-innovation',
    title: 'Sinh hoạt chuyên đề: Ứng dụng Trí tuệ nhân tạo (AI) và Chuyển đổi số trong Dạy học và Đánh giá cấp THCS',
    category: 'thematic',
    periodLabel: 'Sinh hoạt chuyên đề',
    academicYear: '2026-2027',
    date: '2026-09-11',
    timeStart: '14:00',
    timeEnd: '17:00',
    location: 'Phòng Hội thảo Đa chức năng Trường',
    schoolName: 'Trường THCS Yết Kiêu',
    departmentName: 'Tổ Toán - Tin học',
    attendees: {
      host: 'Thầy ThS. Lê Hoàng Nam (Tổ trưởng)',
      secretary: 'Cô Trần Thị Mai Lan (Thư ký)',
      presentCount: 9,
      totalCount: 9,
      absentNames: '0 (Đủ 9/9, có Phó Hiệu trưởng tham dự chỉ đạo)',
      members: [
        'Lê Hoàng Nam (Báo cáo viên chính)',
        'Vũ Đình Hưng',
        'Trần Thị Mai Lan',
        'Nguyễn Thành Long',
        'Phạm Quỳnh Chi',
        'Hoàng Quốc Việt',
        'Lê Thu Trang',
        'Đỗ Quang Huy',
        'Bùi Thị Hồng Hạnh'
      ]
    },
    content: `1. Báo cáo đề dẫn chuyên đề (Thầy Lê Hoàng Nam trình bày):
- Giới thiệu các mô hình AI phục vụ giáo dục hiện đại: Gemini, ChatGPT trong việc hỗ trợ xây dựng kế hoạch bài dạy 4 bước cấp THCS, tạo bài toán thực tế gắn liền đời sống học sinh lứa tuổi 11 - 15 tuổi.
- Kỹ thuật "Prompt Engineering sư phạm": cách đặt câu hỏi để AI sinh ma trận đề thi 4 mức độ (Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao) chuẩn chương trình GDPT 2018.
- Cảnh báo về đạo đức trí tuệ nhân tạo và kiểm tra tính chính xác của dữ liệu do AI tạo ra.

2. Thực hành tại chỗ (Hands-on workshop):
- Chia tổ thành 3 nhóm:
  + Nhóm 1 (Toán 6 & 7): Dùng AI tạo tình huống thực tiễn ứng dụng Số học và Hình học trực quan (tính diện tích sàn nhà, lãi suất đơn giản).
  + Nhóm 2 (Toán 8 & 9): Ứng dụng AI xây dựng sơ đồ tư duy Đại số, hệ phương trình và các dạng bài ôn thi vào lớp 10.
  + Nhóm 3 (Tin học THCS): Sử dụng AI tạo bài toán lập trình trực quan Scratch và Python cơ bản cho học sinh lớp 8, 9.

3. Đánh giá sản phẩm và đúc rút bài học kinh nghiệm:
- Các sản phẩm đạt chất lượng cao, giảm 60% thời gian tìm kiếm tư liệu cho giáo viên.`,
    teacherOpinions: [
      {
        id: 'op-th-1',
        teacherName: 'Thầy Nguyễn Thành Long',
        subject: 'Toán 9',
        opinion: 'Chuyên đề rất thiết thực! Các bài toán thực tế AI gợi ý rất sát với định hướng đề thi tuyển sinh vào lớp 10 của các tỉnh thành trong năm học 2026-2027.',
        type: 'consensus'
      },
      {
        id: 'op-th-2',
        teacherName: 'Cô Bùi Thị Hồng Hạnh',
        subject: 'Toán 6',
        opinion: 'Cần lưu ý giáo viên không phụ thuộc hoàn toàn vào AI. Mọi bài toán do AI sinh ra phải được giáo viên giải lại chi tiết và thẩm định độ chính xác trước khi đưa vào bài dạy.',
        type: 'proposal'
      },
      {
        id: 'op-th-3',
        teacherName: 'Thầy Đỗ Quang Huy',
        subject: 'Tin học',
        opinion: 'Đề xuất xây dựng một "Kho Prompt sư phạm dùng chung" của Tổ Toán - Tin trên Google Drive nội bộ để các thầy cô cùng chia sẻ và cải tiến câu lệnh.',
        type: 'proposal'
      }
    ],
    conclusion: `1. Đánh giá chuyên đề xếp loại Xuất sắc, có tính ứng dụng thực tiễn cao trong năm học 2026-2027.
2. Thống nhất triển khai "Sổ sinh hoạt chuyên môn điện tử" và "Kho Prompt sư phạm dùng chung" từ tuần tới.
3. Giao Cô Mai Lan tổng hợp toàn văn tài liệu chuyên đề và sản phẩm của 3 nhóm, gửi báo cáo về Phòng Giáo dục và Đào tạo trước ngày 18/09/2026.`,
    proofFiles: [
      {
        id: 'pf-th-1',
        name: 'Bao_cao_Chuyen_de_AI_trong_Giao_duc.pdf',
        size: '4.2 MB',
        type: 'pdf',
        uploadDate: '2026-09-11',
        description: 'Tài liệu báo cáo chuyên đề số 01'
      },
      {
        id: 'pf-th-2',
        name: 'Slide_thuyet_trinh_chuyen_de_AI.pptx',
        size: '8.7 MB',
        type: 'doc',
        uploadDate: '2026-09-11',
        description: 'Slide trình chiếu bài báo cáo tại phòng hội thảo'
      },
      {
        id: 'pf-th-3',
        name: 'Anh_chup_buoi_thuc_hanh_chuyen_de.jpg',
        size: '3.5 MB',
        type: 'image',
        uploadDate: '2026-09-11',
        description: 'Ảnh toàn cảnh các giáo viên thực hành AI tại phòng máy'
      }
    ],
    status: 'completed',
    officialMinutesText: `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
-------------------------
TRƯỜNG THCS YẾT KIÊU
TỔ TOÁN - TIN HỌC

BIÊN BẢN SINH HOẠT CHUYÊN ĐỀ SỐ 01
NĂM HỌC 2026 - 2027

Chuyên đề: "Ứng dụng Trí tuệ nhân tạo (AI) và Chuyển đổi số trong Dạy học và Kiểm tra Đánh giá cấp THCS"
Thời gian: 14h00 - 17h00 ngày 11/09/2026
Địa điểm: Phòng Hội thảo Đa chức năng Trường THCS Yết Kiêu

I. THÀNH PHẦN:
- Có mặt: 09/09 thành viên tổ và Ban Giám hiệu dự chỉ đạo.
- Báo cáo viên: ThS. Lê Hoàng Nam.

II. NỘI DUNG:
- Báo cáo phương pháp xây dựng kế hoạch bài dạy bằng AI theo CV 5512 cấp THCS.
- Thực hành xây dựng ngân hàng câu hỏi định dạng mới 2026-2027.
- Thảo luận về chuẩn mực đạo đức và bảo mật dữ liệu học sinh khi ứng dụng công nghệ.

III. NGHỊ QUYẾT:
1. 100% giáo viên tích cực ứng dụng công cụ số vào bài giảng.
2. Xây dựng Kho tài nguyên số và Prompt sư phạm dùng chung của tổ.

      THƯ KÝ                                           TỔ TRƯỞNG
  Trần Thị Mai Lan                                    Lê Hoàng Nam`
  }
];
