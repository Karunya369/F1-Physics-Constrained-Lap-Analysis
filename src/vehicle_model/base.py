"""
Abstract Base Class for Vehicle Dynamics Models.
Enforces standard interface across Level 0, Level 1, and Level 2 models.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any
import numpy as np


class BaseVehicleModel(ABC):
    """Abstract base class for lap analysis vehicle models."""

    def __init__(self, params: Dict[str, Any]):
        self.params = params

    @property
    @abstractmethod
    def model_level(self) -> int:
        """Returns integer model hierarchy level (0, 1, or 2)."""
        pass

    @property
    @abstractmethod
    def name(self) -> str:
        """Descriptive model name."""
        pass

    @abstractmethod
    def corner_speed_limit(self, kappa: float) -> float:
        """
        Maximum physical cornering speed (m/s) for a given curvature kappa (1/m).
        Returns infinity (or high bound) if straight / unconstrained.
        """
        pass

    @abstractmethod
    def max_acceleration(self, v: float, kappa: float = 0.0, drs: int = 0) -> float:
        """
        Maximum forward longitudinal acceleration (m/s^2) achievable at speed v
        given path curvature kappa and DRS status.
        """
        pass

    @abstractmethod
    def max_deceleration(self, v: float, kappa: float = 0.0, drs: int = 0) -> float:
        """
        Maximum longitudinal braking deceleration magnitude (m/s^2, positive value)
        achievable at speed v given path curvature kappa.
        """
        pass
