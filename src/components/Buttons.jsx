import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import copy from 'clipboard-copy';
import shareIcon from '../images/shareIcon.svg';
import AppRecipesContext from '../context/AppRecipesContext';

export default function Buttons() {
  const { detailRecipe } = useContext(AppRecipesContext);
  const history = useHistory();
  const { location: { pathname } } = history;

  const [share, setShare] = useState(false);

  const starRecipeBtn = () => {
    const id = pathname.split('/')[2];
    if (pathname.includes('meals')) {
      return history.push(`/meals/${id}/in-progress`);
    }
    return history.push(`/drinks/${id}/in-progress`);
  };

  const shareRecipeBtn = () => {
    copy(`http://localhost:3000${pathname}`);
    setShare(true);
  };

  const saveFavorites = () => {
    const id = detailRecipe.idMeal || detailRecipe.idDrink;
    const type = pathname.includes('meals') ? 'meal' : 'drink';
    const nationality = detailRecipe.strArea || detailRecipe.strAlcoholic;
  };

  return (
    <div>
      {share && <h2>Link copied!!</h2>}
      <button
        type="button"
        data-testid="start-recipe-btn"
        className="startButton"
        onClick={ starRecipeBtn }
      >
        Start Recipe
      </button>
      <button
        type="button"
      >
        Continue Recipe
      </button>
      <button data-testid="share-btn" onClick={ shareRecipeBtn }>
        <img src={ shareIcon } alt="share" />
      </button>
      <button data-testid="favorite-btn" onClick={ saveFavorites }>
        favorite recipe
      </button>
    </div>
  );
}
