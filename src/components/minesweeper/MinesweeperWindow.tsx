import { BasicWindow } from "~/app/_components/window/BasicWindow";
import { Minesweeper } from "./Minesweeper";
import { useMinesweepurrrWindowStore } from "~/app/stores/minesweepurrrWindowStore";
import { Bomb } from "lucide-react";

export const MinesweeperWindow = () => {
  const close = useMinesweepurrrWindowStore((state) => state.close);
  const isOpen = useMinesweepurrrWindowStore((state) => state.isOpen);

  const minimize = useMinesweepurrrWindowStore((state) => state.minimize);
  const isMinimized = useMinesweepurrrWindowStore((state) => state.isMinimized);

  return (
    <BasicWindow
      defaultPosition={{ x: 460, y: 100 }}
      title="Minesweepurr.exe"
      onClose={close}
      isOpen={isOpen}
      icon={<Bomb size={22} strokeWidth={2} fill="white" />}
      minimize={minimize}
      isMinimized={isMinimized}
      taskbarButtonId="minesweeper-taskbar-button"
    >
      <Minesweeper />
    </BasicWindow>
  );
};
