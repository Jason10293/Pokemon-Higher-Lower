import { useEffect, useReducer, useRef } from "react";
import type { Card, GameLogic } from "@/features/game/types";
import { fetchRandomCard, fetchTwoDifferentCards } from "@/app/gamepage/api/cards";

type GameState = Omit<GameLogic, "handleGuess">;

type GameAction =
  | { type: "load_start" }
  | { type: "load_success"; leftCard: Card; rightCard: Card }
  | { type: "load_error"; message: string }
  | { type: "guess_result"; isCorrect: boolean }
  | { type: "advance_start" }
  | { type: "advance_finish"; leftCard: Card; rightCard: Card }
  | { type: "advance_error"; message: string };

const initialState: GameState = {
  leftCard: null,
  rightCard: null,
  loading: true,
  error: null,
  result: null,
  score: 0,
  guessed: false,
  isAnimating: false,
  isMovingCard: false,
};

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "load_start":
      return { ...state, loading: true, error: null };
    case "load_success":
      return {
        ...state,
        loading: false,
        error: null,
        leftCard: action.leftCard,
        rightCard: action.rightCard,
        result: null,
      };
    case "load_error":
      return { ...state, loading: false, error: action.message };
    case "guess_result":
      return {
        ...state,
        isAnimating: true,
        guessed: true,
        result: action.isCorrect ? "correct" : "wrong",
        score: action.isCorrect ? state.score + 1 : state.score,
      };
    case "advance_start":
      return { ...state, isMovingCard: true };
    case "advance_finish":
      return {
        ...state,
        error: null,
        leftCard: action.leftCard,
        rightCard: action.rightCard,
        guessed: false,
        result: null,
        isMovingCard: false,
        isAnimating: false,
      };
    case "advance_error":
      return {
        ...state,
        error: action.message,
        guessed: false,
        result: null,
        isAnimating: false,
        isMovingCard: false,
      };
    default:
      return state;
  }
}

export function useCardGame(): GameLogic {
  const CARD_TRANSITION_DURATION = 500; // in milliseconds
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  function createAbortController() {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    return controller;
  }

  useEffect(() => {
    const controller = createAbortController();

    async function loadCards() {
      try {
        dispatch({ type: "load_start" });
        const [first, second] = await fetchTwoDifferentCards(
          controller.signal,
        );
        if (controller.signal.aborted) return;
        dispatch({
          type: "load_success",
          leftCard: first,
          rightCard: second,
        });
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error(err);
          dispatch({
            type: "load_error",
            message: "Failed to load cards. Please try again.",
          });
        }
      }
    }

    loadCards();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      controller.abort();
    };
  }, []);

  function handleGuess(direction: "higher" | "lower") {
    if (!state.leftCard || !state.rightCard || state.isAnimating) return;
    const isHigher = state.rightCard.averagePrice > state.leftCard.averagePrice;
    const guessedHigher = direction === "higher";
    const isCorrect =
      (guessedHigher && isHigher) || (!guessedHigher && !isHigher);
    const currentRightCard = state.rightCard;

    dispatch({ type: "guess_result", isCorrect });

    const loadNextCard = async () => {
      const controller = createAbortController();
      try {
        const newCard = await fetchRandomCard(controller.signal);
        if (controller.signal.aborted) return;
        dispatch({ type: "advance_start" });

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          dispatch({
            type: "advance_finish",
            leftCard: currentRightCard,
            rightCard: newCard,
          });
        }, CARD_TRANSITION_DURATION);
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error(err);
          dispatch({
            type: "advance_error",
            message: "Failed to load next card. Please try again.",
          });
        }
      }
    };

    loadNextCard();
  }

  return {
    ...state,
    handleGuess,
  };
}
