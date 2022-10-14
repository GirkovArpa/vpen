import { formatBytes } from '../format-bytes.js';

export class Content extends Element {
  constructor(props) {
    super();
    this.app = props.app;

    this.dragTarget = null;
    this.dropTarget = null;
  }


  ['on mousedragrequest at [role=option]'](evt, el) {
    if (this.app.checkIfLoading()) return;
    this.componentUpdate({ dragTarget: el });

    this.post(function () {
      const image = new Graphics.Image(el);
      document.style.setCursor(image, 0, 0);
      el.style.visibility = "hidden";
      document.state.capture(true);
      document.attributes["dnd"] = "true";

      Window.this.doEvent("untilMouseUp");

      document.state.capture(false);
      document.style.setCursor(null);
      el.style.visibility = undefined;
      document.attributes["dnd"] = undefined;

      const textures = [...this.app.textures];
      const from = textures.findIndex(({ key }) => key === Number(this.dragTarget.attributes.key));
      const to = textures.findIndex(({ key }) => key === Number(this.dropTarget.attributes.key));

      arrayMove(textures, from, to);

      const { dragTarget } = this;
      this.post(() => dragTarget.click());

      this.app.componentUpdate({ textures });
      this.componentUpdate({ dragTarget: null, dropTarget: null });
    });
  }

  ['on mousemove at [role=option]'](evt, el) {
    if (this.app.loading) return;
    if (this.dragTarget) {
      this.componentUpdate({ dropTarget: el });
    }

    const aboveNotBelow = ((el.offsetTop + el.clientHeight / 2) - evt.y) > 0;
    if (aboveNotBelow) {
      el.classList.add('above');
      el.classList.remove('below');
    } else {
      el.classList.add('below');
      el.classList.remove('above');
    }
  }


  render() {
    const { internalTotal, uncompressedTotal } = this.app.textures
      .reduce((sums, { size, uncompressedSize }) => {
        sums.internalTotal += size;
        sums.uncompressedTotal += uncompressedSize;
        return sums;
      }, { internalTotal: 0, uncompressedTotal: 0 });

    return (
      <div id='container' styleset={__DIR__ + 'content.css#content'}>
        <table id='textures' disabled={this.app.loading}>
          <thead>
            <tr>
              <th style="width: 4ch" class='index'>#</th>
              <th style="width: *" class='name'>Name</th>
              <th style="width: 6ch" class='size'>Size: {formatBytes(internalTotal)}</th>
              <th style="width: 6ch" class='uncompressed-size'>Uncompressed: {formatBytes(uncompressedTotal)}</th>
            </tr>
          </thead>
          <tbody>
            {
              this.app.textures.map((texture, i) => {
                return <tr role='option' value={texture.filename} key={texture.key}>
                  <td class='index'>{i}</td>
                  <td class='name'>{texture.filename || 'Assigning name...'}</td>
                  <td class='size'>{formatBytes(texture.size)}</td>
                  <td class='uncompressed-size'>{formatBytes(texture.uncompressedSize)}</td>
                </tr>;
              })
            }
          </tbody>
        </table>
        {this.app.loading ? <progress value={this.app.progressVal} max={this.app.progressMax} /> : false}
      </div>
    );
  }
}

function arrayMove(arr, fromIndex, toIndex) {
  var element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}