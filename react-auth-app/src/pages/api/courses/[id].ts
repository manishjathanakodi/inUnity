import { NextApiRequest, NextApiResponse } from 'next';
import { getCourseById, updateLectureCompletion } from '../../../../data/courses';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const course = getCourseById(id as string);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch course' });
    }
  } else if (req.method === 'PATCH') {
    try {
      const { lectureId, completed } = req.body;
      if (!lectureId || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const success = updateLectureCompletion(id as string, lectureId, completed);
      if (!success) {
        return res.status(404).json({ message: 'Course or lecture not found' });
      }

      const updatedCourse = getCourseById(id as string);
      res.status(200).json({
        success: true,
        progress: updatedCourse?.progress,
        lectureId,
        completed
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update lecture status' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PATCH']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
