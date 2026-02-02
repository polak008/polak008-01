export type Theme = 'light' | 'dark';

export interface Skill {
    name: string;
    level: string; // e.g., 'beginner', 'intermediate', 'advanced'
}

export interface Education {
    institution: string;
    degree: string;
    year: number;
}

export interface ContactInfo {
    email: string;
    phone?: string; // optional
}