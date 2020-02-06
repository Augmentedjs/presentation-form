import { isObject } from "next-core-utilities";
import { DecoratorView } from "presentation-decorator";
import { request } from "presentation-request";
import { Model } from "presentation-models";
import Dom from "presentation-dom";
import formCompile from "./functions/buildForm.js";
import formatValidationMessages from "./functions/messages.js";

/**
 * A automatic form view created from a JSON Schema
 * <br/>
 *
 * Supported options:
 * <ul>
 * <li>schema - The JSON Schema for use with the UI and validation</li>
 * <li>data - prepopulate the model data</li>
 * <li>crossOrigin - Set CORS for the fetch</li>
 * <li>uri - the uri to fetch data from </li>
 * <li>title - the title of the form</li>
 * <li>description</li>
 * <li>display - Array of fields to display (others are hidden)</li>
 * <li>nestedInput - add additional markup in the form (DOM elements)</li>
 * <li>submitButton - set the name of the submit button (binds to a submit function)</li>
 * <li>resetButton - set the name of the reset button (binds to a reset function)</li>
 * </ul>
 * @param {Object} options Options for the class
 * @extends DecoratorView
 */
class AutomaticForm extends DecoratorView {
  constructor(options) {
    if (!options) {
      options = {};
    }
    super(options);
    this.crossOrigin = false;
    this._fields = {};
    this.uri = null;
    this.isInitalized = false;
    this.title = null;
    this.description = "";
    this._required = [];
    this.display = null;
    this.nestedInput = false;
    this.submitButton = false;
    this.resetButton = false;

    if (this.model && options && options.clearForm) {
      this.model.clear();
    } else if (!this.model) {
      this.model = new Model();
    }

    if (options.submitButton) {
      this.submitButton = options.submitButton;
    }

    if (options.resetButton) {
      this.resetButton = options.resetButton;
    }

    if (options.nestedInput) {
      this.nestedInput = options.nestedInput;
    }

    if (options.crossOrigin) {
      this.crossOrigin = options.crossOrigin;
    }
    if (options.schema) {
      // check if this is a schema vs a URI to get a schema
      if (isObject(options.schema)) {
        this.schema = options.schema;
      } else {
        // is a URI?
        let parsedSchema = null;
        try {
          parsedSchema = JSON.parse(options.schema);
          if (parsedSchema && isObject(parsedSchema)) {
            this.schema = parsedSchema;
          }
        } catch(e) {
          //_logger.warn("AUGMENTED: AutoForm parsing string schema failed.  URI perhaps?");
        }
        if (!this.schema) {
          this._retrieveSchema(options.schema);
          this.isInitalized = false;
        }
      }
    }

    if (options.el) {
      this.el = options.el;
    }

    if (options.uri) {
      this.uri = options.uri;
    }

    if (options.style) {
      this.style = options.style;
    } else {
     this.style = "material";
    }

    if (options.data && (isObject(options.data))) {
      this.model.set(options.data);
    }
    if (options.title) {
      this.title = options.title;
    }
    if (options.description) {
      this.description = options.description;
    }

    if (options.display) {
      this.display = options.display;
    }

    if (this.model && this.uri) {
      this.model.url = this.uri;
    }
    if (this.model) {
      this.model.crossOrigin = this.crossOrigin;
    }
    if (this.schema) {
      if ((!this.name || this.name === "") && this.schema.title) {
        this.name = this.schema.title;
      }
      if ((!this.description || this.description === "") && this.schema.description) {
        this.description = this.schema.description;
      }

      if (this.schema.required) {
        this._required = this.schema.required;
      } else {
        this._required = [];
      }

      if (!this.isInitalized) {
        this._fields = this.schema.properties;
        this.model.schema = this.schema;
        this.isInitalized = true;
      }
    } else {
      this.isInitalized = false;
    }
  };

  /**
   * The crossOrigin property - enables cross origin fetch
   * @property {boolean} crossOrigin The crossOrigin property
   */

  /**
   * The fields property
   * @property {object} _fields The fields property
   * @private
   */

  /**
   * The URI property
   * @property {string} uri The URI property
   */

  /**
   * The model property
   * @property {Model} model The model property
   */

  /**
   * The initialized property
   * @property {boolean} isInitalized The initialized property
   */

  /**
   * The title property
   * @property {string} title The title of the form
   */

  /**
   * The name property
   * @property {string} name The name of the form
   */

