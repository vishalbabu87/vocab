import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  createQuizSession,
  getNextQuestion,
  isAnswerCorrect,
} from '../services/quizService.js';

const QuizContext = createContext(null);

export function QuizProvider({ children }) {
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState(new Set());
  const [score, setScore] = useState(0);

  const startQuiz = useCallback((questions) => {
    const initialSession = createQuizSession(questions);
    const { session: updatedSession, question } = getNextQuestion(initialSession);

    setSession(updatedSession);
    setCurrentQuestion(question);
    setAnsweredQuestionIds(new Set());
    setScore(0);
  }, []);

  const nextQuestion = useCallback(() => {
    setSession((previousSession) => {
      const { session: updatedSession, question } = getNextQuestion(previousSession);
      setCurrentQuestion(question);
      return updatedSession;
    });
  }, []);

  const submitAnswer = useCallback((answer) => {
    if (!currentQuestion || answeredQuestionIds.has(currentQuestion.id)) {
      return false;
    }

    const correct = isAnswerCorrect(currentQuestion, answer);

    setAnsweredQuestionIds((previous) => new Set(previous).add(currentQuestion.id));

    if (correct) {
      setScore((previous) => previous + 1);
    }

    return correct;
  }, [answeredQuestionIds, currentQuestion]);

  const resetQuiz = useCallback(() => {
    setSession(null);
    setCurrentQuestion(null);
    setAnsweredQuestionIds(new Set());
    setScore(0);
  }, []);

  const value = useMemo(() => {
    const totalQuestions = session?.questions?.length ?? 0;
    const answeredCount = answeredQuestionIds.size;

    return {
      currentQuestion,
      isComplete: !currentQuestion && totalQuestions > 0,
      nextQuestion,
      resetQuiz,
      score,
      startQuiz,
      submitAnswer,
      totalQuestions,
      answeredCount,
    };
  }, [answeredQuestionIds.size, currentQuestion, nextQuestion, resetQuiz, score, session?.questions?.length, startQuiz, submitAnswer]);

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const context = useContext(QuizContext);

  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }

  return context;
}
