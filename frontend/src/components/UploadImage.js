import React, { useState } from 'react';
import axios from 'axios';

const UploadImage = () => {
  const [image, setImage] = useState(null);
  const [nutritionInfo, setNutritionInfo] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError('Please upload an image.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post('https://api.logmeal.com/v2/recognition/dish', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer YOUR_API_KEY' // Replace with your LogMeal API key
        }
      });

      const dishId = response.data.recognition_results[0].id;
      const nutritionResponse = await axios.get(`https://api.logmeal.com/v2/nutrition/dish/${dishId}`, {
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY' // Replace with your LogMeal API key
        }
      });

      setNutritionInfo(nutritionResponse.data);
      setError(null);
    } catch (err) {
      setError('Failed to retrieve nutritional information.');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Upload an Image of a Dish</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit">Upload</button>
      </form>
      {error && <div className="error">{error}</div>}
      {nutritionInfo && (
        <div className="nutrition-info">
          <h3>Nutritional Information</h3>
          <p>Calories: {nutritionInfo.calories}</p>
          <p>Serving Size: {nutritionInfo.serving_size}</p>
          <p>Protein: {nutritionInfo.protein}g</p>
          <p>Carbohydrates: {nutritionInfo.carbohydrates}g</p>
          <p>Fat: {nutritionInfo.fat}g</p>
        </div>
      )}
    </div>
  );
};

export default UploadImage;