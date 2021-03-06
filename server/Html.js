/* eslint-disable react/no-danger */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import serialize from 'serialize-javascript';

class Html extends Component {
  getInitialStateHtml(initialState) {
    return `window.INITIAL_STATE = ${serialize(initialState)};`;
  }

  renderStylesLink(appCssSrc, isProduction) {
    if (!isProduction) {
      return null;
    }

    return <link href={appCssSrc} rel="stylesheet" />;
  }

  render() {
    const {
      appCssSrc,
      appScriptSrc,
      initialState,
      isProduction,
    } = this.props;
    const initialStateHtml = this.getInitialStateHtml(initialState);

    return (
      <html lang="fi">
        <head>
          <meta charSet="utf-8" />
          <meta content="37B6C7A87B582B25B0C1C938BD8AD440" name="msvalidate.01" />
          <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          <meta content="Varaamo, Turku, Kirjasto, Pääkirjasto, Yliopisto, Palvelu, Pelitila, Soittohuone, Työpiste, 3D-tulostin, Stoori, Varauspalvelu, Kokoustila, Tulostus, Mikrofilmit, Musiikki, Askartelut" name="keywords" />
          <meta content="Varaamo – Tilat ja laitteet varattavana. Varaamosta voit varata julkisia tiloja ja laitteita omaan käyttöösi. Varaamo on Turun kaupungin varauspalvelu." name="description" />
          <meta content="Digipoint" name="author" />
          <meta content="x4GUwZEJru1x6OpgxdEMMfLatFyGx5lmxlbD0AMqtbw" name="google-site-verification" />
          <link href="https://overpass-30e2.kxcdn.com/overpass.css" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,800" rel="stylesheet" />
          {this.renderStylesLink(appCssSrc, isProduction)}
          <title>Varaamo</title>
        </head>
        <body>
          <div id="root" />
          <script dangerouslySetInnerHTML={{ __html: initialStateHtml }} />
          <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en-gb,Intl.~locale.fi,Intl.~locale.sv" />
          <script src={appScriptSrc} />
        </body>
      </html>
    );
  }
}

Html.propTypes = {
  appCssSrc: PropTypes.string.isRequired,
  appScriptSrc: PropTypes.string.isRequired,
  initialState: PropTypes.object.isRequired,
  isProduction: PropTypes.bool.isRequired,
};

export default Html;
