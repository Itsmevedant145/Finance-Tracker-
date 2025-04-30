import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashoboardLayout'; // intentional name
import IncomeOverview from '../../components/Income/IncomeOverview';
import axiosInstance from '../../utils/axiosinstance';
import { API_Path } from '../../utils/apiPath';
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import Modal from '../../components/Modal';
import { toast } from 'react-toastify';
import IncomeList from '../../components/Income/IncomeList';
import DeleteAlert from '../../components/layouts/DeleteAlert';
import { useUserAuth } from '../../hooks/useUserAuth';

const Income = () => {
    useUserAuth(); 
  const [openAddIncomeModel, setOpenAddIncomeModel] = useState(false);
  const [incomedata, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    date: null,
  });

  const fetchIncomeDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_Path.INCOME.GET_ALL_INCOME);
      if (response.data) {
        setIncomeData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncome = async (income) => {
    const { source, amount, date, icon } = income;

    if (!source.trim()) {
      toast.error("Source is required");
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
      await axiosInstance.post(API_Path.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon,
      });

      setOpenAddIncomeModel(false);
      toast.success("Income added successfully");
      fetchIncomeDetails();

    } catch (error) {
      console.error("Error adding income:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Failed to add income");
    }
  };

  const handleDeleteIncome = async (id) => {
    try {
      await axiosInstance.delete(API_Path.INCOME.DELETE_INCOME(id));
  
      setOpenDeleteAlert({ show: false, date: null });
      toast.success("Income details deleted successfully");
      fetchIncomeDetails();
    } catch (error) {
      console.error("Error deleting income:", error);
      toast.error(error.response?.data?.message || "Failed to delete income");
    }
  };
  
  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_Path.INCOME.DOWNLOAD_INCOME,
        { responseType: "blob" }
      );
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_details.xlsx"); // Adjust filename if needed
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading income details:", error);
      toast.error("Failed to download income details. Please try again.");
    }
  };
  
  useEffect(() => {
    fetchIncomeDetails();
  }, []);

  return (
    <div>
      <DashboardLayout activeMebu='Income'>
        <div className='my-5 mx-auto'>
          <div className='grid grid-cols-1 gap-6'>
            <div>
              <IncomeOverview
                transactions={incomedata}
                onAddIncome={() => setOpenAddIncomeModel(true)}
              />
            </div>
            <IncomeList
              transactions={incomedata}
              onDelete={(id) => {
                setOpenDeleteAlert({ show: true, date: id }); // ✅ renamed data → date
              }}
              onDownload={handleDownloadIncomeDetails} // ✅ spelling corrected
            />
          </div>
          <Modal
            isOpen={openAddIncomeModel}
            onClose={() => setOpenAddIncomeModel(false)}
            title="Add Income"
          >
            <AddIncomeForm onAddIncome={handleAddIncome} />
          </Modal>
          <Modal
            isOpen={openDeleteAlert.show}
            onClose={() =>
              setOpenDeleteAlert({
                show: false,
                date: null,
              })
            }
            title="Delete Income"
          >
            <DeleteAlert
              content="Are you sure you wanna delete income details"
              onDelete={() => handleDeleteIncome(openDeleteAlert.date)} // ✅ uses date
            />
          </Modal>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default Income;
