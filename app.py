from flask import Flask, render_template, request, jsonify
import pandas as pd
from datetime import time
from sklearn.utils import _joblib
import numpy as np
import pickle

app = Flask(__name__)
users = {'admin': 'password'}

def custom_serializer(obj):
    if isinstance(obj, time):
        return obj.strftime('%H:%M:%S')
    raise TypeError(f"Object of type {type(obj).__name__} is not JSON serializable")

# Load CSV data
def load_data():
    df = pd.read_csv('data/data.csv')
    if 'Time' in df.columns:
        df['Time'] = df['Time'].astype(str)
    
    df = df.replace({np.nan: None})
    return df





with open('model/xgboost.pkl', 'rb') as model_file:

    model = pickle.load(model_file)

with open('model/label_encoders.pkl', 'rb') as encoder_file:
    label_encoders = pickle.load(encoder_file)

with open('model/target_encoder.pkl', 'rb') as target_file:
    target_encoder = pickle.load(target_file)

@app.route('/')
def home():
    return render_template('login.html')

@app.route('/predict', methods=['POST', 'GET'])
def predict():
    if request.method == 'POST':
        '''
        For rendering results on HTML GUI
        '''
        custom_input = {
            'Day_of_week': request.form['day_of_week'],
            'Area_accident_occured': request.form['area_accident_occured'],
            'Types_of_Junction': request.form['types_of_junction'],
            'Cause_of_accident': request.form['cause_of_accident'],
            'Type_of_collision': request.form['type_of_collision'],
            'Number_of_vehicles_involved': int(request.form['number_of_vehicles_involved']),
            'Type_of_vehicle': request.form['type_of_vehicle'],
            'Service_year_of_vehicle': request.form['service_year_of_vehicle'],
            'Vehicle_driver_relation': request.form['vehicle_driver_relation'],
            'Driving_experience': request.form['driving_experience'],
            'Age_band_of_driver': request.form['age_band_of_driver'],
            'Sex_of_driver': request.form['sex_of_driver'],
            'Educational_level': request.form['educational_level'],
            'Number_of_casualties': int(request.form['number_of_casualties']),
            'Sex_of_casualty': request.form['sex_of_casualty'],
            'Age_band_of_casualty': request.form['age_band_of_casualty']
        }

        custom_input_df = pd.DataFrame([custom_input])

        
        for col in custom_input_df.select_dtypes(include=['object']).columns:
            if col in label_encoders:
                custom_input_df[col] = label_encoders[col].transform(custom_input_df[col])
            else:
                raise ValueError(f"Unexpected category in column: {col}. Model was not trained on this value.")

        
        cols = ['Day_of_week', 'Area_accident_occured', 'Types_of_Junction', 'Cause_of_accident', 'Type_of_collision',
                'Number_of_vehicles_involved', 'Type_of_vehicle', 'Service_year_of_vehicle', 'Vehicle_driver_relation',
                'Driving_experience', 'Age_band_of_driver', 'Sex_of_driver', 'Educational_level', 'Number_of_casualties',
                'Sex_of_casualty', 'Age_band_of_casualty']
        custom_input_df = custom_input_df[cols]

        
        prediction = model.predict(custom_input_df)

        
        decoded_prediction = target_encoder.inverse_transform(prediction)

        return render_template('index.html', prediction_text='Predicted Accident Severity: {}'.format(decoded_prediction[0]))
    else:
        return render_template('index.html')

@app.route('/predict_api', methods=['POST'])
def predict_api():
    '''
    For direct API calls through request
    '''
    data = request.get_json(force=True)
    custom_input_df = pd.DataFrame([data])

    
    for col in custom_input_df.select_dtypes(include=['object']).columns:
        if col in label_encoders:
            custom_input_df[col] = label_encoders[col].transform(custom_input_df[col])
        else:
            raise ValueError(f"Unexpected category in column: {col}. Model was not trained on this value.")

    
    cols = ['Day_of_week', 'Area_accident_occured', 'Types_of_Junction', 'Cause_of_accident', 'Type_of_collision',
            'Number_of_vehicles_involved', 'Type_of_vehicle', 'Service_year_of_vehicle', 'Vehicle_driver_relation',
            'Driving_experience', 'Age_band_of_driver', 'Sex_of_driver', 'Educational_level', 'Number_of_casualties',
            'Sex_of_casualty', 'Age_band_of_casualty']
    custom_input_df = custom_input_df[cols]

   
    prediction = model.predict(custom_input_df)

    
    decoded_prediction = target_encoder.inverse_transform(prediction)

    return jsonify(decoded_prediction[0])

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username in users and users[username] == password:
            return render_template('dashboard.html')
        else:
            error = 'Invalid Credentials. Please try again.'
    return render_template('login.html', error=error)

@app.route('/dashboard')
def dashboard():
    print("dashboard")
    return render_template('dashboard.html')

@app.route('/data')
def get_data():
    df = load_data()
    return jsonify(df.to_dict(orient='records'))





if __name__ == '__main__':
    app.run(debug=True)

