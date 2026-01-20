import React, { useState, useEffect, useCallback } from 'react';
import { useCourses } from '../contexts/CourseContext';
import { Topic, GlossaryTerm, CriticalThinkingQuestion } from '../types';
import { 
  ArrowRight, 
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  Languages,
  Brain,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  X
} from 'lucide-react';
import { 
  generateStudyContent, 
  getGlossaryTerms, 
  getCriticalThinkingQuestions 
} from '../utils/mockData';

interface StudySessionPageProps {
  courseId: string;
  topicId?: string;
  onNavigate: (page: string, courseId?: string) => void;
}

export default function StudySessionPage({ courseId, topicId, onNavigate }: StudySessionPageProps) {
  const { courses, markTopicComplete, addStudySession } = useCourses();
  
  const course = courses.find(c => c.id === courseId);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  
  // Timer state (30 minutes = 1800 seconds)
  const [timeRemaining, setTimeRemaining] = useState(30 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  
  // UI state
  const [showGlossary, setShowGlossary] = useState(false);
  const [showCriticalThinking, setShowCriticalThinking] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  
  // Content
  const [studyContent, setStudyContent] = useState('');
  const [glossaryTerms, setGlossaryTerms] = useState<GlossaryTerm[]>([]);
  const [criticalQuestions, setCriticalQuestions] = useState<CriticalThinkingQuestion[]>([]);

  // Initialize topic and content
  useEffect(() => {
    if (course) {
      let topic: Topic | undefined;
      
      if (topicId) {
        topic = course.topics.find(t => t.id === topicId);
      }
      
      if (!topic) {
        topic = course.topics.find(t => !t.completed);
      }
      
      if (topic) {
        setSelectedTopic(topic);
        setStudyContent(generateStudyContent(topic, course.name));
        setGlossaryTerms(getGlossaryTerms(course.name));
        setCriticalQuestions(getCriticalThinkingQuestions(topic));
      }
    }
  }, [course, topicId]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isRunning) {
      setIsRunning(false);
      handleSessionComplete();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeRemaining]);

  const startSession = () => {
    setSessionStarted(true);
    setIsRunning(true);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setTimeRemaining(30 * 60);
    setIsRunning(false);
  };

  const handleSessionComplete = useCallback(async () => {
    if (!selectedTopic || !course) return;
    
    const duration = 30 - Math.floor(timeRemaining / 60);
    
    await addStudySession({
      courseId: course.id,
      topicId: selectedTopic.id,
      startedAt: new Date(Date.now() - duration * 60 * 1000),
      endedAt: new Date(),
      duration,
      completed: true,
    });
    
    setSessionCompleted(true);
  }, [selectedTopic, course, timeRemaining, addStudySession]);

  const handleMarkComplete = async () => {
    if (!selectedTopic || !course) return;
    
    await markTopicComplete(course.id, selectedTopic.id);
    
    if (!sessionCompleted) {
      await handleSessionComplete();
    }
    
    onNavigate('course', courseId);
  };

  const formatTimerDisplay = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!course || !selectedTopic) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">لم يتم العثور على الموضوع</p>
        <button
          onClick={() => onNavigate('dashboard')}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          العودة للوحة التحكم
        </button>
      </div>
    );
  }

  // Pre-session screen
  if (!sessionStarted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-12">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: course.color + '20' }}
          >
            <BookOpen className="w-10 h-10" style={{ color: course.color }} />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            جلسة دراسة جديدة
          </h1>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6 text-right">
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: course.color }}
              />
              <span className="text-gray-600">{course.nameAr}</span>
            </div>
            
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {selectedTopic.nameAr}
            </h2>
            <p className="text-gray-500 content-en">{selectedTopic.name}</p>
            
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {selectedTopic.estimatedMinutes} دقيقة تقديرية
              </span>
              {selectedTopic.priority === 'high' && (
                <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full">
                  أولوية عالية
                </span>
              )}
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl text-sm text-blue-700">
            <p>مدة الجلسة: <strong>30 دقيقة</strong></p>
            <p className="mt-1">المحتوى التعليمي سيكون باللغة الإنجليزية بأسلوب تنفيذي</p>
          </div>

          <button
            onClick={startSession}
            className="mt-8 px-8 py-4 rounded-xl text-white font-medium flex items-center gap-3 mx-auto transition hover:opacity-90"
            style={{ backgroundColor: course.color }}
          >
            <Play className="w-6 h-6" />
            ابدأ الجلسة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => onNavigate('course', courseId)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowRight className="w-5 h-5" />
          <span>العودة للمادة</span>
        </button>
        
        {/* Timer */}
        <div className="flex items-center gap-3">
          <div 
            className={`text-3xl font-mono font-bold ${
              timeRemaining < 300 ? 'text-red-600' : 'text-gray-800'
            }`}
          >
            {formatTimerDisplay(timeRemaining)}
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTimer}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              {isRunning ? (
                <Pause className="w-5 h-5 text-gray-700" />
              ) : (
                <Play className="w-5 h-5 text-gray-700" />
              )}
            </button>
            <button
              onClick={resetTimer}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              <RotateCcw className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Topic Header */}
      <div 
        className="rounded-xl p-4 mb-6 text-white"
        style={{ backgroundColor: course.color }}
      >
        <p className="text-white/80 text-sm mb-1">{course.nameAr}</p>
        <h1 className="text-xl font-bold">{selectedTopic.nameAr}</h1>
        <p className="text-white/80 content-en">{selectedTopic.name}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setShowGlossary(!showGlossary)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            showGlossary 
              ? 'bg-purple-600 text-white' 
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Languages className="w-5 h-5" />
          قاموس المصطلحات
        </button>
        <button
          onClick={() => setShowCriticalThinking(!showCriticalThinking)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            showCriticalThinking 
              ? 'bg-amber-600 text-white' 
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Brain className="w-5 h-5" />
          التفكير النقدي
        </button>
      </div>

      {/* Glossary Panel */}
      {showGlossary && (
        <GlossaryPanel 
          terms={glossaryTerms} 
          onClose={() => setShowGlossary(false)} 
        />
      )}

      {/* Critical Thinking Panel */}
      {showCriticalThinking && (
        <CriticalThinkingPanel 
          questions={criticalQuestions} 
          onClose={() => setShowCriticalThinking(false)} 
        />
      )}

      {/* Study Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="prose prose-lg max-w-none content-en" dir="ltr">
          <div dangerouslySetInnerHTML={{ __html: formatMarkdown(studyContent) }} />
        </div>
      </div>

      {/* Complete Button */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          هل أكملت دراسة هذا الموضوع؟
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          تأكد من فهمك للمفاهيم الرئيسية قبل الانتقال للموضوع التالي
        </p>
        <button
          onClick={handleMarkComplete}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium flex items-center gap-2 mx-auto transition"
        >
          <CheckCircle className="w-5 h-5" />
          تم - انتقل للموضوع التالي
        </button>
      </div>
    </div>
  );
}

