function nonRandomCharacterPredicate(character) {
  return !character.random;
}

function getSelectableCharactersFromCategory(category) {
  const selectableCharacters = [];

  const nonRandomCharacters = category.characters.filter(nonRandomCharacterPredicate);
  selectableCharacters.push(...nonRandomCharacters);

  for (const character of nonRandomCharacters) {
    if (Array.isArray(character.styles)) {
      const nonRandomSubCharacters = character.styles.filter(nonRandomCharacterPredicate);
      selectableCharacters.push(...nonRandomSubCharacters);
    }
  }

  return selectableCharacters;
}


function nonRandomCategoryPredicate(category) {
  if (category.random) {
    return false;
  }
  if (!Array.isArray(category.characters)) {
    return false;
  }
  for (const character of category.characters) {
    if (!character.random) {
      return true;
    }
  }
  return false;
}

function getSelectableCharactersFromCategories(categories) {
  const selectableCharacters = [];

  const nonRandomCategories = categories.filter(nonRandomCategoryPredicate);
  for (const category of nonRandomCategories) {
    selectableCharacters.push(...getSelectableCharactersFromCategory(category));
  }

  return selectableCharacters;
}


export default function getRandomCharacter(categories) {
  const characters = getSelectableCharactersFromCategories(categories);
  const randomIndex = Math.floor(Math.random() * characters.length);
  return characters[randomIndex];
}
