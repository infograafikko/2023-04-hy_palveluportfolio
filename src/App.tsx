import {
  Component,
  Show,
  batch,
  createEffect,
  createSignal,
  onCleanup,
} from "solid-js";
import { WindowEventListener } from "@solid-primitives/event-listener";

import { Node, Edge, SolidFlow } from "./SolidFlow/src/index";
import PinchZoomPan from "./Components/PinchZoomPan";
import css from "./App.module.css";
import { initialTsv } from "./data/data";
import Logo from "./assets/Logo";
import { formJson } from "./data/dataWrangling";
import ServiceCard from "./ServiceCard";

const Simple: Component = () => {
  const [tsv, setTsv] = createSignal(initialTsv);
  const [loading, setLoading] = createSignal(false);
  const [filterGroupOne, setFilterGroupOne] = createSignal("");
  const [filterGroupTwo, setFilterGroupTwo] = createSignal("");

  const [formedJson, setFormedJson] = createSignal(
    formJson(tsv(), filterGroupOne(), filterGroupTwo())
  );

  const [selectedIndex, setSelectedIndex] = createSignal();

  const handleChange = () => {
    setFormedJson({ nodes: [], edges: [], arr: [] });
    setLoading(true);
    //Time out updates empty nodes and forces rerender
    setTimeout(() => {
      setFormedJson(formJson(tsv(), filterGroupOne(), filterGroupTwo()));
      setLoading(false);
    }, 100);
  };

  createEffect(() => {
    console.log(formedJson().nodes.length);
    console.log(formedJson().arr?.[selectedIndex()]);
  });

  return (
    <div class={css.root}>
      <section class={css.tool}>
        <div style="background-color: var(--brand-main-nearly-black);">
          <Logo />
        </div>
        <h1 class={css.h1title + " text-xxl"}>Tutki palvelu-portfoliota</h1>
        <div>
          <h2 class={css.h2tool}>Rajaa ja muuta dataa</h2>
          <p>
            Alla olevissa tekstikentissä voit rajata hakusanoilla, mitkä
            palvelukortit näytetään.
          </p>
          <div class={css.inputfilter}>
            <h3>Valitse käyttäjäryhmä</h3>
            <select
              onChange={(e) => {
                setFilterGroupOne(e.target.value);
                handleChange();
              }}
            >
              <option value="" selected>
                Kaikki
              </option>
              <option value="opiskelija">Opiskelija</option>
              <option value="työntekijä">Työntekijä</option>
              <option value="johto">Johto</option>
              <option value="tutkija">Tutkija</option>
              <option value="opettaja">Opettaja</option>
              <option value="johto">Johto</option>
              <option value="yhteiskunta">Yhteiskunta</option>
            </select>
          </div>
          <div class={css.inputfilter}>
            <h3>Kirjoita palvelutuotannon omistaja</h3>
            <input
              onInput={(e) => setFilterGroupTwo(e.target.value)}
              type="text"
            />
          </div>
          <div>
            <h2 class={css.h2tool}>Valittu palvelukortti</h2>
            <ServiceCard data={formedJson().arr?.[selectedIndex()]} />
          </div>
          <h2 class="my-2">
            Visualisoinnin data (liitä tähän data taulukosta)
          </h2>
          <textarea
            class={css.textarea}
            onInput={(e) => setTsv(e.target.value)}
            rows="4"
            cols="75"
          >
            {tsv()}
          </textarea>
          <button onClick={() => handleChange()} class={css.toolbutton}>
            Päivitä data
          </button>
          <WindowEventListener
            onkeypress={(e) => e.key === "Enter" && handleChange()}
          />
        </div>
      </section>
      {formedJson().nodes.length > 0 ? (
        <section class={css.canvas}>
          <PinchZoomPan
            height={formedJson().nodes.length}
            min={0.25}
            max={2.5}
            captureWheel
            class={css.wrapper}
          >
            <SolidFlow
              //nodes={nodes()}
              //edges={edges()}
              height={formedJson().nodes.length}
              nodes={formedJson().nodes}
              edges={formedJson().edges}
              setSelectedIndex={setSelectedIndex}
            />
          </PinchZoomPan>
        </section>
      ) : (
        <div class={css.loading}>
          <p class={css.loadingtext}>
            {loading() ? "Ladataan..." : "Ei dataa"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Simple;
