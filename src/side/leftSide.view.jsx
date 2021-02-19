import React from "react";
import useCharacterName from "../character/useCharacterName.hook";
import Portrait from "./left/portrait.view";
import StandAnimation from "./left/standAnimation.view";
import CharacterName from "./left/characterName.view";

export default function LeftSide({ character }) {
  const characterName = useCharacterName(character);

  return (
    <>
      <Portrait character={character} />
      <StandAnimation character={character} colorIndex={1} />
      <CharacterName>{characterName}</CharacterName>
    </>
  );
}
