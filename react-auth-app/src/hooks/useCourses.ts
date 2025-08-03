import { useState, useEffect, useCallback } from 'react';
import type { Course } from '../types/course';

const API_BASE_URL = '/api/courses';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all courses (for dashboard)
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single course by ID (for course details)
  const fetchCourseById = useCallback(async (id: string): Promise<Course | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) {
        throw new Error('Course not found');
      }
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update lecture completion status
  const updateLectureStatus = useCallback(
    async (courseId: string, lectureId: string, completed: boolean): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/${courseId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ lectureId, completed }),
        });

        if (!response.ok) {
          throw new Error('Failed to update lecture status');
        }

        // Update local state
        const result = await response.json();
        if (result.success) {
          setCourses(prevCourses =>
            prevCourses.map(course =>
              course.id === courseId
                ? { ...course, progress: result.progress }
                : course
            )
          );
          return true;
        }
        return false;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Initial fetch
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    loading,
    error,
    fetchCourseById,
    updateLectureStatus,
    refreshCourses: fetchCourses,
  };
};

export default useCourses;
