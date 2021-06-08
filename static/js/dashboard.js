class ErrorResponse extends Response {
  constructor(fromResponse) {
    super();
    Object.assign(this, fromResponse.clone());
  }
}

async function loadResource(url) {
  const response = await fetch(url);
  if (response.ok) {
    return response.json();
  } else {
    throw new ErrorResponse(response);
  }
}

async function post(url, body) {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (response.ok) {
    return response.json();
  } else {
    throw new ErrorResponse(response);
  }
}

async function loadEffects() {
  return loadResource("/effects/list");
}

async function init() {
  window.app = new Vue({
    el: "#app",
    data: {
      appTitle: "BeamerPI a0.1",
      effects: await loadEffects(),
    },

    methods: {
      setEffect: function (effect) {
        post("/effects/");
      },
    },
  });
}

init();
