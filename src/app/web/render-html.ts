global.html = (template) => {
  const renderedTemplate = template.join("\n").trim();

  return (response) => {
    response.header("content-type", "text/html");
    response.send(renderedTemplate);
  };
};
