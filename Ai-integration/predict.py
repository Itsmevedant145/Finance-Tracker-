import joblib

# ✅ 1. Load the trained classifier and vectorizer
clf = joblib.load("model/classifier.pkl")
vectorizer = joblib.load("model/vectorizer.pkl")

# ✅ 2. Function to classify a new transaction
def classify_transaction(text):
    # Transform the input text using the same vectorizer used during training
    x = vectorizer.transform([text])
    # Predict the label (either "income" or "expense")
    return clf.predict(x)[0]

# ✅ 3. Test the classifier with a sample input
sample_text = "INR 5000 credited from SBI bank"

print("====== Transaction Classification ======")
print(f"Text: {sample_text}")
print(f"Prediction: {classify_transaction(sample_text)}")
print("========================================")
samples = [
    "INR 5000 credited from SBI bank",             # Should predict: income
    "₹999 spent at Flipkart",                      # Should predict: expense
    "Rs. 3000 received from freelance work",       # Should predict: income
    "₹1200 paid for groceries at Big Bazaar",      # Should predict: expense
    "Rs. 10000 salary credited to your account"    # Should predict: income
]

for text in samples:
    print(f"{text} -> {classify_transaction(text)}")