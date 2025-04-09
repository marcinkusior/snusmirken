import { BasicWindow } from "~/app/_components/window/BasicWindow";
import { useMusicPlayerWindowStore } from "~/app/stores/MusicPlayerWindowStore";
import { Play } from "lucide-react";
import { MusicPlayer } from "./MusicPlayer";

export const MusicPlayerWindow = () => {
  const close = useMusicPlayerWindowStore((state) => state.close);
  const isOpen = useMusicPlayerWindowStore((state) => state.isOpen);

  const minimize = useMusicPlayerWindowStore((state) => state.minimize);
  const isMinimized = useMusicPlayerWindowStore((state) => state.isMinimized);

  return (
    <BasicWindow
      defaultPosition={{ x: 460, y: 100 }}
      title="Music Player.exe"
      onClose={close}
      isOpen={isOpen}
      icon={<Play size={22} strokeWidth={2} fill="white" />}
      minimize={minimize}
      isMinimized={isMinimized}
      taskbarButtonId="music-player-taskbar-button"
    >
      <MusicPlayer />
    </BasicWindow>
  );
};
