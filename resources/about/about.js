import { launch } from '@env';
import { exepath } from '@sys';

export class About extends Element {
  componentDidMount() {
    this.$('#ok').focus();

    const [wmin, w] = document.state.contentWidths();
    const h = document.state.contentHeight(w);
    const [sw, sh] = Window.this.screenBox('frame', 'dimension');
    Window.this.move((sw - w) / 2, (sh - h) / 2, w, h, true);

    this.post(() => this.$('icon#logo').style.behavior = 'shell-icon');
  }

  ['on click at #ok']() {
    Window.this.close();
  }

  ['on click at a'](_, a) {
    launch(a.attributes.href);
    return true;
  }

  render() {
    return (
      <body styleset='about.css#about'>
        <div id="container">
          <div id="header">
            <icon id="logo" icon-size="xx-large" filename={exepath()} />
            <div id="title">
              <div>vPen</div>
              <div>v1.0.1</div>
            </div>
          </div>
          <div id="contents">
            <div class="row">
              <a href="https://GirkovArpa.itch.io">Girkov Arpa</a>&nbsp;©&nbsp;2022
            </div>
            <hr />
            <div class="row">
              This application uses&nbsp;<img src={__DIR__ + 'sciter.png'} width="16" height="16" />
              &nbsp;<a href="https://sciter.com/?ref=Clipomagic">Sciter</a>&nbsp;Engine,
            </div>
            <div class="row">
              ©&nbsp;<a href="https://terrainformatica.com/?ref=Clipomagic">Terra Informatica Software</a>, Inc.
            </div>
          </div>
          <div id="footer">
            <button id="ok">OK</button>
          </div>
        </div>
      </body>
    );
  }
}
