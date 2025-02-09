import React, { useState } from 'react';
import { useRecipesContext } from '../hooks/useRecipeContext'; // Ensure this matches the file name
import { useAuthContext } from '../hooks/useAuthContext';

const RecipeForm = () => {
  const { dispatch } = useRecipesContext();
  const { user } = useAuthContext();

  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in');
      return;
    }

    const newRecipe = {
      name: recipeName, // Ensure this matches the backend API expectations
      ingredients,
      instructions,
      prepTime,
      difficulty,
    };

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes`, {
      method: 'POST',
      body: JSON.stringify(newRecipe),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    });

    const json = await response.json();
    if (!response.ok) {
      alert(json.error);
    }
    if (response.ok) {
      setRecipeName('');
      setIngredients('');
      setInstructions('');
      setPrepTime('');
      setDifficulty('');
      dispatch({ type: 'CREATE_RECIPE', payload: json });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add a New Recipe</h3>
      <div>
        <label>Recipe Name:</label>
        <input
          type="text"
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Ingredients:</label>
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Instructions:</label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Preparation Time:</label>
        <input
          type="text"
          value={prepTime}
          onChange={(e) => setPrepTime(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Difficulty Level:</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          required
        >
          <option value="">Select</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
      <button type="submit">Add Recipe</button>
    </form>
  );
};

export default RecipeForm;