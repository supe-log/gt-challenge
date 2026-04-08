import React from "react";
import { Sequence } from "remotion";
import { Scene1Hook } from "./Scene1Hook";
import { Scene2Problem } from "./Scene2Problem";
import { Scene3Solution } from "./Scene3Solution";
import { Scene4Frontend } from "./Scene4Frontend";
import { Scene5Backend } from "./Scene5Backend";
import { Scene6Flow } from "./Scene6Flow";
import { Scene7Screens } from "./Scene7Screens";
import { Scene7Built } from "./Scene7Built";
import { Scene8NeedsWork } from "./Scene8NeedsWork";
import { Scene9GettingStarted } from "./Scene9GettingStarted";
import { Scene10Outro } from "./Scene10Outro";

// Scene durations in frames at 30fps — total: 3120 frames (~104 sec)
const SCENES = [
  { Component: Scene1Hook, frames: 180 },            //  6 sec — now has screenshot
  { Component: Scene2Problem, frames: 270 },          //  9 sec
  { Component: Scene3Solution, frames: 300 },         // 10 sec — now has screenshots
  { Component: Scene4Frontend, frames: 360 },         // 12 sec
  { Component: Scene5Backend, frames: 360 },          // 12 sec
  { Component: Scene6Flow, frames: 360 },             // 12 sec
  { Component: Scene7Screens, frames: 270 },          //  9 sec — NEW: app screenshots showcase
  { Component: Scene7Built, frames: 270 },            //  9 sec
  { Component: Scene8NeedsWork, frames: 240 },        //  8 sec
  { Component: Scene9GettingStarted, frames: 270 },   //  9 sec
  { Component: Scene10Outro, frames: 150 },           //  5 sec
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
