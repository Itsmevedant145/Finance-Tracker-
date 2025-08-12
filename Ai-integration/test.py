import sys
from parser import parse_transaction

# ✅ Fix Unicode printing (₹, etc.)
sys.stdout.reconfigure(encoding='utf-8')

# ✅ Sample texts to test
sample_sms = [
    "INR 845.23 was paid to Big Bazaar on 6th August using your HDFC debit card.",
    "Rs. 2000 credited to your account via UPI from Ramesh Kumar.",
    "₹1500 spent at Amazon on 3rd August using credit card.",
    "INR 3500 received from employer salary account.",
    "Rs. 650 debited from your SBI account at Indian Oil petrol station."
]

# ✅ Run parser and print results
for i, text in enumerate(sample_sms, start=1):
    print(f"\n--- Test #{i} ---")
    print(f"📨 Text: {text}")
    parsed = parse_transaction(text)
    for key, value in parsed.items():
        print(f"{key}: {value}")
