import React from "react";
import { Composition } from "remotion";
import { GTChallengeOverview } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="GTChallengeOverview"
        component={GTChallengeOverview}
        durationInFrames={3030}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
