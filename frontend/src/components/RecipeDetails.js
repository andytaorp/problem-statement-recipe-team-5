import { useState } from 'react';
import { useRecipesContext } from '../hooks/useRecipeContext';
import { useAuthContext } from '../hooks/useAuthContext';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const RecipeDetails = ({ recipe }) => {
  const { dispatch } = useRecipesContext();
  const { user } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedRecipe, setUpdatedRecipe] = useState({
    name: recipe.name,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    prepTime: recipe.prepTime,
    difficulty: recipe.difficulty,
  });

  // Delete Recipe Function
  const handleDelete = async () => {
    if (!user) {
      alert("You must be logged in to delete a recipe!");
      return;
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${recipe._id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${user.token}` },
    });

    if (response.ok) {
      dispatch({ type: 'DELETE_RECIPE', payload: recipe._id });
    }
  };

  // Update Recipe Function
  const handleUpdate = async () => {
    if (!user) {
      alert("You must be logged in to edit a recipe!");
      return;
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${recipe._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
      },
      body: JSON.stringify(updatedRecipe),
    });

    if (response.ok) {
      const updatedData = await response.json();
      dispatch({ type: 'UPDATE_RECIPE', payload: updatedData });
      setIsEditing(false);
    }
  };

  return (
    <div className="recipe-details">
      {isEditing ? (
        // Edit Mode
        <div className="edit-form">
          <input
            type="text"
            value={updatedRecipe.name}
            onChange={(e) => setUpdatedRecipe({ ...updatedRecipe, name: e.target.value })}
            placeholder="Recipe Name"
          />
          <textarea
            value={updatedRecipe.ingredients}
            onChange={(e) => setUpdatedRecipe({ ...updatedRecipe, ingredients: e.target.value })}
            placeholder="Ingredients"
          />
          <textarea
            value={updatedRecipe.instructions}
            onChange={(e) => setUpdatedRecipe({ ...updatedRecipe, instructions: e.target.value })}
            placeholder="Instructions"
          />
          <input
            type="text"
            value={updatedRecipe.prepTime}
            onChange={(e) => setUpdatedRecipe({ ...updatedRecipe, prepTime: e.target.value })}
            placeholder="Preparation Time"
          />
          <select
            value={updatedRecipe.difficulty}
            onChange={(e) => setUpdatedRecipe({ ...updatedRecipe, difficulty: e.target.value })}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        // View Mode
        <>
          <h4>{recipe.name}</h4>
          <p><strong>Ingredients: </strong>{recipe.ingredients}</p>
          <p><strong>Cooking Instructions: </strong>{recipe.instructions}</p>
          <p><strong>Preparation time: </strong>{recipe.prepTime}</p>
          <p><strong>Difficulty level: </strong>{recipe.difficulty}</p>
          <p>{formatDistanceToNow(new Date(recipe.createdAt), { addSuffix: true })}</p>

          <div className="action-buttons">
            <button className="edit-button" onClick={() => setIsEditing(true)}>Edit</button>
            <button className="delete-button" onClick={handleDelete}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
};

export default RecipeDetails;