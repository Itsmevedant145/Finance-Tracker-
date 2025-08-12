import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
import joblib
import os

# ✅ 1. Load your CSV
df = pd.read_csv("transaction_data.csv")

# ✅ 2. Extract features and labels
texts = df["text"]
type_labels = df["type"]
category_labels = df["category"]

# ✅ 3. TF-IDF Vectorization
vectorizer = TfidfVectorizer(ngram_range=(1, 2))  # capturing phrases
X = vectorizer.fit_transform(texts)

# ✅ 4. Train Type Classifier (Income / Expense)
X_train_type, X_test_type, y_train_type, y_test_type = train_test_split(
    X, type_labels, test_size=0.2, random_state=42
)
type_clf = LogisticRegression(max_iter=1000)
type_clf.fit(X_train_type, y_train_type)
print("\n📊 Type Classifier Report:")
print(classification_report(y_test_type, type_clf.predict(X_test_type)))

# ✅ 5. Train Category Classifier (Rent / Salary / Food, etc.)
X_train_cat, X_test_cat, y_train_cat, y_test_cat = train_test_split(
    X, category_labels, test_size=0.2, random_state=42
)
category_clf = LogisticRegression(max_iter=1000)
category_clf.fit(X_train_cat, y_train_cat)
print("\n📊 Category Classifier Report:")
print(classification_report(y_test_cat, category_clf.predict(X_test_cat)))

# ✅ 6. Save Models and Vectorizer
os.makedirs("model", exist_ok=True)
joblib.dump(vectorizer, "model/vectorizer.pkl")
joblib.dump(type_clf, "model/type_classifier.pkl")
joblib.dump(category_clf, "model/category_classifier.pkl")

print("\n✅ All models and vectorizer saved to 'model/' folder.")
