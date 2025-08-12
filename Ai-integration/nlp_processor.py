import re
from datetime import datetime
import joblib

# Load models
try:
    vectorizer = joblib.load('model/vectorizer.pkl')
    type_classifier = joblib.load('model/type_classifier.pkl')
    category_classifier = joblib.load('model/category_classifier.pkl')
except FileNotFoundError as e:
    print(f"Model file not found: {e}")
    vectorizer = None
    type_classifier = None
    category_classifier = None

def extract_amount(text):
    """Extract the most relevant (likely largest) amount from transaction text."""
    patterns = [
        r'[₹RsINR\$\.,\s]*([0-9]+(?:,[0-9]{2,3})*(?:\.\d{1,2})?)',  # Match 1,200.50 or 1200
    ]

    amounts = []

    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        for match in matches:
            try:
                clean_amount = match.replace(',', '')
                value = float(clean_amount)
                amounts.append(value)
            except ValueError:
                continue

    # Return the largest valid amount found
    if amounts:
        return max(amounts)

    return None


def extract_date(text):
    """Extract date from transaction text"""
    patterns = [
        r'on\s+(\w{3,9})\s+(\d{1,2})(?:st|nd|rd|th)?',                        # on Jan 15th
        r'on\s+(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})',                          # on 15/01/2024
        r'(\w{3,9})\s+(\d{1,2})(?:st|nd|rd|th)?(?:\s+(\d{4}))?',              # Jan 15th
        r'on\s+(\d{1,2})(?:st|nd|rd|th)?\s+(\w{3,9})',                        # on 15th Jan
    ]
    
    for i, pattern in enumerate(patterns):
        matches = re.findall(pattern, text, re.IGNORECASE)
        if matches:
            for match in matches:
                try:
                    if i == 0:
                        month_str, day_str = match
                        date_str = f"{day_str} {month_str}"
                        parsed_date = datetime.strptime(date_str, '%d %b').replace(year=datetime.now().year)
                        return str(parsed_date.date())
                    elif i == 1:
                        day, month, year = match
                        if len(year) == 2:
                            year = f"20{year}"
                        parsed_date = datetime.strptime(f"{day}/{month}/{year}", '%d/%m/%Y')
                        return str(parsed_date.date())
                    elif i == 2:
                        month_str, day_str, year_str = match
                        year_str = year_str or str(datetime.now().year)
                        date_str = f"{day_str} {month_str} {year_str}"
                        parsed_date = datetime.strptime(date_str, '%d %b %Y')
                        return str(parsed_date.date())
                    elif i == 3:
                        day_str, month_str = match
                        date_str = f"{day_str} {month_str}"
                        parsed_date = datetime.strptime(date_str, '%d %b').replace(year=datetime.now().year)
                        return str(parsed_date.date())
                except ValueError:
                    continue
    return None

# ✅ NEW: Keyword-based override to fix common ML mistakes
def override_type_prediction(text, predicted_type):
    income_keywords = ["credited", "received", "refund", "payment from", "salary", "transferred to you"]
    expense_keywords = ["paid", "debited", "spent", "purchase", "transferred from", "withdrawn"]

    text_lower = text.lower()

    if any(word in text_lower for word in income_keywords):
        return "Income"
    if any(word in text_lower for word in expense_keywords):
        return "Expense"
    
    return predicted_type  # fallback to ML prediction

def process_text(text):
    """Process transaction text and return predictions"""
    if not all([vectorizer, type_classifier, category_classifier]):
        raise RuntimeError("Models not loaded properly. Please check model files.")
    
    try:
        vec = vectorizer.transform([text])
        predicted_type = type_classifier.predict(vec)[0]
        predicted_type = override_type_prediction(text, predicted_type)  # 🔥 Use override here

        predicted_category = category_classifier.predict(vec)[0]
        amount = extract_amount(text)
        date = extract_date(text)

        return {
            'text': text,
            'type': predicted_type,
            'category': predicted_category,
            'amount': amount,
            'date': date
        }

    except Exception as e:
        print(f"Error processing text: {e}")
        return {
            'text': text,
            'type': None,
            'category': None,
            'amount': extract_amount(text),
            'date': extract_date(text),
            'error': str(e)
        }

def process_texts(texts):
    return [process_text(text) for text in texts]

def validate_transaction(result):
    required_fields = ['text', 'type', 'category']
    for field in required_fields:
        if field not in result or result[field] is None:
            return False, f"Missing or None value for field: {field}"
    if result.get('amount') is not None and result['amount'] <= 0:
        return False, "Amount must be positive"
    return True, "Valid transaction"
