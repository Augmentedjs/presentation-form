import { Widget } from "presentation-widget";

const formCompile = (name, description, fields, model, required, binding, display, nestedInput, submitButton, resetButton) => {
  const form = document.createElement("form"), fs = document.createElement("formset"), keys = Object.keys(fields), l = ((display) ? display.length: keys.length);
  let t, i, input, lb, req;

  form.appendChild(fs);

  if (name) {
    const lg = document.createElement("legend");
    t = document.createTextNode(name);
    if (description) {
      const att = document.createAttribute("title");
      att.value = description;
      lg.setAttributeNode(att);
    }
    lg.appendChild(t);
    fs.appendChild(lg);
  }
  //console.debug("form display fields", display);

  if (!display) {
    display = keys;
  }

  for (i = 0; i < l; i++) {
    let displayCol = true;
    if (display) {
      //console.debug("form field: " + display[i] + " is present: " + keys.indexOf(display[i]) );
      displayCol = (keys.indexOf(display[i]) !== -1) ? true : false;
    }

    if (displayCol) {
      req = (required.indexOf(display[i]) !== -1);
      lb = document.createElement("label");
      lb.setAttribute("for", display[i]);
      t = document.createTextNode(fields[display[i]].description);
      lb.appendChild(t);
      input = Widget.Input(fields[display[i]], display[i], model[display[i]], display[i], req, binding);
      if (nestedInput) {
        if (input) {
          lb.appendChild(input);
        }
        fs.appendChild(lb);
      } else {
        fs.appendChild(lb);
        if (input) {
          fs.appendChild(input);
        }
      }
    }
  }

  if (resetButton) {
    const reset = document.createElement("button");
    reset.setAttribute("type", "reset");
    reset.setAttribute(`data-${name}`, binding);
    form.appendChild(reset);
  }

  if (submitButton) {
    const submit = document.createElement("button");
    submit.setAttribute("type", "submit");
    submit.setAttribute(`data-${name}`, binding);
    form.appendChild(submit);
  }
  return form;
};

export default formCompile;
