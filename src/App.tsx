import {
  Component,
  Show,
  batch,
  createEffect,
  createSignal,
  onCleanup,
} from "solid-js";
import { WindowEventListener } from "@solid-primitives/event-listener";
import { MultiSelect } from "@digichanges/solid-multiselect";

import { Node, Edge, SolidFlow } from "./SolidFlow/src/index";
import PinchZoomPan from "./Components/PinchZoomPan";
import css from "./App.module.css";
import { initialTsv } from "./data/data";
import Logo from "./assets/Logo";
import { formJson } from "./data/dataWrangling";
import ServiceCard from "./ServiceCard";

function fireMouseEvents(query, eventNames) {
  var element = document.querySelector(query);
  if (element && eventNames && eventNames.length) {
    for (var index in eventNames) {
      var eventName = eventNames[index];
      if (element.fireEvent) {
        element.fireEvent("on" + eventName);
      } else {
        var eventObject = document.createEvent("MouseEvents");
        eventObject.initEvent(eventName, true, false);
        element.dispatchEvent(eventObject);
      }
    }
  }
}

const App: Component = () => {
  const [tsv, setTsv] = createSignal(initialTsv);
  const [filterGroupOne, setFilterGroupOne] = createSignal([
    "oppija",
    "työntekijä",
    "johto",
    "tutkija",
    "opettaja",
    "yhteiskunta",
  ]);
  const [filterGroupTwo, setFilterGroupTwo] = createSignal("");

  const [formedJson, setFormedJson] = createSignal(
    formJson(tsv(), filterGroupOne(), filterGroupTwo())
  );

  const [selectedIndex, setSelectedIndex] = createSignal(0);

  const handleChange = () => {
    //Time out updates empty nodes and forces rerender

    const els = document.querySelectorAll(".node-holder");

    els.forEach((el) => {
      const userGroups = el.getAttribute("usergroups");
      if (filterGroupOne().some((d) => userGroups.includes(d)))
        el.classList.remove("inactive");
      else el.classList.add("inactive");
    });
  };

  const handleKeyPress = (key) => {
    key === "Enter" && handleChange();
    key.includes("Arrow") && changeSelectedByArrow(key);
  };

  const changeSelectedByArrow = (key) => {
    let newIndex = selectedIndex();
    if (key.includes("Down")) newIndex = newIndex + 1;
    if (key.includes("Up")) newIndex = newIndex - 1;
    if (key.includes("Left")) {
      const listOfPalvelukokonaisuus = [
        ...new Set(
          formedJson()
            .arr?.map((d) => d?.Palvelukokonaisuus)
            .filter((d) => d !== undefined)
        ),
      ];

      const indexOfPalvelukokonaisuus = listOfPalvelukokonaisuus.indexOf(
        formedJson().arr?.[selectedIndex()]?.Palvelukokonaisuus
      );
      //if index matches (not -1) update newindex
      if (indexOfPalvelukokonaisuus >= 0) newIndex = indexOfPalvelukokonaisuus;
    }
    if (key.includes("Right")) {
      const palvelukokonaisuus = formedJson().arr?.map(
        (d) => d?.Palvelukokonaisuus
      );
      const indexOfPalvelukokonaisuus = palvelukokonaisuus.indexOf(
        formedJson().arr?.[selectedIndex()]
      );
      if (indexOfPalvelukokonaisuus >= 0) newIndex = indexOfPalvelukokonaisuus;
    }

    fireMouseEvents(`#nodecontainer .nodeChild:nth-child(${newIndex + 1})`, [
      "mouseover",
      "mousedown",
      "mouseup",
      "click",
    ]);
    newIndex >= 0 && setSelectedIndex(newIndex);
  };

  createEffect(() => {
    //console.log(formedJson().nodes.length);
    //console.log(selectedIndex());
    //console.log(formedJson().arr?.[selectedIndex()]);
    fireMouseEvents(
      `#nodecontainer .nodeChild:nth-child(${selectedIndex() + 1})`,
      ["mouseover", "mousedown", "mouseup", "click"]
    );
  });

  return (
    <div class={css.root}>
      <section class={css.tool}>
        <div style="background-color: var(--brand-main-nearly-black);">
          <Logo />
        </div>
        <h1 class={css.h1title + " text-xxl"}>Tutki palvelu-portfoliota</h1>
        <div>
          <h2 class={css.h2tool}>Valittu palvelukortti</h2>
          <ServiceCard data={formedJson().arr?.[selectedIndex()]} />
        </div>
        <div>
          <h2 class={css.h2tool}>Rajaa ja muuta dataa</h2>
          <p>
            Alla olevissa tekstikentissä voit rajata hakusanoilla, mitkä
            palvelukortit näytetään.
          </p>
          <div class={css.inputfilter}>
            <h3>Kirjoita palvelutuotannon omistaja</h3>
            <input
              onInput={(e) => setFilterGroupTwo(e.target.value)}
              type="text"
            />
          </div>
          <div class={css.inputfilter}>
            <h3>Valitut käyttäjäryhmät</h3>
            <MultiSelect
              style={{ chips: { color: "black", "background-color": "white" } }}
              options={[
                "oppija",
                "työntekijä",
                "johto",
                "tutkija",
                "opettaja",
                "yhteiskunta",
              ]}
              onSelect={(d) => {
                setFilterGroupOne(d);
                handleChange();
              }}
              onRemove={(d) => {
                setFilterGroupOne(d);
                handleChange();
              }}
              selectedValues={filterGroupOne()}
              hidePlaceholder={true}
            />
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
          <WindowEventListener onkeydown={(e) => handleKeyPress(e.key)} />
        </div>
      </section>
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
    </div>
  );
};

export default App;
