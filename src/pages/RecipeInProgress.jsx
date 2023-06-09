import React, { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ButtonsSmall from '../components/ButtonsSmall';
import AppRecipesContext from '../context/AppRecipesContext';

const inputCheckbox = 'input[type="checkbox"]';

export default function RecipeInProgress() {
  const { RecipesDetailsApi, detailRecipe } = useContext(AppRecipesContext);
  const history = useHistory();
  const { pathname } = history.location;

  const [ingredients, setIngredients] = useState([]);
  const [disabledButton, setDisabledButton] = useState(false);
  const [nameOBJ, setNameOBJ] = useState('');

  const AltCss = () => {
    const AllCheckbox = document.querySelectorAll(inputCheckbox);
    AllCheckbox.forEach((checkbox) => {
      if (checkbox.checked) {
        checkbox.parentNode.style.textDecoration = 'line-through';
      } else {
        checkbox.parentNode.style.textDecoration = 'none';
      }
    });
  };
  const verifyCheckbox = () => {
    const oldLocalStorage = JSON.parse(localStorage.getItem('inProgressRecipes')) || [];
    const getCategoryLocalStorage = oldLocalStorage[nameOBJ] || [];
    const actualId = pathname.split('/')[2];
    const drinkActual = getCategoryLocalStorage[actualId] || [];
    const AllCheckbox = document.querySelectorAll(inputCheckbox);
    AllCheckbox.forEach((checkbox) => {
      if (drinkActual.includes(checkbox.parentNode.innerText)) {
        checkbox.checked = true;
      }
    });
    AltCss();
  };

  const saveRecipes = () => {
    const oldLocalStorage = JSON.parse(localStorage.getItem('doneRecipes')) || [];
    const dateNow = new Date();
    const newLocalStorage = [
      ...oldLocalStorage,
      {
        id: detailRecipe.idMeal || detailRecipe.idDrink,
        nationality: detailRecipe.strArea || '',
        name: detailRecipe.strMeal || detailRecipe.strDrink,
        category: detailRecipe.strCategory,
        image: detailRecipe.strMealThumb || detailRecipe.strDrinkThumb,
        tags: detailRecipe.strTags ? detailRecipe.strTags.split(',') : [],
        alcoholicOrNot: detailRecipe.strAlcoholic || '',
        type: pathname.includes('/meals') ? 'meal' : 'drink',
        doneDate: dateNow.toISOString(),
      },
    ];
    localStorage.setItem('doneRecipes', JSON.stringify(newLocalStorage));
    history.push('/done-recipes');
  };
  useEffect(() => {
    if (detailRecipe.length === 0) {
      const id = pathname.split('/')[2];
      RecipesDetailsApi(id, pathname);
    }
    if (ingredients.length === 0 && detailRecipe.length !== 0) {
      const alligrendients = Object.entries(detailRecipe)
        .filter((ingredient) => ingredient[0]
          .includes('strIngredient') && ingredient[1] !== null)
        .map((ingredient) => ingredient[1]);
      const removeUnusedIngredients = alligrendients
        .filter((ingredient) => ingredient !== '');
      setIngredients(removeUnusedIngredients);
    }

    verifyCheckbox();
    if (pathname.includes('/meals')) {
      setNameOBJ('meals');
    } else {
      setNameOBJ('drinks');
    }
  }, [detailRecipe, ingredients]);

  const verifyBtn = () => {
    const AllCheckbox = document.querySelectorAll(inputCheckbox);
    const checked = [];
    AllCheckbox.forEach((checkbox) => {
      if (checkbox.checked) {
        checked.push(checkbox);
      }
    });
    if (checked.length === AllCheckbox.length) {
      return setDisabledButton(true);
    }
    return setDisabledButton(false);
  };

  const saveLocalStorage = () => {
    verifyBtn();
    const oldLocalStorage = JSON.parse(localStorage.getItem('inProgressRecipes')) || [];
    const id = pathname.split('/')[2];
    const selectIgredients = document.querySelectorAll(inputCheckbox);
    const ingredients2 = [];
    selectIgredients.forEach((ingredient) => {
      if (ingredient.checked) {
        ingredients2.push(ingredient.parentNode.innerText);
      }
    });
    const getRecipe = oldLocalStorage[nameOBJ];
    if (getRecipe) {
      const newLocalStorage = {
        ...oldLocalStorage,
        [nameOBJ]: {
          ...getRecipe,
          [id]: ingredients2,
        },
      };
      localStorage.setItem('inProgressRecipes', JSON.stringify(newLocalStorage));
    } else {
      const newLocalStorage = {
        ...oldLocalStorage,
        [nameOBJ]: {
          [id]: ingredients2,
        },
      };
      localStorage.setItem('inProgressRecipes', JSON.stringify(newLocalStorage));
    }
  };

  return (
    <div>
      <h1>Recipes In Progress</h1>
      <h2 data-testid="recipe-title">
        { detailRecipe.strDrink || detailRecipe.strMeal }
      </h2>
      <img
        src={ detailRecipe.strDrinkThumb || detailRecipe.strMealThumb }
        data-testid="recipe-photo"
        alt=""
      />
      <ButtonsSmall />
      {ingredients?.map((ingredient, index) => (
        <div key={ index } data-testid={ `${index}-ingredient-step` }>
          <input
            type="checkbox"
            onClick={ () => {
              saveLocalStorage();
              AltCss();
            } }
          />
          <label
            htmlFor={ `${index}-ingredient-step` }
          >
            {ingredient}
          </label>
        </div>
      ))}
      <h3 data-testid="recipe-category">
        { detailRecipe.strAlcoholic || detailRecipe.strCategory }
      </h3>
      <p data-testid="instructions">{ detailRecipe.strInstructions }</p>
      <button
        data-testid="finish-recipe-btn"
        className="startButton"
        disabled={ !disabledButton }
        onClick={ saveRecipes }
      >
        Finalizar Receita
      </button>
    </div>
  );
}
