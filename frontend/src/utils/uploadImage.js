import { API_Path 
} from "./apiPath";
import axiosInstance from "./axiosinstance"; // Assuming you have an axios instance set up
const uploadImage = async (imageFile) => {
    const formdata = new FormData();
    formdata.append('image', imageFile); // Fix 2 issues here:
    // 1. Use formdata (lowercase) instead of FormData
    // 2. Fix typo 'iamge' → 'image'
  
    try {
      const response = await axiosInstance.post(
        API_Path.IMAGE.UPLOAD_IMAGE, 
        formdata,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };
export default uploadImage;