import { JSX, onCleanup } from "solid-js";
import { create } from "./src";
import css from "./PinchZoomPan.module.css";

interface IProps {
  min?: number;
  max?: number;
  captureWheel?: boolean;
  class?: string;
  children: JSX.Element;
  defaultState: object;
}

function PinchZoomPan(props: IProps) {
  let element: HTMLDivElement;
  let cleanup: () => void;

  setTimeout(() => {
    cleanup = create({
      element,
      minZoom: props.min,
      maxZoom: props.max,
      captureWheel: props.captureWheel,
      nodeLen: props.height,
    });
  });

  onCleanup(() => cleanup());

  return (
    <div
      // @ts-ignore
      ref={element}
      class={css.root}
      classList={{ [props.class || ""]: !!props.class }}
    >
      <div class={css.point}>
        <div class={css.canvas}>{props.children}</div>
      </div>
    </div>
  );
}

export default PinchZoomPan;
