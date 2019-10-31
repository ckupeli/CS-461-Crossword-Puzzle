import React, { Component } from "react";
import "./App.css";
import Clue from "./Clue";
import Cell from "./Cell";

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      clue_number : "1D",
      clue_text : "Dummy Text",
      cell_types : [],
      cell_numbers : [],
      default_cell : [],
      /*
        0 : horizontal
        1 : vertical
      */
      direction : 0,
      selected : 0,
      puzzle : new Array(25).fill(''),
      date : new Date(),
      down_clues : [],
      across_clues : []
    }
    this.keyboardPress = this.keyboardPress.bind(this)
  }

  componentDidMount() {
    fetch("http://localhost:5000/get_cell_types").then((response) => {
      response.json().then((types) => {
        let temp = []
        Object.keys(types).forEach((key) => {
          this.setState({
            default_cell : [...this.state.default_cell, types[key]]
          }, () => {
            temp = [...temp, types[key]]
          })
        })
        let i
        for(i = 0; i < temp.length; i++) {
          if(temp[i] !== 'Block') {
            break
          }
        }
        this.setState({
          selected : i
        }, () => {
          //temp[i] = 'Selected'
          this.setState({
            cell_types : temp
          }, () => this.highlighCells())
        })
      })
    })
    fetch("http://localhost:5000/get_cell_numbers").then((response) => {
      response.json().then((numbers) => {
        this.setState({
          cell_numbers : numbers
        })
      })
    })
    fetch('http://localhost:5000/get_new_clues').then((response) => {
      response.json().then((clues) => {
        Object.keys(clues).forEach((key) => {
          if(key.charAt(1) === 'D') {
            this.setState({
              down_clues : [...this.state.down_clues, { 'key' : key, 'clue' : clues[key]}]
            })
          }
          else if(key.charAt(1) === 'A') {
            this.setState({
              across_clues : [...this.state.across_clues, { 'key' : key, 'clue' : clues[key]}]
            })
          }
        })
      })
    })
    //document.addEventListener("keydown", this.keyboardPress, false);
    this.reveal()
  }


  mouseClick(index) {
    /*
    if(this.state.default_cell[index] !== 'Block') {
      this.setState({
        selected : index,
      }, () => {
        this.highlighCells()
      })
    }
    */
  }

  keyboardPress(event) {
    /*
    let input = (event.key + "").toUpperCase()
    if(input.match('[A-Z0-9]') && input.length === 1) {
      let temp = this.state.puzzle
      temp[this.state.selected] = input
      this.setState({
        puzzle : temp
      }, () => {
        if(this.state.direction === 0) {
          if(this.state.selected % 5 !== 4 && this.state.default_cell[this.state.selected + 1] !== 'Block') {
            this.setState({
              selected : this.state.selected + 1
            }, () => this.highlighCells())
          }
        }
        else if(this.state.direction === 1) {
          if(this.state.selected + 5 <= 24 && this.state.default_cell[this.state.selected + 5] !== 'Block') {
            this.setState({
              selected : this.state.selected + 5
            }, () => this.highlighCells())
          }
        }
      })
    }
    else if(input === 'BACKSPACE') {
      let temp = this.state.puzzle
      temp[this.state.selected] = ''
      this.setState({
        puzzle : temp
      }, () => {
        if(this.state.direction === 0) {
          if(this.state.selected % 5 !== 0 && this.state.default_cell[this.state.selected - 1] !== 'Block') {
            this.setState({
              selected : this.state.selected - 1
            }, () => this.highlighCells())
          }
        }
        else if(this.state.direction === 1) {
          if(0 <= this.state.selected - 5 && this.state.default_cell[this.state.selected - 5] !== 'Block') {
            this.setState({
              selected : this.state.selected - 5
            }, () => this.highlighCells())
          }
        }
      })
    }
    else if(input === 'ARROWDOWN') {
      if(this.state.direction === 0) {
        this.setState({
          direction : 1
        }, () => this.highlighCells())
      }
      else if(this.state.direction === 1) {
        if(this.state.selected + 5 <= 24 && this.state.default_cell[this.state.selected + 5] !== 'Block') {
          this.setState({
            selected : this.state.selected + 5
          }, () => this.highlighCells())
        }
      }
    }
    else if(input === 'ARROWUP') {
      if(this.state.direction === 0) {
        this.setState({
          direction : 1
        }, () => this.highlighCells())
      }
      else if(this.state.direction === 1) {
        if(0 <= this.state.selected - 5 && this.state.default_cell[this.state.selected - 5] !== 'Block') {
          this.setState({
            selected : this.state.selected - 5
          }, () => this.highlighCells())
        }
      }
    }
    else if(input === 'ARROWRIGHT') {
      if(this.state.direction === 0) {
        if(this.state.selected % 5 !== 4 && this.state.default_cell[this.state.selected + 1] !== 'Block') {
          this.setState({
            selected : this.state.selected + 1
          }, () => this.highlighCells())
        }
      }
      else if(this.state.direction === 1) {
        this.setState({
          direction : 0
        }, () => this.highlighCells())
      }
    }
    else if(input === 'ARROWLEFT') {
      if(this.state.direction === 0) {
        if(this.state.selected % 5 !== 0 && this.state.default_cell[this.state.selected - 1] !== 'Block') {
          this.setState({
            selected : this.state.selected - 1
          }, () => this.highlighCells())
        }
      }
      else if(this.state.direction === 1) {
        this.setState({
          direction : 0
        }, () => this.highlighCells())
      }
    }
    */
  }

  highlighCells() {
    /*
    let temp = []
    for(let i = 0; i < this.state.default_cell.length; i++) {
      temp[i] = this.state.default_cell[i]
    }
    temp[this.state.selected] = 'Selected'
    if(this.state.direction === 0) {
      for(let i = ~~(this.state.selected / 5) * 5; i < (~~(this.state.selected / 5) + 1) * 5; i++) {
        if(temp[i] !== 'Block' && temp[i] !== 'Selected') {
          temp[i] = 'Highlighted'
        }
      }
    }
    else if(this.state.direction === 1) {
      for(let i = this.state.selected % 5; i < 25; i = i + 5) {
        if(temp[i] !== 'Block' && temp[i] !== 'Selected') {
          temp[i] = 'Highlighted'
        }
      }
    }
    this.setState({
      cell_types : temp
    })
    */
  }

  reveal() {
    let temp = []
    for(let i = 0; i < this.state.default_cell.length; i++) {
      temp[i] = this.state.default_cell[i]
    }
    fetch("http://localhost:5000/get_puzzle").then((response) => {
      response.json().then((solutions) => {
        let i = 0
        Object.keys(solutions).forEach((key) => {
          temp[key] = solutions[key]
          i = i + 1
          if(i === Object.keys(solutions).length) {
            this.setState({
              puzzle : temp 
            })
          }
        })
      })
    })
  }

  render() {
    let cell_elements = []
    let cell_number = 1
    for(let i = 0; i < this.state.cell_types.length; i++) {
      if(this.state.cell_numbers.includes(i)) {
        cell_elements.push(<Cell key={i} index={i} type={this.state.cell_types[i]} mouseClick={(index) => this.mouseClick(index)} textAnchorStart={cell_number} textAnchorMiddle={this.state.puzzle[i]}/>)
        cell_number = cell_number + 1
      }
      else {
        cell_elements.push(<Cell key={i} index={i} type={this.state.cell_types[i]} mouseClick={(index) => this.mouseClick(index)} textAnchorStart={''} textAnchorMiddle={this.state.puzzle[i]}/>)
      }
    }
    return (
      <div className="App">
        <header className="Puzzle-Header-Wrapper">
          <div className="Puzzle-Header-Row">
            <div className="Puzzle-Header-Container">
              <div className="Puzzle-Details">
                <div className="Puzzle-Details-Main"><span>CS 461 </span>Artificial Intelligence</div>
                {/*
                  <div className="Puzzle-Details-Secondary">Crossword Puzzle{<span>By FIRING JOEL FAGLIANO</span>}</div>
                */}
              </div>
            </div>
          </div>
        </header>
        <article className="Puzzle-Layout" aria-label="Main Puzzle Layout">
          <section className="ClueBar-And-Board" aria-label="Game Board with Clue Bar">
            {/*
              <div className="ClueBar">
                <div className="ClueBar-Number">{this.state.clue_number}</div>
                <div className="ClueBar-Text">{this.state.clue_text}</div>
              </div>
            */}
            <section className="Board" aria-label="Game Board">
              <div className="Board-Content" style={{ transition: "transform 0s ease 0s", transform: "translate(0px, 0px) scale(1)", touchAction: "none", userSelect: "none", WebkitUserDrag: "none", WebkitTapHighlightColor: "rgba(0, 0, 0, 0)" }}>
                <svg id="board" className="Board-SVG" preserveAspectRatio="xMidYMin meet" aria-labelledby="boardTitle" aria-describedby="boardDesc" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 506.00 564.00">
                  <title id="boardTitle">Puzzle Board</title>
                  <desc id="boardDesc">Game Board for the Crossword</desc>
                  <g data-group="cells" role="table">
                    {cell_elements}
                  </g>
                  <g data-group="grid">
                    <path d="M3.00,103.00 l500.00,0.00 M3.00,203.00 l500.00,0.00 M3.00,303.00 l500.00,0.00 M3.00,403.00 l500.00,0.00 M103.00,3.00 l0.00,500.00 M203.00,3.00 l0.00,500.00 M303.00,3.00 l0.00,500.00 M403.00,3.00 l0.00,500.00" stroke="dimgray" vectorEffect="non-scaling-stroke"></path>
                    <rect x="1.50" y="1.50" width="503.00" height="503.00" stroke="black" strokeWidth="3.00" fill="none"></rect>
                  </g>
                  <g data-group="date">
                    <text x="506.00" y="564.50" textAnchor="end" fontSize="30" style={{ fontFamily : "Times" }}>
                      {this.state.date.getDate() + '.' + (this.state.date.getMonth() < 10 ? ('0' + this.state.date.getMonth()) : this.state.date.getMonth()) + '.' + this.state.date.getFullYear() /* + ' ' + (this.state.date.getHours() < 10 ? ('0' + this.state.date.getHours()) : this.state.date.getHours()) + ':' + (this.state.date.getMinutes() < 10 ? ('0' + this.state.date.getMinutes()) : this.state.date.getMinutes()) */}
                    </text>
                    <text x="506.00" y="534.50" textAnchor="end" fontSize="30" style={{ fontFamily : "Times" }}>
                      FIRING JOEL FAGLIANO
                    </text>
                  </g>
                </svg>
              </div>
            </section>
          </section>
          <section className="ClueList-Layout">
            <div className="ClueList-Wrapper">
              <h3 className="ClueList-Title">Across</h3>
              <ol className="ClueList-List">
                {
                  this.state.across_clues.map((item) => {
                    return <Clue key={item.key} number={item.key.charAt(0)} clue={item.clue}/>
                  })
                }
              </ol>
            </div>
            <div className="ClueList-Wrapper">
              <h3 className="ClueList-Title">Down</h3>
              <ol className="ClueList-List">
                {
                  this.state.down_clues.map((item) => {
                    return <Clue key={item.key} number={item.key.charAt(0)} clue={item.clue}/>
                  })
                }
              </ol>
            </div>
          </section>
        </article>
      </div>
    );
  }
}

export default App;
