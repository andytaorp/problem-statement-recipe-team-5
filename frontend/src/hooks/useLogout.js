import { useAuthContext } from './useAuthContext';
import { useRecipesContext } from './useRecipeContext';

export const useLogout = () => {
  const { dispatch } = useAuthContext(); // Handles authentication logout
  const { dispatch: dispatchRecipes } = useRecipesContext(); // Handles clearing recipes on logout

  const logout = () => {
    // Clear authentication state
    dispatch({ type: 'LOGOUT' });

    // Clear recipes from state
    dispatchRecipes({ type: 'SET_RECIPES', payload: [] });

    // Remove token from localStorage
    localStorage.removeItem('user');
  };

  return { logout };
};
