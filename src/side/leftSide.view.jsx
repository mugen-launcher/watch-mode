import React from "react";
import styled from "styled-components";
import useCharacterName from "../character/useCharacterName.hook";
import Portrait from "./left/portrait.view";
import StandAnimation from "./left/standAnimation.view";
import CharacterName from "./left/characterName.view";

const PortraitOffset = styled.div`
  position: absolute;
  left: -5vw;
  top: 100vh;
`;

export default function LeftSide({ character }) {
  const characterName = useCharacterName(character);

  return (
    <>
      <PortraitOffset>
        <Portrait character={character} />
      </PortraitOffset>
      <StandAnimation character={character} colorIndex={1} />
      <CharacterName>{characterName}</CharacterName>
    </>
  );
}
