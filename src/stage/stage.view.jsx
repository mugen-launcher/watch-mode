import React, { useState, useEffect } from "react";
import Title from "./title.view";
import Name from "./name.view";
import Preview from "./preview.view";
import useStageName from "./useStageName.hook";

export default function Stage({ stage }) {
    const name = useStageName(stage);

  return (
    <>
      <Preview stage={stage} />
      <Title>Stage</Title>
      <Name>{name}</Name>
    </>
  );
}
