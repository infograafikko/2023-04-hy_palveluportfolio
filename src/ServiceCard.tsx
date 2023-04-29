import { For, Show, createEffect } from "solid-js";
import css from "./App.module.css";

const ParentCard = (props) => {
  return (
    <p>
      <b>{props.text}</b>
    </p>
  );
};

const ChildCard = (props) => {
  console.log(props);
  return (
    <p style={{ margin: "6px 0" }}>
      <b>{props.title}:</b>{" "}
      {props.text.split("\r").map((r) => (
        <>
          <span>{r}</span>
          <br />
        </>
      ))}
    </p>
  );
};

const ServiceCard = (props) => {
  const keys = () => props?.data && Object.keys(props?.data);
  const getValue = (index, key) => props.data[index][key];
  const dataType = (match) => typeof props?.data === match;
  createEffect(() => {
    console.log(typeof props.data === "object");
  });

  return (
    <div class={css.servicecard}>
      <Show when={keys()}>
        {dataType("undefined") ? (
          <></>
        ) : dataType("string") ? (
          <ParentCard text={props.data} />
        ) : (
          <For each={keys()}>
            {(key, i) => {
              return <ChildCard title={key} text={props.data[key]} />;
            }}
          </For>
        )}
      </Show>
    </div>
  );
};

export default ServiceCard;
