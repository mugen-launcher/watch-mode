function nonRandomCharacterPredicate(character) {
  return !character.random;
}

function nonExcludedCharactersPredicate(excludedCharacters) {
    return (character) => {
        return !excludedCharacters.includes(character);
    }
}

function getSelectableCharactersFromCategory(category, excludedCharacters) {
  const selectableCharacters = [];

  const nonRandomCharacters = category.characters.filter(
    nonRandomCharacterPredicate,
  );
  const availableCharacters = nonRandomCharacters.filter(
    nonExcludedCharactersPredicate(excludedCharacters),
  );
  selectableCharacters.push(...availableCharacters);

  for (const character of availableCharacters) {
    if (Array.isArray(character.styles)) {
      const nonRandomSubCharacters = character.styles.filter(
        nonRandomCharacterPredicate,
      );
      const availableSubCharacters = nonRandomSubCharacters.filter(
        nonExcludedCharactersPredicate(excludedCharacters),
      );
      selectableCharacters.push(...availableSubCharacters);
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

function getSelectableCharactersFromCategories(categories, excludedCharacters) {
  const selectableCharacters = [];

  const nonRandomCategories = categories.filter(nonRandomCategoryPredicate);
  for (const category of nonRandomCategories) {
    selectableCharacters.push(
      ...getSelectableCharactersFromCategory(category, excludedCharacters),
    );
  }

  return selectableCharacters;
}

export default function getRandomCharacter(categories, excludedCharacters = []) {
  const characters = getSelectableCharactersFromCategories(
    categories,
    excludedCharacters,
  );
  const randomIndex = Math.floor(Math.random() * characters.length);
  return characters[randomIndex];
}
