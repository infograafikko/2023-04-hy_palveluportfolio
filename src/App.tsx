import { Component, Show, createEffect, createSignal } from "solid-js";
import { WindowEventListener } from "@solid-primitives/event-listener";

import { SolidFlow } from "./SolidFlow/src/index";
import PinchZoomPan from "./PinchZoomPanTool/PinchZoomPanTool";
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

const filterOneValues = [
  "johto",
  "opettaja",
  "oppija",
  "tutkija",
  "työntekijä",
  "yhteiskunta",
];

const App: Component = () => {
  const [tsv, setTsv] = createSignal(initialTsv);
  const [filterGroupOne, setFilterGroupOne] = createSignal(filterOneValues);
  const [loading, setLoading] = createSignal(false);
  const [formedJson, setFormedJson] = createSignal(formJson(tsv()));
  const [wholeExplainer, showWholeExplainer] = createSignal(false);

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
    //console.log(filterGroupOne());
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
        <h1 class={css.h1title}>
          Tutki <br />
          palvelu&shy;portfoliota
        </h1>
        <Show when={!wholeExplainer()}>
          <p class="mt-3">
            Palveluportfoliosta löydät{" "}
            <span
              onClick={() => showWholeExplainer(true)}
              class="underline cursor-pointer"
            >
              (klikkaa lukeaksesi lisää...)
            </span>
          </p>
        </Show>
        <Show when={wholeExplainer()}>
          <p class="mt-3">
            Palveluportfoliosta löydät Yliopistopalveluiden
            palvelukokonaisuudet, palvelut ja palvelukortit. Klikkaamalla
            palvelua avautuu palvelukortti, josta löytyy palveluun liittyviä
            tietoja. Valitun palvelun tunnistat tummansinisestä taustasta.
          </p>
        </Show>
        <div>
          <h2 class={css.h2tool}>Valittu palvelukortti</h2>
          <ServiceCard data={formedJson().arr?.[selectedIndex()]} />
        </div>
        <div>
          <h2 class={css.h2tool}>Rajaa näytettäviä palveluita</h2>
          {/* {<p>
            Alla olevissa tekstikentissä voit rajata hakusanoilla, mitkä
            palvelukortit näytetään.
          </p>} */}
          <div class={css.inputfilter}>
            <fieldset
              onChange={(e) => {
                const checkboxValue = e.target.name;
                const index = filterGroupOne().indexOf(checkboxValue);
                const newFilterGroupOne = [...filterGroupOne()];
                index >= 0
                  ? newFilterGroupOne.splice(index, 1)
                  : newFilterGroupOne.push(checkboxValue);

                setFilterGroupOne(newFilterGroupOne);
                handleChange();
              }}
            >
              <legend>Valitse käyttäjäryhmät:</legend>
              <For each={filterOneValues}>
                {(el, i) => (
                  <div>
                    <input
                      style={{ "margin-right": "4px" }}
                      type="checkbox"
                      id={el}
                      name={el}
                      checked
                    />
                    <label for={el}>{el}</label>
                  </div>
                )}
              </For>
            </fieldset>
          </div>
          {/* <div class={css.inputfilter}>
            <h3>Kirjoita palvelutuotannon omistaja</h3>
            <input
              id="ownerinput"
              onInput={(e) => setFilterGroupTwo(e.target.value)}
              type="text"
            />
          </div> */}
          <h2 class="my-2">Visualisoinnin data (vain pääkäyttäjille)</h2>
          <textarea
            class={css.textarea}
            onInput={(e) => setTsv(e.target.value)}
            rows="4"
            cols="75"
          >
            {tsv()}
          </textarea>
          <button
            onClick={() => {
              setLoading(true);
              setFormedJson(formJson(tsv()));
              setTimeout(() => setLoading(false), 0);
            }}
            class={css.toolbutton}
          >
            Päivitä data
          </button>
          <WindowEventListener onkeydown={(e) => handleKeyPress(e.key)} />
        </div>
      </section>
      <Show when={!loading()}>
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
      </Show>
    </div>
  );
};

export default App;
