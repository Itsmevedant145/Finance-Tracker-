import React, { useEffect, useState } from 'react';
import { useUserAuth } from '../../hooks/useUserAuth';
import DashboardLayout from '../../components/layouts/DashoboardLayout';
import { API_Path } from '../../utils/apiPath';
import axiosInstance from '../../utils/axiosinstance';
import { toast } from 'react-toastify';
import ExpenseOverview from '../../components/Expense/ExpenseOverview';
import Modal from '../../components/Modal';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import ExpenseList from '../../components/Expense/ExpeneseList';
import DeleteAlert from '../../components/layouts/DeleteAlert';

const Expense = () => {
  useUserAuth();

  const [openAddExpenseModel, setOpenAddExpenseModel] = useState(false);
  const [expensedata, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    date: null,
  });

  const fetchExpenseDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_Path.EXPENSE.GET_ALL_EXPENSE);
      if (response.data) {
        setExpenseData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;

    if (!category.trim()) {
      toast.error("Category is required");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0.");
      return;
    }

    if (!date) {
      toast.error("Date is required");
      return;
    }

    try {
      await axiosInstance.post(API_Path.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      });

      setOpenAddExpenseModel(false);
      toast.success("Expense added successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error("Error adding expense:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Failed to add expense");
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_Path.EXPENSE.DELETE_EXPENSE(id));
      setOpenDeleteAlert({ show: false, date: null });
      toast.success("Expense deleted successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error(error.response?.data?.message || "Failed to delete expense");
    }
  };

  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_Path.EXPENSE.DOWNLOAD_EXPENSE,
        { responseType: "blob" }
      );
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading expense details", error);
      toast.error("Failed to download expense details. Please try again.");
    }
  };
  
  useEffect(() => {
    fetchExpenseDetails();
  }, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <ExpenseOverview
          transactions={expensedata}
          onExpenseIncome={() => setOpenAddExpenseModel(true)}
        />
      </div>

      <ExpenseList
        transactions={expensedata}
        onDelete={(id) => {
          setOpenDeleteAlert({ show: true, date: id });
        }}
        onDownload={handleDownloadExpenseDetails}
      />

      <Modal
        isOpen={openAddExpenseModel}
        onClose={() => setOpenAddExpenseModel(false)}
        title="Add Expense"
      >
        <AddExpenseForm onAddExpense={handleAddExpense} />
      </Modal>

      <Modal
        isOpen={openDeleteAlert.show}
        onClose={() =>
          setOpenDeleteAlert({
            show: false,
            date: null,
          })
        }
        title="Delete Expense"
      >
        <DeleteAlert
          content="Are you sure you want to delete this expense?"
          onDelete={() => handleDeleteExpense(openDeleteAlert.date)}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default Expense;