  /**
   * The description property
   * @property {string} description The description of the form
   */

  /**
   * The required fields property
   * @property {Array} _required The required fields
   * @private
   */

  /**
   * @property {array} display Fields to display - null will display all
   */

  _retrieveSchema(uri) {
    const that = this;
    let schema = null;
    return request({
      url: uri,
      contentType: "application/json",
      dataType: "json",
      success: (data, status) => {
        if (typeof data === "string") {
          schema = JSON.parse(data);
        } else {
          schema = data;
        }
        that.initialize({ "schema": schema });
      },
      error: (data, status) => {
        console.warn(`${this.name} Failed to fetch schema!`, status);
      }
    });
  };

  /**
   * Sets the URI
   * @param {string} uri The URI
   * @deprecated Use property
   */
  setURI(uri) {
    this.uri = uri;
  };

  /**
   * Sets the schema
   * @param {object} schema The JSON schema of the dataset
   */
  setSchema(schema) {
    this.schema = schema;
    this._fields = schema.properties;
    this.model.reset();
    this.model.schema = schema;

    if (this.uri) {
      model.url = this.uri;
    }
  };

  /**
   * Enable/Disable the progress bar
   * @param {boolean} show Show or Hide the progress bar
   */
  showProgressBar(show) {
    if (this.el) {
      const e = Dom.selector(this.el);
      if (e) {
        const p = e.querySelector("progress");
        if (p) {
          p.style.display = (show) ? "block" : "none";
          p.style.visibility = (show) ? "visible" : "hidden";
        }
      }
    }
  };

  /**
   * Show a message related to the form
   * @param {string} message Some message to display
   */
  showMessage(message) {
    if (this.el) {
      const e = Dom.selector(this.el);
      if (e) {
        const p = e.querySelector("p[class=message]");
        if (p) {
          p.innerHTML = message;
        }
      }
    }
  };

  /**
   * Validate the form
   * @returns {boolean} Returns true on success of validation
   */
  validate() {
    let messages = (this.model) ? this.model.validate() : null;
    if (!this.model.isValid() && messages && messages.messages) {
      this.showMessage(formatValidationMessages(messages.messages));
    } else {
      this.showMessage("");
    }
    return messages;
  };

  /**
   * Is the form valid
   * @returns {boolean} Returns true if valid
   */
  isValid() {
    return (this.model) ? this.model.isValid() : true;
  };

  /**
   * Render the form
   * @returns {object} Returns the view context ('this')
   */
  async render() {
    if (!this.isInitalized) {
      console.warn(`${this.name} Can't render yet, not initialized!`);
      return this;
    }

    this.template = null;//"notused";
    this.showProgressBar(true);

    if (this.el) {
      const e = await Dom.selector(this.el);
      if (e) {
        if (this.theme) {
          Dom.addClass(e, this.theme);
        }
        // progress bar
        let n = document.createElement("progress"), t = document.createTextNode("Please wait.");
        n.appendChild(t);
        e.appendChild(n);

        // the form
        const form = await formCompile(
          ((this.title) ? this.title : null),
          this.description,
          this._fields,
          this.model.toJSON(),
          this._required,
          this.name,
          this.display,
          this.nestedInput,
          this.submitButton,
          this.resetButton,
          this.style
        );
        if (form) {
          await e.appendChild(form);
        }
        this._formEl = Dom.query("form", this.el);

        // message
        n = document.createElement("p");
        n.classList.add("message");
        e.appendChild(n);
      }
    } else {
      console.warn(`${this.name} no element anchor, not rendering.`);
      this.showProgressBar(false);
      return this;
    }

    await this.delegateEvents();
    await this.syncAllBoundElements();
    this.showProgressBar(false);
    return this;
  };

  /**
   * Reset the form
   * @returns {object} Returns the view context ('this')
   */
  reset() {
    if (this._formEl) {
      this._formEl.reset();
      this.model.reset();
    }
    return this;
  };

  /**
   * Populate the form
   * @param {object} data Data to fill in
   * @returns {object} Returns the view context ('this')
   */
  populate(data) {
    this.model.set(data);
    return this;
  };

  /**
   * Remove the form and all binds
   */
  remove() {
    /* off to unbind the events */
    this.undelegateEvents();
    this.off();
    this.stopListening();

    Dom.empty(this.el);

    return this;
  };
};

export default AutomaticForm;
