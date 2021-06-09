import blessed from "blessed";
import contrib from "blessed-contrib";

class TerminalDashboard {
  screen: blessed.Widgets.Screen;

  /**
   * Frame Per Second / Frame Time Chart
   */
  fpsFtSparkline: contrib.Widgets.SparklineElement;
  fpsFtHistory = [new Array(32), new Array(32)];
  grid: contrib.grid;

  constructor() {
    this.screen = blessed.screen();

    this.grid = new contrib.grid({ rows: 6, cols: 12, screen: this.screen });

    //grid.set(row, col, rowSpan, colSpan, obj, opts)
    this.fpsFtSparkline = this.grid.set(0, 0, 3, 12, contrib.sparkline, {
      label: "Frame Utilization (fps/frame time in ms)",
    });

    //    var box = this.grid.set(4, 4, 4, 4, blessed.box, { content: "My Box" });

    this.screen.key(["escape", "q", "C-c"], function (ch, key) {
      // return process.exit(0);
    });

    // setInterval(this.render.bind(this), 200);
  }

  addToFrameSparkline(fps: number, ft: number) {
    const [fpsHist, ftHist] = this.fpsFtHistory;

    fpsHist.push(fps);
    fpsHist.shift();

    ftHist.push(ft);
    ftHist.shift();

    Dashboard.fpsFtSparkline.setData(["FPS", "FT"], this.fpsFtHistory);
  }

  render() {
    this.screen.render();
  }
}

const Dashboard = new TerminalDashboard();

export default Dashboard;
