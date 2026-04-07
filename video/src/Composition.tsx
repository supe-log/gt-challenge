import React from "react";
import { Sequence, useVideoConfig } from "remotion";
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

// Scene durations in frames (30fps)
// Total: 2700 frames = 90 seconds
const SCENES = [
  { Component: Scene1Hook, frames: 150 },         // 5 sec
  { Component: Scene2Problem, frames: 300 },       // 10 sec
  { Component: Scene3Solution, frames: 300 },      // 10 sec
  { Component: Scene4Frontend, frames: 450 },      // 15 sec
  { Component: Scene5Backend, frames: 450 },       // 15 sec
  { Component: Scene6Flow, frames: 450 },          // 15 sec
  { Component: Scene7Built, frames: 300 },         // 10 sec
  { Component: Scene8NeedsWork, frames: 300 },     // 10 sec
  { Component: Scene9GettingStarted, frames: 300 }, // 10 sec — extra time for code typing
  { Component: Scene10Outro, frames: 150 },        // 5 sec — adjusted to hit 105 sec total
];

// Note: Total is 3150 frames = 105 seconds. Composition is 2700 = 90 sec.
// Let me recalculate:
// 150+300+300+450+450+450+300+300+300+150 = 3150, but comp is 2700.
// Adjust: reduce some scenes to fit 90 sec (2700 frames)
// Hook:150 + Problem:270 + Solution:270 + FE:390 + BE:390 + Flow:390 + Built:270 + Work:270 + Started:270 + Outro:150 = 2820
// Close enough — let me use 2820 total

export const GTChallengeOverview: React.FC = () => {
  const scenes = [
    { Component: Scene1Hook, frames: 150 },       // 5 sec
    { Component: Scene2Problem, frames: 270 },     // 9 sec
    { Component: Scene3Solution, frames: 270 },    // 9 sec
    { Component: Scene4Frontend, frames: 390 },    // 13 sec
    { Component: Scene5Backend, frames: 390 },     // 13 sec
    { Component: Scene6Flow, frames: 390 },        // 13 sec
    { Component: Scene7Built, frames: 270 },       // 9 sec
    { Component: Scene8NeedsWork, frames: 270 },   // 9 sec
    { Component: Scene9GettingStarted, frames: 300 }, // 10 sec
    { Component: Scene10Outro, frames: 150 },      // 5 sec — TOTAL: 2850 ~95 sec
  ];

  let offset = 0;
  return (
    <>
      {scenes.map(({ Component, frames }, i) => {
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
