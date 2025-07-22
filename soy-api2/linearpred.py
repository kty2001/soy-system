import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler

csv_file_path = "./images/data.csv"
df = pd.read_csv(csv_file_path)

df['gray_data'] = df['gray_data'].apply(lambda x: eval(x))

model = LinearRegression()
scaler = StandardScaler()

X = np.array(df['gray_data'].tolist())
X = scaler.fit_transform(X)
y = np.array(df['label_name'].astype(float))
img_names = df['img_name'].values

X_train, X_test, y_train, y_test, img_train, img_test = train_test_split(X, y, img_names, test_size=0.2, random_state=42)

# Train the regression model
model.fit(X_train, y_train)

# Evaluate the model
y_test_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_test_pred)
r2 = r2_score(y_test, y_test_pred)

# Sample predictions
idx = 15
X_sample = X_test[idx]
y_sample = y_test[idx]
img_name_sample = img_test[idx]

y_pred = model.predict(X_sample.reshape(1, -1))

print("Sample Id:", img_name_sample)
print("target:", y_sample, "/ pred:", np.round(y_pred, 3))

print("MSE:", round(mse, 5))
print("R^2 Score:", round(r2, 5))

mse_scores = cross_val_score(model, X, y, cv=5, scoring='neg_mean_squared_error')
r2_scores = cross_val_score(model, X, y, cv=5, scoring='r2')

print("X shape:", X.shape)
print("y shape:", y.shape)
print("X contains NaN:", np.isnan(X).any())
print("y contains NaN:", np.isnan(y).any())

print("MSE:", -mse_scores.mean())
print("R^2:", r2_scores.mean())
