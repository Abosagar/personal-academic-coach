import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from './AuthContext';
import { Course, Topic, CourseFile, StudySession } from '../types';
import { generateMockTopics, COURSE_COLORS } from '../utils/mockData';

interface CourseContextType {
  courses: Course[];
  sessions: StudySession[];
  loading: boolean;
  addCourse: (name: string, nameAr: string, syllabus?: File) => Promise<Course>;
  updateCourse: (courseId: string, updates: Partial<Course>) => Promise<void>;
  deleteCourse: (courseId: string) => Promise<void>;
  addFileToCoures: (courseId: string, file: File) => Promise<void>;
  removeFileFromCourse: (courseId: string, fileId: string) => Promise<void>;
  markTopicComplete: (courseId: string, topicId: string) => Promise<void>;
  addStudySession: (session: Omit<StudySession, 'id'>) => Promise<void>;
  getTotalStudyTime: () => number;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCourses([]);
      setSessions([]);
      setLoading(false);
      return;
    }

    const coursesQuery = query(
      collection(db, 'courses'),
      where('userId', '==', user.uid)
    );

    const unsubscribeCourses = onSnapshot(coursesQuery, (snapshot) => {
      const coursesData: Course[] = [];
      snapshot.forEach((doc) => {
        coursesData.push({ id: doc.id, ...doc.data() } as Course);
      });
      setCourses(coursesData);
      setLoading(false);
    });

    const sessionsQuery = query(
      collection(db, 'sessions'),
      where('userId', '==', user.uid)
    );

    const unsubscribeSessions = onSnapshot(sessionsQuery, (snapshot) => {
      const sessionsData: StudySession[] = [];
      snapshot.forEach((doc) => {
        sessionsData.push({ id: doc.id, ...doc.data() } as StudySession);
      });
      setSessions(sessionsData);
    });

    return () => {
      unsubscribeCourses();
      unsubscribeSessions();
    };
  }, [user]);

  const addCourse = async (name: string, nameAr: string, syllabus?: File): Promise<Course> => {
    if (!user) throw new Error('User not authenticated');

    const courseId = crypto.randomUUID();
    const colorIndex = courses.length % COURSE_COLORS.length;
    
    // Generate mock topics using AI simulation
    const topics = generateMockTopics(name);

    let syllabusFile: CourseFile | undefined;
    if (syllabus) {
      syllabusFile = {
        id: crypto.randomUUID(),
        name: syllabus.name,
        type: syllabus.type,
        size: syllabus.size,
        uploadedAt: new Date(),
      };
    }

    const newCourse: Course = {
      id: courseId,
      userId: user.uid,
      name,
      nameAr,
      color: COURSE_COLORS[colorIndex],
      topics,
      files: [],
      syllabus: syllabusFile,
      createdAt: new Date(),
      updatedAt: new Date(),
      totalStudyTime: 0,
    };

    await setDoc(doc(db, 'courses', courseId), newCourse);
    return newCourse;
  };

  const updateCourse = async (courseId: string, updates: Partial<Course>) => {
    await updateDoc(doc(db, 'courses', courseId), {
      ...updates,
      updatedAt: new Date(),
    });
  };

  const deleteCourse = async (courseId: string) => {
    await deleteDoc(doc(db, 'courses', courseId));
  };

  const addFileToCoures = async (courseId: string, file: File) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const newFile: CourseFile = {
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: new Date(),
    };

    await updateDoc(doc(db, 'courses', courseId), {
      files: [...course.files, newFile],
      updatedAt: new Date(),
    });
  };

  const removeFileFromCourse = async (courseId: string, fileId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    await updateDoc(doc(db, 'courses', courseId), {
      files: course.files.filter(f => f.id !== fileId),
      updatedAt: new Date(),
    });
  };

  const markTopicComplete = async (courseId: string, topicId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const updatedTopics = course.topics.map(t => 
      t.id === topicId ? { ...t, completed: true, completedAt: new Date() } : t
    );

    await updateDoc(doc(db, 'courses', courseId), {
      topics: updatedTopics,
      updatedAt: new Date(),
    });
  };

  const addStudySession = async (session: Omit<StudySession, 'id'>) => {
    if (!user) return;

    const sessionId = crypto.randomUUID();
    await setDoc(doc(db, 'sessions', sessionId), {
      ...session,
      id: sessionId,
      userId: user.uid,
    });

    // Update course total study time
    const course = courses.find(c => c.id === session.courseId);
    if (course) {
      await updateDoc(doc(db, 'courses', session.courseId), {
        totalStudyTime: course.totalStudyTime + session.duration,
        updatedAt: new Date(),
      });
    }
  };

  const getTotalStudyTime = () => {
    return courses.reduce((total, course) => total + course.totalStudyTime, 0);
  };

  return (
    <CourseContext.Provider value={{
      courses,
      sessions,
      loading,
      addCourse,
      updateCourse,
      deleteCourse,
      addFileToCoures,
      removeFileFromCourse,
      markTopicComplete,
      addStudySession,
      getTotalStudyTime,
    }}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourses() {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
}
