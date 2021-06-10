export const ListCommands = (res: FastifyReply) =>
  html`
    <h1>Welcome to the BeamerPI project!</h1>

    <p>Below are all the commands you can remotely use.</p>

    <ul>
      <li>
        <b><a href="/dashboard">Dashboard</a></b>
        <a href="/effects">Effects</a>
        <a href="/sys/temp">CPU Temp</a>
      </li>
    </ul>
  `(res);
