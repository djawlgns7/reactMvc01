import sys
import librosa
import numpy as np
from scipy.spatial.distance import euclidean
from fastdtw import fastdtw


def extract_features(file_path):
    y, sr = librosa.load(file_path)
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    return mfcc.T


def calculate_similarity(file1, file2):
    features1 = extract_features(file1)
    features2 = extract_features(file2)
    distance, _ = fastdtw(features1, features2, dist=euclidean)
    return distance


if __name__ == "__main__":
    file1 = sys.argv[1]
    file2 = sys.argv[2]
    try:
        distance = calculate_similarity(file1, file2)
        print(distance)
    except Exception as e:
        print(f"Error: {e}")
