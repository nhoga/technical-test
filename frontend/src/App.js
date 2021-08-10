import React, { Component } from "react";
import Search from "./Search";

class App extends Component {
  render() {
    return (
      <div className="column">
        <h1 className="title">MercadoLibre Result's</h1>
        <Search />
      </div>
    );
  }
}

export default App;
