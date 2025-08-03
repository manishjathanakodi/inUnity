import { Course } from '../types/course';

export const coursesData: Course[] = [
  {
    id: '1',
    title: '100x Engineers Generative-AI Wizardry',
    description: 'Master Generative AI with hands-on projects and real-world applications',
    instructor: '100xEngineers',
    thumbnail: 'https://via.placeholder.com/300x200',
    duration: '12 weeks',
    progress: 43,
    nextSession: {
      date: '2023-08-10',
      time: '18:00',
      title: 'Live Lecture - Advanced AI Concepts'
    },
    modules: [
      {
        id: 'm1',
        title: 'Week 1 - Introduction to Python',
        description: 'Get started with Python programming',
        order: 1,
        lectures: [
          {
            id: 'l1',
            title: 'Intro to programming in Python',
            duration: '109:39',
            videoId: 'dQw4w9WgXcQ',
            completed: true,
            type: 'lecture',
            description: 'Learn the basics of Python programming language',
            materials: ['slides.pdf', 'exercise1.py']
          },
          {
            id: 'l2',
            title: 'Assignment 1 - Big Binary',
            duration: '60:00',
            videoId: '',
            completed: false,
            type: 'assignment',
            description: 'Complete the binary number conversion exercise'
          }
        ]
      },
      {
        id: 'm2',
        title: 'Week 2 - Web Development Basics',
        description: 'Introduction to full stack web development',
        order: 2,
        lectures: [
          {
            id: 'l3',
            title: 'Full Stack Web Apps - Part 1',
            duration: '131:12',
            videoId: 'dQw4w9WgXcQ',
            completed: false,
            type: 'lecture',
            description: 'Understanding the basics of web applications'
          },
          {
            id: 'l4',
            title: 'Full Stack Web Apps - Part 2',
            duration: '120:00',
            videoId: 'dQw4w9WgXcQ',
            completed: false,
            type: 'lecture',
            description: 'Advanced web development concepts'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: '100x Engineers Generative-AI Wizardry Cohort 2',
    description: 'Second cohort of the popular Generative AI course',
    instructor: '100xEngineers',
    thumbnail: 'https://via.placeholder.com/300x200',
    duration: '12 weeks',
    progress: 0,
    modules: []
  }
];

// In-memory store for demonstration
let courseProgress = new Map<string, Set<string>>();

export const updateLectureCompletion = (courseId: string, lectureId: string, completed: boolean): boolean => {
  if (!courseProgress.has(courseId)) {
    courseProgress.set(courseId, new Set());
  }
  
  const lectures = courseProgress.get(courseId)!;
  
  if (completed) {
    lectures.add(lectureId);
  } else {
    lectures.delete(lectureId);
  }
  
  // Update the course progress
  const course = coursesData.find(c => c.id === courseId);
  if (course) {
    const totalLectures = course.modules.reduce((sum, module) => sum + module.lectures.length, 0);
    const completedLectures = course.modules.reduce((sum, module) => {
      return sum + module.lectures.filter(lecture => lectures.has(lecture.id)).length;
    }, 0);
    
    course.progress = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;
  }
  
  return completed;
};

export const getCourseById = (id: string) => {
  const course = coursesData.find(course => course.id === id);
  if (!course) return null;
  
  // Create a deep copy to avoid mutating the original data
  return JSON.parse(JSON.stringify(course));
};

export const getAllCourses = () => {
  return coursesData.map(course => ({
    id: course.id,
    title: course.title,
    description: course.description,
    instructor: course.instructor,
    thumbnail: course.thumbnail,
    duration: course.duration,
    progress: course.progress,
    nextSession: course.nextSession
  }));
};
