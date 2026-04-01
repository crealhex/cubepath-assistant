export interface Question {
  question: string;
  options: string[];
}

export interface QuestionnaireProps {
  questions: Question[];
  onComplete: (answers: Record<string, string>) => void;
  onDismiss: () => void;
}
