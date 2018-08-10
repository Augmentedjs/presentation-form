const formatValidationMessages = (messages) => {
  let html = "";
  if (messages && messages.length > 0) {
    html = html + "<ul class=\"errors\">";
    const l = messages.length;
    let i = 0, ii = 0;
    for (i = 0; i < l; i++) {
      const ll = messages[i].errors.length;
      for (ii = 0; ii < ll; ii++) {
        html = html + "<li>" + messages[i].errors[ii] + "</li>";
      }
    }
    html = html + "</ul>";
  }
  return html;
};

export default formatValidationMessages;
