import re
from datetime import datetime

def parse_transaction(text):
    result = {
        "amount": None,
        "type": "expense",  # default to expense
        "vendor": None,
        "date": None,
        "method": None,
    }

    # Amount (₹, Rs., INR, or plain number)
    amount_match = re.search(r'(INR|Rs\.?|₹)?\s?([0-9]+(?:\.[0-9]{1,2})?)', text)
    if amount_match:
        result["amount"] = float(amount_match.group(2))

    # Type: expense or income
    if re.search(r'(credited|received|deposited)', text, re.IGNORECASE):
        result["type"] = "income"
    elif re.search(r'(debited|paid|spent|purchase)', text, re.IGNORECASE):
        result["type"] = "expense"

    # Vendor / merchant (look for "to ___" or "at ___")
    vendor_match = re.search(r'(to|at)\s([A-Z][a-zA-Z0-9 &]+)', text)
    if vendor_match:
        result["vendor"] = vendor_match.group(2)

    # Date: use today if none found
    result["date"] = datetime.today().strftime('%Y-%m-%d')

    # Method: card/bank
    if "debit card" in text.lower():
        result["method"] = "debit card"
    elif "credit card" in text.lower():
        result["method"] = "credit card"
    elif "upi" in text.lower():
        result["method"] = "UPI"
    elif "netbanking" in text.lower():
        result["method"] = "netbanking"

    return result
