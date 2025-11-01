Traffic Accident Severity Classification

This project is a web application that predicts the severity of traffic accidents based on various input features. The application is built using Flask and uses a pre-trained XGBoost model for predictions.

Project Structure

Traffic Accident Severity Classification
├── data
│   └── data.csv
├── model
│   ├── label_encoders.pkl
│   ├── target_encoder.pkl
│   └── xgboost_model.pkl
├── templates
│   ├── dashboard.html
│   ├── index.html
│   └── login.html
├── app.py
├── requirements.txt
└── README.md


Requirements

The required Python packages are listed in the `requirements.txt` file. You can install them using the following command:

```bash
pip install -r requirements.txt

```

## Running the Application

To run the application, execute the following command:

```bash
python app.py
```

The application will be available at `http://127.0.0.1:5000/`.

## Endpoints

### Home

- **URL:** `/`
- **Method:** `GET`
- **Description:** Renders the login page.

### Login
username : admin
password : password

- **URL:** `/login`
- **Method:** `GET`, `POST`
- **Description:** Handles user login. Renders the dashboard on successful login.

### Dashboard

- **URL:** `/dashboard`
- **Method:** `GET`
- **Description:** Renders the dashboard page.

### Predict

- **URL:** `/predict`
- **Method:** `POST`, `GET`
- **Description:** Handles form submission for accident severity prediction and renders the result.

