import React, { useState, useRef } from 'react';
import { useCourses } from '../contexts/CourseContext';
import { Course } from '../types';
import { 
  ArrowRight, 
  Play,
  CheckCircle,
  Circle,
  Clock,
  AlertTriangle,
  Upload,
  FileText,
  Trash2,
  Calendar,
  MoreVertical
} from 'lucide-react';
import { formatTime } from '../utils/mockData';

interface CourseDetailsPageProps {
  courseId: string;
  onNavigate: (page: string, courseId?: string, topicId?: string) => void;
}

export default function CourseDetailsPage({ courseId, onNavigate }: CourseDetailsPageProps) {
  const { courses, markTopicComplete, addFileToCoures, removeFileFromCourse, deleteCourse } = useCourses();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'topics' | 'files'>('topics');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const course = courses.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">لم يتم العثور على المادة</p>
      </div>
    );
  }

  const completedTopics = course.topics.filter(t => t.completed).length;
  const progress = course.topics.length > 0 
    ? (completedTopics / course.topics.length) * 100 
    : 0;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await addFileToCoures(courseId, e.target.files[0]);
    }
  };

  const handleDelete = async () => {
    await deleteCourse(courseId);
    onNavigate('dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => onNavigate('dashboard')}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowRight className="w-6 h-6 text-gray-600" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: course.color }}
            >
              {course.nameAr.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{course.nameAr}</h1>
              <p className="text-gray-500 content-en">{course.name}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">التقدم الكلي</h3>
          <span className="text-2xl font-bold" style={{ color: course.color }}>
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: course.color }}
          />
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{completedTopics} من {course.topics.length} مواضيع مكتملة</span>
          <span>إجمالي الدراسة: {formatTime(course.totalStudyTime)}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('topics')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            activeTab === 'topics' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          المواضيع ({course.topics.length})
        </button>
        <button
          onClick={() => setActiveTab('files')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            activeTab === 'files' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          الملفات ({course.files.length + (course.syllabus ? 1 : 0)})
        </button>
      </div>

      {/* Topics Tab */}
      {activeTab === 'topics' && (
        <div className="space-y-3">
          {course.topics.map((topic) => (
            <div
              key={topic.id}
              className={`bg-white rounded-xl border p-4 transition ${
                topic.completed 
                  ? 'border-green-200 bg-green-50/50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => !topic.completed && markTopicComplete(courseId, topic.id)}
                  className={`flex-shrink-0 ${topic.completed ? 'text-green-600' : 'text-gray-300 hover:text-gray-400'}`}
                >
                  {topic.completed ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-medium ${topic.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                      {topic.nameAr}
                    </h4>
                    {topic.priority === 'high' && !topic.completed && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        أولوية عالية
                      </span>
                    )}
                  </div>
                  <p className={`text-sm content-en ${topic.completed ? 'text-gray-400' : 'text-gray-500'}`}>
                    {topic.name}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-left">
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{topic.estimatedMinutes} د</span>
                    </div>
                  </div>
                  
                  {!topic.completed && (
                    <button
                      onClick={() => onNavigate('study', courseId, topic.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition"
                      style={{ backgroundColor: course.color }}
                    >
                      <Play className="w-4 h-4" />
                      <span>ادرس</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Files Tab */}
      {activeTab === 'files' && (
        <div className="space-y-4">
          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition"
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">اضغط لرفع ملف جديد</p>
            <p className="text-sm text-gray-400">ملخصات، أسئلة، ملاحظات...</p>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Syllabus */}
          {course.syllabus && (
            <FileItem
              file={course.syllabus}
              isSyllabus
              onDelete={() => {}}
            />
          )}

          {/* Other Files */}
          {course.files.map((file) => (
            <FileItem
              key={file.id}
              file={file}
              onDelete={() => removeFileFromCourse(courseId, file.id)}
            />
          ))}

          {!course.syllabus && course.files.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              لا توجد ملفات مرفوعة
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-2">حذف المادة</h3>
            <p className="text-gray-600 mb-6">
              هل أنت متأكد من حذف "{course.nameAr}"؟ سيتم حذف جميع المواضيع والملفات المرتبطة.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                إلغاء
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface FileItemProps {
  file: { id: string; name: string; type: string; size: number; uploadedAt: Date };
  isSyllabus?: boolean;
  onDelete: () => void;
}

function FileItem({ file, isSyllabus, onDelete }: FileItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const uploadDate = new Date(file.uploadedAt);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
        isSyllabus ? 'bg-blue-100' : 'bg-gray-100'
      }`}>
        <FileText className={`w-6 h-6 ${isSyllabus ? 'text-blue-600' : 'text-gray-600'}`} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-gray-800 truncate">{file.name}</h4>
          {isSyllabus && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
              المنهج
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
          <span>{(file.size / 1024).toFixed(1)} KB</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {uploadDate.toLocaleDateString('ar-SA')}
          </span>
        </div>
      </div>

      {!isSyllabus && (
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
          
          {showMenu && (
            <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
              <button
                onClick={() => {
                  onDelete();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-right text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                حذف
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
