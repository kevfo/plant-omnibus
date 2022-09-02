import React, { useState } from "react";
import Plot from "react-plotly.js";
import { removeOutliers } from "../HelperFunctions/math.js";
import { assignColors } from "../Data/genePageInfo.js";

class Experimental extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      geneID: props.geneID,
      organs : props.names,
      boxData: props.data,
      options: props.option,
      colors: props.colors,     // Assuming that we do use this in the future, might somebody else want to pass in some other colors?
      clicked: true,            // For undoing changes made by the event handler...
      noOutliers: false,        // By default, assume that we want to show all points including outliers.
      notched : false,          // Determines whether or not the box plot should be notched or not.
      originalData : props.data // So that we can re-store the original data if need be.
    }
  }

  handleClick = () => {
    this.setState(prevState => ({noOutliers : !prevState.noOutliers}))
  }
  handleNotch = () => {
    this.setState(prevState => ({notched : !prevState.notched}))
  }

  // A little verbose in my opinion, but at least it gets the job done.
  // I tried using the "map()" method, but React wouldn't stop complaining.
  changePlot = (props) => {
    this.setState(prevState => ({
      clicked: !prevState.clicked,
      boxData : ((data) => {
        if (prevState.clicked) {
          for (let i = 0; i < data.length ; i++) {
            data[i]['y'] = (prevState.noOutliers) ? removeOutliers(data[i]['y']) : prevState.originalData[i]['y'];
            data[i]['boxpoints'] = 'all';
            data[i]['jitter'] = 1;
            data[i]['pointpos'] = 0;
            data[i]['line'] = { width : 0.6, color: `rgba(${prevState.colors[assignColors(data[i]['name'])].r}, ${prevState.colors[assignColors(data[i]['name'])].g}, ${prevState.colors[assignColors(data[i]['name'])].b}, 1)`};
            data[i]['fillcolor'] = `rgba(${prevState.colors[assignColors(data[i]['name'])].r}, ${prevState.colors[assignColors(data[i]['name'])].g}, ${prevState.colors[assignColors(data[i]['name'])].b}, 0.1)`;
            data[i]['marker'] = {opacity : 1}
            data[i]['notched'] = prevState.notched;
            data[i]['orientation'] = prevState.orientation ? 'h' : 'v';
          }
        } else {
          for (let i = 0; i < data.length ; i++) {
            data[i]['boxpoints'] = undefined;
            data[i]['jitter'] = undefined;
            data[i]['pointpos'] = undefined;
            data[i]['line'] = { width : 2, color: `rgba(${prevState.colors[assignColors(data[i]['name'])].r}, ${prevState.colors[assignColors(data[i]['name'])].g}, ${prevState.colors[assignColors(data[i]['name'])].b}, 1)` };
            data[i]['fillcolor'] = `rgba(${prevState.colors[assignColors(data[i]['name'])].r}, ${prevState.colors[assignColors(data[i]['name'])].g}, ${prevState.colors[assignColors(data[i]['name'])].b}, 0.5)`;
            data[i]['opacity'] = 1;
            data[i]['marker'] = {opacity: 0};
            data[i]['notched'] = prevState.notched;
            data[i]['orientation'] = prevState.orientation ? 'h' : 'v';
          }
        }
        return data;
      })(prevState.boxData),
      options: prevState.options,
      originalData : prevState.originalData
    }))
  }
//width: 900, height: 500,
  render() {
    return (
      <div className = "container">
        <Plot data = {this.state.boxData}
           config = {this.state.options}
           layout = {{width: 1000, height: 400,
             title: `Experimental Value Plot for ${this.state.geneID}`, yaxis: {title: {text: "TPM"}, range: [0, 12]},
             margin: {b : 100, r: 100}}}
           onClick = {this.changePlot}
           className = "border border-solid border-gray-800"/>
        <div className = "pt-3">
          <div className="flex">
            <p className = 'pr-3 font-medium'> Viewing options: </p>
            <div className="inline-flex shadow-md hover:shadow-lg focus:shadow-lg" role="group">
              <button type="button" onClick = {this.handleClick} className="rounded-l inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"> {this.state.noOutliers ? "Outliers removed!" : "Remove outliers"} </button>
              <button type="button" onClick = {this.handleNotch} className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"> {this.state.notched ? "Remove notches" : "Add notches"} </button>
            </div>
          </div>
        </div>
        {this.state.noOutliers &&
          <div className = "container">
            <br/>
            <p className = "text-primary" style = {{paddingLeft : "43px"}}> Outliers removed!  Refresh page to see changes! </p>
          </div>
        }
      </div>
    )
  }
}

export default Experimental;