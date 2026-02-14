import { shuffle } from '../utils/shuffle.js';

export function createQuizSession(questions, random = Math.random) {
  const normalizedQuestions = Array.isArray(questions)
    ? questions.filter((question) => question && question.id != null)
    : [];

  return {
    questions: shuffle(normalizedQuestions, random),
    cursor: 0,
    askedQuestionIds: new Set(),
  };
}

export function getNextQuestion(session) {
  if (!session || !Array.isArray(session.questions)) {
    return { session, question: null };
  }

  let cursor = session.cursor;

  while (cursor < session.questions.length) {
    const candidate = session.questions[cursor];

    if (!session.askedQuestionIds.has(candidate.id)) {
      const updatedSession = {
        ...session,
        cursor: cursor + 1,
        askedQuestionIds: new Set(session.askedQuestionIds).add(candidate.id),
      };

      return {
        session: updatedSession,
        question: candidate,
      };
    }

    cursor += 1;
  }

  return {
    session: {
      ...session,
      cursor,
    },
    question: null,
  };
}

export function isAnswerCorrect(question, answer) {
  if (!question) {
    return false;
  }

  const correctAnswer = question.correctAnswer;

  if (Array.isArray(correctAnswer)) {
    if (!Array.isArray(answer) || answer.length !== correctAnswer.length) {
      return false;
    }

    const expected = [...correctAnswer].sort();
    const provided = [...answer].sort();

    return expected.every((value, index) => value === provided[index]);
  }

  return answer === correctAnswer;
}
