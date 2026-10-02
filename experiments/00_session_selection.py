"""
Experiment 00: Objective Session & Teammate Evaluation.
Scores candidate qualifying sessions against Section K criteria to select the MVP dataset.
"""

import sys
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from src.ingestion.fetcher import FastF1Fetcher
from src.ingestion.session_evaluator import SessionEvaluator


def main():
    print("=" * 70)
    print("F1 Research Pipeline: Session Selection & Evaluation (Phase 0)")
    print("=" * 70)

    fetcher = FastF1Fetcher()
    evaluator = SessionEvaluator(fetcher)

    # Candidate sessions representing distinct circuit types (high aero, high traction, high-speed flow)
    candidates = [
        {"year": 2023, "race": "Bahrain", "driver1": "LEC", "driver2": "SAI"},
        {"year": 2023, "race": "Spain", "driver1": "HAM", "driver2": "RUS"},
        {"year": 2023, "race": "Spain", "driver1": "VER", "driver2": "PER"},
        {"year": 2023, "race": "Great Britain", "driver1": "NOR", "driver2": "PIA"},
        {"year": 2023, "race": "Austria", "driver1": "LEC", "driver2": "SAI"},
    ]

    print(f"Evaluating {len(candidates)} candidate qualifying sessions against Section K criteria...\n")
    ranking_df = evaluator.rank_candidates(candidates)

    print("\n" + "=" * 70)
    print("CANDIDATE RANKING RESULTS:")
    print("=" * 70)
    print(ranking_df.to_string(index=False))

    best_candidate = ranking_df.iloc[0]
    print("\n" + "*" * 70)
    print(f"SELECTED MVP DATASET: {best_candidate['year']} {best_candidate['race']} Qualifying")
    print(f"TEAMMATES: {best_candidate['driver1']} vs {best_candidate['driver2']}")
    print(f"TIME DELTA: {best_candidate['time_delta_s']} s | SCORE: {best_candidate['score']}")
    print("*" * 70)

    # Save ranking output to processed directory
    output_path = PROJECT_ROOT / "data" / "processed" / "session_evaluation_ranking.csv"
    ranking_df.to_csv(output_path, index=False)
    print(f"\nSaved ranking table to: {output_path}")


if __name__ == "__main__":
    main()
