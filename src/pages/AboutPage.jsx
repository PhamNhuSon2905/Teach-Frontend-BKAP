import React from "react";
import { useNavigate } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";
import {
  Users,
  GraduationCap,
  Presentation,
  TrendingUp,
  Lightbulb,
  Eye,
  Rocket,
  Star,
  Award,
  Mail,
  Linkedin,
  Github,
  Sparkles,
  ArrowRight,
} from "lucide-react";

// ========== CONSTANTS & DATA ==========
const STATS_DATA = [
  {
    icon: Users,
    label: "Thành viên",
    value: "1,500+",
    bgColor: "from-blue-500 to-indigo-500",
  },
  {
    icon: GraduationCap,
    label: "Giảng viên",
    value: "120+",
    bgColor: "from-orange-500 to-amber-500",
  },
  {
    icon: Presentation,
    label: "Slide chia sẻ",
    value: "800+",
    bgColor: "from-green-500 to-emerald-500",
  },
  {
    icon: TrendingUp,
    label: "Chủ đề",
    value: "30+",
    bgColor: "from-purple-500 to-pink-500",
  },
];

const FEATURES_DATA = [
  {
    icon: Lightbulb,
    title: "Sáng tạo không giới hạn",
    desc: "Chia sẻ và phát triển ý tưởng bài giảng độc đáo với cộng đồng",
    color: "text-orange-500",
    bgColor: "from-orange-50 to-amber-50",
  },
  {
    icon: TrendingUp,
    title: "Phát triển liên tục",
    desc: "Cập nhật kiến thức mới, công nghệ mới mỗi ngày",
    color: "text-green-500",
    bgColor: "from-green-50 to-emerald-50",
  },
  {
    icon: Eye,
    title: "Tầm nhìn xa",
    desc: "Xây dựng nền tảng tri thức bền vững cho thế hệ tương lai",
    color: "text-blue-500",
    bgColor: "from-blue-50 to-indigo-50",
  },
];

const TEAM_DATA = [
  {
    name: "Phạm Như Sơn",
    role: "Founder & Lead Developer",
    img: "",
    skills: ["React", "Node.js", "MongoDB"],
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    name: "Phạm Như Sơn",
    role: "UI/UX Designer",
    img: "",
    skills: ["Figma", "Adobe XD", "Design System"],
    gradient: "from-orange-500 to-amber-500",
  },
  {
    name: "Phạm Như Sơn",
    role: "Backend Engineer",
    img: "",
    skills: ["Java", "Spring Boot", "MySQL"],
    gradient: "from-green-500 to-emerald-500",
  },
];

const VALUES_DATA = [
  {
    icon: Star,
    title: "Chất lượng",
    desc: "Cam kết nội dung chất lượng cao",
    bgGradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Users,
    title: "Cộng đồng",
    desc: "Xây dựng môi trường học tập tích cực",
    bgGradient: "from-blue-500 to-indigo-500",
  },
  {
    icon: Award,
    title: "Chuyên nghiệp",
    desc: "Tiêu chuẩn giảng dạy quốc tế",
    bgGradient: "from-purple-500 to-pink-500",
  },
];

