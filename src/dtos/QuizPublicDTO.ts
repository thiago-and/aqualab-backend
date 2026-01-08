export interface QuizPublicDTO {
    id: string;
    title: string;
    questions: {
        id: string;
        statement: string;
        options: {
            id: string;
            text: string;
        }[];
    }[];
}
