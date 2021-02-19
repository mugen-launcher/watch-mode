import React from "react";
import styled from "styled-components";
import useCharacterName from "../character/useCharacterName.hook";
import Portrait from "./right/portrait.view";
import StandAnimation from "./right/standAnimation.view";
import CharacterName from "./right/characterName.view";

const PortraitOffset = styled.div`
position: absolute;
left: 105vw;
top: 100vh;
`;

export default function RightSide({ character }) {
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
