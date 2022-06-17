import { $, $$ } from '@sciter';
import { launch } from '@env';

$('#spud-tablet').on('click', () => {
  launch('https://sadwhale-studios.itch.io/spud-tablet/?ref=vpen');
});

$('#sciter').on('click', () => {
  launch('https://sciter.com/?ref=vpen');
});

$('#terra-informatica').on('click', () => {
  launch('https://terrainformatica.com/?ref=vpen');
});

$('#girkov-arpa').on('click', () => {
  launch('https://girkovarpa.itch.io/?ref=vpen');
});

$('button').on('click', () => Window.this.close());
