from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load model
pipe = pickle.load(open("pipe.pkl", "rb"))
df = pickle.load(open('df.pkl','rb'))

@app.route("/options", methods=["GET"])
def get_options():

    return jsonify({
        "companies": sorted(df["Company"].dropna().unique().tolist()),
        "types": sorted(df["TypeName"].dropna().unique().tolist()),
        "ram": [2, 4, 6, 8, 12, 16, 24, 32, 64],
        "touchscreen": ["No", "Yes"],
        "ips": ["No", "Yes"],
        "screen_size": {
            "min": 10.0,
            "max": 18.0,
            "default": 13.0
        },
        "resolution": [
            "1920x1080",
            "1366x768",
            "1600x900",
            "3840x2160",
            "3200x1800",
            "2880x1800",
            "2560x1600",
            "2560x1440",
            "2304x1440"
        ],
        "cpu": sorted(df["Cpu brand"].dropna().unique().tolist()),
        "hdd": [0, 128, 256, 512, 1024, 2048],
        "ssd": [0, 8, 128, 256, 512, 1024],
        "gpu": sorted(df["Gpu brand"].dropna().unique().tolist()),
        "os": sorted(df["os"].dropna().unique().tolist())
    })

@app.route("/predict", methods=["POST"])
def predict():

    # Receive JSON from frontend
    data = request.json

    # Extract values
    company = data["Company"]
    type_name = data["TypeName"]

    ram = int(data["Ram"])
    weight = float(data["Weight"])

    touchscreen = data["Touchscreen"]
    ips = data["IPS Panel"]

    screen_size = float(data["Screen Size"])
    resolution = data["Resolution"]

    cpu = data["Cpu brand"]

    hdd = int(data["HDD"])
    ssd = int(data["SSD"])

    gpu = data["Gpu brand"]
    os = data["os"]

    # Convert Yes/No to 1/0
    touchscreen = 1 if touchscreen == "Yes" else 0
    ips = 1 if ips == "Yes" else 0

    # Calculate PPI
    x_res = int(resolution.split("x")[0])
    y_res = int(resolution.split("x")[1])

    ppi = (((x_res ** 2) + (y_res ** 2)) ** 0.5) / screen_size

    # Create dataframe
    query = pd.DataFrame({
        "Company": [company],
        "TypeName": [type_name],
        "Ram": [ram],
        "Weight": [weight],
        "Touchscreen": [touchscreen],
        "IPS Panel": [ips],
        "ppi": [ppi],
        "Cpu brand": [cpu],
        "HDD": [hdd],
        "SSD": [ssd],
        "Gpu brand": [gpu],
        "os": [os]
    })

    # Predict
    prediction = np.exp(pipe.predict(query)[0])

    return jsonify({
        "price": int(prediction)
    })


if __name__ == "__main__":
    app.run(debug=True)