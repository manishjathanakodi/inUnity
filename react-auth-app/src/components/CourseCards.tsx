import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy/styles';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  CircularProgress, 
  Avatar, 
  AvatarGroup, 
  CardActions,
  IconButton
} from '@mui/joy';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import { useCourses } from '../hooks/useCourses';
import type { Course } from '../types/course';

// Extend the Course type with UI-specific properties
interface CourseWithUI extends Course {
  author: string;
  nextLesson?: string;
  members?: Array<{ name: string; avatar: string }>;
  description: string;
  showProgress?: boolean;
}

interface CourseCardsProps {
  onCourseSelect?: (courseId: string) => void;
}

const CourseCards: React.FC<CourseCardsProps> = ({ onCourseSelect }) => {
  const { courses: apiCourses, loading, error } = useCourses();
  const navigate = useNavigate();

  // Transform API data to include UI-specific properties
  const courses: CourseWithUI[] = React.useMemo(() => {
    if (!apiCourses) return [];
    
    return apiCourses.map(course => ({
      ...course,
      author: '100xEngineers',
      description: course.description || 'Learn the latest in technology with hands-on projects.',
      nextLesson: course.modules?.[0]?.lectures?.[0]?.title || 'Introduction',
      members: [
        { name: 'Alex Johnson', avatar: '/static/images/avatar/1.jpg' },
        { name: 'Maria Garcia', avatar: '/static/images/avatar/2.jpg' },
      ],
      showProgress: true,
    }));
  }, [apiCourses]);

  React.useEffect(() => {
    if (error) {
      console.error('Error loading courses:', error);
    }
  }, [error]);

  const handleViewCourse = (courseId: string) => {
    if (onCourseSelect) {
      onCourseSelect(courseId);
    } else {
      navigate(`/courses/${courseId}`);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: 'center', color: 'danger.500' }}>
        Error loading courses. Please try again later.
      </Box>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        No courses available.
      </Box>
    );
  }

  return (
    <CssVarsProvider>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, p: 3 }}>
        {courses.map((course) => (
          <Card
            key={course.id}
            variant="outlined"
            sx={{
              width: 320,
              display: 'flex',
              flexDirection: 'column',
              '&:hover': {
                boxShadow: 'md',
                borderColor: 'neutral.outlinedHoverBorder',
              },
            }}
          >
            {/* Course Header with Logo */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: 'neutral.900',
                color: 'common.white',
                height: 120,
                mb: 2,
              }}
            >
              <Typography level="h2" sx={{ fontSize: '3rem', fontWeight: 'xl', lineHeight: 1 }}>
                100<Typography sx={{ color: 'danger.500', display: 'inline' }}>x</Typography>
              </Typography>
            </Box>

            <CardContent sx={{ flexGrow: 1 }}>
              <Typography level="title-lg" sx={{ mb: 0.5 }}>{course.title}</Typography>
              <Typography level="body-sm" sx={{ mb: 2, color: 'text.secondary' }}>
                Course · By {course.author}
              </Typography>

              {course.showProgress && course.progress !== undefined && (
                <Box sx={{ mb: 2 }}>
                  <Typography level="body-xs" sx={{ mb: 1 }}>
                    Next lesson: {course.nextLesson || 'Introduction to Course'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ flexGrow: 1, bgcolor: 'background.level2', height: 8, borderRadius: 4, overflow: 'hidden' }}>
                      <Box
                        sx={{
                          width: `${course.progress}%`,
                          height: '100%',
                          bgcolor: 'danger.500',
                          transition: 'width 0.3s ease-in-out',
                        }}
                      />
                    </Box>
                    <Typography level="body-xs" sx={{ minWidth: 30, textAlign: 'right' }}>
                      {course.progress}%
                    </Typography>
                  </Box>
                </Box>
              )}

              <Typography level="body-sm" sx={{ mb: 2 }}>
                {course.description}
              </Typography>

              {course.members && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                  <AvatarGroup size="sm" sx={{ '--Avatar-size': '28px' }}>
                    {course.members.map((member, index) => (
                      <Avatar key={index} src={member.avatar} alt={member.name} />
                    ))}
                    <Avatar>+{Math.floor(Math.random() * 10) + 1}K</Avatar>
                  </AvatarGroup>
                  <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                    {Math.floor(Math.random() * 1000) + 100} members
                  </Typography>
                </Box>
              )}
            </CardContent>

            <CardActions buttonFlex="0 1 120px">
              <IconButton variant="outlined" color="neutral" sx={{ mr: 'auto' }}>
                <FavoriteBorder />
              </IconButton>
              <Button
                variant="solid"
                color="primary"
                fullWidth
                onClick={() => handleViewCourse(course.id)}
                sx={{
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 'md',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                {course.progress && course.progress > 0 ? 'Continue' : 'Start'}
              </Button>
              <Button variant="solid" color="danger">
                Enroll
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </CssVarsProvider>
  );
};

export default CourseCards;
