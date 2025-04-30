import moment from "moment"; // Corrected import

export const validemail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// utils/helper.js
export const addThousandSeparator = (numb) => {
    if (numb === null || numb === undefined || isNaN(numb)) return '0';
  
    const [integerPart, fractionalPart] = numb.toString().split('.');

    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return fractionalPart ? `${formattedInteger}.${fractionalPart}` : formattedInteger;
};

export const prepareExpenseBarChartData = (data) => {
    const chartData = data.map((item) => ({
        category: item?.category,  // Corrected typo
        amount: item?.amount,
    }));
    return chartData;
};

export const prepareIncomeBarChartData = (data = []) => {
    if (!Array.isArray(data)) {
        console.error('Expected an array, but received:', typeof data);
        return [];
    }

    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

    const chartData = sortedData.map((item) => ({
        month: moment(item?.date || '').format('DD MMM'),
        amount: item?.amount || 0,  // Default to 0 if 'amount' is missing
        source: item?.source || 'Unknown',  // Default to 'Unknown' if 'source' is missing
    }));
    return chartData;
};
export const prepareExpenseLineCharData = (data = []) =>{
    const sortedData = [...data].sort((a,b)=> new Date(a.date) - new Date(b.date))
 const chartData = sortedData.map((item) => ({
    month : moment(item?.date).format('Do MMM'),
    amount: item?.amount,
    category: item?.category,
 }))   
 return chartData;
}
