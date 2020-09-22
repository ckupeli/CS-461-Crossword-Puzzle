import React, { Component } from "react";
import "./App.css";
import Clue from "./Clue";
import Cell from "./Cell";

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
        date : new Date(),
        old_across : [],
        old_down : [],
        puzzle_layout : [],
        cell_numbers : [],
        solutions : [],
        new_across : [],
        new_down : []
    }
  }

  componentDidMount() {
    fetch("http://localhost:5000/get_old_clues_across").then((res) => {
      res.json().then((clues) => {
        let temp = []
        Object.keys(clues).forEach((key) => {
          temp = [...temp, { 'key' : key + 'A', 'clue' : clues[key] }]
        })
        this.setState({
          old_across : temp
        }, () => {
          fetch("http://localhost:5000/get_old_clues_down").then((res) => {
            res.json().then((clues) => {
              let temp = []
              Object.keys(clues).forEach((key) => {
                temp = [...temp, { 'key' : key + 'D', 'clue' : clues[key] }]
              })
              this.setState({
                old_down : temp
              }, () => {
                fetch("http://localhost:5000/get_puzzle_layout").then((res) => {
                  res.json().then((types) => {
                    let temp = []
                    Object.keys(types).forEach((key) => {
                      temp = [...temp, types[key]]
                    })
                    this.setState({
                      puzzle_layout : temp
                    }, () => {
                      fetch("http://localhost:5000/get_cell_numbers").then((res) => {
                        res.json().then((numbers) => {
                          this.setState({
                            cell_numbers : numbers
                          }, () => {
                            fetch("http://localhost:5000/get_solutions").then((res) => {
                              res.json().then((solutions) => {
                                let temp = []
                                Object.keys(solutions).forEach((key) => {
                                  temp = [...temp, solutions[key]]
                                })
                                this.setState({
                                  solutions : temp
                                }, () => {
                                  fetch('http://localhost:5000/generate_new_clues').then((res) => {
                                    res.json().then((clues) => {
                                      let temp_across = []
                                      let temp_down = []
                                      Object.keys(clues).forEach((key) => {
                                        if(key.substring(1) === 'A') {
                                          temp_across = [...temp_across, { 'key' : key, 'clue' : clues[key] }]
                                        }
                                        else if(key.substring(1) === 'D') {
                                          temp_down = [...temp_down, { 'key' : key, 'clue' : clues[key] }]
                                        }
                                      })
                                      this.setState({
                                        new_across : temp_across,
                                        new_down : temp_down
                                      })
                                    })
                                  })
                                })
                              })
                            })
                          })
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  }

  render() {
    let cell_number = 1
    return (
      <div className="App">
        <article className="Puzzle-Layout" aria-label="Main Puzzle Layout">
          <section className="ClueBar-And-Board" aria-label="Game Board with Clue Bar">
            <section className="Board" aria-label="Game Board">
              <div className="Board-Content" style={{ transition: "transform 0s ease 0s", transform: "translate(0px, 0px) scale(1)", touchAction: "none", userSelect: "none", WebkitUserDrag: "none", WebkitTapHighlightColor: "rgba(0, 0, 0, 0)" }}>
                <svg id="board" className="Board-SVG" preserveAspectRatio="xMidYMin meet" aria-labelledby="boardTitle" aria-describedby="boardDesc" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 506.00 564.00">
                  <title id="boardTitle">Puzzle Board</title>
                  <desc id="boardDesc">Game Board for the Crossword</desc>
                  <g data-group="cells" role="table">
                    {
                      this.state.puzzle_layout.map((item, i) => {
                        return <Cell key={i} index={i} type={item} textAnchorStart={this.state.cell_numbers.includes(i) ? cell_number++ : ''} textAnchorMiddle={this.state.solutions[i]}/>
                      })
                    }
                  </g>
                  <g data-group="grid">
                    <path d="M3.00,103.00 l500.00,0.00 M3.00,203.00 l500.00,0.00 M3.00,303.00 l500.00,0.00 M3.00,403.00 l500.00,0.00 M103.00,3.00 l0.00,500.00 M203.00,3.00 l0.00,500.00 M303.00,3.00 l0.00,500.00 M403.00,3.00 l0.00,500.00" stroke="dimgray" vectorEffect="non-scaling-stroke"></path>
                    <rect x="1.50" y="1.50" width="503.00" height="503.00" stroke="black" strokeWidth="3.00" fill="none"></rect>
                  </g>
                  <text x="506.00" y="564.50" textAnchor="end" fontSize="30" style={{ fontFamily : "Times" }}>
                    {(this.state.date.getDate() < 10 ? ('0' + this.state.date.getDate()) : this.state.date.getDate()) + 
                    '.' + String((parseInt(this.state.date.getMonth()) + 1) < 10 ? 
                    ('0' + parseInt(this.state.date.getMonth() + 1)) : parseInt(this.state.date.getMonth() + 1)) + 
                    '.' + this.state.date.getFullYear()}
                  </text>
                  <text x="506.00" y="534.50" textAnchor="end" fontSize="30" style={{ fontFamily : "Times" }}>
                    FIRING JOEL FAGLIANO
                  </text>
                </svg>
              </div>
            </section>
          </section>
          <section className="ClueList-Layout">
            <div className="ClueList-Wrapper">
              <h3 className="ClueList-Title">Across</h3>
              <ol className="ClueList-List">
                {
                  this.state.old_across.map((item) => {
                    return <Clue key={item.key} number={item.key.charAt(0)} clue={item.clue}/>
                  })
                }
              </ol>
            </div>
            <div className="ClueList-Wrapper">
              <h3 className="ClueList-Title">New Across</h3>
              <ol className="ClueList-List">
                {
                  this.state.new_across.map((item) => {
                    return <Clue key={item.key} number={item.key.charAt(0)} clue={item.clue}/>
                  })
                }
              </ol>
            </div>
            <div className="ClueList-Wrapper">
              <h3 className="ClueList-Title">Down</h3>
              <ol className="ClueList-List">
                {
                  this.state.old_down.map((item) => {
                    return <Clue key={item.key} number={item.key.charAt(0)} clue={item.clue}/>
                  })
                }
              </ol>
            </div>
            <div className="ClueList-Wrapper">
              <h3 className="ClueList-Title">New Down</h3>
              <ol className="ClueList-List">
                {
                  this.state.new_down.map((item) => {
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
