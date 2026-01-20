import React from 'react';
import { useCourses } from '../contexts/CourseContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Target,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { calculateExpectedGPA, getDailyFocus, formatTime } from '../utils/mockData';

interface DashboardProps {
  onNavigate: (page: string, courseId?: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { courses, getTotalStudyTime, loading } = useCourses();
  const { user } = useAuth();
  
  const totalStudyTime = getTotalStudyTime();
  const expectedGPA = calculateExpectedGPA(courses);
  const dailyFocus = getDailyFocus(courses);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-l from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          مرحباً، {user?.displayName || 'طالب'}!
        </h1>
        <p className="text-blue-100">استمر في التعلم وحقق أهدافك الأكاديمية</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<BookOpen className="w-6 h-6" />}
          label="المواد الدراسية"
          value={courses.length.toString()}
          color="blue"
        />
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          label="وقت الدراسة"
          value={formatTime(totalStudyTime)}
          color="green"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="المعدل المتوقع"
          value={expectedGPA.toFixed(2)}
          color="purple"
        />
        <StatCard
          icon={<Target className="w-6 h-6" />}
          label="المواضيع المكتملة"
          value={`${courses.reduce((acc, c) => acc + c.topics.filter(t => t.completed).length, 0)}/${courses.reduce((acc, c) => acc + c.topics.length, 0)}`}
          color="amber"
        />
      </div>

      {/* Daily Focus */}
      {dailyFocus && (
        <div className="bg-gradient-to-l from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Sparkles className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1">التركيز اليومي المقترح</h3>
              <p className="text-gray-600 text-sm mb-3">
                بناءً على أولوياتك، ننصح بدراسة:
              </p>
              <div 
                className="flex items-center justify-between bg-white rounded-lg p-3 border cursor-pointer hover:border-amber-400 transition"
                onClick={() => onNavigate('study', dailyFocus.course.id)}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: dailyFocus.course.color }}
                  />
                  <div>
                    <p className="font-medium text-gray-800">{dailyFocus.topic.nameAr}</p>
                    <p className="text-sm text-gray-500">{dailyFocus.course.nameAr}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-amber-600">
                  <span className="text-sm">ابدأ الآن</span>
                  <ChevronLeft className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Courses Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">موادي الدراسية</h2>
          <button
            onClick={() => onNavigate('add-course')}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
          >
            إضافة مادة
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {courses.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-700 mb-1">لا توجد مواد بعد</h3>
            <p className="text-gray-500 text-sm mb-4">أضف موادك الدراسية للبدء في رحلة التعلم</p>
            <button
              onClick={() => onNavigate('add-course')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
              إضافة مادة جديدة
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {courses.map((course) => {
              const completedTopics = course.topics.filter(t => t.completed).length;
              const progress = course.topics.length > 0 
                ? (completedTopics / course.topics.length) * 100 
                : 0;

              return (
                <div
                  key={course.id}
                  onClick={() => onNavigate('course', course.id)}
                  className="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:shadow-md hover:border-gray-300 transition group"
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold"
                      style={{ backgroundColor: course.color }}
                    >
                      {course.nameAr.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 mb-1 truncate">
                        {course.nameAr}
                      </h3>
                      <p className="text-sm text-gray-500 truncate content-en">
                        {course.name}
                      </p>
                    </div>
                    <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition" />
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">التقدم</span>
                      <span className="font-medium text-gray-800">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${progress}%`,
                          backgroundColor: course.color 
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                      <span>{completedTopics} من {course.topics.length} مواضيع</span>
                      <span>{formatTime(course.totalStudyTime)} دراسة</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'blue' | 'green' | 'purple' | 'amber';
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
