"""
Physics-constrained composite trajectory builder.
Assembles composite curvature, DRS configuration, and donor speed caps from segment winner maps.
"""

from typing import Dict, Any, Tuple
import numpy as np
import pandas as pd


class PhysicsConstrainedCompositeBuilder:
    """
    Constructs composite trajectory inputs for physics-constrained lap simulation.
    Strictly preserves canonical spatial domain and verifies data integrity.
    """

    def __init__(self, step_ds: float = 1.0):
        self.step_ds = step_ds

    def build_composite_arrays(
        self,
        df_d1: pd.DataFrame,
        df_d2: pd.DataFrame,
        segments_df: pd.DataFrame,
        driver1_name: str = "Leclerc",
        driver2_name: str = "Sainz",
    ) -> pd.DataFrame:
        """
        Assemble pointwise composite arrays across the entire spatial track domain.

        Args:
            df_d1: Spatial DataFrame for Driver 1 (e.g. LEC) with Distance, Curvature_kappa, DRS_active, Speed_mps.
            df_d2: Spatial DataFrame for Driver 2 (e.g. SAI) with identical spatial grid.
            segments_df: DataFrame of circuit segments with s_start, s_end, winner columns.
            driver1_name: Identifier for Driver 1.
            driver2_name: Identifier for Driver 2.

        Returns:
            DataFrame of composite trajectory containing:
                Distance, Curvature_kappa, DRS_active, Donor_Speed_mps, Donor_Driver, X, Y
        """
        # 1. Grid & length assertions
        n1 = len(df_d1)
        n2 = len(df_d2)
        if n1 != n2:
            raise ValueError(f"Driver dataframe length mismatch: len(d1)={n1} vs len(d2)={n2}")

        s1 = df_d1["Distance"].values
        s2 = df_d2["Distance"].values
        if not np.allclose(s1, s2, atol=1e-4):
            raise ValueError("Driver spatial distance grids do not match.")

        n = n1
        s = s1
        total_dist = float(s[-1])

        # 2. Verify segmentation coverage
        cov_start = float(segments_df["s_start"].iloc[0])
        cov_end = float(segments_df["s_end"].iloc[-1])
        if cov_start != 0.0:
            raise ValueError(f"Segmentation does not start at 0.0 m (starts at {cov_start})")
        if abs(cov_end - total_dist) > 1e-3:
            raise ValueError(f"Segmentation end ({cov_end}) does not match track distance ({total_dist})")

        # 3. Assemble pointwise composite arrays
        kappa_comp = np.zeros(n, dtype=float)
        drs_comp = np.zeros(n, dtype=int)
        v_donor_caps = np.zeros(n, dtype=float)
        donor_tags = []
        x_comp = np.zeros(n, dtype=float)
        y_comp = np.zeros(n, dtype=float)

        seg_starts = segments_df["s_start"].values
        seg_ends = segments_df["s_end"].values
        seg_winners = segments_df["winner"].values
        n_segs = len(segments_df)

        for i in range(n):
            dist = s[i]
            # Efficient segment lookup
            # Find segment index where s_start <= dist <= s_end
            idx = np.where((seg_starts <= dist) & (dist <= seg_ends))[0]
            if len(idx) == 0:
                seg_idx = n_segs - 1
            else:
                seg_idx = idx[0]

            winner = seg_winners[seg_idx]
            donor_tags.append(winner)

            if winner == driver1_name:
                v_donor_caps[i] = float(df_d1["Speed_mps"].iloc[i])
                kappa_comp[i] = float(df_d1["Curvature_kappa"].iloc[i]) if "Curvature_kappa" in df_d1.columns else 0.0
                drs_comp[i] = int(df_d1["DRS_active"].iloc[i]) if "DRS_active" in df_d1.columns else 0
                x_comp[i] = float(df_d1["X"].iloc[i]) if "X" in df_d1.columns else 0.0
                y_comp[i] = float(df_d1["Y"].iloc[i]) if "Y" in df_d1.columns else 0.0
            elif winner == driver2_name:
                v_donor_caps[i] = float(df_d2["Speed_mps"].iloc[i])
                kappa_comp[i] = float(df_d2["Curvature_kappa"].iloc[i]) if "Curvature_kappa" in df_d2.columns else 0.0
                drs_comp[i] = int(df_d2["DRS_active"].iloc[i]) if "DRS_active" in df_d2.columns else 0
                x_comp[i] = float(df_d2["X"].iloc[i]) if "X" in df_d2.columns else 0.0
                y_comp[i] = float(df_d2["Y"].iloc[i]) if "Y" in df_d2.columns else 0.0
            else:
                raise ValueError(f"Unknown segment winner '{winner}' at sample i={i}, s={dist:.1f}")

        # 4. Integrity assertions
        if np.any(np.isnan(kappa_comp)) or np.any(np.isinf(kappa_comp)):
            raise ValueError("Composite curvature contains NaN or Inf values.")
        if np.any(np.isnan(v_donor_caps)) or np.any(v_donor_caps <= 0.0):
            raise ValueError("Composite donor speed caps contain invalid, non-positive, or NaN values.")

        composite_df = pd.DataFrame({
            "Distance": s,
            "Curvature_kappa": kappa_comp,
            "DRS_active": drs_comp,
            "Donor_Speed_mps": v_donor_caps,
            "Donor_Speed_kmh": v_donor_caps * 3.6,
            "Donor_Driver": donor_tags,
            "X": x_comp,
            "Y": y_comp,
        })

        return composite_df
