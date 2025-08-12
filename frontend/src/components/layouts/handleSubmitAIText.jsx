import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL, API_Path } from '../../utils/apiPath';

// same iconMap as before
const iconMap = {
  Salary: '💰',
  Bonus: '💵',
  Food: '🍔',
  Groceries: '🛒',
  Transport: '🚌',
  Rent: '🏠',
  Shopping: '🛍️',
  General: '📄',
  Unknown: '📄'
};

const handleSubmitAIText = async (inputText, setInputText, setShowModal, user) => {
  if (!inputText?.trim()) return;

  const token = localStorage.getItem('token');
  if (!token) {
    toast.error('You must be logged in to perform this action.');
    return;
  }

  try {
    const classifyUrl = `${API_BASE_URL}${API_Path.AI_Integeration.PARSE_TRANSACTIONS}`;
    const classifyRes = await axios.post(
      classifyUrl,
      { texts: [inputText] },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const results = classifyRes.data?.results;
    if (!results || !results.length) {
      toast.error('❌ No transactions detected.');
      return;
    }

    for (const tx of results) {
      const amt = tx.amount;
      const cat = tx.category || 'Unknown';
      const originalText = tx.text || '';
      const type = (tx.type || '').toLowerCase();

      const finalDate = tx.date ? new Date(tx.date).toISOString() : new Date().toISOString();
      if (!tx.date) console.log(`📅 No date provided. Using today's ISO date: ${finalDate}`);

      const assignedIcon = iconMap[cat] || iconMap.Unknown;

      let payload = {
        amount: amt,
        date: finalDate,
        icon: assignedIcon,
        description: originalText
      };

      let endpointPath;
      if (type === 'income') {
        payload.source = cat || 'Unknown';
        endpointPath = API_Path.INCOME.ADD_INCOME;
      } else {
        payload.category = cat || 'General';
        endpointPath = API_Path.EXPENSE.ADD_EXPENSE;
      }

      const fullEndpoint = `${API_BASE_URL}${endpointPath}`;

      try {
        const res = await axios.post(fullEndpoint, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // ✅ Different toast for income vs expense
        if (type === 'income') {
          toast.success(`💰 Income added: ${cat} - ₹${amt}`);
        } else {
          toast.success(`💸 Expense added: ${cat} - ₹${amt}`);
        }

        console.log('✅ Transaction saved response:', res.data);
      } catch (txErr) {
        console.error('❌ Transaction failed:', txErr.response?.data);
        toast.error(`Failed to add ${type || 'transaction'}: ${txErr.response?.data?.message || 'Unknown error'}`);
        throw txErr;
      }
    }

    setInputText('');
    setShowModal(false);

  } catch (err) {
    console.error('❌ Error processing AI automation (outer):', err);
    toast.error(err.response?.data?.message || 'Failed to process transaction.');
  }
};

export default handleSubmitAIText;
