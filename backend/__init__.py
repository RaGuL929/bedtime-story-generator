"""
Bedtime Story Generator Backend Package

This package contains modules for generating coherent, high-quality
bedtime stories using a fine-tuned TinyLlama model.
"""

# Import the main components to expose at the package level
from backend.story_generator.main import StoryGenerator

# Define the version of the package
__version__ = "1.0.0"

# Define what gets imported with `from backend import *`
__all__ = ["StoryGenerator"]