// ========== MAIN COMPONENT ==========
export default function AboutPage() {
  const navigate = useNavigate();
  useScrollToTop();
  
  const handleNavigation = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* HERO SECTION */}
      <div className="relative py-20 md:py-32 bg-gradient-to-br from-indigo-500 to-purple-700 text-white overflow-hidden" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-white opacity-10 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300 opacity-10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Về chúng tôi</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight">
              Aptech Slide Library
            </h1>
            
            <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed opacity-95">
              Nền tảng chia sẻ, học hỏi và sáng tạo bài giảng dành cho cộng đồng Aptech Việt
              Nam. Kết nối giảng viên, sinh viên và lan tỏa tri thức qua từng slide chất lượng.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <button
                onClick={() => handleNavigation("/contact")}
                className="px-8 py-4 border-2 border-white bg-white text-blue-600 font-bold rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                Liên hệ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="relative -mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS_DATA.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="text-center space-y-4">
                  <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${stat.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className={`text-5xl font-black bg-gradient-to-br ${stat.bgColor} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-semibold text-lg">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MISSION & VISION */}
      <div className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Mission"
                className="relative rounded-3xl shadow-2xl w-full h-[400px] lg:h-[500px] object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>

            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-sm font-bold mb-4">
                  <Lightbulb className="w-4 h-4" />
                  <span>Sứ mệnh & Tầm nhìn</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                  Kiến tạo tương lai giáo dục
                </h2>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 hover:shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Eye className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-600 mb-2">Tầm nhìn</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Trở thành nền tảng chia sẻ slide học thuật hàng đầu của cộng đồng
                      Aptech Việt Nam, nơi tri thức được lan tỏa và phát triển không ngừng.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl p-6 hover:shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Rocket className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-orange-600 mb-2">Sứ mệnh</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Kết nối giảng viên, sinh viên, lập trình viên để lan tỏa tri thức qua
                      từng bài giảng sáng tạo và chất lượng cao.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CORE VALUES */}
      <div className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-bold mb-4">
              <Star className="w-4 h-4" />
              <span>Giá trị cốt lõi</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Những gì chúng tôi tin tưởng
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUES_DATA.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="group bg-white border-2 border-gray-200 rounded-3xl p-8 text-center hover:border-purple-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                >
                  <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${value.bgGradient} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full text-sm font-bold mb-4">
              <Rocket className="w-4 h-4" />
              <span>Điểm nổi bật</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Tại sao chọn chúng tôi?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES_DATA.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-3xl p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                >
                  <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${feature.bgColor} border-2 border-gray-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-10 h-10 ${feature.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* TEAM SECTION */}
      <div className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-sm font-bold mb-4">
              <Users className="w-4 h-4" />
              <span>Đội ngũ</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Gặp gỡ đội ngũ phát triển
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Những con người đầy nhiệt huyết đang xây dựng nền tảng học tập tốt nhất cho cộng đồng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEAM_DATA.map((member, index) => (
              <div
                key={index}
                className="group bg-white border-2 border-gray-200 rounded-3xl p-8 text-center hover:border-purple-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className={`w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br ${member.gradient} p-1`}>
                  <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center border-4 border-white group-hover:scale-105 transition-transform">
                    <span className={`text-5xl font-black bg-gradient-to-br ${member.gradient} bg-clip-text text-transparent`}>
                      {member.name.charAt(0)}
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-gray-600 font-semibold mb-4">
                  {member.role}
                </p>

                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {member.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 bg-gradient-to-br ${member.gradient} bg-opacity-10 text-gray-700 rounded-lg text-xs font-bold`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex justify-center gap-3">
                  <button className={`w-10 h-10 rounded-xl bg-gradient-to-br ${member.gradient} bg-opacity-10 flex items-center justify-center hover:scale-110 transition-transform`}>
                    <Mail className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className={`w-10 h-10 rounded-xl bg-gradient-to-br ${member.gradient} bg-opacity-10 flex items-center justify-center hover:scale-110 transition-transform`}>
                    <Linkedin className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className={`w-10 h-10 rounded-xl bg-gradient-to-br ${member.gradient} bg-opacity-10 flex items-center justify-center hover:scale-110 transition-transform`}>
                    <Github className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <div className="py-20 md:py-32 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-white opacity-10 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300 opacity-10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Sẵn sàng bắt đầu hành trình học tập cùng chúng tôi?
          </h2>
          <p className="text-xl opacity-95 max-w-2xl mx-auto">
            Tham gia cộng đồng ngay hôm nay để khám phá tri thức và kết nối với hàng nghìn giáo viên
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button
              onClick={() => handleNavigation("/contact")}
              className="px-8 py-4 border-2 border-white bg-white text-blue-600 font-bold rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              Liên hệ với chúng tôi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}