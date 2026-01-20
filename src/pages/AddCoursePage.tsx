import React, { useState } from 'react';
import { useCourses } from '../contexts/CourseContext';
import { 
  ArrowRight, 
  Upload, 
  BookOpen, 
  Sparkles,
  CheckCircle,
  Loader2
} from 'lucide-react';

interface AddCoursePageProps {
  onNavigate: (page: string) => void;
}

export default function AddCoursePage({ onNavigate }: AddCoursePageProps) {
  const { addCourse } = useCourses();
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [syllabus, setSyllabus] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSyllabus(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !nameAr) return;

    setSubmitting(true);
    setAnalyzing(true);

    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAnalyzing(false);

    try {
      await addCourse(name, nameAr, syllabus || undefined);
      setSuccess(true);
      
      // Navigate after showing success
      setTimeout(() => {
        onNavigate('dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error adding course:', error);
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">تمت إضافة المادة بنجاح!</h2>
          <p className="text-gray-600">تم تحليل المحتوى وإنشاء خطة الدراسة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => onNavigate('dashboard')}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowRight className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إضافة مادة جديدة</h1>
          <p className="text-gray-600">أضف معلومات المادة وسيقوم الذكاء الاصطناعي بتحليلها</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          {/* Course Name (English) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم المادة بالإنجليزية
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition content-en"
              placeholder="e.g., Marketing, Accounting, Finance"
              required
              dir="ltr"
            />
            <p className="text-xs text-gray-500 mt-1">سيستخدم لتوليد المواضيع تلقائياً</p>
          </div>

          {/* Course Name (Arabic) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم المادة بالعربية
            </label>
            <input
              type="text"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="مثال: التسويق، المحاسبة، التمويل"
              required
            />
          </div>

          {/* Syllabus Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ملف المنهج (اختياري)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition cursor-pointer"
              onClick={() => document.getElementById('syllabus-input')?.click()}
            >
              <input
                id="syllabus-input"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx"
              />
              {syllabus ? (
                <div className="flex items-center justify-center gap-3">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                  <div className="text-right">
                    <p className="font-medium text-gray-800">{syllabus.name}</p>
                    <p className="text-sm text-gray-500">
                      {(syllabus.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">اضغط لرفع ملف المنهج</p>
                  <p className="text-sm text-gray-400">PDF, DOC, DOCX</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* AI Analysis Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-800 mb-1">تحليل ذكي للمحتوى</h3>
              <p className="text-sm text-blue-700">
                عند إضافة المادة، سيقوم النظام تلقائياً بـ:
              </p>
              <ul className="text-sm text-blue-600 mt-2 space-y-1">
                <li>• تحليل اسم المادة لتحديد المواضيع الرئيسية</li>
                <li>• تحديد أولوية كل موضوع (عالية / منخفضة)</li>
                <li>• تقدير الوقت اللازم لدراسة كل موضوع</li>
                <li>• إنشاء خطة دراسة مخصصة</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || !name || !nameAr}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {analyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              جاري تحليل المحتوى بالذكاء الاصطناعي...
            </>
          ) : submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              جاري الإضافة...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              إضافة المادة وتحليلها
            </>
          )}
        </button>
      </form>
    </div>
  );
}
