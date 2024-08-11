async function get_research() {
  return await fetch("./research.json").then(async (val) => await val.json());
}

function create_row(td1, td2) {
  let row = document.createElement("tr");
  let td = document.createElement("td");
  td.innerHTML = td1;
  row.appendChild(td);
  td = document.createElement("td");
  td.innerHTML = td2;
  row.appendChild(td);
  return row;
}

function create_element(data) {
  let element = document.createElement("div");
  if(!data.name) {
    return element;
  }

  let title = document.createElement("h2");
  title.innerHTML = data.name;
  element.appendChild(title);

  let body = document.createElement("table");

  body.appendChild(create_row("Description", data.desc));
  body.appendChild(create_row("Item Name", data.item_name));
  body.appendChild(create_row("ID", data.id));

  body.appendChild(create_row("Req Tech", Object.entries(data.req_tech).map(([type, num]) => (
    type.charAt(0).toUpperCase() + type.slice(1) + ": " + num
  )).join(", ")));

  element.appendChild(body);

  return element;
}

let research;
async function render(filter) {
  let target = document.getElementById("research")
  target.innerHTML = "";

  let sortedByCategory = {};
  for (let obj of research) {
    let arr = sortedByCategory[obj.category[0]];
    if (!arr) {
      sortedByCategory[obj.category[0]] = [obj];
    } else {
      sortedByCategory[obj.category[0]].push(obj);
    }
  }
  
  for (let [category, entries] of Object.entries(sortedByCategory).sort((a, b) => a[0].localeCompare(b[0]))) {
    if (category == "undefined") { category = "Unspecified" };
    let container = document.createElement("details");
    let title = document.createElement("summary");
    title.innerHTML = category;
    container.appendChild(title);
    
    let sortedFilteredEntries = entries.filter((val) => {
      if (filter) {
        return val.name?.includes(filter);
      } else {
        return true;
      }
    }).sort((a, b) => a.sort_string.localeCompare(b.sort_string) || a.name?.localeCompare(b.name));
    if (sortedFilteredEntries.length === 0) {
      continue;
    }
    
    let body = document.createElement("p");
    for (let research of sortedFilteredEntries) {
      body.appendChild(create_element(research));
    }
    container.appendChild(body);
  
    target.appendChild(container);
  }

  if (target.children.length === 0) {
    target.innerHTML = "No Results";
  }
}

async function main() {
  research = await get_research();

  await render();

  document.getElementById("search").onkeydown = (e) => {
    if (e.key === "Enter") {
      render(e.target.value);
    }
  }

  document.getElementById("searchbutton").onclick = (e) => {
    render(document.getElementById("search").value);
  }
}

window.onload = function () {
  main();
};