import React from "react";
import useCharacterName from "../character/useCharacterName.hook";
import Portrait from "./right/portrait.view";
import StandAnimation from "./right/standAnimation.view";
import CharacterName from "./right/characterName.view";

export default function RightSide({ character }) {
  const characterName = useCharacterName(character);

  return (
    <>
      <Portrait character={character} />
      <StandAnimation character={character} colorIndex={1} />
      <CharacterName>{characterName}</CharacterName>
    </>
  );
}
