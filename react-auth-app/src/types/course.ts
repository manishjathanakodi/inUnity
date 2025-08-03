export interface Lecture {
  id: string;
  title: string;
  duration: string;
  videoId: string;
  completed: boolean;
  type: 'lecture' | 'assignment';
  description?: string;
  materials?: string[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lectures: Lecture[];
  order: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  duration: string;
  progress: number;
  modules: Module[];
  nextSession?: {
    date: string;
    time: string;
    title: string;
  };
}
