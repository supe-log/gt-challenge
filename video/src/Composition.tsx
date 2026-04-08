import React from "react";
import { Sequence } from "remotion";
import { Scene1Hook } from "./Scene1Hook";
import { Scene2Problem } from "./Scene2Problem";
import { Scene3Solution } from "./Scene3Solution";
import { Scene4Frontend } from "./Scene4Frontend";
import { Scene5Backend } from "./Scene5Backend";
import { Scene6Flow } from "./Scene6Flow";
import { Scene7Built } from "./Scene7Built";
import { Scene8NeedsWork } from "./Scene8NeedsWork";
import { Scene9GettingStarted } from "./Scene9GettingStarted";
import { Scene10Outro } from "./Scene10Outro";

// Scene durations in frames at 30fps — total: 2850 frames (~95 sec)
const SCENES = [
  { Component: Scene1Hook, frames: 150 },           //  5 sec
  { Component: Scene2Problem, frames: 270 },         //  9 sec
  { Component: Scene3Solution, frames: 270 },        //  9 sec
  { Component: Scene4Frontend, frames: 390 },        // 13 sec
  { Component: Scene5Backend, frames: 390 },         // 13 sec
  { Component: Scene6Flow, frames: 390 },            // 13 sec
  { Component: Scene7Built, frames: 270 },           //  9 sec
  { Component: Scene8NeedsWork, frames: 270 },       //  9 sec
  { Component: Scene9GettingStarted, frames: 300 },  // 10 sec
  { Component: Scene10Outro, frames: 150 },          //  5 sec
] as const;

export const GTChallengeOverview: React.FC = () => {

  let offset = 0;
  return (
    <>
      {SCENES.map(({ Component, frames }, i) => {
        const from = offset;
        offset += frames;
        return (
          <Sequence key={i} from={from} durationInFrames={frames} name={`Scene${i + 1}`}>
            <Component />
          </Sequence>
        );
      })}
    </>
  );
};
