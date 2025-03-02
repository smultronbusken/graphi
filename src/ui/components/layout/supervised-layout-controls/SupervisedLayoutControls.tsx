import { Button, Flex } from "@radix-ui/themes";
import { useContext, useState } from "react";
import { PixiContext } from "@/main";
import { PlayIcon, StopIcon } from "@radix-ui/react-icons";

interface SupervisedLayoutControlsProps {
  tickFn: (arg: any) => void;
}

export default function SupervisedLayoutControls({ tickFn }: SupervisedLayoutControlsProps) {
  const appContext = useContext(PixiContext);
  const [isRunning, setIsRunning] = useState(false);

  const toggleForce = () => {
    if (isRunning) {
      appContext?.pixi.ticker.remove(tickFn);
      setIsRunning(false);
    } else {
      appContext?.pixi.ticker.add(tickFn);
      setIsRunning(true);
    }
  };

  return (
    <Flex align="center" gap="2">
      <Button onClick={toggleForce}>
        {isRunning ? (
          <>
            Stop
          </>
        ) : (
          <>
            Start
          </>
        )}
      </Button>
      {isRunning ? (
        <>
          <StopIcon style={{ marginRight: "4px" }} />
        </>
      ) : (
        <>
          <PlayIcon style={{ marginRight: "4px" }} />
        </>
      )}
    </Flex>
  );
}
