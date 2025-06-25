import pandas as pd
import numpy as np

# Step 1: Load the data (replace with the actual file path)
data = pd.read_excel('your_data.xlsx')  # or pd.read_csv('your_data.csv')

# Step 2: Preprocess data
# Convert 'Date' column to datetime format
data['Date'] = pd.to_datetime(data['Date'])

# Extract additional features (Month and Year) from the 'Date'
data['Month'] = data['Date'].dt.month
data['Year'] = data['Date'].dt.year
data['Day'] = data['Date'].dt.day

# Drop the 'Icon' and 'Source' columns as they are not needed
data = data.drop(columns=['Icon', 'Source'])

# Check the data after preprocessing
print(data.head())
