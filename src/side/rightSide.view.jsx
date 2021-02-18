import React from "react";
import useCharacterName from "../../character/useCharacterName.hook";
import useColorIndex from "./useColorIndex.hook";
import Portrait from "./portrait.view";
import StandAnimation from "./standAnimation.view";
import CharacterName from "./characterName.view";

export default function RightSide({ character }) {
  const characterName = useCharacterName(character);
  const colorIndex = useColorIndex();

  return (
    <>
      <Portrait character={character} />
      <StandAnimation character={character} colorIndex={colorIndex} />
      <CharacterName>{characterName}</CharacterName>
    </>
  );
}
