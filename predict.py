import joblib
import numpy as np
import json
import sys
import os

# Determine the absolute path to the current script's directory
script_dir = os.path.dirname(os.path.abspath(__file__))

# Load the trained model and scaler using the absolute paths
model_path = os.path.join(script_dir, 'housemodel.joblib')
scaler_path = os.path.join(script_dir, 'scaler.joblib')

model = joblib.load(model_path)
scaler = joblib.load(scaler_path)

# Extract input from command line arguments
try:
    data = json.loads(sys.argv[1])
    input_data = data['input']
except (IndexError, KeyError, json.JSONDecodeError):
    print(json.dumps({'error': 'Invalid input format'}))
    sys.exit(1)

# Define the expected features and their ranges
expected_features = ['medInc', 'houseAge', 'aveRooms', 'aveBedrms', 'population', 
                     'aveOccup', 'latitude', 'longitude']
feature_ranges = [(0, 10), (0, 50), (0, 10), (0, 5), (0, 5000), (0, 10), (33, 42), 
                  (-124, -114)]

# Validate the input data
if len(input_data) != len(expected_features):
    print(json.dumps({'error': 'Invalid input data'}))
    sys.exit(1)

for i in range(len(input_data)):
    # Convert input_data[i] to float before comparison
    try:
        value = float(input_data[i])
    except ValueError:
        print(json.dumps({'error': f'Invalid value for {expected_features[i]}'}))
        sys.exit(1)

    if not feature_ranges[i][0] <= value <= feature_ranges[i][1]:
        print(json.dumps({'error': f'Invalid value for {expected_features[i]}'}))
        sys.exit(1)

# Convert the input data, reshape, scale, and predict
input_data = np.array([float(i) for i in input_data]).reshape(1, -1)
input_data = scaler.transform(input_data)
prediction = model.predict(input_data)

# Get the feature importances
importances = model.feature_importances_

# Create the response payload
response = {
    'prediction': prediction.tolist(),
    'importances': importances.tolist()
}

# Print the response as JSON
print(json.dumps(response))
