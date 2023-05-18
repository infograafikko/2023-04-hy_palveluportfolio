import { For, Show, createEffect } from "solid-js";
import css from "./App.module.css";
import snarkdown from "snarkdown";
const ParentCard = (props) => {
  return (
    <p>
      <b>{props.text}</b>
    </p>
  );
};

const ChildCard = (props) => {
  const text = () => props.text;

  return (
    <p style={{ margin: "6px 0" }}>
      <b>{props?.title}:</b>{" "}
      {text()
        ?.split("\r")
        .map((r) => (
          <>
            <span innerHTML={snarkdown(r)} />
            <br />
          </>
        ))}
    </p>
  );
};

const ServiceCard = (props) => {
  const keys = () => props?.data && Object.keys(props?.data);
  const getValue = (index, key) => props?.data[index][key];
  const dataType = (match) => typeof props?.data === match;

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
      <Show when={!keys()}>
        Voit tarkastella haluamaasi palvelukorttia lähemmin valitsemalla sen
        oikealla näkyvästä visualisoinnista.
      </Show>
    </div>
  );
};

export default ServiceCard;
