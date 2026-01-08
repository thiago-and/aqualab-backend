export interface QuizStudentResponseDTO {
    id: string;
    title: string;
    year: {
        id: string;
        year: number;
    };
    questions: {
        id: string;
        statement: string;
        options: {
            id: string;
            text: string;
        }[];
    }[];
}
