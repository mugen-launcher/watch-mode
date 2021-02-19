import React, {useState} from 'react';
import {remote} from 'electron';
import styled from 'styled-components';
import isDev from 'electron-is-dev';
import configYaml from 'config-yaml';
import ConfigurationContext from './configuration/configuration.context';
import EnvironmentContext from './configuration/environment.context';
import LeftSide from './side/leftSide.view';
import RightSide from './side/rightSide.view';
import ErrorBoundary from './error/errorBoundary.view';
import FatalError from './error/fatalError.view';
import Requirement from './error/requirement.view';
import versusImagePath from './assets/versus.png';
import getCurrentDirectory from './getCurrentDirectory';
import getRandomCharacter from './character/util/getRandomCharacter';
import noSound from './configuration/noSound';
import getRandomStage from './stage/util/getRandomStage';
import Stage from './stage/stage.view';

const app = remote.app;
const fs = remote.require('fs');
const path = remote.require('path');
const execFile = remote.require('child_process').execFile;
const currentDirectory = getCurrentDirectory();

const Wrapper = styled.main`
  flex: 1;
  height: 100%;
  background: #333;
  color: white;
  font-family: BadaBoom;
  overflow: hidden;
  background: url(./assets/background.jpg);
  background-size: cover;
  background-position: 50%;
`;
const CustomBackground = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
`;
const Versus = styled.img`
  position: absolute;
  z-index: 100;
  left: 50vw;
  bottom: 0;
  height: 30vh;
  transform: translateX(-50%);
`;
const BlackScreen = styled.div`
  position: absolute;
  z-index: 200;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: black;
  color: white;
  font-size: 12vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function Loop({ configuration, environment, roundCount, waitingScreenDuration, backgroundSound, customBackground}) {
  const firstCharacter = getRandomCharacter(configuration.categories);
  const secondCharacter = getRandomCharacter(configuration.categories, [
    firstCharacter,
  ]);
  const [battle, setBattle] = useState({
    state: 'waiting',
    firstCharacter,
    secondCharacter,
    stage: getRandomStage(configuration.stages),
  });

  const displayWaitScreen = (firstCharacter, secondCharacter) => {
    setTimeout(() => {
      setBattle({
        state: 'fighting',
        firstCharacter: battle.firstCharacter,
        secondCharacter: battle.secondCharacter,
        stage: battle.stage,
      });
    }, waitingScreenDuration);

    return (
      <ErrorBoundary>
        <EnvironmentContext.Provider value={environment}>
          <ConfigurationContext.Provider value={configuration}>
            <Wrapper>
              {customBackground}
              <Stage stage={battle.stage} />
              <LeftSide character={battle.firstCharacter} />
              <RightSide character={battle.secondCharacter} />
              <Versus src={versusImagePath} />
            </Wrapper>
          </ConfigurationContext.Provider>
        </EnvironmentContext.Provider>
      </ErrorBoundary>
    );
  };

  const displayFightScreen = () => {
    const options = [];
    options.push('-p1', battle.firstCharacter.definition);
    options.push('-p2', battle.secondCharacter.definition);
    options.push('-s', battle.stage.definition);
    options.push('-rounds', roundCount);
    if (configuration.motif) {
      options.push('-r', configuration.motif);
    }
    //options.push("-p1.color", 1);
    //options.push("-p2.color", 1);
    options.push('-p1.ai', 10);
    options.push('-p2.ai', 10);

    backgroundSound.pause();
    //remote.getCurrentWindow().minimize();

    console.log(environment.mugenPath, options);
    execFile(
      environment.mugenPath,
      options,
      {
        cwd: environment.currentDirectory,
      },
      () => {
        backgroundSound.play();
        createRandomFight();
        //remote.getCurrentWindow().restore();
      },
    );

    return <BlackScreen>Fighting ...</BlackScreen>;
  };

  const createRandomFight = () => {
    const firstCharacter = getRandomCharacter(configuration.categories);
    const secondCharacter = getRandomCharacter(configuration.categories, [
      firstCharacter,
    ]);

    setBattle({
      state: 'waiting',
      firstCharacter,
      secondCharacter,
      stage: getRandomStage(configuration.stages),
    });
  };

  switch (battle.state) {
    default:
    case 'waiting':
      return displayWaitScreen(battle.firstCharacter, battle.secondCharacter);
    case 'fighting':
      return displayFightScreen();
  }
}

export default function App() {
  if (!currentDirectory) {
    return (
      <Requirement>
        <p>No current directory</p>
      </Requirement>
    );
  }

  const jsonFilePath = path.resolve(currentDirectory, 'quick-versus.json');
  const yamlFilePath = path.resolve(currentDirectory, 'quick-versus.yml');
  if (!fs.existsSync(jsonFilePath) && !fs.existsSync(yamlFilePath)) {
    return (
      <Requirement>
        <p>
          Configuration file is missing:
          {jsonFilePath}
        </p>
      </Requirement>
    );
  }

  const mugenPath = path.resolve(currentDirectory, 'mugen.exe');
  if (!fs.existsSync(mugenPath)) {
    return (
      <Requirement>
        <p>
          Mugen executable file is missing:
          {mugenPath}
        </p>
      </Requirement>
    );
  }

  let configuration;
  let configurationFilePath;
  if (fs.existsSync(jsonFilePath)) {
    const jsonContent = fs.readFileSync(jsonFilePath);
    try {
      configuration = JSON.parse(jsonContent);
      configurationFilePath = jsonFilePath;
    } catch (error) {
      return (
        <FatalError>
          <p>Invalid JSON configuration file:</p>
          <p>{jsonFilePath}</p>
          <p>{error.message}</p>
        </FatalError>
      );
    }
  } else if (fs.existsSync(yamlFilePath)) {
    try {
      configuration = configYaml(yamlFilePath);
      configurationFilePath = yamlFilePath;
    } catch (error) {
      return (
        <FatalError>
          <p>Invalid YAML configuration file:</p>
          <p>{yamlFilePath}</p>
          <p>{error.message}</p>
        </FatalError>
      );
    }
  }

  const environment = {
    app,
    currentDirectory,
    mugenPath,
    configurationFilePath,
    isDev,
  };

  let customBackground;
  if (configuration.background) {
    const imagePath = path.resolve(
      environment.currentDirectory,
      configuration.background,
    );
    if (fs.existsSync(imagePath)) {
      customBackground = <CustomBackground src={imagePath} />;
    }
  }

  let backgroundSound = noSound;
  if (configuration.sound && configuration.sound.background) {
    let volume = 100;
    if (configuration.sound.volume) {
      volume = configuration.sound.volume;
    }

    const soundPath = path.resolve(
      environment.currentDirectory,
      configuration.sound.background,
    );
    if (fs.existsSync(soundPath)) {
      const audio = new Audio(soundPath);
      audio.volume = volume / 100;
      audio.loop = true;
      audio.play();

      backgroundSound = audio;
    }
  }

  let waitingScreenDuration = 5000;
  if (configuration.waitingScreenDuration) {
    waitingScreenDuration = configuration.waitingScreenDuration;
  }

  let roundCount = 1;
  if (configuration.roundCount) {
    roundCount = configuration.roundCount;
  }

  return (
    <Loop 
      configuration={configuration} 
      environment={environment} 
      waitingScreenDuration={waitingScreenDuration}
      roundCount={roundCount}
      backgroundSound={backgroundSound}
      customBackground={customBackground}
    />
  );
}
