import NotFoundScreen from "@/components/NotFoundScreen";
import TransitionStage from "@/components/transition/TransitionStage";

export default function NotFound() {
  return (
    <TransitionStage className="relative h-dvh">
      <NotFoundScreen fullscreen />
    </TransitionStage>
  );
}
