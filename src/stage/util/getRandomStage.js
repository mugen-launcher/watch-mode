function getSelectableStages(stages) {
  return stages.filter(stage => !stage.random);
}

export default function getRandomStage(stages) {
  const selectableStages = getSelectableStages(stages);
  const randomIndex = Math.floor(Math.random() * selectableStages.length);
  return selectableStages[randomIndex];
}
