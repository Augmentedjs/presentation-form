import { Widget } from "presentation-widget";

/**
 * @function formCompile Creats the markup for the form
 * @param {string} name Name of the form
 * @param {string} description A description
 * @param {object} fields Object of fields with types (see JSON scheme properties format)
 * @param {object} model Data for the fields by key
 * @param {array} required Array of requires fields
 * @param {string} binding Name of the binding function
 * @param {array} display Array of fields to display
 * @param {Dom} nestedInput Dom tree of nested markup
 * @param {string} submitButton Name of the Submit button
 * @param {string} resetButton  Name of the reset button
 * @param {string} style Name of styles
 * @param {string} tagName Name of tag
 * @param {boolean} legacy Set old markup style
 * @returns {Dom} Dom tree of form elements
 */
const formCompile = (
                      name,
                      description,
                      fields,
                      model,
                      required,
                      binding,
                      display,
                      nestedInput,
                      submitButton,
                      resetButton,
                      style,
                      tagName,
                      legacy = false,
                      large = false
                    ) => {
  const form = document.createElement(tagName),
        fs = document.createElement("fieldset"),
        keys = Object.keys(fields),
        l = ((display) ? display.length: keys.length);
  let t, i, input, lb, req;

  if (style) {
    const styles = style.split(" ");
    if (styles) {
      for (i = 0; i < styles.length; i++) {
        form.classList.add(styles[i]);
      }
    }
  }

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

  if (!display) {
    display = keys;
  }

  let container;
  for (i = 0; i < l; i++) {
    let displayCol = true;
    if (display) {
      displayCol = (keys.indexOf(display[i]) !== -1) ? true : false;
    }

    if (displayCol) {
      container = document.createElement("div");
      let css = "input";

      if (large) {
        css += " large";
      }
      container.setAttribute("class", css);
      req = (required.indexOf(display[i]) !== -1);
      lb = document.createElement("label");
      lb.setAttribute("for", display[i]);
      t = document.createTextNode(fields[display[i]].description);
      lb.appendChild(t);
      input = Widget.Input(fields[display[i]], display[i], model[display[i]], display[i], req, binding);

      /* set the css class to 'select' for better styles */
      if (input.tagName === "select" ) {
        css = "select";
      }
      input.setAttribute("placeholder", display[i]);
      if (nestedInput) {
        if (input) {
          lb.appendChild(input);
        }
        container.appendChild(lb);
      } else if (legacy) {
        container.appendChild(lb);
        if (input) {
          container.appendChild(input);
        }
      } else {
        if (input) {
          container.appendChild(input);
        }
        container.appendChild(lb);
      }
      fs.appendChild(container);
    }
  }

  if (resetButton) {
    const reset = document.createElement("button");
    reset.setAttribute("type", "reset");
    reset.setAttribute(`data-${binding}`, "reset");
    reset.setAttribute("data-click", "reset");
    const t = document.createTextNode(resetButton);
    reset.appendChild(t);
    form.appendChild(reset);
  }

  if (submitButton) {
    const submit = document.createElement("button");
    submit.setAttribute("type", "submit");
    submit.setAttribute(`data-${binding}`, "submit");
    submit.setAttribute("data-click", "submit");
    const t = document.createTextNode(submitButton);
    submit.appendChild(t);
    form.appendChild(submit);
  }
  return form;
};

export default formCompile;