// Glossary Panel Component
function GlossaryPanel({ terms, onClose }: { terms: GlossaryTerm[]; onClose: () => void }) {
  return (
    <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-purple-800 flex items-center gap-2">
          <Languages className="w-5 h-5" />
          قاموس المصطلحات
        </h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-purple-100 rounded transition"
        >
          <X className="w-5 h-5 text-purple-600" />
        </button>
      </div>
      
      <div className="grid gap-3 md:grid-cols-2">
        {terms.map((term, index) => (
          <div key={index} className="bg-white rounded-lg p-3 border border-purple-100">
            <div className="font-medium text-gray-800 content-en" dir="ltr">
              {term.term}
            </div>
            <div className="text-sm text-purple-700 font-medium mt-1">
              {term.arabic}
            </div>
            <div className="text-sm text-gray-500 mt-1 content-en" dir="ltr">
              {term.definition}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Critical Thinking Panel Component
function CriticalThinkingPanel({ questions, onClose }: { 
  questions: CriticalThinkingQuestion[]; 
  onClose: () => void 
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-amber-800 flex items-center gap-2">
          <Brain className="w-5 h-5" />
          أسئلة التفكير النقدي
        </h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-amber-100 rounded transition"
        >
          <X className="w-5 h-5 text-amber-600" />
        </button>
      </div>
      
      <div className="space-y-3">
        {questions.map((q) => (
          <div key={q.id} className="bg-white rounded-lg border border-amber-100">
            <button
              onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
              className="w-full p-4 text-right flex items-center justify-between"
            >
              <span className="font-medium text-gray-800 content-en text-left" dir="ltr">
                {q.question}
              </span>
              {expandedId === q.id ? (
                <ChevronUp className="w-5 h-5 text-amber-600 flex-shrink-0 mr-3" />
              ) : (
                <ChevronDown className="w-5 h-5 text-amber-600 flex-shrink-0 mr-3" />
              )}
            </button>
            
            {expandedId === q.id && q.hints && (
              <div className="px-4 pb-4 border-t border-amber-100 pt-3">
                <p className="text-sm text-amber-700 mb-2">تلميحات:</p>
                <ul className="text-sm text-gray-600 space-y-1 content-en" dir="ltr">
                  {q.hints.map((hint, i) => (
                    <li key={i}>• {hint}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Simple markdown formatter
function formatMarkdown(text: string): string {
  return text
    .replace(/## (.*)/g, '<h2 class="text-2xl font-bold text-gray-800 mt-6 mb-4">$1</h2>')
    .replace(/### (.*)/g, '<h3 class="text-xl font-bold text-gray-700 mt-5 mb-3">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/- (.*)/g, '<li class="ml-4">$1</li>')
    .replace(/(\d+)\. (.*)/g, '<li class="ml-4">$2</li>')
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/\n/g, '<br>');
}
