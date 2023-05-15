export const formJson = (tsv, filterOne, filterTwo) => {
  const splitTsv = tsv.split("\n");
  const tsvTitles = splitTsv.shift()?.split("\t");

  const tsvBody = splitTsv.map((t) => t.split("\t"));

  const arr: [] = [];

  //create array of object for each child card
  tsvBody.map((b, i) => {
    arr[i] = {};
    tsvTitles?.map((t, it) => {
      arr[i][t] = b[it];
    });
  });

  const filteredArr = arr.filter((d) => {
    //Filter one should match index 2
    const filterOneSmall = filterOne.toLowerCase();
    const filterTwoSmall = filterTwo.toLowerCase();
    console.log(filterOneSmall, filterTwoSmall);

    if (filterOne.length === 0 && filterTwo.length === 0) return true;
    else if (
      d[tsvTitles[2]]?.toLowerCase()?.includes(filterOneSmall) &&
      filterTwo.length === 0
    )
      return true;
    else if (
      d[tsvTitles[5]]?.toLowerCase().includes(filterTwoSmall) &&
      filterOne.length === 0
    )
      return true;
    else if (
      d[tsvTitles[2]]?.toLowerCase()?.includes(filterOneSmall) &&
      d[tsvTitles[5]]?.toLowerCase()?.includes(filterTwoSmall)
    )
      return true;
    else return false;
  });

  const sortedArr = filteredArr.sort((a, b) => {
    const at = a[tsvTitles[0]];
    const bt = b[tsvTitles[0]];

    if (at < bt) return -1;
    else if (at > bt) return 1;
    else return 0;
  });
  console.log(sortedArr);

  //there are two levels of cards - use first title as parent card (tsvTitles[0])
  //get unique parent cards
  const parentCards = [...new Set(sortedArr.map((d) => d[tsvTitles[0]]))];

  //create edges and nodes
  const enObj = { edges: [], nodes: [], arr: [...parentCards, ...sortedArr] };

  parentCards.forEach((d, i) => {
    const indexOfFirstChildCard = sortedArr
      .map((a) => a[tsvTitles[0]])
      .indexOf(d);
    enObj.nodes.push({
      id: "parentnode-" + i,
      position: { x: 50, y: 100 * indexOfFirstChildCard + 100 },
      data: {
        content: <p style={{ "max-width": "300px" }}>{d}</p>,
      },
      inputs: 0,
      outputs: 1,
    });
  });

  //child nodes
  sortedArr.forEach((d, i) => {
    enObj.nodes.push({
      id: "childnode-" + i,
      position: { x: 750, y: 100 * i + 100 },
      data: {
        content: (
          <div style={{ "max-width": "400px" }}>
            <div class="card-title">
              <p>{d[tsvTitles[1]]}</p>
            </div>
            <div
              class="card-content-hide"
              id={"card-" + Number(parentCards.length + i)}
            >
              {tsvTitles.map((t) => {
                return (
                  <p>
                    <b>{t}</b>: {d[t]}
                  </p>
                );
              })}
            </div>
          </div>
        ),
      },
      inputs: 1,
      outputs: 0,
    });
  });

  //edges between parent and child
  sortedArr.forEach((d, i) => {
    const indexOfFirstParentCard = parentCards.indexOf(d[tsvTitles[0]]);

    enObj.edges.push({
      id: "edge_" + d[tsvTitles[0]] + "_" + d[tsvTitles[1]],
      sourceNode: "parentnode-" + indexOfFirstParentCard,
      sourceOutput: 0,
      targetNode: "childnode-" + i,
      targetInput: 0,
    });
  });

  console.log(enObj);
  return enObj;
};
