from flask import Flask, render_template, request, jsonify
import pandas as pd
import re

app = Flask(__name__)

df = pd.read_csv('garage_data.csv')

@app.route("/")
def home():
    data = df.to_dict(orient='records')
    return render_template('index.html', data=data)

@app.route("/add", methods=["POST"])
def add():
    new_data = request.get_json()
    global df
    new_id = df['VehicleID'].max() + 1 if not df.empty else 1
    new_data['VehicleID'] = new_id
    df = df._append(new_data, ignore_index=True)
    df.to_csv('garage_data.csv', index=False)
    return jsonify(df.to_dict(orient='records'))

@app.route("/delete/<int:id>", methods=["DELETE"])
def delete(id):
    global df
    entry_name = df.loc[df['VehicleID'] == id, ['Make', 'Year']]
    make, year = entry_name.iloc[0]
    if id in df['VehicleID'].values:
        df = df[df['VehicleID'] != id]
        df.to_csv('garage_data.csv', index=False)
        return jsonify({'message': f'Entry {make}, {year} deleted successfully.'}), 200
    else:
        return jsonify({'error': 'Entry not found.'}), 404

@app.route("/read", methods=["GET"])
def read():
    global df
    data = df.to_dict(orient='records')
    return jsonify(data)

@app.route("/update/<int:id>", methods=["PUT"])
def update(id):
    updated_data = request.get_json()
    global df
    if id in df['VehicleID'].values:
        for key, value in updated_data.items():
            if key in df.columns:
                df.loc[df['VehicleID'] == id, key] = value
        df.to_csv('garage_data.csv', index=False)
        return jsonify(df.to_dict(orient='records')), 200
    else:
        return jsonify({'error': 'Entry not found.'}), 404


@app.template_filter('split_camel_case')
def split_camel_case(s):
    return re.sub(r'(?<!^)(?=[A-Z])', ' ', s).capitalize()

if __name__ == "__main__":
    app.run(debug=True)
