export interface TutoringAd{
    id: number;
    title: string;
    description: string;
    price : number;
    isOnline : boolean;
    isAvailable : boolean;

    tutorId : number;
    tutorName : string;
}

export interface UserProfile {
    id: number;
    name: string;
    email:string;
    role: 'Student' | 'Tutor';
}

export const LessonStatus = {
    Pending: 0 as const,
    Confirmed: 1 as const,
    Cancelled: 2 as const,
    Completed: 3 as const
};

export type LessonStatus = typeof LessonStatus[keyof typeof LessonStatus];

export interface Lesson {
    id: number;
    startTime: string; 
    status: LessonStatus;
    isReccuring: boolean;
    remainingLessons?: number;
    studentId: number;
    tutoringAdId: number;
    
    student?: { name: string; email: string };
    tutoringAd?: { title: string; price: number; tutorName?: string }; 
}
