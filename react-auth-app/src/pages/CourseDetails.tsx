import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Typography, 
  List, 
  ListItem, 
  ListItemButton, 
  Checkbox, 
  useTheme
} from '@mui/joy';
import useMediaQuery from '@mui/material/useMediaQuery';
import YouTube from 'react-youtube';
import { useCourses } from '../hooks/useCourses';
import type { Course, Lecture } from '../types/course';

// Lecture data is now fetched from the API

// Sidebar component
const SidebarContent: React.FC<{ 
  course: Course; 
  currentLecture: Lecture; 
  onLectureSelect: (lecture: Lecture) => void 
}> = ({ course, currentLecture, onLectureSelect }) => (
  <Box sx={{ width: '100%', p: 2, overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
    <Typography level="h4" mb={2}>{course.title}</Typography>
    {course.modules.map((module) => (
      <Box key={module.id} mb={3}>
        <Typography level="title-sm" mb={1}>{module.title}</Typography>
        <List size="sm">
          {module.lectures.map((lecture) => (
            <ListItem key={lecture.id}>
              <ListItemButton
                selected={lecture.id === currentLecture.id}
                onClick={() => onLectureSelect(lecture)}
                sx={{
                  borderRadius: 'sm',
                  '&.Mui-selected': {
                    bgcolor: 'var(--joy-palette-primary-50)',
                    '&:hover': {
                      bgcolor: 'var(--joy-palette-primary-100)',
                    },
                  },
                }}
              >
                <Checkbox
                  checked={lecture.completed}
                  readOnly
                  size="sm"
                  sx={{ mr: 1 }}
                />
                <Typography level="body-sm">{lecture.title}</Typography>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    ))}
  </Box>
);

interface MainContentProps {
  onBack: () => void;
  course: Course;
  currentLecture: Lecture;
  onCompleteAndContinue: () => void;
  onLectureSelect: (lecture: Lecture) => void;
}

// Main content component
const MainContent: React.FC<MainContentProps> = ({ 
  onBack, 
  course, 
  currentLecture, 
  onCompleteAndContinue,
  // onLectureSelect is not used in this component but required by the interface
  onLectureSelect: _onLectureSelect 
}) => {
  return (
    <Box sx={{ 
      width: '100%',
      height: '100%',
      bgcolor: 'background.body',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Button 
        variant="outlined" 
        color="neutral" 
        onClick={onBack}
        sx={{ mb: 3 }}
      >
        ← Back to Courses
      </Button>

      <Typography level="h4" sx={{ mb: 3, fontWeight: 'lg' }}>
        Live Lecture - Intro to programming in Python
      </Typography>

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          maxWidth: 'none',
          borderRadius: 0,
          overflow: 'hidden',
          bgcolor: 'background.surface',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          '& .video-container': {
            flex: 1,
            position: 'relative',
            width: '100%',
            height: '100%',
            '& iframe': {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none'
            }
          }
        }}
      >
        <Box className="video-container">
          <YouTube
            videoId={currentLecture.videoId}
            opts={{
              width: '100%',
              height: '100%',
              playerVars: {
                autoplay: 0,
                modestbranding: 1,
                controls: 1,
                rel: 0,
                showinfo: 0
              },
            }}
          />
          
          {/* Overlay text */}
          <Box sx={{ 
            position: 'absolute', 
            top: 20, 
            left: 20,
            color: 'common.white',
            textShadow: '0 1px 2px rgba(0,0,0,0.7)',
          }}>
            <Typography level="h3" sx={{ fontWeight: 'xl', fontSize: '2rem', lineHeight: 1.2 }}>
              SESSION 01 - Code Sphere
            </Typography>
            <Typography level="h4" sx={{ color: 'danger.500', fontWeight: 'lg', fontSize: '1.5rem', mt: 0.5 }}>
              Friday @6pm
            </Typography>
            <Typography level="body-md" sx={{ fontSize: '1.1rem', mt: 0.5 }}>
              Intro To Python
            </Typography>
          </Box>
        </Box>

        {/* Video Controls */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          p: 2,
          gap: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.surface',
          '& > *': {
            flex: 1,
            maxWidth: 'calc(50% - 8px)'
          }
        }}>
          <Button 
            variant="outlined" 
            color="neutral" 
            startDecorator={'←'}
            fullWidth
            disabled={!course.modules[0]?.lectures[0]?.id}
          >
            Previous Lesson
          </Button>
          <Button 
            variant="solid" 
            color={currentLecture.completed ? 'success' : 'danger'} 
            endDecorator={currentLecture.completed ? '✓' : '→'}
            fullWidth
            onClick={onCompleteAndContinue}
          >
            {currentLecture.completed ? 'Completed' : 'Complete and Continue'}
          </Button>
        </Box>
      </Box>

      {/* Download Section */}
      <Box sx={{ 
        maxWidth: '1000px', 
        mx: 'auto',
        textAlign: 'center',
        mt: 6,
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 'md',
        bgcolor: 'background.surface',
      }}>
        <Typography level="body-sm" sx={{ color: 'text.secondary', mb: 1 }}>
          Download
        </Typography>
        <Button variant="plain" color="primary" size="sm">
          Download Lecture Materials
        </Button>
      </Box>
    </Box>
  );
};

// Main CourseDetails component
interface CourseDetailsProps {
  courseId: string;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ courseId }) => {
  const theme = useTheme();
  // isMobile is used in the JSX below for responsive layout
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { fetchCourseById, updateLectureStatus } = useCourses();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);

  // Load course data
  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      const data = await fetchCourseById(courseId);
      if (data) {
        setCourse(data);
        // Set the first lecture as current by default
        const firstLecture = data.modules[0]?.lectures[0];
        if (firstLecture) {
          setCurrentLecture(firstLecture);
        }
      }
      setLoading(false);
    };
    loadCourse();
  }, [courseId, fetchCourseById]);

  const handleBackToCourses = () => {
    navigate('/dashboard');
  };

  const handleCompleteAndContinue = async () => {
    if (!currentLecture || !course) return;
    
    const success = await updateLectureStatus(
      course.id,
      currentLecture.id,
      !currentLecture.completed
    );
    
    if (success) {
      // Refresh course data to get updated progress
      const updatedCourse = await fetchCourseById(courseId);
      if (updatedCourse) {
        setCourse(updatedCourse);
        // Update current lecture status
        const updatedLecture = updatedCourse.modules
          .flatMap(m => m.lectures)
          .find(l => l.id === currentLecture.id);
        if (updatedLecture) {
          setCurrentLecture(updatedLecture);
        }
      }
    }
  };

  const handleLectureSelect = (lecture: Lecture) => {
    setCurrentLecture(lecture);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row', 
      height: '100vh',
      width: '100vw',
      bgcolor: 'background.level1',
      overflow: 'hidden',
    }}>
      {/* Sidebar for desktop */}
      {!isMobile && (
        <Box sx={{ 
          width: 300, 
          height: '100%', 
          overflowY: 'auto',
          borderRight: '1px solid',
          borderColor: 'divider',
          flexShrink: 0
        }}>
          {course && currentLecture && (
            <SidebarContent 
              course={course} 
              currentLecture={currentLecture} 
              onLectureSelect={handleLectureSelect} 
            />
          )}
        </Box>
      )}
      
      {/* Main content area */}
      <Box sx={{ 
        flex: 1,
        position: 'relative',
        height: '100%',
        overflow: 'hidden',
      }}>
        {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          {/* <CircularProgress /> */}
        </Box>
      ) : course && currentLecture ? (
        <MainContent 
          onBack={handleBackToCourses}
          course={course}
          currentLecture={currentLecture}
          onCompleteAndContinue={handleCompleteAndContinue}
          onLectureSelect={handleLectureSelect}
        />
      ) : (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography level="h4">Course not found</Typography>
        </Box>
      )}
      </Box>
      
      {/* Sidebar for mobile */}
      {isMobile && course && currentLecture && (
        <Box sx={{ 
          width: '100%',
          maxHeight: '40vh',
          overflowY: 'auto',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}>
          <SidebarContent 
            course={course} 
            currentLecture={currentLecture} 
            onLectureSelect={handleLectureSelect} 
          />
        </Box>
      )}
    </Box>
  );
};

export default CourseDetails;
